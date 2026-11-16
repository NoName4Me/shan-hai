import * as THREE from 'three';

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const lerp = (a, b, t) => a + (b - a) * t;

export const smoothstep = (edge0, edge1, value) => {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

export const damp = (current, target, lambda, delta) =>
  lerp(current, target, 1 - Math.exp(-lambda * delta));

export function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function hash2(x, y) {
  const value = Math.sin(x * 127.1 + y * 311.7 + 19.19) * 43758.5453123;
  return value - Math.floor(value);
}

export function noise2(x, y) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi);
  const b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1);
  const d = hash2(xi + 1, yi + 1);
  return lerp(lerp(a, b, u), lerp(c, d, u), v);
}

export function fbm(x, y, octaves = 5, persistence = 0.5, lacunarity = 2.03) {
  let value = 0;
  let amplitude = 0.5;
  let total = 0;
  let px = x;
  let py = y;
  for (let index = 0; index < octaves; index += 1) {
    value += amplitude * noise2(px, py);
    total += amplitude;
    px = px * lacunarity + 13.7;
    py = py * lacunarity - 7.3;
    amplitude *= persistence;
  }
  return value / total;
}

export function fbm2(x, y) {
  let value = 0;
  let amplitude = 0.5;
  for (let index = 0; index < 5; index += 1) {
    value += amplitude * hash2(Math.floor(x), Math.floor(y));
    x *= 2.03;
    y *= 2.03;
    amplitude *= 0.5;
  }
  return value;
}

export function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

export function dampAngle(current, target, lambda, delta) {
  let difference = (target - current + Math.PI) % (Math.PI * 2);
  if (difference < 0) difference += Math.PI * 2;
  difference -= Math.PI;
  return current + difference * (1 - Math.exp(-lambda * delta));
}

export function createCanvasTexture(size, draw, colorSpace = THREE.SRGBColorSpace) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  if (!context) {
    return new THREE.Texture();
  }
  draw(context, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = colorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

export function createInkTexture() {
  return createCanvasTexture(512, (context, size) => {
    const random = mulberry32(83021);
    context.fillStyle = '#ded9ca';
    context.fillRect(0, 0, size, size);

    for (let index = 0; index < 46; index += 1) {
      const x = random() * size - 90;
      const y = random() * size;
      const width = 4 + random() * 26;
      context.save();
      context.globalAlpha = 0.025 + random() * 0.075;
      context.lineWidth = width;
      context.lineCap = 'round';
      context.strokeStyle = index % 11 === 0 ? '#803b35' : '#30383a';
      context.beginPath();
      context.moveTo(x, y);
      context.bezierCurveTo(
        x + size * 0.22,
        y - 28 + random() * 56,
        x + size * 0.62,
        y - 20 + random() * 40,
        x + size * 0.9,
        y - 18 + random() * 36
      );
      context.stroke();
      context.restore();
    }

    for (let index = 0; index < 180; index += 1) {
      const alpha = 0.015 + random() * 0.04;
      context.fillStyle = `rgba(22, 29, 31, ${alpha})`;
      const radius = 0.4 + random() * 1.8;
      context.beginPath();
      context.arc(random() * size, random() * size, radius, 0, Math.PI * 2);
      context.fill();
    }
  });
}

export function createGlowTexture(inner = 'rgba(255, 230, 190, 0.95)', outer = 'rgba(255, 140, 80, 0)') {
  return createCanvasTexture(
    128,
    (context, size) => {
      const gradient = context.createRadialGradient(
        size * 0.5,
        size * 0.5,
        0,
        size * 0.5,
        size * 0.5,
        size * 0.5
      );
      gradient.addColorStop(0, inner);
      gradient.addColorStop(0.22, 'rgba(255, 214, 160, 0.5)');
      gradient.addColorStop(0.55, 'rgba(197, 116, 73, 0.14)');
      gradient.addColorStop(1, outer);
      context.fillStyle = gradient;
      context.fillRect(0, 0, size, size);
    },
    THREE.SRGBColorSpace
  );
}

export function createMistTexture() {
  return createCanvasTexture(
    256,
    (context, size) => {
      const gradient = context.createRadialGradient(
        size * 0.5,
        size * 0.5,
        size * 0.04,
        size * 0.5,
        size * 0.5,
        size * 0.5
      );
      gradient.addColorStop(0, 'rgba(198, 207, 199, 0.32)');
      gradient.addColorStop(0.38, 'rgba(137, 156, 151, 0.16)');
      gradient.addColorStop(1, 'rgba(80, 105, 108, 0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, size, size);
    },
    THREE.SRGBColorSpace
  );
}

export function createWedgeGeometry(width, height, length, frontScale = 0.62) {
  const halfWidth = width * 0.5;
  const halfHeight = height * 0.5;
  const halfLength = length * 0.5;
  const frontWidth = halfWidth * frontScale;
  const frontHeight = halfHeight * frontScale;
  const vertices = new Float32Array([
    -halfWidth, -halfHeight, -halfLength,
    halfWidth, -halfHeight, -halfLength,
    halfWidth, halfHeight, -halfLength,
    -halfWidth, halfHeight, -halfLength,
    -frontWidth, -frontHeight, halfLength,
    frontWidth, -frontHeight, halfLength,
    frontWidth, frontHeight, halfLength,
    -frontWidth, frontHeight, halfLength
  ]);
  const indices = [
    0, 2, 1, 0, 3, 2,
    4, 6, 5, 4, 7, 6,
    0, 4, 7, 0, 7, 3,
    1, 2, 6, 1, 6, 5,
    0, 1, 5, 0, 5, 4,
    3, 7, 6, 3, 6, 2
  ];
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function createLoftGeometry(sections, radialSegments = 10) {
  const positions = [];
  const indices = [];
  for (let ring = 0; ring < sections.length; ring += 1) {
    const section = sections[ring];
    for (let radial = 0; radial <= radialSegments; radial += 1) {
      const angle = (radial / radialSegments) * Math.PI * 2;
      const wobble = 1 + Math.sin(angle * 3 + ring * 0.7) * 0.018;
      positions.push(
        Math.cos(angle) * section.width * wobble,
        section.y + Math.sin(angle) * section.height * wobble,
        section.z
      );
    }
  }
  for (let ring = 0; ring < sections.length - 1; ring += 1) {
    for (let radial = 0; radial < radialSegments; radial += 1) {
      const a = ring * (radialSegments + 1) + radial;
      const b = a + radialSegments + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const start = 0;
  const end = (sections.length - 1) * (radialSegments + 1);
  for (let radial = 1; radial < radialSegments; radial += 1) {
    indices.push(start, start + radial, start + radial + 1);
    indices.push(end, end + radial + 1, end + radial);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function createLimb(start, end, startRadius, endRadius, material, radialSegments = 6) {
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  const geometry = new THREE.CylinderGeometry(
    endRadius,
    startRadius,
    length,
    radialSegments,
    1,
    false
  );
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  mesh.castShadow = true;
  return mesh;
}

function tailProfile(t) {
  const swell = Math.pow(Math.sin(Math.PI * Math.pow(t, 0.9)), 0.92);
  const taper = Math.pow(1 - t, 0.48);
  return {
    width: (0.11 + 0.43 * swell) * taper,
    thickness: (0.018 + 0.035 * swell) * (0.3 + 0.7 * (1 - t))
  };
}

export function createTailGeometry(curve, index, segments = 56, radialSegments = 9) {
  const positions = [];
  const colors = [];
  const indices = [];
  const bone = new THREE.Color(index % 2 === 0 ? '#bdb8a9' : '#a9a89d');
  const ink = new THREE.Color('#10171a');
  const cinnabar = new THREE.Color('#a94a3e');
  const coldSeal = new THREE.Color('#416f7a');
  const accent = index % 2 === 0 ? cinnabar : coldSeal;
  const up = new THREE.Vector3(0, 1, 0);

  for (let segment = 0; segment <= segments; segment += 1) {
    const t = segment / segments;
    const point = curve.getPoint(t);
    const tangent = curve.getTangent(t).normalize();
    const side = new THREE.Vector3().crossVectors(tangent, up);
    if (side.lengthSq() < 0.0001) side.set(1, 0, 0);
    side.normalize();
    const normal = new THREE.Vector3().crossVectors(side, tangent).normalize();
    const { width, thickness } = tailProfile(t);
    const twist = t * 0.7 + index * 0.14;

    for (let radial = 0; radial <= radialSegments; radial += 1) {
      const angle = (radial / radialSegments) * Math.PI * 2 + twist;
      const offset = side
        .clone()
        .multiplyScalar(Math.cos(angle) * width)
        .add(normal.clone().multiplyScalar(Math.sin(angle) * thickness));
      const vertex = point.clone().add(offset);
      positions.push(vertex.x, vertex.y, vertex.z);

      const upper = Math.max(0, Math.sin(angle));
      const lower = Math.max(0, -Math.sin(angle));
      const pigment = bone.clone().lerp(ink, 0.06 + lower * 0.54);
      pigment.lerp(ink, 0.03 + Math.max(0, t - 0.7) * 0.2);
      const edge = Math.pow(Math.abs(Math.cos(angle)), 22);
      if (edge > 0.22 && (index === 0 || index === 4 || index === 8 || t > 0.84)) {
        pigment.lerp(accent, edge * (0.16 + t * 0.54));
      }
      const brush = 0.94 + Math.sin(t * 47 + index * 3.1 + radial * 0.7) * 0.06;
      pigment.multiplyScalar(brush);
      colors.push(pigment.r, pigment.g, pigment.b);
    }
  }

  for (let segment = 0; segment < segments; segment += 1) {
    for (let radial = 0; radial < radialSegments; radial += 1) {
      const a = segment * (radialSegments + 1) + radial;
      const b = a + radialSegments + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function createCurveLine(curve, material, segments = 64, offset = 0) {
  const points = [];
  const up = new THREE.Vector3(0, 1, 0);
  for (let index = 0; index <= segments; index += 1) {
    const t = index / segments;
    const point = curve.getPoint(t);
    const tangent = curve.getTangent(t).normalize();
    const side = new THREE.Vector3().crossVectors(tangent, up).normalize();
    const normal = new THREE.Vector3().crossVectors(side, tangent).normalize();
    const { width } = tailProfile(t);
    points.push(point.add(side.multiplyScalar(width * offset)));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  return new THREE.Line(geometry, material);
}

export function createSoftDisc(texture, color, size, opacity) {
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), material);
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}
