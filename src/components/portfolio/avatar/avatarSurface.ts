import * as THREE from "three";

export const AVATAR_SURFACE_REVISION = 4;

interface ProfileRow {
  y: number;
  left: number;
  right: number;
  center: number;
  half: number;
}

const clamp = THREE.MathUtils.clamp;
const gaussian = (value: number, center: number, radius: number) =>
  Math.exp(-Math.pow((value - center) / radius, 2));

const profileRows = (positions: THREE.BufferAttribute): ProfileRow[] => {
  const rows = new Map<number, { y: number; left: number; right: number }>();
  for (let vertex = 0; vertex < positions.count; vertex++) {
    const y = positions.getY(vertex);
    const key = Math.round(y * 100000);
    const row = rows.get(key) ?? { y, left: Infinity, right: -Infinity };
    row.left = Math.min(row.left, positions.getX(vertex));
    row.right = Math.max(row.right, positions.getX(vertex));
    rows.set(key, row);
  }
  const sorted = [...rows.values()].sort((a, b) => a.y - b.y);
  return sorted.map((row, index) => {
    let center = 0;
    let half = 0;
    let weight = 0;
    for (
      let neighbor = Math.max(0, index - 3);
      neighbor <= Math.min(sorted.length - 1, index + 3);
      neighbor++
    ) {
      const amount = Math.exp(-Math.pow((neighbor - index) / 1.8, 2));
      center += ((sorted[neighbor].left + sorted[neighbor].right) / 2) * amount;
      half += ((sorted[neighbor].right - sorted[neighbor].left) / 2) * amount;
      weight += amount;
    }
    return {
      ...row,
      center: center / weight,
      half: Math.max(0.02, half / weight),
    };
  });
};

const rowAt = (rows: ProfileRow[], y: number): ProfileRow => {
  let low = 0;
  let high = rows.length - 1;
  while (low + 1 < high) {
    const middle = (low + high) >>> 1;
    if (rows[middle].y < y) low = middle;
    else high = middle;
  }
  const a = rows[low];
  const b = rows[high];
  const t = clamp((y - a.y) / Math.max(0.00001, b.y - a.y), 0, 1);
  return {
    y,
    left: THREE.MathUtils.lerp(a.left, b.left, t),
    right: THREE.MathUtils.lerp(a.right, b.right, t),
    center: THREE.MathUtils.lerp(a.center, b.center, t),
    half: THREE.MathUtils.lerp(a.half, b.half, t),
  };
};

/** Replace the discontinuous landmark/fallback seam with one continuous, outward surface. */
export const stabilizeAvatarSurface = (group: THREE.Group): void => {
  if (group.userData.avatarSurfaceRevision === AVATAR_SURFACE_REVISION) return;
  const back = group.getObjectByName("AvatarBack");
  const portrait = group.getObjectByName("AvatarPortrait");
  const leftEye = group.getObjectByName("Eye0");
  const rightEye = group.getObjectByName("Eye1");
  if (
    !(back instanceof THREE.Mesh) ||
    !(portrait instanceof THREE.Mesh) ||
    !leftEye ||
    !rightEye
  )
    return;
  const backPositions = back.geometry.getAttribute(
    "position",
  ) as THREE.BufferAttribute;
  const rows = profileRows(backPositions);
  const eyeY = (leftEye.position.y + rightEye.position.y) / 2;
  const eyeX = (leftEye.position.x + rightEye.position.x) / 2;
  const spacing = Math.abs(rightEye.position.x - leftEye.position.x);
  const noseY = eyeY - spacing * 0.78;
  const chinY = eyeY - spacing * 1.9;

  const depth = (x: number, y: number) => {
    const row = rowAt(rows, y);
    const q = clamp((x - row.center) / row.half, -1, 1);
    const neck = 1 - THREE.MathUtils.smoothstep(y, chinY - 0.12, chinY + 0.16);
    const radius = THREE.MathUtils.lerp(
      Math.min(0.66, row.half * 0.73),
      Math.min(0.3, row.half * 0.65),
      neck,
    );
    const dome = radius * Math.pow(Math.max(0, 1 - q * q), 0.62);
    const nose =
      0.14 *
      gaussian(x, eyeX, spacing * 0.18) *
      gaussian(y, noseY, spacing * 0.26);
    const bridge =
      0.055 *
      gaussian(x, eyeX, spacing * 0.13) *
      gaussian(y, eyeY - spacing * 0.26, spacing * 0.4);
    const muzzle =
      0.025 *
      gaussian(x, eyeX, spacing * 0.42) *
      gaussian(y, eyeY - spacing * 1.37, spacing * 0.21);
    const socket =
      -0.022 *
      (gaussian(x, leftEye.position.x, spacing * 0.25) +
        gaussian(x, rightEye.position.x, spacing * 0.25)) *
      gaussian(y, eyeY, spacing * 0.16);
    const edge = Math.abs(
      (x - (row.left + row.right) / 2) /
        Math.max(0.01, (row.right - row.left) / 2),
    );
    const boundary = THREE.MathUtils.smoothstep(1 - edge, 0, 0.08);
    return (
      Math.max(0, dome + nose + bridge + muzzle + socket) *
      boundary *
      THREE.MathUtils.smoothstep((row.right - row.left) / 2, 0, 0.035)
    );
  };

  group.traverse((object) => {
    if (!(object instanceof THREE.Mesh) || object === back) return;
    const positions = object.geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;
    const deltas = object.geometry.morphAttributes.position?.[0] as
      THREE.BufferAttribute | undefined;
    const eye = object.name === "Eye0" || object.name === "Eye1";
    const lid = object.name.startsWith("Lid");
    const originX = object.position.x;
    const originY = object.position.y;
    const originZ = eye ? depth(originX, originY) : object.position.z;
    for (let vertex = 0; vertex < positions.count; vertex++) {
      const x = positions.getX(vertex) + originX;
      const y = positions.getY(vertex) + originY;
      const openZ = depth(x, y) + (eye ? 0.008 : lid ? 0.011 : 0) - originZ;
      if (deltas) {
        const closedZ =
          depth(x + deltas.getX(vertex), y + deltas.getY(vertex)) +
          0.013 -
          originZ;
        deltas.setZ(vertex, closedZ - openZ);
      }
      positions.setZ(vertex, openZ);
    }
    if (eye) object.position.z = originZ;
    positions.needsUpdate = true;
    if (deltas) {
      deltas.needsUpdate = true;
      // Upper eyelid strips originally relied on double-sided rendering; orient the closed skin outward.
      const indices = object.geometry.getIndex();
      if (indices)
        for (let triangle = 0; triangle < indices.count; triangle += 3) {
          const a = indices.getX(triangle);
          const b = indices.getX(triangle + 1);
          const c = indices.getX(triangle + 2);
          const x1 =
            positions.getX(b) +
            deltas.getX(b) -
            positions.getX(a) -
            deltas.getX(a);
          const y1 =
            positions.getY(b) +
            deltas.getY(b) -
            positions.getY(a) -
            deltas.getY(a);
          const x2 =
            positions.getX(c) +
            deltas.getX(c) -
            positions.getX(a) -
            deltas.getX(a);
          const y2 =
            positions.getY(c) +
            deltas.getY(c) -
            positions.getY(a) -
            deltas.getY(a);
          if (x1 * y2 - y1 * x2 < 0) {
            indices.setX(triangle + 1, c);
            indices.setX(triangle + 2, b);
          }
        }
      if (indices) indices.needsUpdate = true;
    }
    object.geometry.computeBoundingBox();
    object.geometry.computeBoundingSphere();
  });

  // Back and front share the same boundary depth, avoiding overlap at the ears and jaw.
  for (let vertex = 0; vertex < backPositions.count; vertex++) {
    const x = backPositions.getX(vertex);
    const y = backPositions.getY(vertex);
    const row = rowAt(rows, y);
    const q = clamp(
      (x - (row.left + row.right) / 2) /
        Math.max(0.01, (row.right - row.left) / 2),
      -1,
      1,
    );
    const blend = Math.acos(q) / Math.PI;
    const boundary = THREE.MathUtils.lerp(
      depth(row.right, y),
      depth(row.left, y),
      blend,
    );
    const radius = Math.min(
      y < chinY ? 0.3 : 0.6,
      (row.right - row.left) * 0.41,
    );
    backPositions.setZ(
      vertex,
      boundary - Math.sqrt(Math.max(0, 1 - q * q)) * radius,
    );
  }
  backPositions.needsUpdate = true;
  back.geometry.computeVertexNormals();
  back.geometry.computeBoundingBox();
  back.geometry.computeBoundingSphere();

  // Smooth sampled edge colors along the profile instead of exposing individual photo scanlines.
  const colors = back.geometry.getAttribute("color") as
    THREE.BufferAttribute | undefined;
  if (colors) {
    const original = colors.clone();
    const stride = backPositions.count / rows.length;
    if (Number.isInteger(stride))
      for (let vertex = 0; vertex < colors.count; vertex++) {
        const row = Math.floor(vertex / stride);
        const column = vertex % stride;
        let red = 0;
        let green = 0;
        let blue = 0;
        let weight = 0;
        for (let offset = -3; offset <= 3; offset++) {
          const target =
            clamp(row + offset, 0, rows.length - 1) * stride + column;
          const amount = Math.exp((-offset * offset) / 4);
          red += original.getX(target) * amount;
          green += original.getY(target) * amount;
          blue += original.getZ(target) * amount;
          weight += amount;
        }
        const hair = backPositions.getY(vertex) > eyeY + spacing * 0.55;
        colors.setXYZ(
          vertex,
          Math.min(red / weight, hair ? 0.065 : 1),
          Math.min(green / weight, hair ? 0.05 : 1),
          Math.min(blue / weight, hair ? 0.04 : 1),
        );
      }
    colors.needsUpdate = true;
  }
  group.userData.avatarSurfaceRevision = AVATAR_SURFACE_REVISION;
};
