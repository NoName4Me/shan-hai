import * as THREE from 'three';
import { createArchitecture } from './architecture.js';
import { createAtmosphere } from './atmosphere.js';
import { createDistantPeaks } from './distantPeaks.js';
import { createFoliage } from './foliage.js';
import { createRiftField } from './rift.js';
import { createSky, updateSky } from './sky.js';
import { createTerrain } from './terrain.js';
import { createWater } from './water.js';

export function createEnvironment(scene) {
  scene.background = new THREE.Color('#070c15');
  scene.fog = new THREE.FogExp2('#142131', 0.0045);

  const moonDirection = new THREE.Vector3(-0.17, 0.22, -0.96).normalize();
  const sky = createSky(moonDirection);
  scene.add(sky);

  const moon = new THREE.Mesh(
    new THREE.CircleGeometry(14, 64),
    new THREE.MeshBasicMaterial({
      color: '#dcece8',
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
      fog: false,
      toneMapped: false
    })
  );
  moon.position.copy(moonDirection).multiplyScalar(360);
  moon.lookAt(0, 24, 0);
  scene.add(moon);

  const terrain = createTerrain(scene);
  const peaks = createDistantPeaks(scene);
  const water = createWater(scene, moonDirection);
  const architecture = createArchitecture(scene);
  const foliage = createFoliage(scene);
  const rifts = createRiftField(scene);
  const atmosphere = createAtmosphere(scene);

  const ambient = new THREE.HemisphereLight('#b9d4da', '#0b151c', 2.65);
  scene.add(ambient);

  const key = new THREE.DirectionalLight('#e4eee7', 5.1);
  key.position.set(-46, 74, 38);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -28;
  key.shadow.camera.right = 28;
  key.shadow.camera.top = 28;
  key.shadow.camera.bottom = -28;
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 170;
  key.shadow.bias = -0.0008;
  key.shadow.normalBias = 0.06;
  scene.add(key);

  const rim = new THREE.DirectionalLight('#78aec8', 3.1);
  rim.position.set(60, 24, -86);
  scene.add(rim);

  const shrineGlow = new THREE.PointLight('#f07a48', 65, 45, 2);
  shrineGlow.position.set(0, architecture.foxGround + 8, -43);
  scene.add(shrineGlow);

  const foxBacklight = new THREE.PointLight('#8bcbd4', 85, 52, 2);
  foxBacklight.position.set(0, architecture.foxGround + 16, -58);
  scene.add(foxBacklight);

  const gateLight = new THREE.PointLight('#e27743', 70, 42, 2);
  gateLight.position.set(0, architecture.gatePosition.y + 12, -90);
  scene.add(gateLight);

  const fill = new THREE.DirectionalLight('#bb6d4a', 1.15);
  fill.position.set(26, 12, 72);
  scene.add(fill);

  const moonSpot = new THREE.SpotLight('#c8e2e3', 240, 185, 0.46, 0.72, 1.2);
  moonSpot.position.set(-72, 92, -92);
  moonSpot.target.position.set(0, 0, -34);
  scene.add(moonSpot, moonSpot.target);

  const update = (time) => {
    updateSky(sky, time);
    water.material.uniforms.uTime.value = time;
    architecture.update(time);
    rifts.update(time);
    atmosphere.update(time);
    shrineGlow.intensity = 56 + Math.sin(time * 1.15) * 8;
    foxBacklight.intensity = 78 + Math.sin(time * 0.8 + 1.4) * 10;
    gateLight.intensity = 62 + Math.sin(time * 0.66) * 7;
    peaks.snow.rotation.y = time * 0.0008;
  };

  return {
    update,
    terrain,
    water,
    architecture,
    foliage,
    rifts,
    sky,
    keyLight: key,
    foxGround: architecture.foxGround
  };
}
