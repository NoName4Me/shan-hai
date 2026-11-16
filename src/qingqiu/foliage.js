import * as THREE from 'three';
import { sampleTerrain, WATER_LEVEL } from './terrain.js';
import { mulberry32 } from './utils.js';

export function createFoliage(scene) {
  const random = mulberry32(50117);
  const treeCount = 110;
  const rockCount = 95;
  const dummy = new THREE.Object3D();
  const tint = new THREE.Color();

  const trunk = new THREE.InstancedMesh(
    new THREE.CylinderGeometry(0.07, 0.21, 4.2, 5),
    new THREE.MeshStandardMaterial({ color: '#0a1117', roughness: 0.96, metalness: 0.04, flatShading: true }),
    treeCount
  );
  const crownLow = new THREE.InstancedMesh(
    new THREE.ConeGeometry(1.35, 1.05, 5),
    new THREE.MeshStandardMaterial({ color: '#111d23', roughness: 0.94, metalness: 0.08, flatShading: true }),
    treeCount
  );
  const crownHigh = new THREE.InstancedMesh(
    new THREE.ConeGeometry(0.86, 0.82, 5),
    new THREE.MeshStandardMaterial({ color: '#18282c', roughness: 0.9, metalness: 0.1, flatShading: true }),
    treeCount
  );

  let placed = 0;
  let attempts = 0;
  while (placed < treeCount && attempts < treeCount * 12) {
    attempts += 1;
    const angle = random() * Math.PI * 2;
    const radius = 19 + Math.pow(random(), 0.7) * 72;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius - 10;
    if (Math.abs(x) < 9 && z > -62) continue;
    const y = sampleTerrain(x, z);
    if (y < WATER_LEVEL + 0.7 || y > 15) continue;

    const scale = 0.65 + random() * 1.5;
    dummy.position.set(x, y + 2.1 * scale, z);
    dummy.rotation.set((random() - 0.5) * 0.08, random() * Math.PI * 2, (random() - 0.5) * 0.1);
    dummy.scale.set(scale, scale, scale);
    dummy.updateMatrix();
    trunk.setMatrixAt(placed, dummy.matrix);

    dummy.position.y = y + (3.25 + random() * 0.4) * scale;
    dummy.scale.set(scale, scale * (0.8 + random() * 0.3), scale);
    dummy.updateMatrix();
    crownLow.setMatrixAt(placed, dummy.matrix);
    tint.setHSL(0.48 + random() * 0.03, 0.12, 0.1 + random() * 0.05);
    crownLow.setColorAt(placed, tint);

    dummy.position.y = y + 4.4 * scale;
    dummy.scale.set(scale * 0.76, scale * 0.8, scale * 0.76);
    dummy.updateMatrix();
    crownHigh.setMatrixAt(placed, dummy.matrix);
    tint.offsetHSL(0.01, 0.02, 0.035);
    crownHigh.setColorAt(placed, tint);
    placed += 1;
  }
  trunk.count = placed;
  crownLow.count = placed;
  crownHigh.count = placed;
  trunk.instanceMatrix.needsUpdate = true;
  crownLow.instanceMatrix.needsUpdate = true;
  crownHigh.instanceMatrix.needsUpdate = true;
  if (crownLow.instanceColor) crownLow.instanceColor.needsUpdate = true;
  if (crownHigh.instanceColor) crownHigh.instanceColor.needsUpdate = true;

  const rocks = new THREE.InstancedMesh(
    new THREE.DodecahedronGeometry(1, 0),
    new THREE.MeshStandardMaterial({
      color: '#1d2b35',
      roughness: 0.96,
      metalness: 0.08,
      flatShading: true
    }),
    rockCount
  );
  for (let index = 0; index < rockCount; index += 1) {
    const angle = random() * Math.PI * 2;
    const radius = 16 + random() * 82;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius - 8;
    const y = sampleTerrain(x, z);
    const scale = 0.25 + Math.pow(random(), 2) * 2.7;
    dummy.position.set(x, y + scale * 0.34, z);
    dummy.rotation.set(random() * 2.4, random() * Math.PI * 2, random() * 1.7);
    dummy.scale.set(scale * (0.7 + random() * 0.7), scale * (0.38 + random() * 0.55), scale);
    dummy.updateMatrix();
    rocks.setMatrixAt(index, dummy.matrix);
    tint.setHSL(0.53, 0.12, 0.12 + random() * 0.08);
    rocks.setColorAt(index, tint);
  }
  rocks.instanceMatrix.needsUpdate = true;
  if (rocks.instanceColor) rocks.instanceColor.needsUpdate = true;

  const grassCount = 360;
  const bladeGeometry = new THREE.BufferGeometry();
  bladeGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute([
      -0.075, 0, 0,
      0.075, 0, 0,
      0.018, 0.58, 0
    ], 3)
  );
  bladeGeometry.computeVertexNormals();
  const grass = new THREE.InstancedMesh(
    bladeGeometry,
    new THREE.MeshStandardMaterial({
      color: '#36595a',
      roughness: 0.88,
      metalness: 0.04,
      flatShading: true,
      side: THREE.DoubleSide
    }),
    grassCount
  );
  for (let index = 0; index < grassCount; index += 1) {
    const angle = random() * Math.PI * 2;
    const radius = 10 + Math.pow(random(), 0.8) * 48;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius - 5;
    const y = sampleTerrain(x, z);
    const scale = 0.22 + random() * 0.58;
    dummy.position.set(x, y + 0.28 * scale, z);
    dummy.rotation.set((random() - 0.5) * 0.22, random() * Math.PI, (random() - 0.5) * 0.2);
    dummy.scale.set(scale * (0.55 + random() * 0.45), scale, scale);
    dummy.updateMatrix();
    grass.setMatrixAt(index, dummy.matrix);
    tint.setHSL(0.46 + random() * 0.05, 0.15, 0.27 + random() * 0.1);
    grass.setColorAt(index, tint);
  }
  grass.instanceMatrix.needsUpdate = true;
  if (grass.instanceColor) grass.instanceColor.needsUpdate = true;

  const group = new THREE.Group();
  group.name = 'qingqiu-foliage';
  group.add(trunk, crownLow, crownHigh, rocks, grass);

  [
    [-10.5, 18, 2.8, 1.7],
    [9.8, 12.5, -2.3, 1.9],
    [-7.8, -7, 1.1, 1.25],
    [11.5, -24, 2.1, 1.4]
  ].forEach(([x, z, rotation, scale], index) => {
    const stone = new THREE.Mesh(
      new THREE.DodecahedronGeometry(1, 0),
      new THREE.MeshStandardMaterial({
        color: index % 2 ? '#1b2b36' : '#263b44',
        roughness: 0.94,
        metalness: 0.1,
        flatShading: true
      })
    );
    stone.position.set(x, sampleTerrain(x, z) + 0.52 * scale, z);
    stone.scale.set(scale * 1.45, scale * 0.74, scale);
    stone.rotation.set(0.3, rotation, 0.12);
    stone.receiveShadow = true;
    group.add(stone);
  });
  scene.add(group);
  return { group, treeCount: placed };
}
