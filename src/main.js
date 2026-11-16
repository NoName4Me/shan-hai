import './styles.css';
import { createQingqiu } from './qingqiu/qingqiu.js';

const app = document.querySelector('#app');
const sceneRoot = document.querySelector('#scene-root');
const loading = document.querySelector('#loading');
const loadingBar = document.querySelector('#loading-bar');
const loadingPercent = document.querySelector('#loading-percent');
const loadingLabel = document.querySelector('#loading-label');
const awakenButton = document.querySelector('#awaken-button');
const infoButton = document.querySelector('#info-button');
const infoPanel = document.querySelector('#info-panel');
const closeInfo = document.querySelector('#close-info');
const closeInfoBottom = document.querySelector('#close-info-bottom');
const fallback = document.querySelector('#fallback');
const fallbackReason = document.querySelector('#fallback-reason');
const retryButton = document.querySelector('#retry-button');
const fallbackInfoButton = document.querySelector('#fallback-info-button');
const backendBadge = document.querySelector('#backend-badge');
const hudZone = document.querySelector('#hud-zone');
const hudCoordinates = document.querySelector('#hud-coordinates');
const hudSpeed = document.querySelector('#hud-speed');
const hudAltitude = document.querySelector('#hud-altitude');
const compassHeading = document.querySelector('#compass-heading');
const compassNeedle = document.querySelector('#compass-needle');
const missionDistance = document.querySelector('#mission-distance');
const interactPrompt = document.querySelector('#interact-prompt');
const interactText = interactPrompt.querySelector('span');
const zoneBanner = document.querySelector('#zone-banner');
const zoneBannerName = zoneBanner.querySelector('strong');
const radarCanvas = document.querySelector('#radar-canvas');
const radarContext = radarCanvas.getContext('2d');

let experience = null;
let infoOpen = false;
let toastTimer = 0;
let bannerTimer = 0;
let introTimer = 0;

const toast = document.createElement('div');
toast.className = 'scene-toast';
toast.setAttribute('role', 'status');
app.appendChild(toast);

const landmarks = [
  { x: 0, z: -43, type: 'fox', label: '九尾祭坛' },
  { x: 0, z: -90, type: 'gate', label: '天关' },
  { x: 8.5, z: 32, type: 'origin', label: '青丘刻石' },
  { x: 42, z: -18, type: 'water', label: '玄水泽' }
];

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

function setProgress(value, label) {
  const progress = Math.min(1, Math.max(0, value));
  loadingBar.style.transform = `scaleX(${progress})`;
  loadingPercent.textContent = String(Math.round(progress * 100));
  if (label) loadingLabel.textContent = label;
}

function setInfo(open) {
  infoOpen = open;
  infoPanel.hidden = !open;
  infoButton.setAttribute('aria-expanded', String(open));
  app.classList.toggle('info-is-open', open);
  experience?.setPaused(open);
  interactPrompt.hidden = true;
  if (open) {
    window.setTimeout(() => closeInfo.focus(), 40);
  } else {
    infoButton.focus({ preventScroll: true });
  }
}

function handleAwaken() {
  if (!experience) {
    showToast('场景尚未就绪');
    return;
  }
  experience.awaken();
  awakenButton.classList.remove('is-awake');
  void awakenButton.offsetWidth;
  awakenButton.classList.add('is-awake');
  showToast('九尾回应了你的鸣啸');
  window.setTimeout(() => awakenButton.classList.remove('is-awake'), 3200);
}

function showZone(name) {
  window.clearTimeout(bannerTimer);
  zoneBannerName.textContent = name;
  zoneBanner.classList.remove('is-visible');
  void zoneBanner.offsetWidth;
  zoneBanner.classList.add('is-visible');
  bannerTimer = window.setTimeout(() => zoneBanner.classList.remove('is-visible'), 2600);
}

function showPrompt(target) {
  if (infoOpen) return;
  interactPrompt.hidden = !target;
  if (!target) return;
  interactText.textContent = target === 'fox' ? '读取九尾残卷' : '读取青丘刻石';
}

function drawRadar(state) {
  if (!radarContext) return;
  const width = radarCanvas.width;
  const height = radarCanvas.height;
  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.42;
  const range = 80;
  const yaw = state.yaw ?? 0;
  radarContext.clearRect(0, 0, width, height);

  radarContext.save();
  radarContext.translate(cx, cy);
  radarContext.strokeStyle = 'rgba(123, 177, 185, 0.25)';
  radarContext.lineWidth = 1;
  [0.32, 0.66, 1].forEach((ratio) => {
    radarContext.beginPath();
    radarContext.arc(0, 0, radius * ratio, 0, Math.PI * 2);
    radarContext.stroke();
  });
  radarContext.beginPath();
  radarContext.moveTo(-radius, 0);
  radarContext.lineTo(radius, 0);
  radarContext.moveTo(0, -radius);
  radarContext.lineTo(0, radius);
  radarContext.strokeStyle = 'rgba(123, 177, 185, 0.13)';
  radarContext.stroke();

  landmarks.forEach((landmark) => {
    const dx = landmark.x - state.position.x;
    const dz = landmark.z - state.position.z;
    const sx = dx * Math.cos(yaw) - dz * Math.sin(yaw);
    const sy = dx * Math.sin(yaw) + dz * Math.cos(yaw);
    const distance = Math.hypot(sx, sy);
    if (distance > range) return;
    const x = (sx / range) * radius;
    const y = (sy / range) * radius;
    radarContext.beginPath();
    radarContext.arc(x, y, landmark.type === 'fox' ? 5.5 : 3.5, 0, Math.PI * 2);
    radarContext.fillStyle =
      landmark.type === 'fox' ? '#de784e' : landmark.type === 'water' ? '#68c5cf' : '#b9c6bd';
    radarContext.shadowColor = radarContext.fillStyle;
    radarContext.shadowBlur = landmark.type === 'fox' ? 14 : 7;
    radarContext.fill();
    radarContext.shadowBlur = 0;
  });

  radarContext.beginPath();
  radarContext.moveTo(0, -8);
  radarContext.lineTo(5.5, 6);
  radarContext.lineTo(0, 3);
  radarContext.lineTo(-5.5, 6);
  radarContext.closePath();
  radarContext.fillStyle = '#e6eee8';
  radarContext.fill();
  radarContext.restore();
}

function updateHud(state) {
  hudZone.textContent = state.zone;
  hudCoordinates.textContent = `E ${Math.abs(state.position.x).toFixed(1)} / ${state.position.z < 0 ? 'N' : 'S'} ${Math.abs(state.position.z).toFixed(1)}`;
  hudSpeed.textContent = state.speed.toFixed(1);
  hudAltitude.textContent = state.altitude.toFixed(1);

  const heading = ((-state.yaw * 180) / Math.PI + 360) % 360;
  compassHeading.textContent = `${String(Math.round(heading)).padStart(3, '0')}°`;
  compassNeedle.style.transform = `rotate(${heading}deg)`;

  const distance = Math.hypot(state.position.x, state.position.z + 43);
  missionDistance.textContent = String(Math.max(0, Math.round(distance)));
  drawRadar(state);
  if (state.zoneChanged) showZone(state.zone);
}

function showFallback(error) {
  app.classList.remove('is-booting', 'is-ready');
  app.classList.add('is-fallback');
  loading.hidden = true;
  fallback.hidden = false;
  fallbackReason.textContent =
    error?.message?.includes('context lost')
      ? '三维图形上下文已中断，可能是显卡驱动、资源限制或浏览器重置导致。'
      : '当前浏览器未能创建 WebGL 上下文。请确认图形加速已开启，或换用独立的 Chrome / Edge 标签页。';
}

async function boot() {
  app.classList.remove('is-fallback', 'is-ready');
  app.classList.add('is-booting');
  fallback.hidden = true;
  loading.hidden = false;
  setProgress(0, '校准目镜');

  if (experience) {
    experience.dispose();
    experience = null;
  }
  sceneRoot.replaceChildren();

  try {
    experience = await createQingqiu(sceneRoot, {
      onProgress: ({ value, label }) => setProgress(value, label),
      onReady: () => {
        setProgress(1, '进入青丘');
        backendBadge.textContent = sceneRoot.dataset.backend === 'WebGPU' ? 'WEBGPU' : 'WEBGL2';
        window.setTimeout(() => {
          app.classList.remove('is-booting');
          app.classList.add('is-ready');
          loading.hidden = true;
          window.clearTimeout(introTimer);
          introTimer = window.setTimeout(() => app.classList.add('intro-finished'), 3200);
        }, 320);
      },
      onSelect: () => setInfo(true),
      onHud: updateHud,
      onPrompt: showPrompt,
      onError: showFallback
    });
    if (!experience) showFallback();
  } catch (error) {
    console.error('[Shan Hai] Scene failed to start:', error);
    showFallback(error);
  }
}

awakenButton.addEventListener('click', handleAwaken);
infoButton.addEventListener('click', () => setInfo(!infoOpen));
closeInfo.addEventListener('click', () => setInfo(false));
closeInfoBottom.addEventListener('click', () => setInfo(false));
retryButton.addEventListener('click', boot);
fallbackInfoButton.addEventListener('click', () => setInfo(true));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && infoOpen) setInfo(false);
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) experience?.setPaused(true);
  else if (!infoOpen) experience?.setPaused(false);
});

window.addEventListener('pagehide', () => experience?.dispose(), { once: true });

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  app.classList.add('reduced-motion');
}

boot();
