import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

export function createPostProcessing(renderer, scene, camera) {
  const size = renderer.getSize(new THREE.Vector2());
  const composer = new EffectComposer(renderer);
  composer.setSize(size.x, size.y);

  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(
    new THREE.Vector2(size.x * 0.7, size.y * 0.7),
    0.36,
    0.46,
    0.88
  );
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  return {
    render: () => composer.render(),
    setSize(width, height) {
      composer.setSize(width, height);
      bloom.setSize(width * 0.7, height * 0.7);
    },
    dispose() {
      composer.dispose();
    }
  };
}
