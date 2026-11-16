import * as THREE from 'three';
import { sampleTerrain, WATER_LEVEL } from './terrain.js';
import { clamp, damp } from './utils.js';

const EYE_HEIGHT = 1.72;
const WORLD_LIMIT = 174;

export function createFirstPersonController(camera, element, spawn = new THREE.Vector3(0, 0, 38)) {
  const state = {
    position: spawn.clone(),
    velocity: new THREE.Vector3(),
    speed: 0,
    grounded: true,
    groundY: 0,
    aboveGround: 0,
    verticalVelocity: 0,
    yaw: 0,
    pitch: -0.015,
    targetYaw: 0,
    targetPitch: -0.015,
    fov: 66,
    targetFov: 66,
    dragging: false,
    pointerId: null,
    lastX: 0,
    lastY: 0,
    moved: 0,
    paused: false,
    sprinting: false,
    stride: 0
  };
  const keys = Object.create(null);
  const forward = new THREE.Vector3();
  const right = new THREE.Vector3();
  const desired = new THREE.Vector3();

  const groundAt = (x, z) => Math.max(sampleTerrain(x, z), WATER_LEVEL - 0.42);
  state.groundY = groundAt(state.position.x, state.position.z);
  state.position.y = state.groundY + EYE_HEIGHT;
  camera.position.copy(state.position);
  camera.rotation.order = 'YXZ';

  const onPointerDown = (event) => {
    if (state.paused) return;
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    state.dragging = true;
    state.pointerId = event.pointerId;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.moved = 0;
    element.setPointerCapture?.(event.pointerId);
    element.classList.add('is-dragging');
  };

  const onPointerMove = (event) => {
    if (state.paused) return;
    if (!state.dragging || event.pointerId !== state.pointerId) return;
    const dx = event.clientX - state.lastX;
    const dy = event.clientY - state.lastY;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.moved += Math.abs(dx) + Math.abs(dy);
    state.targetYaw -= dx * 0.0038;
    state.targetPitch = clamp(state.targetPitch - dy * 0.003, -1.15, 1.15);
  };

  const onPointerUp = (event) => {
    if (!state.dragging || event.pointerId !== state.pointerId) return;
    state.dragging = false;
    state.pointerId = null;
    element.releasePointerCapture?.(event.pointerId);
    element.classList.remove('is-dragging');
  };

  const onWheel = (event) => {
    event.preventDefault();
    if (state.paused) return;
    const normalized = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
    state.targetFov = clamp(state.targetFov + normalized * 0.018, 48, 76);
  };

  const onKeyDown = (event) => {
    const key = event.key.toLowerCase();
    if (['w', 'a', 's', 'd', 'shift', ' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
      event.preventDefault();
    }
    keys[key] = true;
    if (key === ' ' && state.grounded && !state.paused) {
      state.verticalVelocity = 6.6;
      state.grounded = false;
    }
  };

  const onKeyUp = (event) => {
    keys[event.key.toLowerCase()] = false;
  };

  const onBlur = () => {
    Object.keys(keys).forEach((key) => {
      keys[key] = false;
    });
  };

  element.addEventListener('pointerdown', onPointerDown);
  element.addEventListener('pointermove', onPointerMove);
  element.addEventListener('pointerup', onPointerUp);
  element.addEventListener('pointercancel', onPointerUp);
  element.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', onBlur);

  const update = (delta) => {
    const dt = Math.min(delta, 0.05);
    state.yaw = damp(state.yaw, state.targetYaw, 18, dt);
    state.pitch = damp(state.pitch, state.targetPitch, 18, dt);
    state.fov = damp(state.fov, state.targetFov, 10, dt);

    if (camera.fov !== state.fov) {
      camera.fov = state.fov;
      camera.updateProjectionMatrix();
    }

    const inputX = state.paused
      ? 0
      : (keys.d || keys.arrowright ? 1 : 0) - (keys.a || keys.arrowleft ? 1 : 0);
    const inputZ = state.paused
      ? 0
      : (keys.w || keys.arrowup ? 1 : 0) - (keys.s || keys.arrowdown ? 1 : 0);
    const hasInput = inputX !== 0 || inputZ !== 0;
    state.sprinting = Boolean(keys.shift) && inputZ > 0;

    forward.set(-Math.sin(state.yaw), 0, -Math.cos(state.yaw));
    right.set(Math.cos(state.yaw), 0, -Math.sin(state.yaw));
    desired.set(0, 0, 0);
    desired.addScaledVector(forward, inputZ);
    desired.addScaledVector(right, inputX);
    if (desired.lengthSq() > 1) desired.normalize();

    const previousGround = state.groundY;
    const maxSpeed = state.sprinting ? 13.2 : 6.8;
    const targetX = desired.x * maxSpeed;
    const targetZ = desired.z * maxSpeed;
    const response = hasInput ? (state.grounded ? 12 : 3.6) : (state.grounded ? 16 : 2.6);
    state.velocity.x = damp(state.velocity.x, targetX, response, dt);
    state.velocity.z = damp(state.velocity.z, targetZ, response, dt);

    const nextX = state.position.x + state.velocity.x * dt;
    const nextZ = state.position.z + state.velocity.z * dt;
    const nextGround = groundAt(nextX, nextZ);
    const horizontalSpeed = Math.hypot(state.velocity.x, state.velocity.z);
    const climb = nextGround - previousGround;
    const tooSteep = climb > 0.2 && climb > horizontalSpeed * dt * 1.7;
    const inside = Math.hypot(nextX, nextZ) < WORLD_LIMIT;

    if (inside && !tooSteep) {
      state.position.x = nextX;
      state.position.z = nextZ;
      state.groundY = nextGround;
    } else {
      state.velocity.x *= 0.28;
      state.velocity.z *= 0.28;
    }

    if (!state.grounded) {
      state.verticalVelocity -= 21 * dt;
      state.aboveGround += state.verticalVelocity * dt;
      if (state.aboveGround <= 0) {
        state.aboveGround = 0;
        state.verticalVelocity = 0;
        state.grounded = true;
      }
    }

    state.speed = horizontalSpeed;
    if (state.speed > 0.08) {
      state.stride += dt * (4.2 + state.speed * (state.sprinting ? 1.0 : 0.82));
    } else {
      state.stride += dt * 1.2;
    }

    const bobAmount = state.grounded ? Math.min(state.speed / 8, 1) * (state.sprinting ? 0.075 : 0.045) : 0;
    const bob = Math.sin(state.stride) * bobAmount;
    const sway = Math.cos(state.stride * 0.5) * bobAmount * 0.27;
    state.position.y = state.groundY + EYE_HEIGHT + state.aboveGround + bob;
    camera.position.set(
      state.position.x + right.x * sway,
      state.position.y,
      state.position.z + right.z * sway
    );
    camera.rotation.set(state.pitch, state.yaw, Math.sin(state.stride * 0.5) * 0.0025);
  };

  const setPaused = (paused) => {
    state.paused = paused;
    if (paused) {
      state.velocity.set(0, 0, 0);
      Object.keys(keys).forEach((key) => {
        keys[key] = false;
      });
    }
  };

  const dispose = () => {
    element.removeEventListener('pointerdown', onPointerDown);
    element.removeEventListener('pointermove', onPointerMove);
    element.removeEventListener('pointerup', onPointerUp);
    element.removeEventListener('pointercancel', onPointerUp);
    element.removeEventListener('wheel', onWheel);
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('blur', onBlur);
  };

  return { state, update, setPaused, dispose };
}
