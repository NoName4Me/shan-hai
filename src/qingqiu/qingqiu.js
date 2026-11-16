import * as THREE from 'three';
import { createEnvironment } from './environment.js';
import { createFirstPersonController } from './firstPerson.js';
import { createInkFox } from './fox.js';
import { createPostProcessing } from './postprocessing.js';
import { nextFrame } from './utils.js';

async function createRenderer() {
  const probe = document.createElement('canvas');
  const context =
    probe.getContext('webgl2', { failIfMajorPerformanceCaveat: false }) ||
    probe.getContext('webgl', { failIfMajorPerformanceCaveat: false });
  if (!context) throw new Error('WebGL unavailable');
  context.getExtension('WEBGL_lose_context')?.loseContext();

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
    stencil: false
  });
  return { renderer, backend: 'WebGL2' };
}

function zoneAt(position) {
  if (position.z < -72) return '天关遗址';
  if (position.x > 27 && position.z > -42) return '玄水泽';
  if (position.x < -34 && position.z < 12) return '断脊高地';
  if (Math.hypot(position.x - 8.5, position.z - 32) < 13) return '青丘南麓';
  if (position.z < -24) return '九尾祭坛';
  return '青丘古径';
}

export async function createQingqiu(container, options = {}) {
  const onProgress = options.onProgress ?? (() => {});
  const onReady = options.onReady ?? (() => {});
  const onSelect = options.onSelect ?? (() => {});
  const onError = options.onError ?? (() => {});
  const onHud = options.onHud ?? (() => {});
  const onPrompt = options.onPrompt ?? (() => {});

  let renderer;
  let backend;
  try {
    const result = await createRenderer();
    renderer = result.renderer;
    backend = result.backend;
  } catch (error) {
    onError(error);
    return null;
  }

  onProgress({ value: 0.04, label: '校准目镜' });
  await nextFrame();

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(container.clientWidth, container.clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.className = 'qingqiu-canvas';
  renderer.domElement.dataset.backend = backend;
  renderer.domElement.tabIndex = 0;
  renderer.domElement.setAttribute(
    'aria-label',
    '青丘之山第一人称三维场景。WASD 移动，拖动鼠标环视，滚轮缩放，点击九尾狐阅读原文。'
  );
  container.dataset.backend = backend;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    66,
    Math.max(container.clientWidth, 1) / Math.max(container.clientHeight, 1),
    0.08,
    540
  );

  onProgress({ value: 0.16, label: '展开山海地脉' });
  await nextFrame();
  const environment = createEnvironment(scene);

  onProgress({ value: 0.62, label: '唤醒九尾骨甲' });
  await nextFrame();
  const fox = createInkFox({
    x: 0,
    y: environment.foxGround + 0.62,
    z: -43,
    rotation: 0.08,
    scale: 3.15
  });
  scene.add(fox.group);

  onProgress({ value: 0.72, label: '点亮月晕与尘埃' });
  await nextFrame();
  let post = null;
  try {
    post = createPostProcessing(renderer, scene, camera);
  } catch (error) {
    console.warn('[Shan Hai] Bloom disabled:', error);
  }

  const stele = scene.getObjectByName('origin-stele');
  const params = new URLSearchParams(window.location.search);
  const spawn =
    params.get('view') === 'fox'
      ? new THREE.Vector3(0, 0, -14)
      : new THREE.Vector3(0, 0, 24);
  const controls = createFirstPersonController(camera, renderer.domElement, spawn);

  onProgress({ value: 0.82, label: '接通风声与潮汐' });
  await nextFrame();

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const foxPosition = new THREE.Vector3(0, environment.foxGround, -43);
  const stelePosition = environment.architecture.origin;
  let hovered = false;
  let nearTarget = null;
  let disposed = false;
  let pointerDown = null;
  let slowFrames = 0;
  let qualityReduced = false;
  let hudTimer = 0;
  let lastZone = '';

  const setRay = (event) => {
    const bounds = renderer.domElement.getBoundingClientRect();
    pointer.set(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      -((event.clientY - bounds.top) / bounds.height) * 2 + 1
    );
    raycaster.setFromCamera(pointer, camera);
  };

  const hitLandmark = (event) => {
    setRay(event);
    const foxHit = raycaster.intersectObject(fox.hitMesh, false).length > 0;
    const steleHit = stele ? raycaster.intersectObject(stele, true).length > 0 : false;
    return foxHit ? 'fox' : steleHit ? 'stele' : null;
  };

  const onPointerMove = (event) => {
    if (event.pointerType !== 'mouse' || controls.state.dragging) return;
    const target = hitLandmark(event);
    const nextHovered = Boolean(target);
    if (nextHovered !== hovered) {
      hovered = nextHovered;
      fox.setHover(target === 'fox');
      renderer.domElement.classList.toggle('is-interactive', nextHovered);
    }
  };

  const onPointerDown = (event) => {
    pointerDown = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event) => {
    if (!pointerDown) return;
    const moved = Math.abs(event.clientX - pointerDown.x) + Math.abs(event.clientY - pointerDown.y);
    pointerDown = null;
    if (moved > 9) return;
    if (hitLandmark(event)) onSelect();
  };

  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointerup', onPointerUp);

  const onKeyDown = (event) => {
    if (event.key.toLowerCase() === 'e' && nearTarget) {
      onSelect();
    }
  };
  window.addEventListener('keydown', onKeyDown);

  const onResize = () => {
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    post?.setSize(width, height);
  };
  const observer = new ResizeObserver(onResize);
  observer.observe(container);

  const onContextLost = (event) => {
    event.preventDefault();
    onError(new Error('WebGL context lost'));
  };
  renderer.domElement.addEventListener('webglcontextlost', onContextLost, false);

  const clock = new THREE.Clock();
  let firstFrame = true;
  let frameCount = 0;
  let sampleTime = 0;

  const render = () => {
    if (disposed) return;
    const delta = Math.min(clock.getDelta(), 0.05);
    const time = clock.elapsedTime;

    controls.update(delta);
    environment.update(time, delta);
    fox.update(time, delta);
    if (post) post.render();
    else renderer.render(scene, camera);

    if (firstFrame) {
      firstFrame = false;
      onProgress({ value: 1, label: '入境' });
      onReady();
    }

    frameCount += 1;
    sampleTime += delta;
    hudTimer += delta;
    if (hudTimer > 0.16) {
      hudTimer = 0;
      const zone = zoneAt(controls.state.position);
      const nearFox = controls.state.position.distanceTo(foxPosition) < 18;
      const nearStele = controls.state.position.distanceTo(stelePosition) < 7;
      nearTarget = nearFox ? 'fox' : nearStele ? 'stele' : null;
      onPrompt(nearTarget);
      onHud({
        position: controls.state.position,
        speed: controls.state.speed,
        sprinting: controls.state.sprinting,
        altitude: controls.state.groundY,
        yaw: controls.state.yaw,
        zone,
        zoneChanged: zone !== lastZone
      });
      lastZone = zone;
    }

    if (sampleTime > 2.4) {
      const fps = frameCount / sampleTime;
      container.dataset.fps = fps.toFixed(1);
      if (fps < 34 && !qualityReduced) {
        slowFrames += 1;
        if (slowFrames >= 2) {
          renderer.setPixelRatio(1);
          onResize();
          environment.keyLight.castShadow = false;
          post?.dispose();
          post = null;
          qualityReduced = true;
          container.classList.add('reduced-quality');
          container.dataset.quality = 'reduced';
        }
      } else {
        slowFrames = 0;
      }
      frameCount = 0;
      sampleTime = 0;
    }
  };

  onProgress({ value: 0.94, label: '进入青丘' });
  await nextFrame();
  renderer.setAnimationLoop(render);

  const setPaused = (paused) => controls.setPaused(paused);
  const awaken = () => fox.awaken();

  const dispose = () => {
    disposed = true;
    renderer.setAnimationLoop(null);
    post?.dispose();
    controls.dispose();
    observer.disconnect();
    window.removeEventListener('keydown', onKeyDown);
    renderer.domElement.removeEventListener('pointermove', onPointerMove);
    renderer.domElement.removeEventListener('pointerdown', onPointerDown);
    renderer.domElement.removeEventListener('pointerup', onPointerUp);
    renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
    scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((item) => {
          Object.values(item).forEach((value) => {
            if (value && value.isTexture) value.dispose();
          });
          item.dispose();
        });
      }
    });
    renderer.dispose();
    renderer.domElement.remove();
  };

  return {
    awaken,
    setPaused,
    dispose,
    scene,
    camera,
    renderer,
    controls
  };
}
