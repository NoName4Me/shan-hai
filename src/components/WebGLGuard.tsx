import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import QingqiuFallback from './QingqiuFallback';

const Qingqiu = lazy(() => import('./Qingqiu'));

type FailureReason = 'unavailable' | 'context-lost' | 'renderer-error';
type Status = 'checking' | 'ready' | 'failed';

/**
 * 检测实际能否创建 WebGL 上下文，而不只检查 WebGLRenderingContext 是否存在。
 * 部分浏览器或沙箱会暴露 WebGL API，但禁用 GPU，createContext 返回 null。
 */
function canCreateWebGLContext(): boolean {
  if (typeof document === 'undefined') return false;
  const canvas = document.createElement('canvas');
  try {
    const attributes: WebGLContextAttributes = {
      alpha: true,
      antialias: false,
      depth: true,
      stencil: false,
      failIfMajorPerformanceCaveat: false,
      powerPreference: 'default'
    };
    const context =
      canvas.getContext('webgl2', attributes) ??
      canvas.getContext('webgl', attributes);
    if (!context) return false;

    // 释放探测上下文，给真正的 R3F Canvas 留出 GPU 上下文配额。
    const extension = context.getExtension('WEBGL_lose_context');
    extension?.loseContext();
    return true;
  } catch (error) {
    console.info('[Shan Hai] WebGL capability probe failed:', error);
    return false;
  }
}

type BoundaryProps = { children: ReactNode; onError: (error: Error) => void };
type BoundaryState = { hasError: boolean };

class RendererBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { hasError: false };
  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.error('[Shan Hai] WebGL renderer could not start:', error);
    this.props.onError(error);
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

export default function WebGLGuard() {
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<Status>('checking');
  const [reason, setReason] = useState<FailureReason>('unavailable');
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supported = canCreateWebGLContext();
    setStatus(supported ? 'ready' : 'failed');
    if (!supported) setReason('unavailable');
  }, [attempt]);

  useEffect(() => {
    const stage = container.current;
    if (!stage) return;
    const handleLoss = (event: Event) => {
      event.preventDefault();
      setReason('context-lost');
      setStatus('failed');
    };
    stage.addEventListener('webglcontextlost', handleLoss, true);
    return () => stage.removeEventListener('webglcontextlost', handleLoss, true);
  }, []);

  const handleRendererError = useCallback((_error: Error) => {
    setReason('renderer-error');
    setStatus('failed');
  }, []);

  const retry = () => {
    setStatus('checking');
    setAttempt((previous) => previous + 1);
  };

  return <div ref={container} className="webgl-stage">
    {status === 'checking' && <div className="webgl-loading" role="status">正在检测三维渲染能力…</div>}
    {status === 'failed' && <QingqiuFallback reason={reason} onRetry={retry} />}
    {status === 'ready' && (
      <RendererBoundary key={attempt} onError={handleRendererError}>
        <Suspense fallback={<div className="webgl-loading" role="status">正在进入青丘之山…</div>}>
          <Qingqiu />
        </Suspense>
      </RendererBoundary>
    )}
  </div>;
}
