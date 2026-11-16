import * as THREE from 'three';
import { createGlowTexture, createMistTexture, mulberry32 } from './utils.js';

const CLOUD_VERTEX = `
  varying vec2 vUv;
  varying vec3 vWorld;
  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const CLOUD_FRAGMENT = `
  precision highp float;
  varying vec2 vUv;
  varying vec3 vWorld;
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

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

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += noise21(p) * amplitude;
      p = p * 2.03 + vec2(9.2, -3.4);
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    float cloud = fbm(vec2(uv.x * 3.2 + uTime * 0.007, uv.y * 2.3 - uTime * 0.003));
    float detail = fbm(vec2(uv.x * 8.7 - uTime * 0.011, uv.y * 5.4));
    cloud = smoothstep(0.44, 0.7, cloud * 0.8 + detail * 0.35);
    float edgeX = smoothstep(0.0, 0.15, uv.x) * smoothstep(1.0, 0.78, uv.x);
    float edgeY = smoothstep(0.0, 0.2, uv.y) * smoothstep(1.0, 0.34, uv.y);
    float alpha = cloud * edgeX * edgeY * uOpacity;
    vec3 color = mix(uColorA, uColorB, clamp(uv.y * 0.7 + detail * 0.4, 0.0, 1.0));
    gl_FragColor = vec4(color, alpha);
  }
`;

function createCloudCurtain(colorA, colorB, opacity) {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: opacity },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) }
    },
    vertexShader: CLOUD_VERTEX,
    fragmentShader: CLOUD_FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  });
  return new THREE.Mesh(new THREE.PlaneGeometry(430, 180), material);
}

function createGroundMist(colorA, colorB, opacity, y) {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: opacity },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) }
    },
    vertexShader: CLOUD_VERTEX,
    fragmentShader: CLOUD_FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(340, 340), material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(8, y, -14);
  return mesh;
}

export function createAtmosphere(scene) {
  const random = mulberry32(11773);
  const group = new THREE.Group();
  group.name = 'qingqiu-atmosphere';

  const moteCount = 520;
  const positions = new Float32Array(moteCount * 3);
  const sizes = new Float32Array(moteCount);
  for (let index = 0; index < moteCount; index += 1) {
    const angle = random() * Math.PI * 2;
    const radius = 6 + Math.pow(random(), 0.64) * 110;
    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = 0.4 + Math.pow(random(), 1.4) * 23;
    positions[index * 3 + 2] = Math.sin(angle) * radius - 10;
    sizes[index] = 0.16 + random() * 0.34;
  }
  const moteGeometry = new THREE.BufferGeometry();
  moteGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  moteGeometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

  const moteMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#d7c9a9') }
    },
    vertexShader: `
      attribute float aSize;
      uniform float uTime;
      varying float vFade;
      void main() {
        vec3 p = position;
        p.y += sin(uTime * 0.22 + position.x * 0.18 + position.z * 0.1) * 0.8;
        p.x += cos(uTime * 0.09 + position.z * 0.1) * 0.7;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = aSize * (170.0 / max(-mv.z, 1.0));
        gl_Position = projectionMatrix * mv;
        vFade = smoothstep(150.0, 12.0, -mv.z);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying float vFade;
      void main() {
        vec2 p = gl_PointCoord - 0.5;
        float glow = smoothstep(0.5, 0.04, length(p));
        gl_FragColor = vec4(uColor, glow * vFade * 0.62);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const motes = new THREE.Points(moteGeometry, moteMaterial);
  group.add(motes);

  const emberCount = 110;
  const emberPositions = new Float32Array(emberCount * 3);
  const emberPhases = new Float32Array(emberCount);
  for (let index = 0; index < emberCount; index += 1) {
    const angle = random() * Math.PI * 2;
    const radius = 2 + random() * 12;
    emberPositions[index * 3] = Math.cos(angle) * radius;
    emberPositions[index * 3 + 1] = 1 + random() * 11;
    emberPositions[index * 3 + 2] = -43 + Math.sin(angle) * radius;
    emberPhases[index] = random() * Math.PI * 2;
  }
  const emberGeometry = new THREE.BufferGeometry();
  emberGeometry.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3));
  const embers = new THREE.Points(emberGeometry, new THREE.PointsMaterial({
    color: '#e47a45',
    size: 0.18,
    transparent: true,
    opacity: 0.78,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  }));
  group.add(embers);

  const mistTexture = createMistTexture();
  const mist = [];
  for (let index = 0; index < 16; index += 1) {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: mistTexture,
      color: index % 4 === 0 ? '#a8bec8' : '#738ba0',
      transparent: true,
      opacity: 0.07 + random() * 0.1,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: true
    }));
    const angle = random() * Math.PI * 2;
    const radius = 28 + random() * 95;
    sprite.position.set(
      Math.cos(angle) * radius,
      1.4 + random() * 8,
      Math.sin(angle) * radius - 22
    );
    sprite.scale.set(26 + random() * 38, 4.5 + random() * 7, 1);
    group.add(sprite);
    mist.push({
      sprite,
      x: sprite.position.x,
      y: sprite.position.y,
      phase: random() * Math.PI * 2,
      speed: 0.02 + random() * 0.025
    });
  }

  const moonGlow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: createGlowTexture(
      'rgba(229, 240, 230, 0.88)',
      'rgba(97, 144, 160, 0)'
    ),
    color: '#d7e8e5',
    transparent: true,
    opacity: 0.34,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    fog: false
  }));
  moonGlow.position.set(-66, 86, -374);
  moonGlow.scale.set(108, 108, 1);
  group.add(moonGlow);

  const cloudFar = createCloudCurtain('#294b70', '#9bb4c4', 0.28);
  cloudFar.position.set(-88, 54, -292);
  cloudFar.rotation.y = 0.15;
  group.add(cloudFar);

  const cloudNear = createCloudCurtain('#526f92', '#b7c9ca', 0.19);
  cloudNear.position.set(48, 42, -216);
  cloudNear.rotation.y = -0.12;
  group.add(cloudNear);

  const emberCurtain = createCloudCurtain('#59231b', '#b06a55', 0.1);
  emberCurtain.position.set(0, 14, -128);
  emberCurtain.scale.set(0.7, 0.55, 1);
  group.add(emberCurtain);

  const lowMist = createGroundMist('#507489', '#9fb9bd', 0.08, 1.1);
  const highMist = createGroundMist('#354c6f', '#8398aa', 0.045, 5.5);
  group.add(lowMist, highMist);

  const shaftMaterial = new THREE.MeshBasicMaterial({
    color: '#83aeb9',
    transparent: true,
    opacity: 0.045,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  });
  [-30, -8, 23, 42].forEach((x, index) => {
    const shaft = new THREE.Mesh(new THREE.ConeGeometry(8 + index * 2.5, 95, 4, 1, true), shaftMaterial);
    shaft.position.set(x, 50, -112 - index * 9);
    shaft.rotation.z = 0.12 + index * 0.03;
    group.add(shaft);
  });

  scene.add(group);
  return {
    group,
    update(time) {
      moteMaterial.uniforms.uTime.value = time;
      cloudFar.material.uniforms.uTime.value = time;
      cloudNear.material.uniforms.uTime.value = time * 1.18;
      emberCurtain.material.uniforms.uTime.value = time * 0.82;
      lowMist.material.uniforms.uTime.value = time * 0.55;
      highMist.material.uniforms.uTime.value = time * 0.38;
      const positions = embers.geometry.attributes.position.array;
      for (let index = 0; index < emberCount; index += 1) {
        positions[index * 3 + 1] += 0.006;
        if (positions[index * 3 + 1] > 13) {
          positions[index * 3 + 1] = 1;
          positions[index * 3] = Math.cos(emberPhases[index]) * (2 + (index % 11));
          positions[index * 3 + 2] = -43 + Math.sin(emberPhases[index]) * (2 + (index % 9));
        }
      }
      embers.geometry.attributes.position.needsUpdate = true;
      mist.forEach((item) => {
        item.sprite.position.x = item.x + Math.sin(time * item.speed + item.phase) * 9;
        item.sprite.position.y = item.y + Math.sin(time * 0.12 + item.phase) * 0.5;
      });
      moonGlow.material.opacity = 0.25 + Math.sin(time * 0.19) * 0.035;
    }
  };
}
