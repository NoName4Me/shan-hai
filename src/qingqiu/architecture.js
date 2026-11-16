import * as THREE from 'three';
import { sampleTerrain } from './terrain.js';
import { createGlowTexture, mulberry32 } from './utils.js';

const STONE = '#13232e';
const METAL = '#263946';
const BONE = '#98a6a3';
const EMBER = '#e26f3d';
const CYAN = '#68c5cf';

function standard(color, roughness = 0.72, metalness = 0.35) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness,
    flatShading: true
  });
}

export function createArchitecture(scene) {
  const materials = {
    stone: standard(STONE, 0.92, 0.12),
    metal: standard(METAL, 0.38, 0.86),
    bone: standard(BONE, 0.58, 0.38),
    ember: new THREE.MeshBasicMaterial({ color: EMBER, toneMapped: false }),
    cyan: new THREE.MeshBasicMaterial({ color: CYAN, toneMapped: false }),
    dark: standard('#071019', 0.8, 0.52)
  };

  const group = new THREE.Group();
  group.name = 'qingqiu-architecture';
  const random = mulberry32(92017);
  const foxGround = sampleTerrain(0, -43);

  const dais = new THREE.Group();
  dais.position.set(0, foxGround, -43);
  const body = new THREE.Mesh(new THREE.CylinderGeometry(12.8, 15.2, 1.25, 20), materials.stone);
  body.position.y = -0.36;
  dais.add(body);

  const inner = new THREE.Mesh(new THREE.CylinderGeometry(9.6, 10.4, 0.34, 32), materials.metal);
  inner.position.y = 0.18;
  dais.add(inner);

  const top = new THREE.Mesh(new THREE.CylinderGeometry(7.1, 7.1, 0.22, 32), materials.dark);
  top.position.y = 0.38;
  dais.add(top);

  [7.25, 9.5, 12.1].forEach((radius, index) => {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(radius, radius + (index === 1 ? 0.16 : 0.09), 96),
      index === 1 ? materials.ember : materials.cyan
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.51;
    dais.add(ring);
  });

  for (let index = 0; index < 16; index += 1) {
    const angle = (index / 16) * Math.PI * 2;
    const spoke = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.05, 4.6),
      index % 4 === 0 ? materials.ember : materials.metal
    );
    spoke.position.set(Math.cos(angle) * 9.6, 0.46, Math.sin(angle) * 9.6);
    spoke.rotation.y = -angle;
    dais.add(spoke);

    if (index % 2 === 0) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.2 + random() * 2.4, 0.8), materials.stone);
      fin.position.set(Math.cos(angle) * 14.2, 0.2, Math.sin(angle) * 14.2);
      fin.rotation.y = -angle;
      fin.rotation.z = (random() - 0.5) * 0.12;
      dais.add(fin);
    }
  }
  group.add(dais);

  const gate = new THREE.Group();
  gate.position.set(0, sampleTerrain(0, -90), -90);
  const arch = new THREE.Mesh(
    new THREE.TorusGeometry(18.5, 0.74, 7, 52, Math.PI),
    materials.metal
  );
  arch.position.y = 21.4;
  arch.scale.y = 1.15;
  gate.add(arch);

  const archEdge = new THREE.Mesh(
    new THREE.TorusGeometry(17.55, 0.09, 4, 64, Math.PI),
    materials.ember
  );
  archEdge.position.set(0, 21.4, 0.76);
  archEdge.scale.y = 1.15;
  gate.add(archEdge);

  [-1, 1].forEach((side) => {
    const pylon = new THREE.Group();
    pylon.position.set(side * 18.5, 0, 0);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 5.4, 4.8, 6), materials.stone);
    base.position.y = 2.4;
    pylon.add(base);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 2.2, 20.5, 6), materials.metal);
    shaft.position.y = 14.2;
    pylon.add(shaft);
    for (let index = 0; index < 6; index += 1) {
      const band = new THREE.Mesh(
        new THREE.CylinderGeometry(2.15 - index * 0.09, 2.15 - index * 0.09, 0.18, 6),
        index === 2 ? materials.ember : materials.bone
      );
      band.position.y = 7.2 + index * 2.65;
      pylon.add(band);
    }
    const crown = new THREE.Mesh(new THREE.ConeGeometry(2.45, 7.4, 4), materials.stone);
    crown.position.y = 28.4;
    crown.rotation.y = Math.PI / 4;
    pylon.add(crown);
    gate.add(pylon);
  });

  for (let index = 0; index < 11; index += 1) {
    const slab = new THREE.Mesh(
      new THREE.BoxGeometry(9.8 - index * 0.16, 0.32, 3.1),
      index % 3 === 0 ? materials.metal : materials.stone
    );
    slab.position.set(
      Math.sin(index * 0.63) * 0.24,
      0.1 + index * 0.05,
      15 - index * 3.1
    );
    gate.add(slab);
  }
  group.add(gate);

  const skyRing = new THREE.Group();
  skyRing.position.set(-58, 42, -148);
  const ringOuter = new THREE.Mesh(new THREE.TorusGeometry(24, 0.32, 5, 84), materials.metal);
  ringOuter.rotation.set(0.16, 0.58, -0.18);
  skyRing.add(ringOuter);
  const ringInner = new THREE.Mesh(new THREE.TorusGeometry(19.5, 0.1, 4, 84), materials.cyan);
  ringInner.rotation.copy(ringOuter.rotation);
  skyRing.add(ringInner);
  for (let index = 0; index < 7; index += 1) {
    const angle = (index / 7) * Math.PI * 2;
    const shard = new THREE.Mesh(new THREE.BoxGeometry(1, 6.5, 0.55), materials.stone);
    shard.position.set(Math.cos(angle) * 24, Math.sin(angle) * 24, 0);
    shard.rotation.z = angle;
    skyRing.add(shard);
  }
  skyRing.rotation.z = -0.12;
  group.add(skyRing);

  const debris = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1, 1, 1),
    materials.stone,
    24
  );
  const dummy = new THREE.Object3D();
  for (let index = 0; index < 24; index += 1) {
    const angle = random() * Math.PI * 2;
    const radius = 26 + random() * 30;
    dummy.position.set(
      Math.cos(angle) * radius,
      10 + random() * 42,
      -72 - random() * 40
    );
    dummy.rotation.set(random() * Math.PI, random() * Math.PI, random() * Math.PI);
    const scale = 0.5 + random() * 2.4;
    dummy.scale.set(scale, scale * (0.3 + random() * 2.2), scale * (0.6 + random() * 1.8));
    dummy.updateMatrix();
    debris.setMatrixAt(index, dummy.matrix);
  }
  debris.instanceMatrix.needsUpdate = true;
  group.add(debris);

  const waystones = [
    [-12.5, 31, 0.2],
    [12.5, 31, -0.2],
    [-14, 6, 0.1],
    [14, 6, -0.1],
    [-13, -19, 0.16],
    [13, -19, -0.16]
  ];
  waystones.forEach(([x, z, lean], index) => {
    const stone = new THREE.Group();
    stone.position.set(x, sampleTerrain(x, z), z);
    stone.rotation.z = lean;
    const shaft = new THREE.Mesh(new THREE.BoxGeometry(1.1, 7.6 + (index % 2) * 2.1, 0.8), materials.stone);
    shaft.position.y = 3.3;
    stone.add(shaft);
    const cap = new THREE.Mesh(new THREE.OctahedronGeometry(0.58, 0), materials.metal);
    cap.position.y = 7.4 + (index % 2) * 2.1;
    stone.add(cap);
    const slit = new THREE.Mesh(new THREE.BoxGeometry(0.07, 2.5, 0.06), index % 2 ? materials.cyan : materials.ember);
    slit.position.set(0, 3.9, 0.43);
    stone.add(slit);
    group.add(stone);
  });

  const stele = new THREE.Group();
  stele.name = 'origin-stele';
  stele.position.set(8.5, sampleTerrain(8.5, 32), 32);
  const steleBase = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.4, 0.75, 8), materials.stone);
  steleBase.position.y = 0.3;
  stele.add(steleBase);
  const steleBody = new THREE.Mesh(new THREE.BoxGeometry(1.45, 4.7, 0.58), materials.metal);
  steleBody.position.y = 2.8;
  stele.add(steleBody);
  const steleFace = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 3.1), new THREE.MeshBasicMaterial({
    color: '#b86644',
    transparent: true,
    opacity: 0.92,
    toneMapped: false
  }));
  steleFace.position.set(0, 2.9, 0.3);
  stele.add(steleFace);
  group.add(stele);

  const pathGlow = createGlowTexture(
    'rgba(255, 185, 125, 0.85)',
    'rgba(173, 70, 35, 0)'
  );
  [18, 3, -12, -27].forEach((z, pairIndex) => {
    [-1, 1].forEach((side) => {
      const x = side * (8.4 + pairIndex * 0.3);
      const pylon = new THREE.Group();
      pylon.position.set(x, sampleTerrain(x, z), z);
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.28, 3.7, 5),
        materials.metal
      );
      stem.position.y = 1.8;
      pylon.add(stem);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.72, 0.48), materials.stone);
      cap.position.y = 3.82;
      pylon.add(cap);
      const ember = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.46, 0.14), materials.ember);
      ember.position.set(0, 3.86, 0.26);
      pylon.add(ember);
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({
        map: pathGlow,
        color: '#f08a52',
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      }));
      glow.position.set(0, 3.87, 0.3);
      glow.scale.set(1.7, 1.7, 1);
      pylon.add(glow);
      group.add(pylon);
    });
  });

  const pathSlab = new THREE.InstancedMesh(
    new THREE.BoxGeometry(2.05, 0.12, 0.76),
    materials.stone,
    42
  );
  const moduleSlab = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.1, 0.026, 0.46),
    materials.ember,
    42
  );
  const pathDummy = new THREE.Object3D();
  for (let index = 0; index < 42; index += 1) {
    const z = 18 - index * 1.62;
    const x = Math.sin(index * 0.43) * 0.38;
    const y = sampleTerrain(x, z) + 0.08;
    pathDummy.position.set(x, y, z);
    pathDummy.rotation.set(0, Math.sin(index * 0.31) * 0.07, 0);
    pathDummy.scale.set(1, 1, 1);
    pathDummy.updateMatrix();
    pathSlab.setMatrixAt(index, pathDummy.matrix);

    pathDummy.position.set(x + (index % 2 ? 0.54 : -0.54), y + 0.08, z);
    pathDummy.rotation.set(0, 0, 0);
    pathDummy.scale.set(1, 1, 1);
    pathDummy.updateMatrix();
    moduleSlab.setMatrixAt(index, pathDummy.matrix);
  }
  pathSlab.instanceMatrix.needsUpdate = true;
  moduleSlab.instanceMatrix.needsUpdate = true;
  group.add(pathSlab, moduleSlab);

  scene.add(group);

  return {
    group,
    foxGround,
    origin: new THREE.Vector3(8.5, sampleTerrain(8.5, 32), 32),
    gatePosition: gate.position.clone(),
    materials,
    update(time) {
      skyRing.rotation.z = -0.12 + time * 0.014;
      archEdge.material.opacity = 1;
    }
  };
}
