import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cwd } from "node:process";
import * as THREE from "three";
import { describe, expect, it } from "vitest";

type Vertex = [number, number, number];
interface Asset {
  nodes: { name: string; mesh: number; translation?: Vertex }[];
  meshes: {
    primitives: { attributes: { POSITION: number }; indices: number }[];
  }[];
  accessors: {
    bufferView: number;
    byteOffset?: number;
    count: number;
    componentType: number;
  }[];
  bufferViews: { byteOffset?: number }[];
}
const bytes = readFileSync(resolve(cwd(), "public/models/sebaz-avatar.glb"));
const jsonLength = bytes.readUInt32LE(12);
const asset = JSON.parse(
  bytes.subarray(20, 20 + jsonLength).toString(),
) as Asset;
const start = 28 + jsonLength;
const offset = (index: number) =>
  start +
  (asset.bufferViews[asset.accessors[index].bufferView].byteOffset ?? 0) +
  (asset.accessors[index].byteOffset ?? 0);
const mesh = (name: string) => {
  const node = asset.nodes.find((item) => item.name === name)!;
  const primitive = asset.meshes[node.mesh].primitives[0];
  const positions = asset.accessors[primitive.attributes.POSITION];
  const at = offset(primitive.attributes.POSITION);
  const vertices = Array.from(
    { length: positions.count },
    (_, index): Vertex => [
      bytes.readFloatLE(at + index * 12),
      bytes.readFloatLE(at + index * 12 + 4),
      bytes.readFloatLE(at + index * 12 + 8),
    ],
  );
  const indices = asset.accessors[primitive.indices];
  const indexAt = offset(primitive.indices);
  const triangles = Array.from({ length: indices.count / 3 }, (_, index) =>
    Array.from({ length: 3 }, (_, corner) =>
      indices.componentType === 5123
        ? bytes.readUInt16LE(indexAt + (index * 3 + corner) * 2)
        : bytes.readUInt32LE(indexAt + (index * 3 + corner) * 4),
    ),
  );
  return { node, vertices, triangles };
};

describe("Portrait surface stability", () => {
  const front = mesh("AvatarPortrait");

  it("keeps the entire facial surface in front of the interior of the head", () => {
    expect(
      Math.min(...front.vertices.map((vertex) => vertex[2])),
    ).toBeGreaterThanOrEqual(-0.000001);
    const back = mesh("AvatarBack");
    // The middle of each back-shell ring must remain behind the face.
    for (let row = 0; row < back.vertices.length / 49; row++)
      expect(back.vertices[row * 49 + 24][2]).toBeLessThan(0.01);
  });

  it("does not fold the cheeks, mouth or forehead over themselves at either rotation limit", () => {
    const back = mesh("AvatarBack");
    const rows = Array.from(
      { length: back.vertices.length / 49 },
      (_, row) => ({
        y: back.vertices[row * 49][1],
        left: back.vertices[row * 49 + 48][0],
        right: back.vertices[row * 49][0],
      }),
    );
    // Silhouette triangles legitimately turn away; interior facial triangles must never fold.
    const inside = front.vertices.map(([x, y]) => {
      const row = rows.reduce((best, candidate) =>
        Math.abs(candidate.y - y) < Math.abs(best.y - y) ? candidate : best,
      );
      return (
        Math.abs(
          (x - (row.left + row.right) / 2) / ((row.right - row.left) / 2),
        ) < 0.82 &&
        y > -1 &&
        y < 1.1
      );
    });
    const interior = front.triangles.filter((triangle) =>
      triangle.every((index) => inside[index]),
    );
    expect(interior.length).toBeGreaterThan(2000);
    for (const yaw of [-0.28, 0, 0.28])
      for (const pitch of [-0.07, 0.07]) {
        const matrix = new THREE.Matrix4().makeRotationFromEuler(
          new THREE.Euler(pitch, yaw, 0),
        );
        let folds = 0;
        for (const triangle of interior) {
          const [a, b, c] = triangle.map((index) =>
            new THREE.Vector3(...front.vertices[index]).applyMatrix4(matrix),
          );
          if (
            (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) <
            -0.0000001
          )
            folds++;
        }
        expect(folds, `yaw=${yaw}, pitch=${pitch}`).toBe(0);
      }
  });

  it("keeps both eye rims attached to the repaired facial surface", () => {
    for (const name of ["Eye0", "Eye1"]) {
      const eye = mesh(name);
      const origin = eye.node.translation!;
      for (const vertex of eye.vertices.slice(1)) {
        const x = vertex[0] + origin[0];
        const y = vertex[1] + origin[1];
        const z = vertex[2] + origin[2];
        const nearest = front.vertices.reduce((best, candidate) =>
          Math.hypot(candidate[0] - x, candidate[1] - y) <
          Math.hypot(best[0] - x, best[1] - y)
            ? candidate
            : best,
        );
        expect(Math.hypot(nearest[0] - x, nearest[1] - y)).toBeLessThan(
          0.00001,
        );
        expect(z - nearest[2]).toBeGreaterThan(0.006);
        expect(z - nearest[2]).toBeLessThan(0.01);
      }
    }
  });

});
