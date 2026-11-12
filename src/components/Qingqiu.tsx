import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles } from '@react-three/drei';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useAppStore } from '../store';

const TERRACE = { x: 2.3, z: 0, top: 3.42, radius: 5.1 };
const LAKE = { x: -17, z: -4, radius: 13.5, level: 0.44 };
const SUN = new THREE.Vector3(-44, 20, -86);

const smoothstep = (value: number, min: number, max: number) =>
  THREE.MathUtils.smoothstep(value, min, max);

function heightAt(x: number, z: number) {
  const hill = (cx: number, cz: number, height: number, sx: number, sz: number) =>
    height * Math.exp(-(((x - cx) / sx) ** 2 + ((z - cz) / sz) ** 2));

  let height =
    0.22 +
    0.11 * Math.sin(x * 0.23) * Math.cos(z * 0.27) +
    0.045 * Math.sin((x + z) * 0.61);

  height += 10 * smoothstep(-z, 24, 68);
  height += hill(-48, -62, 23, 29, 27);
  height += hill(31, -68, 27, 27, 31);
  height += hill(-2, -49, 12, 46, 18);
  height += hill(40, -22, 8, 21, 25);
  height += hill(-50, -15, 9, 25, 31);
  height -= hill(LAKE.x, LAKE.z, 2.15, 14.5, 17.5);
  height += hill(TERRACE.x, TERRACE.z, 1.45, 8.5, 11);

  return height;
}

function SkyDome() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          sunPosition: { value: SUN.clone().normalize() }
        },
        vertexShader: `
          varying vec3 vWorldPosition;
          void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 sunPosition;
          varying vec3 vWorldPosition;
          void main() {
            vec3 direction = normalize(vWorldPosition);
            float height = direction.y;
            vec3 night = vec3(0.025, 0.032, 0.075);
            vec3 dusk = vec3(0.16, 0.105, 0.19);
            vec3 horizon = vec3(0.26, 0.18, 0.23);
            vec3 sky = mix(horizon, dusk, smoothstep(-0.02, 0.28, height));
            sky = mix(sky, night, smoothstep(0.16, 0.72, height));
            vec3 azimuth = normalize(vec3(direction.x, 0.0, direction.z));
            vec3 sunAzimuth = normalize(vec3(sunPosition.x, 0.0, sunPosition.z));
            float sunSide = smoothstep(-0.2, 1.0, dot(azimuth, sunAzimuth));
            float horizonBand = 1.0 - smoothstep(0.0, 0.24, abs(height));
            sky += vec3(0.78, 0.30, 0.075) * sunSide * horizonBand * 0.72;
            sky += vec3(0.45, 0.16, 0.04) * pow(sunSide, 4.0) * smoothstep(0.0, 0.2, height) * 0.28;
            float sunDot = max(dot(direction, sunPosition), 0.0);
            float glow = pow(sunDot, 20.0) * 0.72 + pow(sunDot, 120.0) * 1.1;
            float disc = smoothstep(0.9992, 0.99972, sunDot);
            sky += vec3(1.0, 0.47, 0.13) * glow;
            sky += vec3(1.0, 0.77, 0.37) * disc * 1.8;
            gl_FragColor = vec4(sky, 1.0);
          }
        `
      }),
    []
  );

  return <mesh material={material} renderOrder={-1}>
    <sphereGeometry args={[150, 48, 24]} />
  </mesh>;
}

function Terrain() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(190, 190, 180, 180);
    geo.rotateX(-Math.PI / 2);
    const position = geo.attributes.position as THREE.BufferAttribute;
    const colors: number[] = [];
    const deep = new THREE.Color('#1c2929');
    const moss = new THREE.Color('#44523d');
    const warmMoss = new THREE.Color('#6a6244');
    const rock = new THREE.Color('#777261');
    const color = new THREE.Color();

    for (let i = 0; i < position.count; i += 1) {
      const x = position.getX(i);
      const z = position.getZ(i);
      const height = heightAt(x, z);
      position.setY(i, height);

      const moisture = smoothstep(-height, -0.2, 1.3);
      const elevation = smoothstep(height, 1.2, 19);
      const sunward = smoothstep(-x, 2, 52);
      color
        .copy(deep)
        .lerp(moss, moisture * 0.88)
        .lerp(warmMoss, sunward * 0.24)
        .lerp(rock, elevation * 0.68);

      const variation =
        0.018 * Math.sin(x * 1.31 + z * 0.47) * Math.cos(z * 1.71 - x * 0.39);
      colors.push(
        THREE.MathUtils.clamp(color.r + variation, 0, 1),
        THREE.MathUtils.clamp(color.g + variation, 0, 1),
        THREE.MathUtils.clamp(color.b + variation, 0, 1)
      );
    }

    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  return <mesh geometry={geometry} receiveShadow>
    <meshStandardMaterial vertexColors roughness={1} metalness={0} />
  </mesh>;
}

function DistantRidges() {
  const ridges = useMemo(() => {
    const rows = [
      { z: -49, color: '#303b3d', count: 17, height: 14, spread: 126 },
      { z: -68, color: '#3a4146', count: 14, height: 20, spread: 154 }
    ];
    return rows.flatMap((row, rowIndex) =>
      Array.from({ length: row.count }, (_, index) => {
        const offset = (index - (row.count - 1) / 2) / ((row.count - 1) / 2);
        const x = offset * row.spread * 0.5 + (rowIndex ? 8 : -4);
        const scale = 0.7 + Math.abs(Math.sin(index * 2.17 + rowIndex)) * 0.5;
        return {
          x,
          z: row.z - Math.abs(offset) * 13,
          height: row.height * scale,
          radius: 9 + (index % 4) * 2.4,
          color: row.color
        };
      })
    );
  }, []);

  return <group>
    {ridges.map((ridge, index) => <mesh
      key={index}
      position={[ridge.x, ridge.height * 0.34 - 2.5, ridge.z]}
      scale={[ridge.radius, ridge.height, ridge.radius]}
      rotation={[0, index * 0.37, 0]}
    >
      <coneGeometry args={[1, 1, 7]} />
      <meshStandardMaterial color={ridge.color} roughness={1} flatShading />
    </mesh>)}
  </group>;
}

function Terrace() {
  const rocks = useMemo(() => Array.from({ length: 17 }, (_, index) => {
    const angle = (index / 17) * Math.PI * 2 + 0.12;
    const radius = 4.45 + (index % 3) * 0.28;
    const scale = 0.42 + (index % 5) * 0.13;
    return {
      x: TERRACE.x + Math.cos(angle) * radius,
      z: TERRACE.z + Math.sin(angle) * radius,
      y: TERRACE.top + 0.05 + (index % 4) * 0.04,
      scale,
      rotation: angle + index * 0.47
    };
  }), []);

  return <group>
    <mesh position={[TERRACE.x, 2.13, TERRACE.z]} rotation={[0, 0.24, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[5.14, 6.35, 2.58, 9, 1]} />
      <meshStandardMaterial color="#555a4f" roughness={1} flatShading />
    </mesh>
    <mesh position={[TERRACE.x, TERRACE.top - 0.015, TERRACE.z]} rotation={[-Math.PI / 2, 0, 0.24]} receiveShadow>
      <circleGeometry args={[5.16, 40]} />
      <meshStandardMaterial color="#4d5b40" roughness={1} />
    </mesh>
    {rocks.map((rock, index) => <mesh
      key={index}
      position={[rock.x, rock.y, rock.z]}
      scale={[rock.scale * 1.3, rock.scale * 0.6, rock.scale]}
      rotation={[0.25, rock.rotation, 0.1]}
      castShadow
      receiveShadow
    >
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={index % 3 ? '#626455' : '#4e5c46'} roughness={1} flatShading />
    </mesh>)}
  </group>;
}

function createTaperedTube(
  curve: THREE.CatmullRomCurve3,
  tubularSegments: number,
  radialSegments: number,
  radiusAt: (t: number) => number
) {
  const frames = curve.computeFrenetFrames(tubularSegments, false);
  const positions: number[] = [];
  const normals: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const rootColor = new THREE.Color('#c5a57b');
  const middleColor = new THREE.Color('#f4e4c8');
  const tipColor = new THREE.Color('#fff8e9');
  const point = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const color = new THREE.Color();

  for (let i = 0; i <= tubularSegments; i += 1) {
    const t = i / tubularSegments;
    curve.getPointAt(t, point);
    const radius = radiusAt(t);
    const frameNormal = frames.normals[i];
    const frameBinormal = frames.binormals[i];
    color.copy(rootColor).lerp(middleColor, smoothstep(t, 0.08, 0.58));
    color.lerp(tipColor, smoothstep(t, 0.58, 0.96));

    for (let j = 0; j <= radialSegments; j += 1) {
      const angle = (j / radialSegments) * Math.PI * 2;
      const sin = Math.sin(angle);
      const cos = Math.cos(angle);
      normal
        .copy(frameNormal)
        .multiplyScalar(cos)
        .addScaledVector(frameBinormal, sin)
        .normalize();
      positions.push(
        point.x + normal.x * radius,
        point.y + normal.y * radius,
        point.z + normal.z * radius
      );
      normals.push(normal.x, normal.y, normal.z);
      colors.push(color.r, color.g, color.b);
    }
  }

  for (let i = 0; i < tubularSegments; i += 1) {
    for (let j = 0; j < radialSegments; j += 1) {
      const a = i * (radialSegments + 1) + j;
      const b = (i + 1) * (radialSegments + 1) + j;
      const c = a + 1;
      const d = b + 1;
      indices.push(a, b, c, b, d, c);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();
  return geometry;
}

function NineTails() {
  const groups = useRef<Array<THREE.Group | null>>([]);
  const tails = useMemo(() => Array.from({ length: 9 }, (_, index) => {
    const spread = (index - 4) / 4;
    const centerWeight = 1 - Math.abs(spread);
    const depth = (index % 3) * 0.22;
    const height = 1.82 + centerWeight * 0.34 + Math.sin(index * 2.3) * 0.12;
    const reach = 2.28 + centerWeight * 0.22 + Math.sin(index * 1.7) * 0.14;
    const side = Math.sign(spread) || 1;
    const curl = Math.sin(index * 1.9 + 0.4) * 0.22;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(spread * 0.24, 0, -0.42 - depth * 0.2),
      new THREE.Vector3(spread * 0.44, 0.5, -0.86 - depth * 0.3),
      new THREE.Vector3(spread * 0.92 + side * 0.08, height * 0.54, -1.24 - depth * 0.36),
      new THREE.Vector3(spread * 1.35 + side * 0.2, height * 0.92, -1.62 - depth * 0.3),
      new THREE.Vector3(spread * 1.62 + side * 0.44 + curl, height * 0.82, -1.9 - depth * 0.22),
      new THREE.Vector3(spread * 1.82 + side * 0.7 + curl, height * 0.5, -reach)
    ]);
    const geometry = createTaperedTube(curve, 56, 10, (t) => {
      const flare = 1 + Math.sin(Math.min(t, 0.94) * Math.PI) * 0.42;
      return (0.245 * (1 - t) ** 0.46 + 0.014) * flare;
    });
    return { geometry, curve, depth };
  }), []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    groups.current.forEach((group, index) => {
      if (!group) return;
      group.rotation.z = Math.sin(time * 0.36 + index * 0.67) * 0.014;
      group.rotation.y = Math.sin(time * 0.28 + index * 0.54) * 0.016;
    });
  });

  return <group position={[0, 1.58, -0.86]} rotation={[0, 0.16, 0]} scale={1.12}>
    <mesh position={[0, 0.12, 0.05]} scale={[0.36, 0.28, 0.4]} castShadow>
      <sphereGeometry args={[1, 18, 12]} />
      <meshStandardMaterial color="#f7e8d2" roughness={0.88} emissive="#7a4a29" emissiveIntensity={0.1} />
    </mesh>
    {tails.map((tail, index) => <group
      key={index}
      ref={(node) => { groups.current[index] = node; }}
      position={[0, 0, tail.depth]}
    >
      <mesh geometry={tail.geometry} castShadow>
        <meshStandardMaterial
          vertexColors
          roughness={0.8}
          metalness={0}
          emissive="#8b4c22"
          emissiveIntensity={0.13}
        />
      </mesh>
    </group>)}
  </group>;
}

function Fox({ onSelect }: { onSelect: () => void }) {
  const fox = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => () => { document.body.style.cursor = 'auto'; }, []);

  useFrame((state) => {
    if (!fox.current) return;
    const time = state.clock.elapsedTime;
    fox.current.rotation.y = -0.18 + Math.sin(time * 0.28) * 0.012;
    const targetScale = hovered ? 1.035 : 1;
    const nextScale = THREE.MathUtils.lerp(fox.current.scale.x, targetScale, 0.07);
    fox.current.scale.setScalar(nextScale);
  });

  const fur = (color: string) => <meshStandardMaterial
    color={color}
    roughness={0.74}
    emissive="#8c5a35"
    emissiveIntensity={0.22}
  />;

  return <group
    ref={fox}
    position={[TERRACE.x, TERRACE.top + 0.02, TERRACE.z]}
    rotation={[0, -0.18, 0]}
    onClick={(event) => { event.stopPropagation(); onSelect(); }}
    onPointerOver={(event) => {
      event.stopPropagation();
      setHovered(true);
      document.body.style.cursor = 'pointer';
    }}
    onPointerOut={() => {
      setHovered(false);
      document.body.style.cursor = 'auto';
    }}
  >
    <NineTails />

    <mesh position={[0, 1.56, -0.02]} scale={[0.59, 0.54, 1.08]} castShadow>
      <sphereGeometry args={[1, 28, 20]} />
      {fur(hovered ? '#fffaf0' : '#f4ead9')}
    </mesh>
    <mesh position={[0, 1.61, 0.61]} scale={[0.5, 0.54, 0.54]} castShadow>
      <sphereGeometry args={[1, 26, 18]} />
      {fur('#faf1e2')}
    </mesh>
    <mesh position={[0, 1.43, -0.62]} scale={[0.48, 0.46, 0.58]} castShadow>
      <sphereGeometry args={[1, 24, 18]} />
      {fur('#eee2d0')}
    </mesh>

    <mesh position={[0, 2.08, 0.72]} rotation={[0.22, 0, 0]} scale={[0.37, 0.48, 0.38]} castShadow>
      <sphereGeometry args={[1, 24, 18]} />
      {fur('#fff6e8')}
    </mesh>
    <mesh position={[0, 2.59, 0.84]} rotation={[0, 0.08, 0]} scale={[0.42, 0.43, 0.45]} castShadow>
      <sphereGeometry args={[1, 28, 20]} />
      {fur('#fff9ee')}
    </mesh>
    <mesh position={[0, 2.55, 1.19]} rotation={[0.03, 0, 0]} scale={[0.23, 0.19, 0.38]} castShadow>
      <sphereGeometry args={[1, 22, 16]} />
      {fur('#f5ead8')}
    </mesh>
    <mesh position={[0, 2.51, 1.54]} scale={[0.105, 0.075, 0.075]}>
      <sphereGeometry args={[1, 14, 10]} />
      <meshStandardMaterial color="#3b302d" roughness={0.48} />
    </mesh>

    {[-0.235, 0.235].map((x) => <group key={x}>
      <mesh
        position={[x, 3.02, 0.77]}
        rotation={[0.08, 0, x * 0.32]}
        castShadow
      >
        <coneGeometry args={[0.175, 0.63, 9]} />
        {fur('#fff5e5')}
      </mesh>
      <mesh
        position={[x * 0.88, 3.01, 0.84]}
        rotation={[0.09, 0, x * 0.32]}
        scale={[0.62, 0.72, 0.55]}
      >
        <coneGeometry args={[0.175, 0.63, 9]} />
        <meshStandardMaterial color="#a87966" roughness={0.9} />
      </mesh>
    </group>)}

    {[-0.158, 0.158].map((x) => <mesh key={x} position={[x, 2.66, 1.245]} scale={[0.065, 0.047, 0.038]}>
      <sphereGeometry args={[1, 14, 10]} />
      <meshStandardMaterial
        color="#d69435"
        emissive="#b95e13"
        emissiveIntensity={1.1}
        roughness={0.28}
      />
    </mesh>)}

    {[-0.3, 0.3].map((x) => <group key={`front-${x}`}>
      <mesh position={[x, 0.84, 0.64]} scale={[0.16, 0.72, 0.18]} castShadow>
        <capsuleGeometry args={[0.12, 0.58, 6, 10]} />
        {fur('#f6ecdc')}
      </mesh>
      <mesh position={[x, 0.17, 0.77]} scale={[0.19, 0.12, 0.27]} castShadow>
        <sphereGeometry args={[1, 18, 12]} />
        {fur('#fff8ea')}
      </mesh>
    </group>)}
    {[-0.32, 0.32].map((x) => <group key={`back-${x}`}>
      <mesh position={[x, 0.86, -0.57]} rotation={[-0.16, 0, 0]} scale={[0.18, 0.75, 0.2]} castShadow>
        <capsuleGeometry args={[0.13, 0.6, 6, 10]} />
        {fur('#eee1cf')}
      </mesh>
      <mesh position={[x, 0.18, -0.7]} scale={[0.2, 0.12, 0.29]} castShadow>
        <sphereGeometry args={[1, 18, 12]} />
        {fur('#faf0df')}
      </mesh>
    </group>)}

    <mesh position={[0, 1.88, 0.74]} rotation={[0.38, 0, 0]} scale={[0.34, 0.61, 0.26]} castShadow>
      <coneGeometry args={[1, 1, 10]} />
      {fur('#fff6e7')}
    </mesh>

    <mesh position={[0, 2.45, 0.4]} scale={[4.8, 2.9, 4.6]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
    </mesh>
  </group>;
}

function Forest() {
  const trunks = useRef<THREE.InstancedMesh>(null);
  const lowerCrowns = useRef<THREE.InstancedMesh>(null);
  const upperCrowns = useRef<THREE.InstancedMesh>(null);
  const trees = useMemo(() => {
    let seed = 782341;
    const random = () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 4294967296);
    const result: Array<{ x: number; y: number; z: number; height: number; radius: number; tone: number }> = [];

    for (let i = 0; i < 360; i += 1) {
      const x = -86 + random() * 172;
      const z = -72 + random() * 122;
      const distanceToLake = Math.hypot(x - LAKE.x, z - LAKE.z);
      const distanceToTerrace = Math.hypot(x - TERRACE.x, z - TERRACE.z);
      const y = heightAt(x, z);
      if (y < 0.65 || distanceToLake < 13.5 || distanceToTerrace < 7.2) continue;
      if (x > -8 && x < 16 && z > -12 && z < 17) continue;
      result.push({
        x,
        y,
        z,
        height: 2.3 + random() * 5.1,
        radius: 0.55 + random() * 0.52,
        tone: random()
      });
    }
    return result;
  }, []);

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    trees.forEach((tree, index) => {
      dummy.position.set(tree.x, tree.y + tree.height * 0.24, tree.z);
      dummy.rotation.set(0, index * 0.73, 0);
      dummy.scale.set(tree.radius * 0.17, tree.height * 0.5, tree.radius * 0.17);
      dummy.updateMatrix();
      trunks.current?.setMatrixAt(index, dummy.matrix);

      dummy.position.set(tree.x, tree.y + tree.height * 0.57, tree.z);
      dummy.rotation.set(0, index * 0.91, 0);
      dummy.scale.set(tree.height * 0.25 * tree.radius, tree.height * 0.57, tree.height * 0.25 * tree.radius);
      dummy.updateMatrix();
      lowerCrowns.current?.setMatrixAt(index, dummy.matrix);
      lowerCrowns.current?.setColorAt(index, color.set(tree.tone > 0.5 ? '#1e3734' : '#283d35'));

      dummy.position.set(tree.x, tree.y + tree.height * 0.83, tree.z);
      dummy.rotation.set(0, index * 0.63, 0);
      dummy.scale.set(tree.height * 0.17 * tree.radius, tree.height * 0.38, tree.height * 0.17 * tree.radius);
      dummy.updateMatrix();
      upperCrowns.current?.setMatrixAt(index, dummy.matrix);
      upperCrowns.current?.setColorAt(index, color.set(tree.tone > 0.5 ? '#29433c' : '#33493c'));
    });
    [trunks, lowerCrowns, upperCrowns].forEach((ref) => {
      if (!ref.current) return;
      ref.current.instanceMatrix.needsUpdate = true;
      if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
    });
  }, [trees]);

  return <group>
    <instancedMesh ref={trunks} args={[undefined, undefined, trees.length]} castShadow>
      <cylinderGeometry args={[0.72, 1, 1, 5]} />
      <meshStandardMaterial color="#303b32" roughness={1} />
    </instancedMesh>
    <instancedMesh ref={lowerCrowns} args={[undefined, undefined, trees.length]} castShadow>
      <coneGeometry args={[1, 1, 7]} />
      <meshStandardMaterial color="#ffffff" vertexColors roughness={1} flatShading />
    </instancedMesh>
    <instancedMesh ref={upperCrowns} args={[undefined, undefined, trees.length]} castShadow>
      <coneGeometry args={[1, 1, 7]} />
      <meshStandardMaterial color="#ffffff" vertexColors roughness={1} flatShading />
    </instancedMesh>
  </group>;
}

function Grass() {
  const grass = useRef<THREE.InstancedMesh>(null);
  const blades = useMemo(() => {
    let seed = 421977;
    const random = () => ((seed = (1103515245 * seed + 12345) >>> 0) / 4294967296);
    const result: Array<{ x: number; y: number; z: number; height: number; tone: number }> = [];
    for (let i = 0; i < 2600; i += 1) {
      const x = -55 + random() * 110;
      const z = -22 + random() * 58;
      const y = heightAt(x, z);
      if (y < 0.32) continue;
      if (Math.hypot(x - LAKE.x, z - LAKE.z) < 12.5) continue;
      if (Math.hypot(x - TERRACE.x, z - TERRACE.z) < 5.7) continue;
      result.push({ x, y, z, height: 0.36 + random() * 1.18, tone: random() });
    }
    return result;
  }, []);

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    blades.forEach((blade, index) => {
      dummy.position.set(blade.x, blade.y + blade.height * 0.5, blade.z);
      dummy.rotation.set(
        (index % 7) * 0.025,
        (index * 1.61) % (Math.PI * 2),
        Math.sin(index * 1.31) * 0.13
      );
      dummy.scale.set(1, blade.height, 1);
      dummy.updateMatrix();
      grass.current?.setMatrixAt(index, dummy.matrix);
      grass.current?.setColorAt(
        index,
        color.set(blade.tone > 0.55 ? '#8b8256' : '#626a48')
      );
    });
    if (grass.current) {
      grass.current.instanceMatrix.needsUpdate = true;
      if (grass.current.instanceColor) grass.current.instanceColor.needsUpdate = true;
    }
  }, [blades]);

  return <instancedMesh ref={grass} args={[undefined, undefined, blades.length]}>
    <coneGeometry args={[0.035, 1, 3]} />
    <meshStandardMaterial color="#ffffff" vertexColors roughness={1} side={THREE.DoubleSide} />
  </instancedMesh>;
}

function Rocks() {
  const rocks = useMemo(() => {
    let seed = 67311;
    const random = () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 4294967296);
    return Array.from({ length: 58 }, (_, index) => {
      const nearShore = index < 30;
      const angle = random() * Math.PI * 2;
      const radius = nearShore ? LAKE.radius + 0.4 + random() * 3.2 : 9 + random() * 37;
      const x = nearShore ? LAKE.x + Math.cos(angle) * radius : TERRACE.x + Math.cos(angle) * radius;
      const z = nearShore ? LAKE.z + Math.sin(angle) * radius : TERRACE.z + Math.sin(angle) * radius;
      const scale = 0.28 + random() * 1.15;
      return {
        x,
        y: heightAt(x, z) + scale * 0.24,
        z,
        scale,
        rotation: random() * Math.PI
      };
    });
  }, []);

  return <group>
    {rocks.map((rock, index) => <mesh
      key={index}
      position={[rock.x, rock.y, rock.z]}
      rotation={[rock.rotation * 0.21, rock.rotation, rock.rotation * 0.1]}
      scale={[rock.scale * 1.3, rock.scale * 0.72, rock.scale]}
      castShadow
      receiveShadow
    >
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={index % 4 === 0 ? '#53604a' : '#666559'}
        roughness={1}
        flatShading
      />
    </mesh>)}
  </group>;
}

function StoneSteps() {
  return <group position={[TERRACE.x + 1.2, 0, TERRACE.z + 6.5]} rotation={[0, -0.1, 0]}>
    {Array.from({ length: 6 }, (_, index) => <mesh
      key={index}
      position={[0, 0.24 + index * 0.49, -index * 0.86]}
      scale={[2.05 - index * 0.08, 0.28, 0.86]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={index % 2 ? '#5a5c50' : '#656456'} roughness={1} />
    </mesh>)}
  </group>;
}

function Water() {
  const reflectionTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(32, 128, 2, 32, 128, 124);
      gradient.addColorStop(0, 'rgba(255,196,108,0.9)');
      gradient.addColorStop(0.26, 'rgba(245,145,65,0.38)');
      gradient.addColorStop(1, 'rgba(245,145,65,0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 64, 256);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  return <group>
    <mesh position={[LAKE.x + 1.5, 0.16, LAKE.z + 5.2]} rotation={[-Math.PI / 2, 0, 0.08]}>
      <circleGeometry args={[LAKE.radius + 2.2, 72]} />
      <meshStandardMaterial color="#202a28" roughness={1} />
    </mesh>
    <mesh position={[LAKE.x, LAKE.level, LAKE.z]} rotation={[-Math.PI / 2, 0, 0.08]} receiveShadow>
      <circleGeometry args={[LAKE.radius, 96]} />
      <meshPhysicalMaterial
        color="#0b1820"
        roughness={0.36}
        metalness={0.28}
        clearcoat={1}
        clearcoatRoughness={0.1}
        transparent
        opacity={0.95}
      />
    </mesh>
    <mesh
      position={[LAKE.x - 4.2, LAKE.level + 0.012, LAKE.z + 1.2]}
      rotation={[-Math.PI / 2, 0, 0.06]}
    >
      <planeGeometry args={[5.2, 25]} />
      <meshBasicMaterial
        map={reflectionTexture}
        transparent
        opacity={0.24}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  </group>;
}

function Sun() {
  const glowTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(128, 128, 4, 128, 128, 126);
      gradient.addColorStop(0, 'rgba(255,244,208,1)');
      gradient.addColorStop(0.2, 'rgba(255,210,130,1)');
      gradient.addColorStop(0.35, 'rgba(250,158,72,0.5)');
      gradient.addColorStop(1, 'rgba(236,98,30,0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 256, 256);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  return <sprite position={[-38, 13.2, -88]} scale={[30, 30, 1]}>
    <spriteMaterial
      map={glowTexture}
      transparent
      opacity={0.96}
      depthWrite={false}
      depthTest={false}
      blending={THREE.AdditiveBlending}
    />
  </sprite>;
}

function Mist() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(128, 64, 2, 128, 64, 124);
      gradient.addColorStop(0, 'rgba(255,220,170,0.78)');
      gradient.addColorStop(0.42, 'rgba(232,188,145,0.32)');
      gradient.addColorStop(1, 'rgba(210,170,140,0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 256, 128);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);
  const sprites = useRef<Array<THREE.Sprite | null>>([]);
  const clouds = useMemo(() => Array.from({ length: 12 }, (_, index) => ({
    x: -38 + (index % 6) * 13 + (index % 2) * 4,
    y: 1.5 + (index % 4) * 1.45,
    z: -24 - Math.floor(index / 3) * 9 + (index % 3) * 3,
    scaleX: 18 + (index % 4) * 7,
    scaleY: 4.5 + (index % 3) * 2.1,
    opacity: 0.09 + (index % 4) * 0.028
  })), []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    sprites.current.forEach((sprite, index) => {
      if (!sprite) return;
      const cloud = clouds[index];
      sprite.position.x = cloud.x + Math.sin(time * 0.045 + index * 0.7) * 4.2;
    });
  });

  return <group>
    {clouds.map((cloud, index) => <sprite
      key={index}
      ref={(node) => { sprites.current[index] = node; }}
      position={[cloud.x, cloud.y, cloud.z]}
      scale={[cloud.scaleX, cloud.scaleY, 1]}
    >
      <spriteMaterial
        map={texture}
        color="#d9ae82"
        transparent
        opacity={cloud.opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </sprite>)}
  </group>;
}

export default function Qingqiu() {
  const toggleInfo = useAppStore((state) => state.toggleInfo);

  return <Canvas
    shadows
    dpr={[1, 1.75]}
    camera={{ position: [12.5, 8.8, 27], fov: 42, near: 0.1, far: 260 }}
    gl={{
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: false
    }}
    onCreated={({ gl }) => {
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 1.08;
      gl.shadowMap.type = THREE.PCFSoftShadowMap;
    }}
  >
    <color attach="background" args={['#14182a']} />
    <fog attach="fog" args={['#3b3341', 48, 170]} />

    <ambientLight intensity={0.46} color="#8c9aad" />
    <hemisphereLight intensity={0.66} color="#93a8ba" groundColor="#2b2118" />
    <directionalLight
      castShadow
      position={[-42, 22, -48]}
      color="#ffc07a"
      intensity={3.65}
      shadow-mapSize={[1536, 1536]}
      shadow-camera-left={-42}
      shadow-camera-right={42}
      shadow-camera-top={42}
      shadow-camera-bottom={-42}
      shadow-camera-near={1}
      shadow-camera-far={140}
      shadow-bias={-0.00016}
      shadow-normalBias={0.025}
    />
    <directionalLight position={[24, 18, 30]} color="#b9c4c9" intensity={1.35} />
    <pointLight position={[0.6, 6.2, -2.6]} color="#ffb76f" intensity={28} distance={18} decay={2} />
    <pointLight position={[6.8, 4.5, 5.2]} color="#d3d6cf" intensity={22} distance={18} decay={2} />

    <SkyDome />
    <Sun />
    <DistantRidges />
    <Terrain />
    <Water />
    <Forest />
    <Grass />
    <Rocks />
    <StoneSteps />
    <Terrace />
    <Fox onSelect={toggleInfo} />
    <Mist />
    <Sparkles
      count={52}
      speed={0.16}
      size={1.5}
      opacity={0.38}
      scale={[56, 18, 52]}
      position={[-2, 6, -8]}
      color="#ffd18b"
    />

    <OrbitControls
      makeDefault
      target={[2.8, 4.35, -0.4]}
      enablePan={false}
      enableDamping
      dampingFactor={0.055}
      autoRotate
      autoRotateSpeed={0.16}
      minDistance={9}
      maxDistance={54}
      minPolarAngle={0.68}
      maxPolarAngle={1.48}
    />
  </Canvas>;
}
