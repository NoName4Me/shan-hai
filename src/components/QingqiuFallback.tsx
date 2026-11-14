import { useAppStore } from '../store';

type FailureReason = 'unavailable' | 'context-lost' | 'renderer-error';

const descriptions: Record<FailureReason, string> = {
  unavailable: '当前浏览器未能创建 WebGL 上下文。浏览器的图形渲染功能可能被禁用，或受远程桌面、沙箱预览环境限制。',
  'context-lost': '三维图形上下文已中断，可能是显卡驱动、资源限制或浏览器重置导致。',
  'renderer-error': '当前环境虽然报告支持 WebGL，但 Three.js 渲染器仍然无法启动。'
};

export default function QingqiuFallback({reason,onRetry}:{reason:FailureReason;onRetry:()=>void}) {
  const returnToAtlas = useAppStore((s)=>s.returnToAtlas);
  return <div className="qingqiu-fallback">
    <svg className="fallback-landscape" viewBox="0 0 1200 760" preserveAspectRatio="xMidYMid slice" role="img" aria-label="青丘之山墨骨风格二维场景：矿石山脊、巨月与九尾狐">
      <defs>
        <linearGradient id="ink-sky" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#1a2530"/><stop offset="0.68" stopColor="#505963"/><stop offset="1" stopColor="#777b79"/>
        </linearGradient>
        <linearGradient id="ink-tail" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ece7db"/><stop offset=".55" stopColor="#8e9694"/><stop offset="1" stopColor="#202b34"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="760" fill="url(#ink-sky)"/>
      <circle cx="360" cy="215" r="97" fill="#d7d3c9" opacity=".92"/>
      <path d="M0 490L115 330L185 418L310 220L420 395L550 254L680 436L820 225L970 390L1080 300L1200 468V760H0Z" fill="#35404a"/>
      <path d="M0 535L140 435L250 508L405 373L510 472L685 339L825 498L970 372L1130 485L1200 450V760H0Z" fill="#4b555c"/>
      <path d="M0 627Q320 535 620 610T1200 574V760H0Z" fill="#1e2b33"/>
      <path d="M0 675Q310 615 620 663T1200 636" fill="none" stroke="#a6aba5" strokeWidth="10" opacity=".28"/>
      <path d="M380 640L555 570L835 564L1020 640L808 682L560 682Z" fill="#7a807d"/>
      <path d="M555 682L808 682L1020 640V710L793 739L553 730Z" fill="#27313a"/>
      <path d="M435 638Q570 609 780 629" fill="none" stroke="#ad655b" strokeWidth="3" opacity=".72"/>
      <g transform="translate(704 565)">
        {Array.from({length:9},(_,i)=>{
          const s=(i-4)/4;
          const x=s*200;
          const y=-135-Math.cos(s*Math.PI/2)*55;
          return <path key={i}
            d={'M -8 -12 Q '+(x*.24)+' -74 '+(x*.68)+' '+(y+32)+' Q '+x+' '+(y-45)+' '+(x+s*24)+' '+(y-14)+' Q '+(x*.68+13)+' '+(y+40)+' 10 -10 Z'}
            fill="url(#ink-tail)" stroke={i%3===0?'#b36c60':'#262e34'} strokeWidth="2"/>;
        })}
        <path d="M-62-56Q-64-100-20-113L25-112Q61-94 58-49L70 5L-60 5Z" fill="#e4e1d8"/>
        <path d="M-43-111L-56-166L-15-135L13-140L49-167L42-106Z" fill="#d8d9d3" stroke="#242b31" strokeWidth="5"/>
        <path d="M-26-117L-19-126L-10-117ZM13-117L23-126L30-117Z" fill="#b66b60"/>
        <path d="M-47-34L-62 44L-45 75L-28 30L-16 8M41-34L59 44L43 75L24 30L16 8" fill="#252d34" stroke="#d4d2c9" strokeWidth="8"/>
        <path d="M-24-38Q0-60 26-38L12 13L-12 13Z" fill="#a95752"/>
      </g>
    </svg>
    <section className="webgl-fallback-panel" role="alert">
      <div className="webgl-fallback-kicker">3D RENDERING UNAVAILABLE</div>
      <h2>三维场景暂不可用</h2>
      <p>{descriptions[reason]}</p>
      <p className="webgl-fallback-detail">可以先浏览青丘的二维概念场景。要体验 3D，请使用独立的 Chrome / Edge 标签页打开网站，并在 <code>chrome://gpu</code> 中确认 WebGL 已启用；必要时检查浏览器图形加速设置后重启。</p>
      <div className="webgl-fallback-actions">
        <button type="button" onClick={onRetry}>重新检测 3D</button>
        <button type="button" className="secondary" onClick={returnToAtlas}>返回山海舆图</button>
      </div>
    </section>
  </div>;
}
