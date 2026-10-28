import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cwd } from "node:process";
import { describe, expect, it } from "vitest";
import { avatarBlink } from "@/components/portfolio/avatar/avatarMotion";

interface ModelAsset {
  nodes: { name: string; mesh: number }[];
  meshes: {
    primitives: {
      attributes: { POSITION: number };
      targets?: { POSITION: number }[];
    }[];
  }[];
  animations: {
    name: string;
    channels: { target: { node: number; path: string } }[];
  }[];
  accessors: {
    count: number;
    type: string;
    componentType: number;
    bufferView: number;
    byteOffset?: number;
  }[];
  bufferViews: { byteOffset?: number; byteLength: number }[];
}

const bytes = readFileSync(resolve(cwd(), "public/models/sebaz-avatar.glb"));
const jsonLength = bytes.readUInt32LE(12);
const asset = JSON.parse(
  bytes.subarray(20, 20 + jsonLength).toString(),
) as ModelAsset;
const binaryStart = 20 + jsonLength + 8;

describe("Personalized animated portrait", () => {
  it("ships a valid binary container with finite 3D geometry rather than a flat image plane", () => {
    expect(bytes.toString("ascii", 0, 4)).toBe("glTF");
    expect(bytes.readUInt32LE(4)).toBe(2);
    expect(bytes.readUInt32LE(8)).toBe(bytes.length);
    const mesh =
      asset.meshes[
        asset.nodes.find((node) => node.name === "AvatarPortrait")!.mesh
      ];
    const accessor = asset.accessors[mesh.primitives[0].attributes.POSITION];
    expect(accessor.count).toBeGreaterThan(4000);
    const view = asset.bufferViews[accessor.bufferView];
    const offset =
      binaryStart + (view.byteOffset ?? 0) + (accessor.byteOffset ?? 0);
    const depth: number[] = [];
    for (let vertex = 0; vertex < accessor.count; vertex++) {
      for (let axis = 0; axis < 3; axis++)
        expect(
          Number.isFinite(bytes.readFloatLE(offset + vertex * 12 + axis * 4)),
        ).toBe(true);
      depth.push(bytes.readFloatLE(offset + vertex * 12 + 8));
    }
    expect(Math.max(...depth) - Math.min(...depth)).toBeGreaterThan(0.5);
    expect(asset.nodes.some((node) => node.name === "AvatarBack")).toBe(true);
  });

  it("includes both eyes and four morphing eyelids in the portable blink animation", () => {
    const blink = asset.animations.find(
      (animation) => animation.name === "Blink",
    )!;
    const targets = blink.channels.map((channel) => ({
      name: asset.nodes[channel.target.node].name,
      path: channel.target.path,
    }));
    expect(
      targets
        .filter((target) => target.path === "scale")
        .map((target) => target.name)
        .sort(),
    ).toEqual(["Eye0", "Eye1"]);
    expect(targets.filter((target) => target.path === "weights")).toHaveLength(
      4,
    );
    for (const node of asset.nodes.filter((node) =>
      node.name.startsWith("Lid"),
    )) {
      const mesh = asset.meshes[node.mesh].primitives[0];
      expect(asset.accessors[mesh.targets![0].POSITION].count).toBe(
        asset.accessors[mesh.attributes.POSITION].count,
      );
    }
  });

  it("closes and reopens naturally without inverted or fully collapsed eyes", () => {
    expect(avatarBlink(0)).toBe(1);
    expect(avatarBlink(2.5)).toBeCloseTo(0.03);
    expect(avatarBlink(2.67)).toBe(1);
    for (let frame = 0; frame < 900; frame++) {
      const openness = avatarBlink(frame / 60);
      expect(openness).toBeGreaterThanOrEqual(0.029);
      expect(openness).toBeLessThanOrEqual(1);
      expect(avatarBlink(frame / 60 + 7.2)).toBeCloseTo(openness, 10);
    }
  });

});
