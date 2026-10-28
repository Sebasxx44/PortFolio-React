import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { avatarBlink } from "@/components/portfolio/avatar/avatarMotion";
import { stabilizeAvatarSurface } from "@/components/portfolio/avatar/avatarSurface";
import type { Finish } from "@/components/portfolio/types";

export interface AvatarModel {
  group: THREE.Group;
  animate: (
    time: number,
    finish: Finish,
  ) => void;
  dispose: () => void;
}

interface EyeRig {
  opening: THREE.Mesh;
  texture: THREE.Texture;
}

export const createAvatar = async (): Promise<AvatarModel> => {
  // A solid portrait mesh reconstructed from the facial landmarks of the reference texture.
  const asset = await new GLTFLoader().loadAsync("/models/sebaz-avatar.glb");
  const group = asset.scene;
  group.name = "SebastianAvatar";
  stabilizeAvatarSurface(group);
  const eyes: EyeRig[] = [];
  const lids: THREE.Mesh[] = [];
  const appearance = { value: 0 };
  const clayColor = { value: new THREE.Color("#9baa84") };
  const back = group.getObjectByName("AvatarBack");
  const backColors =
    back instanceof THREE.Mesh && back.geometry.getAttribute("color")
      ? back.geometry.getAttribute("color").clone()
      : null;
  if (back instanceof THREE.Mesh) {
    const previous = Array.isArray(back.material) ? back.material : [back.material];
    back.material = new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false, side: THREE.FrontSide });
    for (const material of previous) material.dispose();
  }
  let activeFinish: Finish = "natural";

  // Independent eye textures let the gaze move without shifting the portrait texture.
  group.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    const renderMaterials = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of renderMaterials) {
      material.side = THREE.FrontSide;
      material.transparent = false;
      material.alphaTest = 0.04;
      material.depthWrite = true;
    }
    object.frustumCulled = false;
    object.castShadow = false;
    object.receiveShadow = false;
    if (object.name === "Eye0" || object.name === "Eye1") {
      const material = object.material;
      if (material instanceof THREE.MeshBasicMaterial && material.map) {
        material.map = material.map.clone();
        material.map.needsUpdate = true;
        material.toneMapped = false;
        eyes.push({ opening: object, texture: material.map });
      }
    } else if (object.name !== "AvatarBack") {
      if (object.name.startsWith("Lid")) lids.push(object);
      const material = object.material;
      if (material instanceof THREE.MeshBasicMaterial) {
        material.toneMapped = false;
        material.depthWrite = true;
        material.onBeforeCompile = (shader) => {
          shader.uniforms.portraitClay = appearance;
          shader.uniforms.portraitClayColor = clayColor;
          shader.fragmentShader =
            "uniform float portraitClay;\nuniform vec3 portraitClayColor;\n" +
            shader.fragmentShader;
          shader.fragmentShader = shader.fragmentShader.replace(
            "#include <color_fragment>",
            `#include <color_fragment>
            float portraitLuminance = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
            diffuseColor.rgb = mix(diffuseColor.rgb, portraitClayColor * (0.35 + portraitLuminance * 0.9), portraitClay);
          `,
          );
        };
        material.customProgramCacheKey = () => "sebaz-portrait-clay";
      }
    }
  });

  return {
    group,
    animate: (time, finish) => {
      group.rotation.set(0, 0, 0);
      group.position.set(0, 0, 0);
      const blink = avatarBlink(time);
      for (const eye of eyes) {
        eye.opening.scale.y = blink;
        eye.texture.offset.set(0, 0);
      }
      for (const lid of lids) {
        if (lid.morphTargetInfluences) lid.morphTargetInfluences[0] = 1 - blink;
      }
      appearance.value = finish === "clay" ? 1 : 0;
      if (finish !== activeFinish && back instanceof THREE.Mesh && backColors) {
        const colors = back.geometry.getAttribute("color");
        const color = new THREE.Color();
        for (let vertex = 0; vertex < colors.count; vertex++) {
          if (finish === "natural")
            colors.setXYZ(
              vertex,
              backColors.getX(vertex),
              backColors.getY(vertex),
              backColors.getZ(vertex),
            );
          else {
            color
              .copy(clayColor.value)
              .multiplyScalar(
                0.35 +
                  0.9 *
                    (backColors.getX(vertex) * 0.2126 +
                      backColors.getY(vertex) * 0.7152 +
                      backColors.getZ(vertex) * 0.0722),
              );
            colors.setXYZ(vertex, color.r, color.g, color.b);
          }
        }
        colors.needsUpdate = true;
        activeFinish = finish;
      }
    },
    dispose: () => {
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      const textures = new Set<THREE.Texture>();
      group.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        geometries.add(object.geometry);
        for (const material of Array.isArray(object.material)
          ? object.material
          : [object.material]) {
          materials.add(material);
          if (
            (material instanceof THREE.MeshBasicMaterial ||
              material instanceof THREE.MeshStandardMaterial) &&
            material.map
          )
            textures.add(material.map);
        }
      });
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
      for (const texture of textures) texture.dispose();
    },
  };
};
