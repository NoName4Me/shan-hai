import * as THREE from 'three';

const WATER_VERTEX = `
  uniform float uTime;
  varying vec3 vWorld;
  varying float vWave;

  void main() {
    vec3 transformed = position;
    float wave =
      sin(transformed.x * 0.13 + uTime * 0.32) * 0.12 +
      sin(transformed.y * 0.21 - uTime * 0.24) * 0.07 +
      sin((transformed.x + transformed.y) * 0.065 + uTime * 0.11) * 0.15;
    transformed.z += wave;
    vWave = wave;
    vec4 world = modelMatrix * vec4(transformed, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const WATER_FRAGMENT = `
  precision highp float;
  uniform float uTime;
  uniform vec3 uDeep;
  uniform vec3 uShallow;
  uniform vec3 uBone;
  uniform vec3 uEmber;
  uniform vec3 uMoonDirection;
  uniform vec3 uFog;
  varying vec3 vWorld;
  varying float vWave;

  float hash21(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 31.4);
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
    vec3 normal = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
    if (normal.y < 0.0) normal *= -1.0;
    vec3 viewDirection = normalize(cameraPosition - vWorld);
    float fresnel = pow(1.0 - max(dot(normal, viewDirection), 0.0), 2.2);
    float lift = smoothstep(-0.22, 0.26, vWave);
    vec3 color = mix(uDeep, uShallow, lift * 0.56);
    color += uBone * fresnel * 0.19;

    float reflection = pow(max(dot(reflect(-viewDirection, normal), normalize(uMoonDirection)), 0.0), 9.0);
    color += vec3(0.55, 0.72, 0.75) * reflection * 0.38;

    float lines = smoothstep(0.975, 0.998, sin(vWorld.x * 1.05 + vWorld.z * 0.72 + uTime * 0.46) * 0.5 + 0.5);
    lines += smoothstep(0.988, 1.0, sin(vWorld.x * 0.37 - vWorld.z * 0.91 - uTime * 0.28) * 0.5 + 0.5);
    float ink = lines * (0.4 + noise21(vWorld.xz * 0.18) * 0.6);
    color = mix(color, uBone, ink * 0.07);

    float vein = smoothstep(0.82, 1.0, noise21(vWorld.xz * 0.055 + uTime * 0.01));
    color = mix(color, uEmber, vein * 0.08);
    float fog = 1.0 - exp(-pow(length(cameraPosition - vWorld) * 0.008, 2.0));
    color = mix(color, uFog, clamp(fog, 0.0, 0.9));
    gl_FragColor = vec4(color, 1.0);
  }
`;

export function createWater(scene, moonDirection) {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uDeep: { value: new THREE.Color('#071722') },
      uShallow: { value: new THREE.Color('#274658') },
      uBone: { value: new THREE.Color('#d4e0d8') },
      uEmber: { value: new THREE.Color('#b65737') },
      uMoonDirection: { value: moonDirection.clone() },
      uFog: { value: new THREE.Color('#172333') }
    },
    vertexShader: WATER_VERTEX,
    fragmentShader: WATER_FRAGMENT,
    fog: false
  });
  const water = new THREE.Mesh(new THREE.PlaneGeometry(320, 320, 90, 90), material);
  water.name = 'qingqiu-water';
  water.rotation.x = -Math.PI / 2;
  water.position.set(10, -2.35, -10);
  scene.add(water);
  return water;
}
