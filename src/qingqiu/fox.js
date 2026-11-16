import * as THREE from 'three';
import {
  createCurveLine,
  createGlowTexture,
  createInkTexture,
  createLimb,
  createLoftGeometry,
  createTailGeometry,
  damp,
  mulberry32
} from './utils.js';

const BONE = '#d7d2c3';
const BONE_DARK = '#b7b4a7';
const OBSIDIAN = '#101719';
const JOINT = '#394343';
const CINNABAR = '#8e3b32';
const EYE = '#ff7557';
let tipGlowTexture;

function material(options) {
  return new THREE.MeshStandardMaterial({
    flatShading: true,
    ...options
  });
}

export function createFoxMaterials() {
  const coat = createInkTexture();
  return {
    bone: material({
      color: BONE,
      map: coat,
      roughness: 0.42,
      metalness: 0.48
    }),
    boneDark: material({
      color: BONE_DARK,
      map: coat,
      roughness: 0.52,
      metalness: 0.4
    }),
    obsidian: material({
      color: OBSIDIAN,
      roughness: 0.24,
      metalness: 0.82
    }),
    joint: material({
      color: JOINT,
      roughness: 0.3,
      metalness: 0.92
    }),
    cinnabar: material({
      color: CINNABAR,
      roughness: 0.38,
      metalness: 0.5,
      emissive: '#2a0806',
      emissiveIntensity: 0.18
    }),
    eye: new THREE.MeshBasicMaterial({
      color: EYE,
      toneMapped: false
    }),
    seam: material({
      color: '#4f5a58',
      roughness: 0.34,
      metalness: 0.88
    }),
    hit: new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
      colorWrite: false
    })
  };
}

function addSeam(parent, position, scale, rotation = [0, 0, 0], mat) {
  const seam = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat);
  seam.position.set(...position);
  seam.scale.set(...scale);
  seam.rotation.set(...rotation);
  parent.add(seam);
  return seam;
}

export function createFoxHead(materials) {
  const head = new THREE.Group();

  const core = new THREE.Mesh(
    createLoftGeometry([
      { z: -0.34, y: 0.03, width: 0.26, height: 0.23 },
      { z: -0.14, y: 0.04, width: 0.34, height: 0.3 },
      { z: 0.1, y: 0.02, width: 0.31, height: 0.27 },
      { z: 0.34, y: -0.02, width: 0.23, height: 0.19 },
      { z: 0.5, y: -0.03, width: 0.14, height: 0.12 },
      { z: 0.58, y: -0.03, width: 0.05, height: 0.06 }
    ]),
    materials.bone
  );
  core.castShadow = true;
  head.add(core);

  const crown = new THREE.Mesh(
    createLoftGeometry([
      { z: -0.38, y: 0.1, width: 0.22, height: 0.16 },
      { z: -0.2, y: 0.15, width: 0.36, height: 0.24 },
      { z: 0.02, y: 0.17, width: 0.4, height: 0.25 },
      { z: 0.25, y: 0.12, width: 0.32, height: 0.19 },
      { z: 0.42, y: 0.05, width: 0.18, height: 0.1 },
      { z: 0.5, y: 0.02, width: 0.06, height: 0.05 }
    ]),
    materials.bone
  );
  crown.castShadow = true;
  head.add(crown);

  const brow = new THREE.Mesh(
    createLoftGeometry([
      { z: 0.02, y: 0.24, width: 0.31, height: 0.045 },
      { z: 0.24, y: 0.21, width: 0.26, height: 0.045 },
      { z: 0.42, y: 0.14, width: 0.16, height: 0.035 }
    ], 8),
    materials.obsidian
  );
  head.add(brow);

  const muzzle = new THREE.Mesh(
    createLoftGeometry([
      { z: 0.22, y: -0.075, width: 0.225, height: 0.145 },
      { z: 0.36, y: -0.085, width: 0.19, height: 0.125 },
      { z: 0.48, y: -0.09, width: 0.135, height: 0.09 },
      { z: 0.56, y: -0.085, width: 0.07, height: 0.05 }
    ], 8),
    materials.boneDark
  );
  muzzle.castShadow = true;
  head.add(muzzle);

  const bridge = new THREE.Mesh(
    createLoftGeometry([
      { z: 0.18, y: 0.08, width: 0.075, height: 0.025 },
      { z: 0.42, y: 0.03, width: 0.06, height: 0.02 },
      { z: 0.61, y: -0.02, width: 0.025, height: 0.012 }
    ], 6),
    materials.seam
  );
  head.add(bridge);

  const nose = new THREE.Mesh(new THREE.DodecahedronGeometry(0.075, 0), materials.obsidian);
  nose.position.set(0, -0.068, 0.58);
  nose.scale.set(1.35, 0.72, 0.72);
  head.add(nose);

  const jaw = new THREE.Mesh(
    createLoftGeometry([
      { z: 0.14, y: -0.21, width: 0.18, height: 0.055 },
      { z: 0.32, y: -0.195, width: 0.145, height: 0.042 },
      { z: 0.48, y: -0.165, width: 0.075, height: 0.025 }
    ], 7),
    materials.obsidian
  );
  head.add(jaw);

  addSeam(head, [0, -0.12, 0.4], [0.24, 0.012, 0.4], [0.12, 0, 0], materials.seam);
  addSeam(head, [0, 0.255, 0.11], [0.014, 0.012, 0.46], [0, 0, 0], materials.cinnabar);

  const seal = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.14, 0.02), materials.cinnabar);
  seal.position.set(0, 0.29, 0.18);
  seal.rotation.x = -0.12;
  head.add(seal);

  const eyeGlowMaterial = materials.eye;
  const eyes = [];
  const eyeGlows = [];
  const glowTexture = createGlowTexture();
  [-1, 1].forEach((side) => {
    const socket = new THREE.Mesh(
      new THREE.BoxGeometry(0.19, 0.085, 0.09),
      materials.obsidian
    );
    socket.position.set(side * 0.22, 0.055, 0.32);
    socket.rotation.z = side * -0.15;
    head.add(socket);

    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.135, 0.021, 0.016), eyeGlowMaterial);
    eye.position.set(side * 0.22, 0.06, 0.4);
    eye.rotation.z = side * -0.13;
    head.add(eye);
    eyes.push(eye);

    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTexture,
        color: '#ff8b68',
        transparent: true,
        opacity: 0.62,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    );
    glow.position.set(side * 0.22, 0.06, 0.43);
    glow.scale.set(0.24, 0.14, 1);
    head.add(glow);
    eyeGlows.push(glow);

    const cheek = new THREE.Mesh(
      createLoftGeometry([
        { z: -0.1, y: -0.01, width: 0.045, height: 0.09 },
        { z: 0.06, y: -0.03, width: 0.085, height: 0.14 },
        { z: 0.2, y: -0.06, width: 0.065, height: 0.1 },
        { z: 0.3, y: -0.08, width: 0.025, height: 0.04 }
      ], 7),
      materials.boneDark
    );
    cheek.position.set(side * 0.3, -0.04, 0.13);
    cheek.rotation.set(0.02, side * 0.16, side * -0.1);
    cheek.castShadow = true;
    head.add(cheek);
    addSeam(
      head,
      [side * 0.3, 0.1, 0.12],
      [0.012, 0.018, 0.32],
      [0, side * 0.16, side * -0.1],
      materials.cinnabar
    );
  });

  const ears = [];
  [-1, 1].forEach((side) => {
    const earPivot = new THREE.Group();
    earPivot.position.set(side * 0.23, 0.35, -0.08);
    earPivot.rotation.set(-0.04, side * 0.1, side * -0.4);

    const outer = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.64, 4), materials.bone);
    outer.scale.z = 0.48;
    outer.position.y = 0.27;
    outer.castShadow = true;
    earPivot.add(outer);

    const inner = new THREE.Mesh(new THREE.ConeGeometry(0.095, 0.47, 4), materials.obsidian);
    inner.scale.z = 0.32;
    inner.position.set(0, 0.25, 0.06);
    earPivot.add(inner);

    const earSeal = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.27, 0.018), materials.cinnabar);
    earSeal.position.set(0, 0.2, 0.12);
    earPivot.add(earSeal);

    head.add(earPivot);
    ears.push({ pivot: earPivot, side });
  });

  const crest = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.24, 4), materials.cinnabar);
  crest.position.set(0, 0.4, -0.24);
  crest.rotation.x = -0.35;
  head.add(crest);

  return { head, ears, eyes, eyeGlows };
}

export function createFoxLeg(materials, side, rear, random) {
  const pivot = new THREE.Group();
  const x = side * (rear ? 0.46 : 0.43);
  const z = rear ? -0.65 : 0.64;
  pivot.position.set(x, 1.94, z);
  pivot.rotation.z = side * -0.045;

  const hipShell = new THREE.Mesh(
    createLoftGeometry([
      { z: -0.2, y: 0.06, width: 0.1, height: 0.11 },
      { z: -0.1, y: -0.02, width: 0.17, height: 0.19 },
      { z: 0.02, y: -0.12, width: 0.19, height: 0.22 },
      { z: 0.16, y: -0.22, width: 0.15, height: 0.18 },
      { z: 0.25, y: -0.29, width: 0.09, height: 0.11 }
    ], 8),
    materials.bone
  );
  hipShell.position.set(side * 0.035, -0.03, 0);
  hipShell.rotation.set(0, side * 0.1, side * -0.16);
  hipShell.castShadow = true;
  pivot.add(hipShell);
  addSeam(
    pivot,
    [side * 0.22, -0.12, 0],
    [0.012, 0.25, 0.22],
    [0, 0, side * -0.16],
    materials.cinnabar
  );

  const upperStart = new THREE.Vector3(0, -0.05, 0);
  const upperEnd = new THREE.Vector3(side * 0.02, -0.5, rear ? 0.08 : -0.06);
  const upper = createLimb(upperStart, upperEnd, 0.145, 0.085, materials.boneDark, 7);
  pivot.add(upper);

  const knee = new THREE.Group();
  knee.position.copy(upperEnd);
  pivot.add(knee);

  const kneeJoint = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), materials.joint);
  kneeJoint.scale.set(1, 0.82, 1);
  knee.add(kneeJoint);

  const kneeRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.135, 0.018, 4, 12),
    materials.cinnabar
  );
  kneeRing.rotation.y = Math.PI / 2;
  knee.add(kneeRing);

  const lowerEnd = new THREE.Vector3(0, -0.5, rear ? -0.08 : 0.08);
  const lower = createLimb(
    new THREE.Vector3(0, 0, 0),
    lowerEnd,
    0.075,
    0.046,
    materials.obsidian,
    6
  );
  knee.add(lower);

  const ankle = new THREE.Group();
  ankle.position.copy(lowerEnd);
  knee.add(ankle);

  const paw = new THREE.Mesh(
    createLoftGeometry([
      { z: -0.15, y: -0.01, width: 0.09, height: 0.07 },
      { z: 0.02, y: -0.05, width: 0.12, height: 0.08 },
      { z: 0.22, y: -0.07, width: 0.1, height: 0.06 },
      { z: 0.32, y: -0.08, width: 0.055, height: 0.035 }
    ], 7),
    materials.bone
  );
  paw.position.set(0, -0.02, 0.12);
  paw.rotation.x = -0.02;
  paw.castShadow = true;
  ankle.add(paw);

  const sole = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.055, 0.42), materials.obsidian);
  sole.position.set(0, -0.14, 0.13);
  ankle.add(sole);

  for (let index = 0; index < 3; index += 1) {
    const claw = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.13, 4), materials.cinnabar);
    claw.position.set((index - 1) * 0.058, -0.105, 0.41);
    claw.rotation.x = Math.PI / 2.2;
    ankle.add(claw);
  }

  const piston = createLimb(
    new THREE.Vector3(side * 0.16, -0.2, rear ? -0.18 : 0.18),
    new THREE.Vector3(side * 0.12, -0.53, rear ? 0.08 : -0.12),
    0.026,
    0.021,
    materials.joint,
    5
  );
  pivot.add(piston);

  const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.02, 6), materials.cinnabar);
  bolt.position.set(side * 0.21, -0.12, 0.12);
  bolt.rotation.z = Math.PI / 2;
  pivot.add(bolt);

  pivot.userData = {
    phase: random() * Math.PI * 2,
    side,
    rear,
    knee,
    ankle,
    baseZ: z
  };
  return pivot;
}

export function createFoxBody(materials, random) {
  const body = new THREE.Group();

  const underbody = new THREE.Mesh(
    createLoftGeometry([
      { z: -0.9, y: 2.04, width: 0.25, height: 0.25 },
      { z: -0.5, y: 2.08, width: 0.37, height: 0.34 },
      { z: 0, y: 2.06, width: 0.41, height: 0.36 },
      { z: 0.45, y: 2.13, width: 0.34, height: 0.31 },
      { z: 0.72, y: 2.2, width: 0.24, height: 0.23 }
    ], 12),
    materials.obsidian
  );
  underbody.castShadow = false;
  body.add(underbody);

  const hull = new THREE.Mesh(
    createLoftGeometry([
      { z: -1.02, y: 2.27, width: 0.12, height: 0.12 },
      { z: -0.78, y: 2.32, width: 0.3, height: 0.28 },
      { z: -0.35, y: 2.38, width: 0.42, height: 0.36 },
      { z: 0.1, y: 2.4, width: 0.4, height: 0.35 },
      { z: 0.55, y: 2.38, width: 0.32, height: 0.3 },
      { z: 0.82, y: 2.31, width: 0.15, height: 0.16 }
    ], 12),
    materials.bone
  );
  hull.castShadow = true;
  body.add(hull);

  const chest = new THREE.Mesh(
    createLoftGeometry([
      { z: 0.48, y: 2.38, width: 0.3, height: 0.29 },
      { z: 0.74, y: 2.46, width: 0.25, height: 0.26 },
      { z: 0.95, y: 2.51, width: 0.14, height: 0.16 }
    ], 10),
    materials.boneDark
  );
  chest.castShadow = true;
  body.add(chest);

  const chestCore = new THREE.Mesh(
    new THREE.TorusGeometry(0.145, 0.026, 6, 24),
    materials.cinnabar
  );
  chestCore.position.set(0, 2.22, 1.17);
  chestCore.rotation.x = Math.PI / 2;
  body.add(chestCore);

  const core = new THREE.Mesh(new THREE.SphereGeometry(0.105, 12, 8), materials.eye);
  core.position.set(0, 2.22, 1.18);
  core.scale.setScalar(0.72);
  body.add(core);

  const back = new THREE.Mesh(
    createLoftGeometry([
      { z: -0.75, y: 2.52, width: 0.12, height: 0.055 },
      { z: -0.4, y: 2.62, width: 0.18, height: 0.075 },
      { z: 0, y: 2.66, width: 0.2, height: 0.08 },
      { z: 0.4, y: 2.6, width: 0.15, height: 0.06 },
      { z: 0.62, y: 2.52, width: 0.08, height: 0.04 }
    ], 8),
    materials.boneDark
  );
  body.add(back);

  const spine = [];
  for (let index = 0; index < 6; index += 1) {
    const t = index / 5;
    const vertebra = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.1 + (1 - Math.abs(t - 0.5) * 2) * 0.05, 0),
      materials.joint
    );
    vertebra.position.set(0, 2.58 + Math.sin(t * Math.PI) * 0.1, -0.82 + t * 1.55);
    vertebra.rotation.y = Math.PI / 4;
    body.add(vertebra);
    spine.push(vertebra);

    const fin = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.23, 4), materials.bone);
    fin.position.set(0, vertebra.position.y + 0.13, vertebra.position.z);
    fin.rotation.x = -0.2;
    body.add(fin);
  }

  [-1, 1].forEach((side) => {
    const shoulder = new THREE.Mesh(
      createLoftGeometry([
        { z: -0.58, y: 0.08, width: 0.12, height: 0.09 },
        { z: -0.34, y: 0.04, width: 0.22, height: 0.14 },
        { z: 0, y: 0, width: 0.26, height: 0.16 },
        { z: 0.32, y: 0.02, width: 0.2, height: 0.13 },
        { z: 0.52, y: 0.06, width: 0.1, height: 0.07 }
      ], 8),
      materials.bone
    );
    shoulder.position.set(side * 0.51, 2.38, 0.18);
    shoulder.rotation.set(-0.03, side * 0.07, side * -0.24);
    shoulder.scale.set(1.1, 1.1, 1.1);
    shoulder.castShadow = true;
    body.add(shoulder);
    addSeam(
      body,
      [side * 0.67, 2.36, 0.18],
      [0.014, 0.18, 0.68],
      [0, 0, side * -0.24],
      materials.cinnabar
    );

    const hip = new THREE.Mesh(
      createLoftGeometry([
        { z: -0.48, y: 0.05, width: 0.1, height: 0.08 },
        { z: -0.26, y: 0.02, width: 0.2, height: 0.13 },
        { z: 0.02, y: -0.01, width: 0.23, height: 0.15 },
        { z: 0.28, y: 0, width: 0.17, height: 0.11 },
        { z: 0.43, y: 0.04, width: 0.08, height: 0.06 }
      ], 8),
      materials.boneDark
    );
    hip.position.set(side * 0.45, 2.16, -0.62);
    hip.rotation.set(0.02, side * -0.08, side * -0.18);
    hip.castShadow = true;
    body.add(hip);

    const piston = createLimb(
      new THREE.Vector3(side * 0.46, 2.62, 0.62),
      new THREE.Vector3(side * 0.72, 2.34, 0.32),
      0.035,
      0.028,
      materials.joint,
      5
    );
    body.add(piston);

    const intake = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.1, 0.42), materials.obsidian);
    intake.position.set(side * 0.61, 2.09, 0.35);
    intake.rotation.z = side * -0.12;
    body.add(intake);

    for (let index = 0; index < 3; index += 1) {
      const vent = new THREE.Mesh(
        new THREE.BoxGeometry(0.014, 0.025, 0.23),
        materials.cinnabar
      );
      vent.position.set(side * 0.7, 2.09, 0.3 + index * 0.08);
      vent.rotation.z = side * -0.12;
      body.add(vent);
    }
  });

  const neckBase = new THREE.Mesh(
    createLoftGeometry([
      { z: 0.56, y: 2.49, width: 0.22, height: 0.2 },
      { z: 0.76, y: 2.68, width: 0.18, height: 0.17 },
      { z: 0.94, y: 2.9, width: 0.145, height: 0.14 },
      { z: 1.06, y: 3.06, width: 0.13, height: 0.12 }
    ], 9),
    materials.obsidian
  );
  neckBase.rotation.x = 0.48;
  neckBase.castShadow = true;
  body.add(neckBase);

  for (let index = 0; index < 4; index += 1) {
    const neckRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.225 - index * 0.018, 0.014, 4, 18),
      index === 1 ? materials.cinnabar : materials.joint
    );
    neckRing.position.set(0, 2.55 + index * 0.145, 0.63 + index * 0.12);
    neckRing.rotation.x = Math.PI / 2 - 0.52;
    body.add(neckRing);
  }

  const tailMount = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34, 0.43, 0.45, 9),
    materials.joint
  );
  tailMount.position.set(0, 2.24, -1.03);
  tailMount.rotation.x = Math.PI / 2 - 0.1;
  tailMount.castShadow = true;
  body.add(tailMount);

  const mountRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.39, 0.028, 5, 20),
    materials.cinnabar
  );
  mountRing.position.set(0, 2.24, -1.19);
  mountRing.rotation.x = 0;
  body.add(mountRing);

  for (let index = 0; index < 14; index += 1) {
    const rivet = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.018, 0.02, 5),
      materials.seam
    );
    const angle = random() * Math.PI * 2;
    rivet.position.set(Math.cos(angle) * 0.5, 2.2 + random() * 0.22, Math.sin(angle) * 0.75);
    body.add(rivet);
  }

  return { body, chestCore, core, spine };
}

function createTailCurve(index) {
  const centered = (index - 4) / 4;
  const outer = Math.abs(centered);
  const random = mulberry32(900 + index * 97);
  const angle = centered * 2.05;
  const fanX = Math.sin(angle);
  const fanZ = -Math.cos(angle);
  const lift = 2.15 + (1 - outer) * 0.85 + random() * 0.3;
  const reach = 2.65 + (1 - outer) * 0.72 + random() * 0.22;
  const baseX = centered * 0.2;
  const baseZ = -outer * 0.07;

  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(baseX, 0, baseZ),
    new THREE.Vector3(baseX + fanX * 0.28, 0.16, baseZ + fanZ * 0.44),
    new THREE.Vector3(baseX + fanX * 0.64, 0.62, baseZ + fanZ * 0.98),
    new THREE.Vector3(baseX + fanX * 1.03 + centered * 0.12, lift * 0.42, baseZ + fanZ * 1.42),
    new THREE.Vector3(baseX + fanX * 1.31 + centered * 0.22, lift * 0.72, baseZ + fanZ * 1.78),
    new THREE.Vector3(baseX + fanX * 1.48 + centered * 0.36, lift * 0.98, baseZ + fanZ * 1.93),
    new THREE.Vector3(
      baseX + fanX * (reach + 0.18) + centered * 0.5,
      lift * 1.2 - outer * 0.18,
      baseZ + fanZ * (reach - 0.25) - random() * 0.16
    )
  ]);
}

export function createFoxTail(materials, index) {
  const curve = createTailCurve(index);
  const angle = ((index - 4) / 4) * 2.3;
  const group = new THREE.Group();
  const geometry = createTailGeometry(curve, index);
  const tail = new THREE.Mesh(
    geometry,
    material({
      vertexColors: true,
      roughness: 0.56,
      metalness: 0.18,
      emissive: '#1d343c',
      emissiveIntensity: 0.6,
      side: THREE.DoubleSide
    })
  );
  tail.castShadow = true;
  group.add(tail);

  const luminousTail = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.13,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })
  );
  luminousTail.renderOrder = 3;
  group.add(luminousTail);

  const lineMaterial = new THREE.LineBasicMaterial({
    color: index % 4 === 0 ? '#e17857' : '#b8d2d1',
    transparent: true,
    opacity: 0.82,
    fog: true
  });
  group.add(createCurveLine(curve, lineMaterial, 72, 0.92));
  const edgeMaterial = new THREE.LineBasicMaterial({
    color: index % 3 === 0 ? '#d96845' : '#75989c',
    transparent: true,
    opacity: 0.5,
    fog: true
  });
  group.add(createCurveLine(curve, edgeMaterial, 58, -0.92));

  const cuffGeometry = new THREE.CylinderGeometry(0.24, 0.31, 0.18, 8, 1, true);
  const cuff = new THREE.Mesh(cuffGeometry, materials.joint);
  const basePoint = curve.getPoint(0.1);
  const baseTangent = curve.getTangent(0.1).normalize();
  cuff.position.copy(basePoint);
  cuff.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), baseTangent);
  group.add(cuff);

  const seal = new THREE.Mesh(
    new THREE.TorusGeometry(0.25, 0.018, 4, 16),
    materials.cinnabar
  );
  seal.position.copy(curve.getPoint(0.16));
  seal.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), curve.getTangent(0.16).normalize());
  group.add(seal);

  [0.38, 0.62, 0.82].forEach((t, ringIndex) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.19 - ringIndex * 0.025, 0.012, 4, 14),
      ringIndex === 1 ? materials.seam : materials.cinnabar
    );
    ring.position.copy(curve.getPoint(t));
    ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), curve.getTangent(t).normalize());
    group.add(ring);
  });

  const tipPoint = curve.getPoint(0.96);
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.036, 0.27, 4), materials.cinnabar);
  const tangent = curve.getTangent(0.98).normalize();
  tip.position.copy(tipPoint);
  tip.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
  group.add(tip);

  tipGlowTexture ??= createGlowTexture();
  const tipGlow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: tipGlowTexture,
    color: index % 2 === 0 ? '#f08a58' : '#80c8d0',
    transparent: true,
    opacity: 0.34,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }));
  tipGlow.position.copy(tipPoint);
  tipGlow.scale.set(0.7, 0.7, 1);
  group.add(tipGlow);

  group.userData = {
    index,
    centered: (index - 4) / 4,
    phase: index * 0.72,
    curve,
    angle
  };
  return group;
}

function createAura() {
  const group = new THREE.Group();
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: '#b34d40',
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const ring = new THREE.Mesh(new THREE.RingGeometry(2.2, 2.235, 100), ringMaterial);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.08;
  group.add(ring);

  const second = new THREE.Mesh(
    new THREE.RingGeometry(2.5, 2.515, 100),
    ringMaterial.clone()
  );
  second.material.opacity = 0.22;
  second.rotation.x = -Math.PI / 2;
  second.position.y = 0.08;
  group.add(second);

  return { group, ring, second };
}

function createOrbitalSigils() {
  const group = new THREE.Group();
  const cyan = new THREE.MeshBasicMaterial({
    color: '#86cbd0',
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const ember = new THREE.MeshBasicMaterial({
    color: '#e17a4f',
    transparent: true,
    opacity: 0.3,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const ringA = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.018, 4, 96), cyan);
  ringA.rotation.x = Math.PI / 2;
  ringA.position.y = 1.8;
  group.add(ringA);

  const ringB = new THREE.Mesh(new THREE.TorusGeometry(5.15, 0.014, 4, 96), ember);
  ringB.rotation.set(1.15, 0.15, 0.38);
  ringB.position.y = 2.1;
  group.add(ringB);

  const shards = [];
  for (let index = 0; index < 12; index += 1) {
    const angle = (index / 12) * Math.PI * 2;
    const shard = new THREE.Mesh(
      new THREE.BoxGeometry(0.035, 0.34 + (index % 3) * 0.12, 0.08),
      index % 4 === 0 ? ember : cyan
    );
    shard.position.set(Math.cos(angle) * 4.65, 1.4 + (index % 4) * 0.55, Math.sin(angle) * 4.65);
    shard.rotation.set(angle * 0.3, -angle, angle * 0.16);
    group.add(shard);
    shards.push({ mesh: shard, angle, height: shard.position.y });
  }
  return { group, ringA, ringB, shards };
}

export function createInkFox(options = {}) {
  const materials = createFoxMaterials();
  const random = mulberry32(6104);
  const root = new THREE.Group();
  const baseScale = options.scale ?? 1;
  const baseY = options.y ?? 0.22;
  const baseRotation = options.rotation ?? 0;
  root.position.set(options.x ?? 0, baseY, options.z ?? 0);
  root.rotation.y = baseRotation;
  root.scale.setScalar(baseScale);
  root.name = 'nine-tail-fox';

  const breath = new THREE.Group();
  root.add(breath);

  const bodyParts = createFoxBody(materials, random);
  breath.add(bodyParts.body);

  const { head, ears, eyes, eyeGlows } = createFoxHead(materials);
  const headPivot = new THREE.Group();
  headPivot.position.set(0, 3.1, 1.25);
  headPivot.scale.setScalar(1.05);
  headPivot.rotation.x = 0.02;
  headPivot.rotation.y = 0.18;
  headPivot.add(head);
  breath.add(headPivot);

  const legs = [];
  [
    [-1, false],
    [1, false],
    [-1, true],
    [1, true]
  ].forEach(([side, rear]) => {
    const leg = createFoxLeg(materials, side, rear, random);
    breath.add(leg);
    legs.push(leg);
  });

  const tailRoot = new THREE.Group();
  tailRoot.position.set(0, 2.22, -1.12);
  breath.add(tailRoot);
  const tails = Array.from({ length: 9 }, (_, index) => {
    const tail = createFoxTail(materials, index);
    tailRoot.add(tail);
    return tail;
  });

  const aura = createAura();
  root.add(aura.group);
  const sigils = createOrbitalSigils();
  root.add(sigils.group);

  const hitMesh = new THREE.Mesh(new THREE.BoxGeometry(6.7, 4.3, 6.4), materials.hit);
  hitMesh.position.set(0, 2.5, -0.9);
  hitMesh.name = 'fox-hit';
  root.add(hitMesh);

  const state = {
    hover: 0,
    awaken: 0,
    awakenTime: 0,
    headYaw: 0,
    headPitch: 0
  };

  const setHover = (hovering) => {
    state.hover = hovering ? 1 : 0;
  };

  const awaken = () => {
    state.awaken = 1;
    state.awakenTime = 0;
  };

  const update = (time, delta) => {
    const clampedDelta = Math.min(delta, 0.05);
    const breathe = Math.sin(time * 1.25) * 0.012;
    breath.scale.set(1 + breathe, 1 + breathe * 1.3, 1 + breathe * 0.6);

    const hoverTarget = state.hover;
    root.scale.x = damp(root.scale.x, baseScale + hoverTarget * 0.018, 5, clampedDelta);
    root.scale.y = damp(root.scale.y, baseScale + hoverTarget * 0.012, 5, clampedDelta);
    root.scale.z = damp(root.scale.z, baseScale + hoverTarget * 0.018, 5, clampedDelta);

    let envelope = 0;
    if (state.awaken > 0) {
      state.awakenTime += clampedDelta;
      const duration = 3.2;
      const t = Math.min(state.awakenTime / duration, 1);
      const rise = Math.sin(Math.min(t / 0.28, 1) * Math.PI / 2);
      const fan = Math.sin(Math.min(Math.max((t - 0.12) / 0.58, 0), 1) * Math.PI / 2);
      const settle = 1 - Math.max(0, (t - 0.78) / 0.22);
      envelope = rise * (0.55 + fan * 0.45) * settle;
      if (t >= 1) state.awaken = 0;
    }

    const idleY = Math.sin(time * 0.72) * 0.018;
    root.position.y = baseY + idleY + envelope * 0.3;
    root.rotation.y = baseRotation + Math.sin(time * 0.19) * 0.018;

    headPivot.rotation.y = 0.18 + Math.sin(time * 0.37) * 0.075 + Math.sin(time * 0.13) * 0.03;
    headPivot.rotation.x = 0.02 + Math.sin(time * 0.55) * 0.022 - envelope * 0.14;
    headPivot.rotation.z = Math.sin(time * 0.23) * 0.018;

    ears.forEach((ear, index) => {
      const twitch = Math.max(0, Math.sin(time * 1.4 + index * 2.4) - 0.93) * 0.7;
      ear.pivot.rotation.z = ear.side * -0.16 + ear.side * twitch;
      ear.pivot.rotation.x = -0.04 + Math.sin(time * 0.8 + index) * 0.02;
    });

    eyes.forEach((eye, index) => {
      eye.scale.y = 0.72 + Math.sin(time * 2.1 + index) * 0.06;
    });
    eyeGlows.forEach((glow, index) => {
      const pulse = 0.82 + Math.sin(time * 1.8 + index * 1.7) * 0.18;
      glow.material.opacity = 0.46 * pulse + envelope * 0.24;
      glow.scale.set(0.22 + pulse * 0.035, 0.12 + pulse * 0.018, 1);
    });

    legs.forEach((leg) => {
      const data = leg.userData;
      const shift = Math.sin(time * 0.8 + data.phase) * 0.012;
      leg.rotation.x = shift + envelope * (data.rear ? -0.06 : 0.05);
      data.knee.rotation.x = Math.sin(time * 0.7 + data.phase + 1) * 0.018 - envelope * 0.05;
      data.ankle.rotation.x = -Math.sin(time * 0.7 + data.phase + 1) * 0.012;
    });

    bodyParts.chestCore.rotation.z = time * 0.42;
    bodyParts.core.scale.setScalar(0.88 + Math.sin(time * 2.4) * 0.12 + envelope * 0.4);

    tails.forEach((tail) => {
      const data = tail.userData;
      const sway = Math.sin(time * 0.42 + data.phase) * 0.045;
      const secondary = Math.sin(time * 0.31 + data.phase * 1.7) * 0.028;
      tail.rotation.z =
        data.centered * 0.08 +
        data.centered * envelope * 0.52 +
        sway * (0.5 + Math.abs(data.centered));
      tail.rotation.x = secondary + envelope * (0.1 + Math.abs(data.centered) * 0.04);
      tail.rotation.y = Math.sin(time * 0.34 + data.phase * 0.8) * 0.035;
    });

    aura.ring.scale.setScalar(0.82 + envelope * 1.7);
    aura.second.scale.setScalar(0.82 + envelope * 1.38);
    aura.ring.material.opacity = 0.08 + envelope * 0.5;
    aura.second.material.opacity = 0.04 + envelope * 0.22;
    aura.group.rotation.y = time * 0.12;
    sigils.ringA.rotation.z = time * 0.12;
    sigils.ringB.rotation.z = -time * 0.09;
    sigils.ringB.rotation.y = 0.15 + Math.sin(time * 0.21) * 0.08;
    sigils.shards.forEach((item, index) => {
      item.mesh.position.y = item.height + Math.sin(time * 0.7 + index) * 0.12;
      item.mesh.rotation.y = -item.angle + time * 0.18;
    });
  };

  return {
    group: root,
    hitMesh,
    update,
    setHover,
    awaken
  };
}
