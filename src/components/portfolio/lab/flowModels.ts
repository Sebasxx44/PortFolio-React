import { Vector3 } from "three";
import {
  monitor,
  monitorCenter,
  phone,
  phoneCenter,
  proofCenter,
  lcdCenter,
  lidNormal,
  lidUp,
  onLid,
  point,
} from "./flowWorld";

export interface Face {
  vertices: Vector3[];
  normal: Vector3;
  fill: string;
  edge?: string;
}
export interface Mesh {
  faces: Face[];
}
export interface Model {
  center: Vector3;
  footprint: [number, number];
  meshes: Mesh[];
}
const face = (vertices: Vector3[], fill: string, edge?: string): Face => ({
  vertices,
  fill,
  edge,
  normal: vertices[1]
    .clone()
    .sub(vertices[0])
    .cross(vertices[2].clone().sub(vertices[0]))
    .normalize(),
});
type MapPoint = (x: number, y: number, z: number) => Vector3;
type Material = { top: string; front: string; side: string; edge?: string };
const alloy: Material = {
  top: "#c3b9e8",
  front: "#8677aa",
  side: "#645b80",
  edge: "#b7abd7",
};
const darkMetal: Material = {
  top: "#66597c",
  front: "#39324e",
  side: "#272339",
  edge: "#807590",
};
const graphite: Material = {
  top: "#342c46",
  front: "#242031",
  side: "#151522",
  edge: "#5e5473",
};
const keyCap: Material = { top: "#514662", front: "#362c46", side: "#2b263b" };
const roseKey: Material = { top: "#ed82b0", front: "#ae5e8b", side: "#774664" };
const violetKey: Material = {
  top: "#ab91fb",
  front: "#8b73bc",
  side: "#69568b",
};
const fixed: MapPoint = (x, y, z) => point(x, y, z);
const within =
  (anchor: Vector3): MapPoint =>
  (x, y, z) =>
    point(anchor.x + x, anchor.y + y, anchor.z + z);

function chamferRing(
  x: number,
  z: number,
  w: number,
  d: number,
  bevel: number,
) {
  const l = x - w / 2,
    r = x + w / 2,
    f = z + d / 2,
    b = z - d / 2,
    k = Math.min(bevel, w * 0.24, d * 0.24);
  return [
    [l + k, f],
    [r - k, f],
    [r, f - k],
    [r, b + k],
    [r - k, b],
    [l + k, b],
    [l, b + k],
    [l, f - k],
  ];
}
function slab(
  meshes: Mesh[],
  map: MapPoint,
  x: number,
  y: number,
  z: number,
  w: number,
  h: number,
  d: number,
  m: Material,
  k = 0.045,
) {
  const ring = chamferRing(x, z, w, d, k);
  const low = ring.map(([a, b]) => map(a, y - h / 2, b)),
    high = ring.map(([a, b]) => map(a, y + h / 2, b));
  const faces = [face(high, m.top, m.edge)];
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length;
    faces.push(
      face(
        [low[i], low[j], high[j], high[i]],
        i === 0 ? m.front : i === 4 ? m.side : i % 2 ? m.front : m.side,
        m.edge,
      ),
    );
  }
  meshes.push({ faces });
}
function frontPanel(
  meshes: Mesh[],
  p: MapPoint,
  x: number,
  y: number,
  z: number,
  w: number,
  h: number,
  color: string,
  edge?: string,
  k = 0.018,
) {
  const ring = chamferRing(x, y, w, h, k).reverse();
  meshes.push({
    faces: [
      face(
        ring.map(([a, b]) => p(a, b, z)),
        color,
        edge,
      ),
    ],
  });
}
function flat(
  meshes: Mesh[],
  p: MapPoint,
  x: number,
  y: number,
  z: number,
  w: number,
  d: number,
  color: string,
  edge?: string,
  k = 0.02,
) {
  meshes.push({
    faces: [
      face(
        chamferRing(x, z, w, d, k).map(([a, b]) => p(a, y, b)),
        color,
        edge,
      ),
    ],
  });
}
function circle(
  meshes: Mesh[],
  p: MapPoint,
  x: number,
  y: number,
  z: number,
  r: number,
  fill: string,
  n = 16,
) {
  const verts = Array.from({ length: n }, (_, i) =>
    p(
      x + r * Math.cos((i / n) * 2 * Math.PI),
      y + r * Math.sin((i / n) * 2 * Math.PI),
      z,
    ),
  );
  meshes.push({ faces: [face(verts, fill)] });
}
function laptop(): Model {
  const meshes: Mesh[] = [];
  slab(meshes, fixed, 0, 0.105, 0.08, 4.36, 0.16, 2.68, graphite, 0.13);
  slab(meshes, fixed, 0, 0.238, 0.07, 4.64, 0.17, 2.94, alloy, 0.14);
  flat(meshes, fixed, 0, 0.327, -0.27, 3.95, 1.4, "#6d6483", "#a296b3", 0.095);
  const rows = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1.35, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.65],
    [1.64, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.36],
    [1.92, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.08],
    [1.2, 1, 1.12, 5.5, 1.16, 1.05, 1, 1, 1],
  ];
  rows.forEach((units, row) => {
    const total = units.reduce((a, b) => a + b, 0),
      pitch = 3.8 / total;
    let left = -1.9;
    for (const [col, u] of units.entries()) {
      const x = left + (u * pitch) / 2,
        z = -0.8 + row * 0.267,
        w = u * pitch - 0.035;
      left += u * pitch;
      slab(
        meshes,
        fixed,
        x,
        0.357,
        z,
        w,
        0.045,
        0.224,
        row === 0 && col === 0
          ? roseKey
          : row === 2 && col === units.length - 1
            ? violetKey
            : keyCap,
        0.032,
      );
      if (u < 3) {
        flat(
          meshes,
          fixed,
          x - w * 0.18,
          0.381,
          z - 0.04,
          row === 0 ? 0.042 : 0.045 + (col % 3) * 0.01,
          0.012,
          "#d6cce6",
          undefined,
          0.004,
        );
        if (row > 0 && col % 4 !== 0)
          flat(
            meshes,
            fixed,
            x - w * 0.18 - 0.011,
            0.382,
            z - 0.019,
            0.014,
            0.035,
            "#bdb0d4",
            undefined,
            0.003,
          );
      }
    }
  });
  flat(meshes, fixed, 0, 0.328, 0.947, 1.38, 0.68, "#a99abe", "#807594", 0.052);
  flat(meshes, fixed, 0, 0.33, 0.974, 1.26, 0.53, "#c3b5dc", undefined, 0.02);
  flat(meshes, fixed, 1.84, 0.331, 1.1, 0.29, 0.035, "#7b698b");
  flat(meshes, fixed, 1.84, 0.331, 1.016, 0.29, 0.021, "#a395af");
  for (const x of [-1.43, 1.43])
    slab(meshes, fixed, x, 0.395, -1.124, 0.62, 0.16, 0.25, graphite, 0.07);
  // The hinge, case and the projected application share one local coordinate frame.
  const silhouette = (
    w: number,
    h: number,
    z: number,
    color: string,
    edge?: string,
  ) => {
    frontPanel(meshes, onLid, 0, 0, z, w, h, color, edge, 0.085);
  };
  silhouette(4.48, 2.77, -0.075, "#665672", "#aaa0c2");
  const lidRing = chamferRing(0, 0, 4.48, 2.77, 0.085);
  const front = lidRing.map(([x, y]) => onLid(x, y, 0.05)),
    back = lidRing.map(([x, y]) => onLid(x, y, -0.075));
  meshes.push({
    faces: lidRing.map((_, i) => {
      const j = (i + 1) % lidRing.length;
      return face(
        [back[j], back[i], front[i], front[j]],
        i === 0 ? "#ccbfdb" : "#9485ae",
      );
    }),
  });
  silhouette(4.48, 2.77, 0.051, "#3c304c", "#bfaed9");
  silhouette(4.4, 2.69, 0.058, "#211d2c", "#625771");
  silhouette(4.21, 2.51, 0.063, "#14101a", "#24172a");
  circle(meshes, onLid, 0, 1.293, 0.075, 0.028, "#110f17");
  circle(meshes, onLid, 0.004, 1.299, 0.076, 0.013, "#b4a7c0");
  const side: MapPoint = (x, y, z) => point(2.322 + z, y, 0.59 - x);
  frontPanel(meshes, side, 0, 0.249, 0, 0.49, 0.12, "#271932", "#927d99");
  frontPanel(meshes, side, 0, 0.25, 0.002, 0.22, 0.042, "#ffa5ca");
  return {
    center: lcdCenter
      .clone()
      .addScaledVector(lidUp, -0.57)
      .addScaledVector(lidNormal, 0.84),
    footprint: [2.72, 1.92],
    meshes,
  };
}

function casing(
  meshes: Mesh[],
  center: Vector3,
  w: number,
  h: number,
  depth: number,
  corner: number,
  material: Material,
) {
  const ring = chamferRing(0, 0, w, h, corner).reverse(),
    p = within(center);
  const front = ring.map(([x, y]) => p(x, y, depth / 2)),
    back = ring.map(([x, y]) => p(x, y, -depth / 2));
  meshes.push({
    faces: ring.map((_, i) => {
      const j = (i + 1) % ring.length;
      return face(
        [back[i], back[j], front[j], front[i]],
        i % 3 ? material.side : material.top,
        material.edge,
      );
    }),
  });
  frontPanel(
    meshes,
    p,
    0,
    0,
    depth / 2,
    w,
    h,
    material.front,
    material.edge,
    corner,
  );
}
function screenFrame(
  meshes: Mesh[],
  center: Vector3,
  w: number,
  h: number,
  corner: number,
) {
  const p = within(center);
  casing(meshes, p(0, 0, -0.104), w + 0.21, h + 0.22, 0.19, corner, alloy);
  frontPanel(
    meshes,
    p,
    0,
    0,
    -0.007,
    w + 0.147,
    h + 0.163,
    "#292238",
    "#8b7fa3",
    corner * 0.76,
  );
  frontPanel(
    meshes,
    p,
    0,
    0,
    -0.003,
    w + 0.055,
    h + 0.05,
    "#110e1a",
    "#443956",
    corner * 0.48,
  );
}
function monitorModel(): Model {
  const meshes: Mesh[] = [],
    p = within(monitor);
  slab(meshes, p, 0, 0.135, 0.55, 2.1, 0.19, 1.06, alloy, 0.14);
  slab(meshes, p, 0, 0.65, 0.17, 0.5, 0.94, 0.34, darkMetal, 0.08);
  slab(meshes, p, 0, 0.97, 0.24, 0.7, 0.33, 0.4, alloy, 0.075);
  screenFrame(meshes, monitorCenter, 4.24, 2.508, 0.12);
  const facePoint = within(monitorCenter);
  circle(meshes, facePoint, 0, 1.31, 0.002, 0.022, "#beb3d8");
  // A physical row of colour keys sits along the drawing monitor's lower edge.
  for (const [i, col] of [
    "#ff85b2",
    "#ab89ff",
    "#88dafa",
    "#ffca70",
  ].entries()) {
    frontPanel(
      meshes,
      facePoint,
      1.6 + i * 0.106,
      -1.3,
      0.006,
      0.073,
      0.028,
      col,
      undefined,
      0.005,
    );
  }
  return { center: p(0, 1.29, 0.48), footprint: [2.33, 1.17], meshes };
}
function phoneModel(): Model {
  const meshes: Mesh[] = [],
    p = within(phone),
    height = (1.31 * 844) / 390;
  slab(meshes, p, 0, 0.132, 0.48, 1.66, 0.17, 0.94, alloy, 0.13);
  slab(meshes, p, 0, 0.42, 0.32, 0.49, 0.55, 0.25, darkMetal, 0.05);
  casing(
    meshes,
    phoneCenter.clone().add(point(0, 0, -0.116)),
    1.5,
    height + 0.23,
    0.207,
    0.16,
    alloy,
  );
  const f = within(phoneCenter);
  frontPanel(
    meshes,
    f,
    0,
    0,
    -0.008,
    1.425,
    height + 0.15,
    "#201729",
    "#695a78",
    0.144,
  );
  frontPanel(
    meshes,
    f,
    0,
    0,
    -0.004,
    1.345,
    height + 0.035,
    "#14111c",
    undefined,
    0.107,
  );
  frontPanel(
    meshes,
    f,
    0,
    height * 0.5 + 0.045,
    0.002,
    0.19,
    0.023,
    "#726a84",
    undefined,
    0.006,
  );
  slab(meshes, f, 0.754, 0.52, -0.11, 0.031, 0.3, 0.11, darkMetal, 0.012);
  for (const y of [0.63, 0.28])
    slab(meshes, f, -0.754, y, -0.11, 0.032, 0.22, 0.1, darkMetal, 0.012);
  return { center: p(0, 1.59, 0.49), footprint: [1.04, 0.8], meshes };
}
function proofModel(): Model {
  const meshes: Mesh[] = [],
    p = within(proofCenter);
  slab(meshes, p, 0, -1.04, -0.1, 1.53, 0.14, 0.73, darkMetal, 0.11);
  slab(meshes, p, 0, -0.85, -0.15, 0.43, 0.34, 0.27, alloy, 0.04);
  screenFrame(meshes, proofCenter, 2.64, 1.65, 0.12);
  return { center: p(0, -0.13, 0), footprint: [1.52, 0.94], meshes };
}
function studioTools(): Model {
  const meshes: Mesh[] = [],
    anchor = point(2.93, 0, -1.91),
    p = within(anchor);
  // Physical sample cards repeat the palette of the three finished sites.
  for (const [i, color] of ["#ef78b0", "#9c81ef", "#edbc6a"].entries()) {
    const x = i * 0.36,
      z = i * 0.09;
    slab(
      meshes,
      p,
      x,
      0.064 + i * 0.02,
      z,
      0.36,
      0.043,
      0.85,
      { top: "#e4d9ec", front: "#928799", side: "#8c7997" },
      0.03,
    );
    flat(
      meshes,
      p,
      x,
      0.087 + i * 0.02,
      z - 0.066,
      0.3,
      0.56,
      color,
      undefined,
      0.02,
    );
    flat(
      meshes,
      p,
      x - 0.068,
      0.088 + i * 0.02,
      z + 0.293,
      0.1,
      0.013,
      "#7c698a",
      undefined,
      0.002,
    );
  }
  const start = point(-0.13, 0.105, 0.72),
    finish = point(1.02, 0.105, 1.02),
    axis = finish.clone().sub(start),
    across = axis
      .clone()
      .cross(point(0, 1, 0))
      .normalize();
  const ring = (t: number, r: number) =>
    Array.from({ length: 8 }, (_, i) => {
      const q = start
        .clone()
        .addScaledVector(axis, t)
        .addScaledVector(across, r * Math.cos((i * Math.PI) / 4));
      q.y += r * Math.sin((i * Math.PI) / 4);
      return p(q.x, q.y, q.z);
    });
  for (const [t0, t1, r0, r1, col] of [
    [0, 0.15, 0.008, 0.065, "#e3cfef"],
    [0.15, 0.85, 0.065, 0.065, "#9c87d1"],
    [0.85, 0.9, 0.066, 0.066, "#f79bc1"],
    [0.9, 1, 0.065, 0.05, "#d3c7e0"],
  ] as const) {
    const a = ring(t0, r0),
      b = ring(t1, r1);
    meshes.push({
      faces: a.map((v, i) =>
        face([v, b[i], b[(i + 1) % 8], a[(i + 1) % 8]], col),
      ),
    });
  }
  return { center: p(0.4, 0.07, 0.16), footprint: [0.9, 0.63], meshes };
}
export const models = [
  laptop(),
  studioTools(),
  monitorModel(),
  proofModel(),
  phoneModel(),
];
