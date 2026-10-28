import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createAvatar, type AvatarModel } from "@/components/portfolio/avatar/createAvatar";
import type { Finish } from "@/components/portfolio/types";

export interface SculptureScene {
  ready?: Promise<void>;
  render: (time: number, finish: Finish) => void;
  resize: () => void;
  dispose: () => void;
}

export const createSculptureScene = (canvas: HTMLCanvasElement): SculptureScene => {
  // Renderer & environment
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-2.3, 2.3, 2.3, -2.3, 0.1, 30);
  camera.position.set(0, 0.07, 7.25);
  camera.lookAt(0, 0.07, 0);
  const room = new RoomEnvironment();
  const generator = new THREE.PMREMGenerator(renderer);
  const environment = generator.fromScene(room, 0.04);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.48;
  room.dispose();
  generator.dispose();

  // Avatar and studio lighting
  let avatar: AvatarModel | null = null;
  let disposed = false;
  const ready = createAvatar().then(model => {
    if (disposed) { model.dispose(); return; }
    avatar = model;
    scene.add(model.group);
  });
  const key = new THREE.DirectionalLight("#fff0df", 3.1);
  key.position.set(-3, 4, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -2.5;
  key.shadow.camera.right = 2.5;
  key.shadow.camera.top = 2.5;
  key.shadow.camera.bottom = -2.5;
  key.shadow.normalBias = 0.015;
  const fill = new THREE.DirectionalLight("#dce9ff", 1.3);
  fill.position.set(3, 1, 3);
  const rim = new THREE.DirectionalLight("#edf1f8", 2.4);
  rim.position.set(1, 2, -3);
  scene.add(key, fill, rim);

  // Public API
  const resize = () => {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    const halfWidth = 2.3 * width / height;
    camera.left = -halfWidth;
    camera.right = halfWidth;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };
  resize();
  return {
    ready,
    resize,
    render: (time, finish) => {
      avatar?.animate(time, finish);
      renderer.render(scene, camera);
    },
    dispose: () => {
      disposed = true;
      avatar?.dispose();
      key.shadow.map?.dispose(); environment.dispose(); renderer.dispose();
    },
  };
};
