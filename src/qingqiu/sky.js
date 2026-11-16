import * as THREE from 'three';

const SKY_VERTEX = `
  varying vec3 vDirection;
  void main() {
    vDirection = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SKY_FRAGMENT = `
  precision highp float;
  varying vec3 vDirection;
  uniform float uTime;
  uniform vec3 uZenith;
  uniform vec3 uHorizon;
  uniform vec3 uHaze;
  uniform vec3 uMoonColor;
  uniform vec3 uMoonDirection;

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
    float weight = 0.5;
    for (int i = 0; i < 5; i++) {
      value += noise21(p) * weight;
      p = p * 2.06 + vec2(7.1, -4.7);
      weight *= 0.5;
    }
    return value;
  }

  void main() {
    vec3 direction = normalize(vDirection);
    float altitude = smoothstep(-0.1, 0.84, direction.y);
    vec3 color = mix(uHorizon, uZenith, altitude);

    float longitude = atan(direction.z, direction.x);
    vec2 cloudUv = vec2(longitude * 1.55 + uTime * 0.004, direction.y * 4.3);
    float cloud = fbm(cloudUv);
    float cloudBand = smoothstep(0.4, 0.69, cloud);
    cloudBand *= smoothstep(-0.04, 0.38, direction.y);
    color = mix(color, uHaze, cloudBand * 0.56);

    float storm = fbm(vec2(longitude * 2.7 + uTime * 0.006, direction.y * 6.2 + 3.0));
    storm = smoothstep(0.46, 0.72, storm) * smoothstep(-0.02, 0.38, direction.y);
    color = mix(color, vec3(0.21, 0.32, 0.45), storm * 0.34);

    float aurora = fbm(vec2(longitude * 1.1 - uTime * 0.008, direction.y * 2.2 + 5.0));
    aurora = smoothstep(0.53, 0.78, aurora);
    aurora *= smoothstep(0.02, 0.22, direction.y) * (1.0 - smoothstep(0.38, 0.74, direction.y));
    color += vec3(0.035, 0.2, 0.24) * aurora;

    vec2 starUv = floor(direction.xz / max(direction.y * 0.32 + 0.18, 0.035) * 340.0);
    float star = step(0.9962, hash21(starUv));
    star *= smoothstep(0.08, 0.5, direction.y);
    color += vec3(0.5, 0.66, 0.7) * star * 0.5;

    float moonDot = max(dot(direction, normalize(uMoonDirection)), 0.0);
    float disc = smoothstep(0.9956, 0.9976, moonDot);
    float halo = pow(moonDot, 42.0) * 0.42 + pow(moonDot, 9.0) * 0.09;
    float moonMottle = fbm(direction.xy * 52.0) * 0.15;
    color += uMoonColor * (disc * (1.08 - moonMottle) + halo);

    float horizonGlow = pow(1.0 - max(direction.y, 0.0), 8.0);
    color += vec3(0.09, 0.2, 0.29) * horizonGlow;
    gl_FragColor = vec4(color, 1.0);
  }
`;

export function createSky(moonDirection) {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uZenith: { value: new THREE.Color('#070b18') },
      uHorizon: { value: new THREE.Color('#263d55') },
      uHaze: { value: new THREE.Color('#5a6f88') },
      uMoonColor: { value: new THREE.Color('#e9f3ee') },
      uMoonDirection: { value: moonDirection.clone() }
    },
    vertexShader: SKY_VERTEX,
    fragmentShader: SKY_FRAGMENT,
    side: THREE.BackSide,
    depthWrite: false,
    fog: false
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(470, 56, 32), material);
  mesh.name = 'sky-dome';
  mesh.renderOrder = -20;
  return mesh;
}

export function updateSky(sky, time) {
  sky.material.uniforms.uTime.value = time;
}
