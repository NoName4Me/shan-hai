import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useAppStore } from '../store';

/**
 * 青丘试境：墨骨 / Mineral Ink
 *
 * Shared visual grammar: large mineral volumes, off-white hard surfaces,
 * wet ink edges and restrained cinnabar. The fox alone owns the nine sweeping
 * tail shapes; later creatures should NOT inherit its anatomy.
 *
 * All geometry and ink textures are local and procedural. No external assets.
 */
const INK = '#161c23';
const BONE = '#e2e0d8';
const CINNABAR = '#a64f49';
const ASH = '#737879';

const noise = (n: number) => {
  const value = Math.sin(n * 127.1 + 19.37) * 43758.5453;
  return value - Math.floor(value);
};

function inkTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();
  ctx.fillStyle = '#e7e3dc';
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 22; i += 1) {
    const y = noise(i + 1) * 580 - 30;
    const x = noise(i + 84) * 370 - 100;
    const width = 9 + noise(i + 55) * 52;
    ctx.save();
    ctx.globalAlpha = 0.06 + noise(i + 44) * 0.21;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.strokeStyle = i % 7 === 0 ? '#923d3e' : '#222831';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + 150, y - 48, x + 270, y + 55, x + 520, y - 36);
    ctx.stroke();
    ctx.restore();
  }
  // Ink pooling follows the strokes, rather than random pixels or grid motifs.
  for (let i = 0; i < 55; i += 1) {
    ctx.fillStyle = i % 8 === 0 ? 'rgba(152,64,62,.12)' : 'rgba(20,26,33,.045)';
    ctx.beginPath();
    ctx.ellipse(noise(i + 4) * 512, noise(i + 95) * 512, 3 + noise(i + 8) * 16, 1 + noise(i + 11) * 5, noise(i + 5), 0, Math.PI * 2);
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

function makeRibbon(points: THREE.Vector3[], width: number) {
  const curve = new THREE.CatmullRomCurve3(points);
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const black = new THREE.Color('#0d1820');
  const dilute = new THREE.Color('#7d8585');
  for (let i = 0; i <= 48; i += 1) {
    const t = i / 48;
    const center = curve.getPoint(t);
    const tangent = curve.getTangent(t);
    const across = new THREE.Vector3(tangent.z, 0, -tangent.x).normalize();
    const taper = Math.pow(Math.sin(Math.PI * t), 0.65);
    const irregular = 0.86 + 0.14 * Math.sin(t * 63);
    const half = width * taper * irregular;
    for (const side of [-1, 1]) {
      const vertex = center.clone().addScaledVector(across, half * side);
      positions.push(vertex.x, vertex.y, vertex.z);
      const c = black.clone().lerp(dilute, (side + 1) * 0.22 + t * 0.18);
      colors.push(c.r, c.g, c.b);
    }
    if (i < 48) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function makeTail(index: number) {
  const s = (index - 4) / 4;
  const outer = Math.abs(s);
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(s * 0.13, 0, 0),
    new THREE.Vector3(s * 0.34, 0.2, -0.58),
    new THREE.Vector3(s * 1.1, 0.95 + (1 - outer) * 0.25, -1.18),
    new THREE.Vector3(s * 2.3, 2.05 + (1 - outer) * 0.3, -1.5),
    new THREE.Vector3(s * 3.25 + Math.sin(index * 2.1) * 0.19, 2.85 - outer * 0.55, -1.65),
    new THREE.Vector3(s * 3.78 + Math.sin(index * 1.4) * 0.31, 2.56 - outer * 0.8, -1.96)
  ]);
  const segments = 44;
  const radial = 8;
  const frames = curve.computeFrenetFrames(segments, false);
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const pearl = new THREE.Color('#e5e3db');
  const black = new THREE.Color('#252b33');
  const red = new THREE.Color('#a54e4b');
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const p = curve.getPoint(t);
    const radius = (0.09 + 0.39 * Math.pow(Math.sin(Math.PI * t), 0.83)) * Math.pow(1 - t, 0.28) + 0.008;
    for (let j = 0; j <= radial; j += 1) {
      const a = (j / radial) * Math.PI * 2;
      const normal = frames.normals[i].clone().multiplyScalar(Math.cos(a) * radius);
      const binormal = frames.binormals[i].clone().multiplyScalar(Math.sin(a) * radius * 0.57);
      const v = p.clone().add(normal).add(binormal);
      positions.push(v.x, v.y, v.z);
      const lightSide = Math.cos(a) > -0.12;
      const pigment = pearl.clone().lerp(black, lightSide ? 0.14 : 0.84);
      const band = Math.sin(t * 22 + index * 3.7 + Math.sin(a * 3)) * 0.5 + 0.5;
      pigment.lerp(black, (lightSide ? 0.05 : 0.12) + band * 0.11);
      if ((index + 1) % 3 === 0 || t > 0.77) pigment.lerp(red, Math.max(0, (t - 0.64) * 0.95));
      colors.push(pigment.r, pigment.g, pigment.b);
    }
  }
  for (let i = 0; i < segments; i += 1) {
    for (let j = 0; j < radial; j += 1) {
      const a = i * (radial + 1) + j;
      const b = a + radial + 1;
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

type FoxProps = { onSelect: () => void; pulse: number };

function InkFox({ onSelect, pulse }: FoxProps) {
  const root = useRef<THREE.Group>(null);
  const breath = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const tailRefs = useRef<Array<THREE.Group | null>>([]);
  const legRefs = useRef<Array<THREE.Group | null>>([]);
  const ripple = useRef<THREE.Mesh>(null);
  const rippleMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const awaken = useRef(0);
  const [hover, setHover] = useState(false);
  const coat = useMemo(inkTexture, []);
  const tails = useMemo(() => Array.from({ length: 9 }, (_, index) => makeTail(index)), []);
  const legs = useMemo(() => [
    { x: -0.39, z: 0.59, rear: false },
    { x: 0.39, z: 0.59, rear: false },
    { x: -0.48, z: -0.69, rear: true },
    { x: 0.48, z: -0.69, rear: true }
  ], []);

  useEffect(() => { if (pulse > 0) awaken.current = 1; }, [pulse]);
  useEffect(() => () => { document.body.style.cursor = ''; }, []);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    awaken.current = Math.max(0, awaken.current - Math.min(delta, 0.08) / 3.2);
    const response = Math.sin(Math.PI * (1 - awaken.current));
    const lift = response * (awaken.current > 0 ? 0.33 : 0);
    if (root.current) {
      root.current.position.y = 0.52 + Math.sin(t * 0.85) * 0.055 + lift;
      root.current.rotation.y = -0.16 + Math.sin(t * 0.31) * 0.055 + response * 0.18;
      const size = THREE.MathUtils.lerp(root.current.scale.x, hover ? 1.035 : 1, 0.075);
      root.current.scale.setScalar(size);
    }
    if (breath.current) {
      breath.current.scale.set(1 + Math.sin(t * 1.36) * 0.011, 1 + Math.sin(t * 1.36) * 0.017, 1);
    }
    if (head.current) {
      head.current.rotation.x = Math.sin(t * 0.68) * 0.022 - response * 0.12;
      head.current.rotation.y = Math.sin(t * 0.44) * 0.035;
    }
    tailRefs.current.forEach((tail, index) => {
      if (!tail) return;
      const s = (index - 4) / 4;
      tail.rotation.z = Math.sin(t * 0.63 + index * 0.44) * 0.075 + s * response * 0.25;
      tail.rotation.x = Math.sin(t * 0.48 + index * 0.68) * 0.044 + response * 0.07;
      tail.rotation.y = Math.sin(t * 0.4 + index * 0.9) * 0.07;
    });
    legRefs.current.forEach((leg, index) => {
      if (!leg) return;
      leg.rotation.x = Math.sin(t * 0.9 + (index % 2) * Math.PI + Math.floor(index / 2)) * 0.025 + response * (index % 2 ? -0.13 : 0.12);
    });
    if (ripple.current) ripple.current.scale.setScalar(0.55 + response * 1.6);
    if (rippleMaterial.current) rippleMaterial.current.opacity = awaken.current > 0 ? response * 0.42 : 0;
  });

  return <group
    ref={root}
    position={[0, 0.52, 0]}
    onClick={(event) => { event.stopPropagation(); onSelect(); }}
    onPointerOver={(event) => { event.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
    onPointerOut={() => { setHover(false); document.body.style.cursor = ''; }}
  >
    <mesh ref={ripple} position={[0, 0.055, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[2.08, 0.026, 5, 80]} />
      <meshBasicMaterial ref={rippleMaterial} color={CINNABAR} transparent opacity={0} depthWrite={false} />
    </mesh>

    <group ref={breath}>
      {/* Core anatomy: narrow fox silhouette beneath a handful of coherent armor plates. */}
      <mesh position={[0, 1.49, -0.06]} scale={[0.62, 0.49, 1.03]} castShadow>
        <sphereGeometry args={[1, 32, 20]} />
        <meshStandardMaterial color={INK} roughness={0.79} />
      </mesh>
      <mesh position={[0, 1.56, -0.05]} scale={[0.626, 0.47, 1.0]} castShadow>
        <sphereGeometry args={[1, 32, 20]} />
        <meshStandardMaterial map={coat} roughness={0.81} metalness={0.12} />
      </mesh>
      <mesh position={[0, 1.68, 0.43]} rotation={[0.38, 0, 0]} scale={[0.39, 0.57, 0.36]} castShadow>
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color={BONE} roughness={0.64} metalness={0.16} flatShading />
      </mesh>
      <mesh position={[0, 1.76, 0.72]} rotation={[0.2, 0, 0]} scale={[0.20, 0.48, 0.19]}>
        <coneGeometry args={[1, 1, 3]} />
        <meshStandardMaterial color={CINNABAR} roughness={0.75} />
      </mesh>
      {[-1, 1].map((side) => <group key={side}>
        <mesh position={[side * 0.56, 1.56, 0.2]} rotation={[0, side * 0.25, side * 0.55]} scale={[0.15, 0.32, 0.61]} castShadow>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={BONE} roughness={0.72} flatShading />
        </mesh>
        <mesh position={[side * 0.52, 1.58, -0.47]} rotation={[0, side * 0.27, side * 0.32]} scale={[0.24, 0.30, 0.47]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={ASH} roughness={0.88} flatShading />
        </mesh>
      </group>)}
    </group>

    {/* Nine independent brush-blade tails: all actual geometry, each animated. */}
    <group position={[0, 1.56, -0.82]}>
      {tails.map((geometry, index) => <group
        key={index}
        ref={(node) => { tailRefs.current[index] = node; }}
        position={[0, 0, -index * 0.035]}
      >
        <mesh geometry={geometry} castShadow>
          <meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.79} metalness={0.08} />
        </mesh>
      </group>)}
    </group>

    <group ref={head}>
      <mesh position={[0, 2.18, 0.68]} rotation={[0.32, 0, 0]} scale={[0.31, 0.47, 0.35]} castShadow>
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color={INK} roughness={0.77} />
      </mesh>
      <mesh position={[0, 2.53, 0.91]} scale={[0.38, 0.32, 0.49]} castShadow>
        <dodecahedronGeometry args={[1, 2]} />
        <meshStandardMaterial color={BONE} roughness={0.68} metalness={0.1} flatShading />
      </mesh>
      <mesh position={[0, 2.42, 1.33]} rotation={[Math.PI / 2, 0, 0]} scale={[0.21, 0.45, 0.21]} castShadow>
        <coneGeometry args={[1, 1, 5]} />
        <meshStandardMaterial color="#d2d2cc" roughness={0.75} flatShading />
      </mesh>
      <mesh position={[0, 2.40, 1.55]} scale={[0.09, 0.06, 0.085]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color={INK} roughness={0.45} />
      </mesh>
      {[-1, 1].map((side) => <group key={side}>
        <mesh position={[side * 0.255, 2.91, 0.78]} rotation={[-0.12, 0, -side * 0.18]} castShadow>
          <coneGeometry args={[0.18, 0.7, 4]} />
          <meshStandardMaterial color={BONE} roughness={0.77} flatShading />
        </mesh>
        <mesh position={[side * 0.24, 2.92, 0.85]} rotation={[-0.08, 0, -side * 0.18]}>
          <coneGeometry args={[0.105, 0.46, 3]} />
          <meshStandardMaterial color={INK} roughness={0.8} />
        </mesh>
        <mesh position={[side * 0.239, 2.57, 1.254]} scale={[0.102, 0.041, 0.035]} rotation={[0, side * 0.12, side * 0.21]}>
          <sphereGeometry args={[1, 12, 8]} />
          <meshBasicMaterial color="#d2b19b" toneMapped={false} />
        </mesh>
        <mesh position={[side * 0.35, 2.27, 1.04]} rotation={[0.1, side * 0.17, -side * 0.52]} scale={[0.12, 0.33, 0.28]}>
          <coneGeometry args={[1, 1, 3]} />
          <meshStandardMaterial color={INK} roughness={0.84} />
        </mesh>
      </group>)}
    </group>

    {legs.map((leg, index) => <group
      key={index}
      ref={(node) => { legRefs.current[index] = node; }}
      position={[leg.x, 1.42, leg.z]}
      rotation={[leg.rear ? -0.16 : 0.1, 0, leg.x > 0 ? -0.07 : 0.07]}
    >
      <mesh position={[leg.x > 0 ? 0.08 : -0.08, -0.35, 0]} rotation={[0.12, 0, leg.x > 0 ? 0.2 : -0.2]} scale={[0.2, 0.49, 0.25]} castShadow>
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color={BONE} roughness={0.76} flatShading />
      </mesh>
      <mesh position={[leg.x > 0 ? 0.12 : -0.12, -0.79, leg.rear ? -0.1 : 0.08]} scale={[0.12, 0.43, 0.15]} castShadow>
        <cylinderGeometry args={[0.65, 0.97, 2, 5]} />
        <meshStandardMaterial color={INK} roughness={0.78} />
      </mesh>
      <mesh position={[leg.x > 0 ? 0.12 : -0.12, -1.19, leg.rear ? -0.18 : 0.17]} rotation={[Math.PI / 2, 0, 0]} scale={[0.19, 0.36, 0.1]} castShadow>
        <coneGeometry args={[1, 1, 4]} />
        <meshStandardMaterial color={CINNABAR} roughness={0.65} />
      </mesh>
    </group>)}

    {/* Hit target covers the nine tails and body without hiding any geometry. */}
    <mesh position={[0, 2.45, -0.4]} scale={[8.4, 4.4, 5.5]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial transparent opacity={0} colorWrite={false} depthWrite={false} />
    </mesh>
  </group>;
}

function Mountains() {
  const peaks = useMemo(() => [-60, -45, -31, -16, 4, 20, 37, 52, 67].flatMap((x, i) => {
    const h = 13 + noise(i + 7) * 25;
    return [
      { x, z: -53 - (i % 3) * 9, h, r: 7.5 + noise(i + 19) * 5.5, color: i % 2 ? '#3b424a' : '#4a5055' },
      { x: x + 8, z: -74, h: h * 0.8, r: 9, color: '#313a43' }
    ];
  }), []);

  return <group>
    {peaks.map((p, i) => <group key={i} position={[p.x, -1, p.z]} rotation={[0, i * 0.31, 0]}>
      <mesh position={[0, p.h * 0.44, 0]} scale={[p.r, p.h, p.r * 0.72]}>
        <coneGeometry args={[1, 1, 5]} />
        <meshStandardMaterial color={p.color} roughness={1} flatShading />
      </mesh>
      <mesh position={[-p.r * 0.17, p.h * 0.84, p.r * 0.2]} scale={[p.r * 0.18, p.h * 0.19, p.r * 0.23]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[1, 1, 3]} />
        <meshBasicMaterial color="#939694" />
      </mesh>
    </group>)}
  </group>;
}

function Landscape() {
  const strokes = useMemo(() => [
    makeRibbon([new THREE.Vector3(-17, -0.72, 14), new THREE.Vector3(-6, -0.7, 11), new THREE.Vector3(8, -0.7, 12), new THREE.Vector3(23, -0.72, 18)], 1.1),
    makeRibbon([new THREE.Vector3(-24, -0.7, -5), new THREE.Vector3(-15, -0.68, 1), new THREE.Vector3(-8, -0.68, 4), new THREE.Vector3(3, -0.68, 8)], 0.8),
    makeRibbon([new THREE.Vector3(8, -0.69, -16), new THREE.Vector3(16, -0.69, -9), new THREE.Vector3(25, -0.69, -6)], 0.7)
  ], []);
  const stones = useMemo(() => Array.from({ length: 34 }, (_, index) => {
    const a = noise(index + 12) * Math.PI * 2;
    const d = 10 + noise(index + 49) * 29;
    return {
      x: Math.sin(a) * d,
      z: Math.cos(a) * d + 3,
      y: -0.45,
      size: 0.38 + noise(index + 77) * 1.55,
      turn: noise(index + 17) * 3
    };
  }), []);
  const trees = useMemo(() => [
    [-12, -7, 1.4], [-15, 9, 1.7], [-11, 17, 1.15], [12, -8, 1.4],
    [17, 8, 1.8], [23, 17, 1.3], [-24, -22, 1.8], [25, -27, 1.6]
  ] as Array<[number, number, number]>, []);

  return <group>
    <mesh position={[0, -0.84, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[220, 220]} />
      <meshStandardMaterial color="#39434a" roughness={1} />
    </mesh>
    <mesh position={[-22, -0.71, -6]} rotation={[-Math.PI / 2, 0, -0.12]}>
      <circleGeometry args={[20, 72]} />
      <meshStandardMaterial color="#1b2930" metalness={0.27} roughness={0.34} />
    </mesh>
    {strokes.map((geometry, index) => <mesh key={index} geometry={geometry}>
      <meshBasicMaterial vertexColors side={THREE.DoubleSide} transparent opacity={index === 0 ? 0.69 : 0.48} depthWrite={false} />
    </mesh>)}

    {/* The stage uses the same mineral/ink surface system as the fox armor. */}
    <mesh position={[0, -0.04, 0]} castShadow receiveShadow rotation={[0, -0.11, 0]}>
      <cylinderGeometry args={[6.55, 7.75, 1.56, 9]} />
      <meshStandardMaterial color="#242d35" roughness={0.94} flatShading />
    </mesh>
    <mesh position={[0, 0.73, 0]} rotation={[-Math.PI / 2, 0, 0.11]} receiveShadow>
      <circleGeometry args={[6.55, 9]} />
      <meshStandardMaterial color="#7c8583" roughness={0.89} flatShading />
    </mesh>
    <mesh position={[0, 0.754, 0]} rotation={[-Math.PI / 2, 0, -0.21]}>
      <ringGeometry args={[5.85, 5.91, 90]} />
      <meshBasicMaterial color="#c38a75" transparent opacity={0.48} side={THREE.DoubleSide} />
    </mesh>
    {stones.map((stone, index) => <mesh
      key={index}
      position={[stone.x, stone.y, stone.z]}
      scale={[stone.size * 1.3, stone.size * 0.8, stone.size]}
      rotation={[index * 0.12, stone.turn, index * 0.06]}
      castShadow receiveShadow
    >
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={index % 3 === 0 ? '#777d7b' : '#242f37'} roughness={0.97} flatShading />
    </mesh>)}
    {trees.map(([x, z, scale], index) => <group key={index} position={[x, -0.4, z]} scale={scale} rotation={[0, index * 0.41, 0]}>
      <mesh position={[0, 1.15, 0]} rotation={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.075, 0.20, 2.4, 5]} />
        <meshStandardMaterial color="#1a252b" roughness={1} />
      </mesh>
      <mesh position={[-0.27, 2.35, 0]} rotation={[0, 0, 0.25]} scale={[0.67, 1.5, 0.22]}>
        <coneGeometry args={[1, 1, 3]} />
        <meshStandardMaterial color={index % 2 ? '#636c6b' : '#465052'} roughness={1} side={THREE.DoubleSide} flatShading />
      </mesh>
      <mesh position={[0.32, 2.85, 0.05]} rotation={[0, 0, -0.19]} scale={[0.42, 1.23, 0.21]}>
        <coneGeometry args={[1, 1, 3]} />
        <meshStandardMaterial color="#303b42" roughness={1} side={THREE.DoubleSide} flatShading />
      </mesh>
    </group>)}
  </group>;
}

function Mist() {
  const sprites = useRef<Array<THREE.Sprite | null>>([]);
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 2, 64, 64, 63);
      gradient.addColorStop(0, 'rgba(214,215,201,.5)');
      gradient.addColorStop(0.5, 'rgba(170,184,183,.12)');
      gradient.addColorStop(1, 'rgba(120,146,150,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);
  const clouds = useMemo(() => Array.from({ length: 10 }, (_, i) => ({
    x: -39 + i * 8,
    z: -18 - (i % 4) * 9,
    y: 0.8 + (i % 3) * 0.8
  })), []);
  useFrame(({ clock }) => {
    sprites.current.forEach((sprite, index) => {
      if (sprite) sprite.position.x = clouds[index].x + Math.sin(clock.elapsedTime * 0.085 + index) * 2.5;
    });
  });
  return <group>{clouds.map((cloud, index) => <sprite
    key={index}
    ref={(node) => { sprites.current[index] = node; }}
    position={[cloud.x, cloud.y, cloud.z]}
    scale={[22, 6, 1]}
  >
    <spriteMaterial map={texture} color="#c5bdb3" transparent opacity={0.22} depthWrite={false} />
  </sprite>)}</group>;
}

export default function Qingqiu() {
  const toggleInfo = useAppStore((s) => s.toggleInfo);
  const pulse = useAppStore((s) => s.foxPulse);
  return <Canvas
    shadows
    dpr={[1, 1.5]}
    camera={{ position: [8.3, 5.8, 17.5], fov: 43, near: 0.1, far: 230 }}
    gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
    onCreated={({ gl }) => {
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 1.13;
      gl.shadowMap.type = THREE.PCFSoftShadowMap;
    }}
  >
    <color attach="background" args={['#222b34']} />
    <fog attach="fog" args={['#3c464b', 24, 105]} />
    <ambientLight intensity={0.72} color="#c5cfcc" />
    <hemisphereLight intensity={0.88} color="#d9d3c9" groundColor="#28343c" />
    <directionalLight
      position={[-15, 23, -16]}
      intensity={2.55}
      color="#f3dbcb"
      castShadow
      shadow-mapSize={[1024, 1024]}
      shadow-camera-left={-25}
      shadow-camera-right={25}
      shadow-camera-top={25}
      shadow-camera-bottom={-25}
      shadow-camera-near={1}
      shadow-camera-far={100}
      shadow-normalBias={0.028}
    />
    <directionalLight position={[12, 10, 15]} color="#9fb2b9" intensity={1.5} />
    <pointLight position={[0, 5, -3]} color="#ad5b50" intensity={13} distance={14} decay={2} />
    <mesh position={[-28, 25, -74]}>
      <sphereGeometry args={[9, 40, 24]} />
      <meshBasicMaterial color="#d8d2c4" />
    </mesh>
    <Mountains />
    <Landscape />
    <Mist />
    <InkFox onSelect={toggleInfo} pulse={pulse} />
    <OrbitControls
      makeDefault
      target={[0, 2.35, -0.5]}
      enablePan={false}
      enableDamping
      dampingFactor={0.065}
      autoRotate
      autoRotateSpeed={0.14}
      minDistance={7.5}
      maxDistance={37}
      minPolarAngle={0.56}
      maxPolarAngle={1.46}
    />
  </Canvas>;
}
