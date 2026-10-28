import * as THREE from "three";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAvatar } from "@/components/portfolio/avatar/createAvatar";

const { load } = vi.hoisted(() => ({ load: vi.fn() }));
vi.mock("three/addons/loaders/GLTFLoader.js", () => ({
  GLTFLoader: class {
    loadAsync = load;
  },
}));

const fixture = () => {
  const group = new THREE.Group();
  const geometry = new THREE.PlaneGeometry();
  const texture = new THREE.Texture();
  const portrait = new THREE.MeshBasicMaterial({ map: texture });
  const front = new THREE.Mesh(geometry, portrait);
  front.name = "AvatarPortrait";
  group.add(front);
  const eyes = [0, 1].map((index) => {
    const eye = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ map: texture }),
    );
    eye.name = `Eye${index}`;
    group.add(eye);
    return eye;
  });
  const lids = [0, 1].flatMap((index) =>
    ["Upper", "Lower"].map((side) => {
      const lid = new THREE.Mesh(geometry, portrait);
      lid.name = `Lid${index}${side}`;
      lid.morphTargetInfluences = [0];
      group.add(lid);
      return lid;
    }),
  );
  load.mockResolvedValue({ scene: group });
  return { geometry, texture, portrait, eyes, lids };
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Avatar eye rig", () => {
  it("closes both eyes while the four skin lids cover the openings", async () => {
    const rig = fixture();
    const avatar = await createAvatar();
    avatar.animate(2.5, "natural");
    for (const eye of rig.eyes) expect(eye.scale.y).toBeCloseTo(0.03);
    for (const lid of rig.lids)
      expect(lid.morphTargetInfluences![0]).toBeCloseTo(0.97);
    expect(rig.eyes[0].material.map).not.toBe(rig.eyes[1].material.map);
    expect(rig.eyes[0].material.map!.offset.x).toBe(0);
    expect(rig.texture.offset.x).toBe(0);
    avatar.animate(2.7, "natural");
    for (const lid of rig.lids) expect(lid.morphTargetInfluences![0]).toBe(0);
    avatar.dispose();
  });

  it("keeps the head and both eyes centered throughout the animation", async () => {
    const rig = fixture();
    const avatar = await createAvatar();
    for (const time of [0, 1, 2.5, 6, 18]) {
      avatar.animate(time, "natural");
      expect(avatar.group.rotation.toArray().slice(0, 3)).toEqual([0, 0, 0]);
      expect(avatar.group.position.toArray()).toEqual([0, 0, 0]);
      for (const eye of rig.eyes) expect(eye.material.map!.offset.toArray()).toEqual([0, 0]);
    }
    avatar.dispose();
  });

  it("disposes shared portrait resources exactly once", async () => {
    const rig = fixture();
    const disposeGeometry = vi.spyOn(rig.geometry, "dispose");
    const disposeMaterial = vi.spyOn(rig.portrait, "dispose");
    const disposeTexture = vi.spyOn(rig.texture, "dispose");
    const avatar = await createAvatar();
    avatar.dispose();
    expect(disposeGeometry).toHaveBeenCalledOnce();
    expect(disposeMaterial).toHaveBeenCalledOnce();
    expect(disposeTexture).toHaveBeenCalledOnce();
  });
});
