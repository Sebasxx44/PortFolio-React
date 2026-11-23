import { CatmullRomCurve3, Vector3 } from "three";
import { clamp, interval, smooth } from "./flowScenes";

export const point = (x: number, y: number, z: number) => new Vector3(x, y, z);
const up = point(0, 1, 0);
export const lcdCenter = point(0, 1.62, -1.32);
export const lidUp = point(0, 0.98481, -0.17365);
export const lidNormal = point(0, 0.17365, 0.98481);
export const monitor = point(8.45, 0, -4.45);
export const phone = point(13.4, 0, -7.6);
export const FOV = 38;
export function onLid(x: number, y: number, z = 0) {
  return lcdCenter
    .clone()
    .addScaledVector(point(1, 0, 0), x)
    .addScaledVector(lidUp, y)
    .addScaledVector(lidNormal, z);
}
export interface Surface {
  corners: Vector3[];
  normal: Vector3;
  width: number;
  height: number;
}
function surface(
  center: Vector3,
  right: Vector3,
  vertical: Vector3,
  w: number,
  h: number,
  width: number,
  height: number,
): Surface {
  const at = (u: number, v: number) =>
    center
      .clone()
      .addScaledVector(right, (u * w) / 2)
      .addScaledVector(vertical, (v * h) / 2);
  return {
    corners: [at(-1, 1), at(1, 1), at(1, -1), at(-1, -1)],
    normal: right.clone().cross(vertical).normalize(),
    width,
    height,
  };
}
export const laptopSurface = surface(
  onLid(0, 0, 0.075),
  point(1, 0, 0),
  lidUp,
  4.16,
  2.46,
  720,
  426,
);

const horizontal = point(1, 0, 0);
export const monitorCenter = point(monitor.x, 1.94, monitor.z + 0.68);
export const phoneCenter = point(phone.x, 1.82, phone.z + 0.68);
export const proofCenter = point(phone.x - 2.08, 1.14, phone.z - 0.29);
export const monitorSurface = surface(
  monitorCenter,
  horizontal,
  up,
  4.24,
  2.508,
  720,
  426,
);
export const phoneSurface = surface(
  phoneCenter,
  horizontal,
  up,
  1.31,
  (1.31 * 844) / 390,
  390,
  844,
);
export const proofSurface = surface(
  proofCenter,
  horizontal,
  up,
  2.64,
  1.65,
  720,
  450,
);
export const caseTrace = new CatmullRomCurve3([
  onLid(2.08, -1.03, 0.076),
  onLid(2.18, -1.11, 0.077),
  onLid(2.18, -1.28, 0.077),
  point(2.18, 0.37, -0.88),
  point(2.22, 0.345, -0.39),
  point(2.24, 0.345, 0.3),
  point(2.31, 0.27, 0.59),
]);
export const sketchPath = new CatmullRomCurve3([
  caseTrace.getPointAt(1),
  point(2.8, 0.19, 0.59),
  point(3.33, 0.13, 0.83),
  point(4.03, 0.111, 0.61),
  point(4.65, 0.13, 0.14),
  point(5.27, 0.18, 0.28),
  point(5.85, 0.22, -0.14),
  point(6.11, 0.16, -0.84),
  point(6.01, 0.12, -1.7),
  point(6.35, 0.14, -2.31),
  point(6.48, 0.32, -2.98),
  point(6.45, 0.74, -3.77),
]);
export const layoutPath = new CatmullRomCurve3([
  point(10.47, 0.74, -3.77),
  point(10.72, 0.44, -3.6),
  point(10.96, 0.16, -3.82),
  point(11.25, 0.14, -4.18),
  point(11.74, 0.12, -4.27),
  point(12.12, 0.16, -4.7),
  point(12.02, 0.14, -5.3),
  point(12.3, 0.12, -5.87),
  point(12.95, 0.14, -6.13),
  point(13.36, 0.18, -6.38),
  point(13.4, 0.35, -6.88),
]);
// Keep a steady travelling speed between the short eases at each connector.
export function cableProgress(t: number, start: number, end: number) {
  const u = interval(t, start, end);
  return 0.76 * u + 0.24 * smooth(u);
}
export function penState(t: number) {
  if (t < 0.249 || t > 0.814) return null;
  if (t < 0.281)
    return {
      path: caseTrace,
      along: smooth(interval(t, 0.249, 0.281)),
      returning: false,
    };
  if (t < 0.435)
    return {
      path: sketchPath,
      along: cableProgress(t, 0.281, 0.435),
      returning: false,
    };
  if (t < 0.574) return null;
  if (t < 0.651)
    return {
      path: layoutPath,
      along: cableProgress(t, 0.574, 0.651),
      returning: false,
    };
  if (t < 0.731) return null;
  if (t < 0.765)
    return {
      path: layoutPath,
      along: 1 - cableProgress(t, 0.731, 0.765),
      returning: true,
    };
  if (t < 0.806)
    return {
      path: sketchPath,
      along: 1 - cableProgress(t, 0.765, 0.806),
      returning: true,
    };
  return {
    path: caseTrace,
    along: 1 - smooth(interval(t, 0.806, 0.814)),
    returning: true,
  };
}
interface Key {
  t: number;
  eye: Vector3;
  focus: Vector3;
}
function track(keys: Key[], t: number, field: "eye" | "focus") {
  let i = 0;
  while (i < keys.length - 2 && keys[i + 1].t < t) i++;
  const a = keys[i],
    b = keys[i + 1],
    before = keys[Math.max(0, i - 1)],
    after = keys[Math.min(keys.length - 1, i + 2)];
  const step = b.t - a.t,
    u = interval(t, a.t, b.t),
    u2 = u * u,
    u3 = u2 * u;
  const m0 = b[field]
    .clone()
    .sub(before[field])
    .multiplyScalar(step / (b.t - before.t));
  const m1 = after[field]
    .clone()
    .sub(a[field])
    .multiplyScalar(step / (after.t - a.t));
  return a[field]
    .clone()
    .multiplyScalar(2 * u3 - 3 * u2 + 1)
    .addScaledVector(m0, u3 - 2 * u2 + u)
    .addScaledVector(b[field], -2 * u3 + 3 * u2)
    .addScaledVector(m1, u3 - u2);
}

export function cameraPath(aspect: number) {
  const tangent = Math.tan((FOV * Math.PI) / 360);
  const distance = Math.max(
    4.16 / (2 * tangent * aspect * 0.92),
    2.46 / (2 * tangent * 0.66),
  );
  const retreat = clamp(1.22 / aspect - 1, 0, 2.5);
  const near = (side: number, height: number, extra: number) =>
    onLid(side, height, distance + 0.075 + extra);
  const front = onLid(0, 0, 0.075);
  const flight = point(
    -1.18 - retreat * 0.44,
    1.65 + retreat * 0.34,
    2.42 + retreat * 0.74,
  );
  const wire = (n: number) => sketchPath.getPointAt(n);
  const monitorDistance = Math.max(
    4.24 / (2 * tangent * aspect * 0.9),
    2.508 / (2 * tangent * 0.65),
  );
  const monFocus = monitorCenter.clone();
  const monEye = monFocus.clone().add(point(0.49, 0.45, monitorDistance));
  const phoneFocus = phoneCenter
    .clone()
    .add(point(-clamp((aspect - 0.55) * 0.6, 0, 0.57), -0.015, 0));
  const phoneEye = phoneFocus
    .clone()
    .add(point(0.46, 0.56, 6.81 + retreat * 0.17));
  const keys: Key[] = [];
  const put = (t: number, eye: Vector3, focus: Vector3) =>
    keys.push({ t, eye, focus });
  put(
    0,
    point(4.92 + retreat * 0.74, 3.76 + retreat * 1.13, 6.63 + retreat * 4.52),
    point(0.52 - Math.min(0.43, retreat * 0.31), 1.13, -0.72),
  );
  put(
    0.065,
    point(2.7 + retreat * 0.55, 2.67 + retreat * 0.8, 5.17 + retreat * 2.9),
    point(0.09, 1.43, -1.05),
  );
  put(0.134, near(0.11, 0.075, 0.055), front.clone());
  put(0.187, near(0.054, 0.035, 0.04), front.clone());
  put(0.238, near(-0.04, 0.024, 0.02), front.clone());
  put(0.251, near(0.11, 0.032, 0.16), onLid(0.09, -0.03, 0.075));
  put(
    0.297,
    point(2.44, 1.96 + retreat * 0.36, 3.64 + retreat * 1.14),
    point(2.42, 0.45, 0.3),
  );
  put(0.332, wire(0.19).add(flight), wire(0.22));
  put(0.397, wire(0.82).add(flight), wire(0.85));
  put(0.426, wire(0.99).add(flight), wire(1));
  put(
    0.477,
    monEye.clone().add(point(0.57, 0.25, 1.1)),
    monFocus.clone().add(point(-0.13, -0.14, 0)),
  );
  put(0.513, monEye.clone().add(point(0.17, 0.1, 0.12)), monFocus.clone());
  put(0.55, monEye.clone().add(point(-0.2, -0.02, -0.1)), monFocus.clone());
  put(
    0.571,
    monEye.clone().add(point(-0.26, 0.02, -0.04)),
    monFocus.clone().add(point(0.12, -0.04, 0)),
  );
  put(
    0.605,
    point(10.12, 2.52 + retreat * 0.35, 0.08 + retreat * 1.25),
    layoutPath.getPointAt(0.32),
  );
  put(
    0.632,
    point(11.59, 2.26 + retreat * 0.34, -1.89 + retreat * 1.35),
    layoutPath.getPointAt(0.77),
  );
  put(0.674, phoneEye.clone().add(point(0.48, 0.14, 0.4)), phoneFocus.clone());
  put(
    0.708,
    phoneEye.clone().add(point(-0.2, -0.025, -0.05)),
    phoneFocus.clone(),
  );
  put(0.73, phoneEye.clone().add(point(-0.3, 0.06, 0.05)), phoneFocus.clone());
  put(
    0.752,
    point(13.0, 3.11 + retreat * 0.45, -0.7 + retreat * 1.2),
    layoutPath.getPointAt(0.52),
  );
  put(
    0.766,
    point(9.8, 3.62 + retreat * 0.45, 1.38 + retreat * 1.3),
    point(8.65, 1.05, -3.43),
  );
  put(
    0.791,
    point(5.87, 3.53 + retreat * 0.5, 3.76 + retreat * 1.6),
    point(4.27, 0.58, -0.07),
  );
  put(
    0.815,
    point(2.47 + retreat * 0.4, 2.92 + retreat * 0.6, 5.58 + retreat * 1.9),
    point(0.51, 1.23, -0.6),
  );
  put(0.851, near(0.35, 0.16, 0.48), front.clone());
  put(0.9, near(0.16, 0.085, 0.2), front.clone());
  put(0.95, near(-0.05, 0.065, 0.135), front.clone());
  put(1, near(-0.19, 0.045, 0.065), front.clone());
  return (t: number) => {
    const eye = track(keys, t, "eye"),
      focus = track(keys, t, "focus");
    const first =
      smooth(interval(t, 0.283, 0.312)) *
      (1 - smooth(interval(t, 0.417, 0.453)));
    const second =
      smooth(interval(t, 0.571, 0.594)) *
      (1 - smooth(interval(t, 0.633, 0.661)));
    if (first > 0 || second > 0) {
      const path = first > 0 ? sketchPath : layoutPath;
      const along =
        first > 0
          ? cableProgress(t, 0.281, 0.435)
          : cableProgress(t, 0.574, 0.651);
      const tip = path.getPointAt(along);
      const drift = Math.sin(along * Math.PI);
      const offset = flight
        .clone()
        .add(
          point(drift * (first > 0 ? 0.2 : 0.42), drift * 0.23, drift * 0.13),
        );
      const ahead = path.getPointAt(Math.min(1, along + 0.055));
      eye.lerp(tip.clone().add(offset), first + second);
      focus.lerp(
        tip
          .clone()
          .lerp(ahead, 0.46)
          .add(point(0, 0.15, 0)),
        first + second,
      );
    }
    return { eye, focus };
  };
}
