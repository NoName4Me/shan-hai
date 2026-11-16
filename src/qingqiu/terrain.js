import * as THREE from 'three';
import { clamp, fbm, smoothstep } from './utils.js';

export const WORLD_SIZE = 380;
export const WATER_LEVEL = -2.35;

export function sampleTerrain(x, z) {
  const radial = Math.hypot(x, z);
  const broad = fbm(x * 0.008 + 11.4, z * 0.008 - 3.8, 5);
  const detail = fbm(x * 0.035 - 7.1, z * 0.035 + 17.2, 4);
  const ridgeNoise = fbm(x * 0.014 + 31.2, z * 0.014 + 9.6, 3);
  const blade = Math.pow(Math.abs(Math.sin(x * 0.018 + z * 0.011 + ridgeNoise * 4.5)), 5);

  let height = 0.6 + (broad - 0.5) * 8.6 + (detail - 0.5) * 1.8 + blade * 1.7;

  const boundary = smoothstep(88, 172, radial);
  height += boundary * (18 + (ridgeNoise - 0.5) * 25);

  const basin = Math.exp(-((x - 20) ** 2 / 2500 + (z + 26) ** 2 / 3900));
  height -= basin * 4.7;

  const lake = Math.exp(-((x - 42) ** 2 / 1300 + (z + 18) ** 2 / 2350));
  height -= lake * 7.4;

  const northValley = Math.exp(-(x ** 2 / 1250 + (z + 72) ** 2 / 4200));
  height -= northValley * 4.2;

  const spawnShelf = Math.exp(-(x ** 2 / 520 + (z - 38) ** 2 / 1150));
  height = THREE.MathUtils.lerp(height, 1.15, spawnShelf * 0.82);

  const shrineShelf = Math.exp(-(x ** 2 / 850 + (z + 48) ** 2 / 1600));
  height = THREE.MathUtils.lerp(height, -1.1, shrineShelf * 0.76);

  const path = Math.exp(-(x ** 2 / 72 + (z + 4) ** 2 / 2400));
  height = THREE.MathUtils.lerp(height, 0.15 + Math.sin(z * 0.045) * 0.35, path * 0.6);

  return height;
}

function terrainColor(height, slope, x, z, target) {
  const low = new THREE.Color('#1e3544');
  const middle = new THREE.Color('#4d6973');
  const high = new THREE.Color('#8c9998');
  const pale = new THREE.Color('#c4c4b6');
  const vein = new THREE.Color('#285d70');
  const t = smoothstep(-4, 19, height);
  target.copy(low).lerp(middle, Math.min(1, t * 1.65));
  target.lerp(high, smoothstep(0.58, 1, t));
  target.lerp(pale, smoothstep(19, 35, height) * 0.36);
  target.lerp(vein, smoothstep(0.35, 0.8, slope) * 0.3);

  const strata = Math.sin(height * 2.15 + fbm(x * 0.05, z * 0.05, 2) * 4.2);
  target.multiplyScalar(0.82 + Math.abs(strata) * 0.22);

  const ink = fbm(x * 0.12 + 21, z * 0.12 - 6, 3);
  target.multiplyScalar(0.86 + ink * 0.24);
}

const TERRAIN_VERTEX = `
  varying vec3 vWorld;
  varying vec3 vNormalWorld;
  varying vec3 vColor;
  varying float vHeight;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vNormalWorld = normalize(mat3(modelMatrix) * normal);
    vColor = color;
    vHeight = position.y;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const TERRAIN_FRAGMENT = `
  precision highp float;
  uniform vec3 uSun;
  uniform vec3 uFog;
  uniform vec3 uSky;
  uniform vec3 uEmber;
  uniform float uTime;
  varying vec3 vWorld;
  varying vec3 vNormalWorld;
  varying vec3 vColor;
  varying float vHeight;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise21(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
      mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  void main() {
    vec3 normal = normalize(vNormalWorld);
    vec3 view = normalize(cameraPosition - vWorld);
    float diffuse = max(dot(normal, normalize(uSun)), 0.0);
    float hemi = normal.y * 0.5 + 0.5;
    float rim = pow(1.0 - max(dot(normal, view), 0.0), 2.6);

    vec3 color = vColor;
    color *= 0.82 + diffuse * 0.72 + hemi * 0.34;
    color += uSky * rim * 0.31;

    float strata = abs(sin(vHeight * 2.4 + noise21(vWorld.xz * 0.055) * 5.0));
    float contour = smoothstep(0.935, 1.0, strata);
    color = mix(color, uEmber * 0.82, contour * 0.075);
    color += uSky * contour * 0.035;

    float dust = noise21(vWorld.xz * 0.17 + uTime * 0.008);
    color *= 0.9 + dust * 0.16;

    float distanceToCamera = length(cameraPosition - vWorld);
    float fog = 1.0 - exp(-pow(distanceToCamera * 0.0115, 2.1));
    color = mix(color, uFog, clamp(fog, 0.0, 0.92));
    gl_FragColor = vec4(color, 1.0);
  }
`;

export function createTerrain(scene) {
  const segments = 176;
  const geometry = new THREE.PlaneGeometry(
    WORLD_SIZE,
    WORLD_SIZE,
    segments,
    segments
  );
  geometry.rotateX(-Math.PI / 2);

  const positions = geometry.attributes.position;
  const colors = new Float32Array(positions.count * 3);
  const color = new THREE.Color();
  const step = WORLD_SIZE / segments;

  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const z = positions.getZ(index);
    const y = sampleTerrain(x, z);
    positions.setY(index, y);

    const hx = sampleTerrain(x + step, z) - sampleTerrain(x - step, z);
    const hz = sampleTerrain(x, z + step) - sampleTerrain(x, z - step);
    const slope = clamp(Math.hypot(hx, hz) / (step * 2.4), 0, 1);
    terrainColor(y, slope, x, z, color);
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.computeVertexNormals();

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uSun: { value: new THREE.Vector3(-0.45, 0.72, 0.35) },
      uFog: { value: new THREE.Color('#172333') },
      uSky: { value: new THREE.Color('#7eaab8') },
      uEmber: { value: new THREE.Color('#a95235') },
      uTime: { value: 0 }
    },
    vertexShader: TERRAIN_VERTEX,
    fragmentShader: TERRAIN_FRAGMENT,
    vertexColors: true,
    fog: false
  });

  const terrain = new THREE.Mesh(geometry, material);
  terrain.name = 'qingqiu-terrain';
  terrain.receiveShadow = false;
  scene.add(terrain);
  return terrain;
}
