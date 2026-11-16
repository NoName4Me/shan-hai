import * as THREE from 'three';
import { mulberry32 } from './utils.js';

const PEAK_VERTEX = `
  varying vec3 vWorld;
  varying vec3 vNormalWorld;
  varying vec3 vColor;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vNormalWorld = normalize(mat3(modelMatrix) * normal);
    vColor = color;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const PEAK_FRAGMENT = `
  precision highp float;
  uniform vec3 uFog;
  uniform vec3 uMoonDirection;
  varying vec3 vWorld;
  varying vec3 vNormalWorld;
  varying vec3 vColor;

  void main() {
    vec3 normal = normalize(vNormalWorld);
    vec3 view = normalize(cameraPosition - vWorld);
    float moonLight = max(dot(normal, normalize(uMoonDirection)), 0.0);
    float rim = pow(1.0 - max(dot(normal, view), 0.0), 2.5);
    vec3 color = vColor * (0.68 + moonLight * 0.74);
    color += vec3(0.13, 0.26, 0.34) * rim * 0.84;
    float distanceToCamera = length(cameraPosition - vWorld);
    float mist = 1.0 - exp(-pow(distanceToCamera * 0.0062, 2.05));
    color = mix(color, uFog, clamp(mist, 0.0, 0.9));
    gl_FragColor = vec4(color, 1.0);
  }
`;

function createMountainRing(radius, height, seed, colorA, colorB) {
  const random = mulberry32(seed);
  const segments = 76;
  const positions = [];
  const colors = [];
  const indices = [];
  const low = new THREE.Color(colorA);
  const high = new THREE.Color(colorB);

  for (let index = 0; index <= segments; index += 1) {
    const angle = (index / segments) * Math.PI * 2;
    const wobble = 0.84 + random() * 0.42;
    const peak = height * (0.34 + random() * 0.82);
    positions.push(
      Math.cos(angle) * radius * 0.92,
      -17,
      Math.sin(angle) * radius * 0.92
    );
    positions.push(
      Math.cos(angle) * radius * wobble,
      peak,
      Math.sin(angle) * radius * wobble
    );
    colors.push(low.r, low.g, low.b);
    const tint = high.clone().lerp(low, random() * 0.32);
    colors.push(tint.r, tint.g, tint.b);
  }

  for (let index = 0; index < segments; index += 1) {
    const a = index * 2;
    indices.push(a, a + 2, a + 1, a + 2, a + 3, a + 1);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uFog: { value: new THREE.Color('#142131') },
      uMoonDirection: { value: new THREE.Vector3(-0.17, 0.22, -0.96).normalize() }
    },
    vertexShader: PEAK_VERTEX,
    fragmentShader: PEAK_FRAGMENT,
    vertexColors: true,
    side: THREE.DoubleSide,
    fog: false
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = false;
  return mesh;
}

export function createDistantPeaks(scene) {
  const rings = [
    createMountainRing(154, 38, 117, '#0a1722', '#344957'),
    createMountainRing(218, 58, 291, '#08131e', '#273b4d'),
    createMountainRing(298, 76, 517, '#060f19', '#1b2c3d'),
    createMountainRing(392, 94, 733, '#040a11', '#111f2e')
  ];
  rings.forEach((ring, index) => {
    ring.position.y = index * -1.6;
    scene.add(ring);
  });

  const snow = new THREE.Group();
  const random = mulberry32(7401);
  const material = new THREE.MeshBasicMaterial({
    color: '#b8c9ca',
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
    fog: true
  });
  for (let index = 0; index < 18; index += 1) {
    const angle = random() * Math.PI * 2;
    const radius = 160 + random() * 120;
    const shard = new THREE.Mesh(new THREE.ConeGeometry(4 + random() * 8, 24 + random() * 45, 4), material);
    shard.position.set(
      Math.cos(angle) * radius,
      28 + random() * 36,
      Math.sin(angle) * radius
    );
    shard.rotation.y = random() * Math.PI;
    shard.rotation.z = (random() - 0.5) * 0.08;
    snow.add(shard);
  }
  scene.add(snow);
  return { rings, snow };
}
