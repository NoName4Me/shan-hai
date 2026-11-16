import * as THREE from 'three';
import { sampleTerrain } from './terrain.js';
import { mulberry32 } from './utils.js';

function makeCrack(points, width) {
  const curve = new THREE.CatmullRomCurve3(points);
  const core = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 46, width, 4, false),
    new THREE.MeshBasicMaterial({
      color: '#ff8d52',
      transparent: true,
      opacity: 0.94,
      toneMapped: false,
      depthWrite: false
    })
  );
  const glow = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 38, width * 4.6, 5, false),
    new THREE.MeshBasicMaterial({
      color: '#b74728',
      transparent: true,
      opacity: 0.09,
      toneMapped: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  );
  core.renderOrder = 2;
  glow.renderOrder = 1;
  return { core, glow, curve };
}

export function createRiftField(scene) {
  const random = mulberry32(34771);
  const group = new THREE.Group();
  group.name = 'cinnabar-rifts';
  const cracks = [];
  const seeds = [
    [-47, 18],
    [52, 9],
    [38, -61],
    [-57, -48],
    [-14, -93]
  ];

  seeds.forEach(([baseX, baseZ], index) => {
    const points = [];
    const length = 15 + random() * 16;
    const direction = random() * Math.PI * 2;
    const bend = (random() - 0.5) * 0.9;
    for (let step = 0; step < 7; step += 1) {
      const t = step / 6;
      const x = baseX + Math.cos(direction + bend * t) * length * t;
      const z = baseZ + Math.sin(direction + bend * t) * length * t;
      points.push(new THREE.Vector3(x, sampleTerrain(x, z) + 0.18, z));
    }
    const crack = makeCrack(points, 0.11 + random() * 0.1);
    group.add(crack.glow, crack.core);
    cracks.push(crack);

    if (index < 3) {
      const light = new THREE.PointLight('#d95d36', 12, 18, 2);
      light.position.copy(points[3]);
      light.position.y += 2.2;
      group.add(light);
    }
  });

  scene.add(group);
  return {
    group,
    update(time) {
      cracks.forEach((crack, index) => {
        const pulse = 0.82 + Math.sin(time * 1.7 + index * 1.4) * 0.18;
        crack.core.material.opacity = 0.72 + pulse * 0.2;
        crack.glow.material.opacity = 0.06 + pulse * 0.05;
      });
    }
  };
}
