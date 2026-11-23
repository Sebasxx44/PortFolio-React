import { PerspectiveCamera, Vector3 } from "three";
import { models, type Model } from "./flowModels";
import {
  cameraPath,
  caseTrace,
  phoneSurface,
  proofSurface,
  FOV,
  laptopSurface,
  sketchPath,
  point,
  monitorSurface,
  layoutPath,
  penState,
  type Surface,
} from "./flowWorld";
import {
  clamp,
  interval,
  smooth,
  exteriorTime,
  galleryPosition,
  immersion,
} from "./flowScenes";

interface Pixel {
  x: number;
  y: number;
  z: number;
}
interface Displays {
  laptop: HTMLElement;
  monitor: HTMLElement;
  phone: HTMLElement;
  proof: HTMLElement;
}
function frameHull(
  surface: Surface,
  marginX: number,
  marginY: number,
  radius: number,
  depth: number,
) {
  const [a, b, , d] = surface.corners,
    u = b.clone().sub(a),
    v = a.clone().sub(d);
  const w = u.length() / 2 + marginX,
    h = v.length() / 2 + marginY,
    center = a.clone().add(surface.corners[2]).multiplyScalar(0.5);
  u.normalize();
  v.normalize();
  const ring = [
    [-w + radius, h],
    [w - radius, h],
    [w, h - radius],
    [w, -h + radius],
    [w - radius, -h],
    [-w + radius, -h],
    [-w, -h + radius],
    [-w, h - radius],
  ];
  const vertices = [-0.008, -depth].flatMap((z) =>
    ring.map(([x, y]) =>
      center
        .clone()
        .addScaledVector(u, x)
        .addScaledVector(v, y)
        .addScaledVector(surface.normal, z),
    ),
  );
  return { surface, center, vertices };
}
const devices = {
  laptop: frameHull(laptopSurface, 0.16, 0.155, 0.085, 0.145),
  monitor: frameHull(monitorSurface, 0.105, 0.11, 0.12, 0.199),
  proof: frameHull(proofSurface, 0.105, 0.11, 0.12, 0.199),
  phone: frameHull(phoneSurface, 0.095, 0.115, 0.16, 0.218),
};
const deviceKeys = Object.keys(devices) as (keyof typeof devices)[];
function convexOutline(pts: Pixel[]) {
  const sorted = [...pts].sort((a, b) => a.x - b.x || a.y - b.y);
  const cross = (a: Pixel, b: Pixel, c: Pixel) =>
    (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  const half = (order: Pixel[]) => {
    const result: Pixel[] = [];
    for (const p of order) {
      while (
        result.length > 1 &&
        cross(result[result.length - 2], result[result.length - 1], p) <= 0
      )
        result.pop();
      result.push(p);
    }
    result.pop();
    return result;
  };
  return [...half(sorted), ...half(sorted.reverse())];
}
const paths = [sketchPath, layoutPath].map((path) => ({
  path,
  points: path.getSpacedPoints(96),
}));
const scratch = new Vector3();
const near = 0.12;
const floorPoints = Array.from({ length: 34 }, (_, x) =>
  Array.from({ length: 30 }, (_, z) =>
    point(-15 + 1.4 * x, -0.016, -24 + 1.4 * z),
  ),
);
const floorMarks: Vector3[][] = [];
for (let x = -12; x < 27; x += 4.2)
  for (let z = -19; z < 11; z += 4.2) {
    floorMarks.push([
      point(x, 0, z),
      point(x - 0.07, 0, z),
      point(x + 0.07, 0, z),
      point(x, 0, z - 0.07),
      point(x, 0, z + 0.07),
    ]);
  }

export class JourneyPainter {
  private cam: PerspectiveCamera;
  private pose: ReturnType<typeof cameraPath>;
  private scale: number;
  private projected = new Map<Vector3, Pixel>();
  private backdrop: HTMLCanvasElement[];
  constructor(
    private ctx: CanvasRenderingContext2D,
    private width: number,
    private height: number,
  ) {
    this.cam = new PerspectiveCamera(FOV, width / height, 0.05, 180);
    this.pose = cameraPath(width / height);
    this.scale = height / (2 * Math.tan((FOV * Math.PI) / 360));
    this.backdrop = [
      ["#171323", "#763b64", "#583f91", "#263f58"],
      ["#101323", "#4b4288", "#305e7d", "#853e83"],
      ["#211926", "#7b4a42", "#694571", "#696044"],
    ].map(([base, left, right, near]) => {
      const tile = document.createElement("canvas");
      tile.width = 440;
      tile.height = 280;
      const canvas = tile.getContext("2d")!;
      canvas.fillStyle = base;
      canvas.fillRect(0, 0, 440, 280);
      for (const [x, y, r, color] of [
        [160, 105, 240, left],
        [399, 32, 184, right],
        [42, 266, 203, near],
      ] as const) {
        const light = canvas.createRadialGradient(x, y, 0, x, y, r);
        light.addColorStop(0, color);
        light.addColorStop(1, color + "00");
        canvas.fillStyle = light;
        canvas.fillRect(0, 0, 440, 280);
      }
      return tile;
    });
  }
  private project(p: Vector3): Pixel {
    const remembered = this.projected.get(p);
    if (remembered) return remembered;
    const e = this.cam.matrixWorldInverse.elements,
      x = p.x,
      y = p.y,
      z = p.z;
    const depth = -(e[2] * x + e[6] * y + e[10] * z + e[14]);
    const k = this.scale / Math.max(depth, 0.0001);
    const pixel = {
      x: this.width * 0.5 + (e[0] * x + e[4] * y + e[8] * z + e[12]) * k,
      y: this.height * 0.455 - (e[1] * x + e[5] * y + e[9] * z + e[13]) * k,
      z: depth,
    };
    this.projected.set(p, pixel);
    return pixel;
  }
  private stroke(a: Pixel, b: Pixel, color: string, width: number) {
    if (
      a.z < near ||
      b.z < near ||
      Math.max(a.x, b.x) < -20 ||
      Math.min(a.x, b.x) > this.width + 20 ||
      Math.max(a.y, b.y) < -20 ||
      Math.min(a.y, b.y) > this.height + 20
    )
      return;
    const c = this.ctx;
    c.beginPath();
    c.moveTo(a.x, a.y);
    c.lineTo(b.x, b.y);
    c.strokeStyle = color;
    c.lineWidth = width;
    c.stroke();
  }
  private floor(t: number, gallery: number) {
    const { ctx: c, width: w, height: h } = this;
    const early =
      smooth(interval(t, 0.225, 0.42)) + smooth(interval(t, 0.566, 0.7));
    const mood =
      t < 0.805 ? early : 2 * (1 - smooth(interval(t, 0.805, 0.887))) + gallery;
    const a = Math.floor(clamp(mood, 0, 2)),
      b = Math.min(2, a + 1);
    c.drawImage(this.backdrop[a], 0, 0, w, h);
    if (a !== b) {
      c.globalAlpha = clamp(mood - a);
      c.drawImage(this.backdrop[b], 0, 0, w, h);
      c.globalAlpha = 1;
    }
    c.lineCap = "butt";
    // Short segments give the measuring grid a gradual falloff in depth.
    for (let x = 0; x < floorPoints.length - 1; x++) {
      const row = floorPoints[x];
      for (let z = 0; z < row.length - 1; z++) {
        const a = this.project(row[z]);
        if (a.z < 0.5 || a.z > 45) continue;
        const alpha = 0.135 * clamp((40 - a.z) / 34, 0.05, 1);
        const color = "rgba(201,181,234," + alpha.toFixed(3) + ")";
        this.stroke(a, this.project(floorPoints[x + 1][z]), color, 0.72);
        this.stroke(a, this.project(row[z + 1]), color, 0.72);
      }
    }
    for (const [center, left, right, back, front] of floorMarks) {
      const a = this.project(center);
      if (a.z < 0.65 || a.z > 26) continue;
      const color =
        "rgba(241,206,219," + (0.28 * clamp((27 - a.z) / 22)).toFixed(3) + ")";
      this.stroke(this.project(left), this.project(right), color, 1);
      this.stroke(this.project(back), this.project(front), color, 1);
    }
  }
  private shadow(model: Model) {
    const c = this.ctx;
    const [rx, rz] = model.footprint;
    const { x, z } = model.center;
    const pts = Array.from({ length: 20 }, (_, i) => {
      const a = (i * Math.PI) / 10;
      return this.project(
        point(x + rx * Math.cos(a), 0.004, z + rz * Math.sin(a)),
      );
    });
    if (pts.some((p) => p.z < 0.23)) return;
    const xs = pts.map((p) => p.x),
      ys = pts.map((p) => p.y);
    const l = Math.min(...xs),
      r = Math.max(...xs),
      top = Math.min(...ys),
      b = Math.max(...ys);
    if (r < 0 || l > this.width || b < 0 || top > this.height) return;
    c.save();
    c.translate((l + r) / 2, (top + b) / 2);
    c.scale(Math.max(1, (r - l) * 0.58), Math.max(1, (b - top) * 0.65));
    const g = c.createRadialGradient(0, 0, 0, 0, 0, 1);
    g.addColorStop(0, "#080615d9");
    g.addColorStop(0.59, "#0b081cab");
    g.addColorStop(1, "#0b081c00");
    c.fillStyle = g;
    c.fillRect(-1, -1, 2, 2);
    c.restore();
  }
  private wire(points: Vector3[], style: string, meters: number, limit = 15) {
    const c = this.ctx;
    c.lineCap = "round";
    let a = this.project(points[0]);
    for (let i = 1; i < points.length; i++) {
      const b = this.project(points[i]),
        z = (a.z + b.z) / 2;
      this.stroke(
        a,
        b,
        style,
        clamp((this.scale * meters) / Math.max(0.3, z), 0.55, limit),
      );
      a = b;
    }
  }
  private guides(t: number) {
    const c = this.ctx;
    for (const [i, guide] of paths.entries()) {
      const color = i === 0 ? "#e79ae5" : "#f3c17b";
      this.wire(guide.points, "#251d3a", 0.056, 14);
      this.wire(guide.points, i === 0 ? "#976aa4" : "#a58785", 0.031, 7);
      const end = Math.round(
        smooth(
          i === 0 ? interval(t, 0.281, 0.435) : interval(t, 0.574, 0.651),
        ) *
          (guide.points.length - 1),
      );
      if (end > 0) this.wire(guide.points.slice(0, end + 1), color, 0.025, 6);
      for (const along of [0.17, 0.54, 0.8]) {
        const mid = guide.path.getPointAt(along),
          tan = guide.path.getTangentAt(along),
          p = this.project(mid);
        if (
          p.z < 0.35 ||
          p.x < -40 ||
          p.x > this.width + 40 ||
          p.y < -30 ||
          p.y > this.height + 30
        )
          continue;
        const size = clamp((0.045 * this.scale) / p.z, 2, 13);
        for (const sign of [-1, 1]) {
          const h = this.project(mid.clone().addScaledVector(tan, 0.39 * sign));
          if (h.z < 0.35) continue;
          this.stroke(p, h, color, 1);
          c.beginPath();
          c.arc(h.x, h.y, size * 0.48, 0, Math.PI * 2);
          c.fillStyle = "#392c4e";
          c.fill();
          c.strokeStyle = color;
          c.lineWidth = 1.2;
          c.stroke();
        }
        c.fillStyle = "#31283f";
        c.fillRect(
          p.x - size * 0.68,
          p.y - size * 0.68,
          size * 1.36,
          size * 1.36,
        );
        c.lineWidth = 1.3;
        c.strokeStyle = color;
        c.strokeRect(
          p.x - size * 0.68,
          p.y - size * 0.68,
          size * 1.36,
          size * 1.36,
        );
      }
    }
  }
  private model(model: Model) {
    const c = this.ctx,
      eye = this.cam.position;
    for (const mesh of model.meshes) {
      for (const f of mesh.faces) {
        const world = f.vertices;
        if (f.normal.dot(scratch.subVectors(eye, world[0])) <= 0) continue;
        const pts = world.map((p) => this.project(p));
        if (
          pts.some((p) => p.z < near) ||
          pts.every((p) => p.x < 0) ||
          pts.every((p) => p.x > this.width) ||
          pts.every((p) => p.y < 0) ||
          pts.every((p) => p.y > this.height)
        )
          continue;
        c.beginPath();
        c.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) c.lineTo(pts[i].x, pts[i].y);
        c.closePath();
        c.fillStyle = f.fill;
        c.fill();
        // A hairline in the face color closes antialiasing seams between metal facets.
        c.strokeStyle = f.edge || f.fill;
        c.lineWidth = f.edge ? 0.78 : 0.55;
        c.lineJoin = "round";
        c.stroke();
      }
    }
  }
  private cursor(state: NonNullable<ReturnType<typeof penState>>) {
    const c = this.ctx,
      main = state.returning
        ? "#ffe28b"
        : state.path === layoutPath
          ? "#ffc377"
          : "#ef9dfa";
    const direction = state.returning ? -1 : 1;
    const tail = Array.from({ length: 17 }, (_, i) =>
      state.path.getPointAt(clamp(state.along - (16 - i) * 0.0045 * direction)),
    );
    this.wire(tail, main + "8f", 0.071, 13);
    this.wire(tail.slice(7), "#fff2ff", 0.024, 6);
    const p = this.project(state.path.getPointAt(state.along));
    if (p.z < near) return;
    const r = clamp((0.078 * this.scale) / p.z, 4, 23);
    const halo = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
    halo.addColorStop(0, main + "ab");
    halo.addColorStop(1, main + "00");
    c.fillStyle = halo;
    c.fillRect(p.x - r * 4, p.y - r * 4, r * 8, r * 8);
    c.save();
    c.translate(p.x, p.y);
    c.scale(r / 11, r / 11);
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(5.2, 23);
    c.lineTo(10.4, 15.4);
    c.lineTo(16, 22.1);
    c.lineTo(19.7, 19.1);
    c.lineTo(14.4, 12.4);
    c.lineTo(22.5, 10);
    c.closePath();
    c.lineWidth = 2;
    c.lineJoin = "round";
    c.strokeStyle = "#321c40";
    c.fillStyle = main;
    c.fill();
    c.stroke();
    c.restore();
  }
  private display(el: HTMLElement, s: Surface, entry: number) {
    // Keep the same DOM on the glass and inside it. The perspective quad opens to the viewport
    // while the design surface reflows at its native resolution.
    const flatten = smooth(interval(entry, 0.22, 1));
    const screenW = Math.min(this.width, 1440);
    const screenH = (screenW * this.height) / this.width;
    const W = s.width + (screenW - s.width) * flatten;
    const H = s.height + (screenH - s.height) * flatten;
    el.style.width = W + "px";
    el.style.height = H + "px";
    el.style.setProperty("--dive", String(flatten));
    if (s === phoneSurface) el.style.borderRadius = 23 * (1 - flatten) + "px";
    const pts = s.corners.map((v, i) => {
      const p = this.project(v);
      if (!entry) return p;
      const x = i === 1 || i === 2 ? this.width : 0;
      const y = i >= 2 ? this.height : 0;
      return {
        x: p.x + (x - p.x) * flatten,
        y: p.y + (y - p.y) * flatten,
        z: p.z,
      };
    });
    if (
      s.normal.dot(scratch.subVectors(this.cam.position, s.corners[0])) <= 0 ||
      pts.some((p) => p.z < near) ||
      pts.every((p) => p.x < 0) ||
      pts.every((p) => p.x > this.width) ||
      pts.every((p) => p.y < 0) ||
      pts.every((p) => p.y > this.height)
    ) {
      el.style.visibility = "hidden";
      return;
    }
    const [a, b, c, d] = pts,
      dx1 = b.x - c.x,
      dx2 = d.x - c.x,
      dx3 = a.x - b.x + c.x - d.x,
      dy1 = b.y - c.y,
      dy2 = d.y - c.y,
      dy3 = a.y - b.y + c.y - d.y;
    const denominator = dx1 * dy2 - dx2 * dy1;
    if (Math.abs(denominator) < 0.001) {
      el.style.visibility = "hidden";
      return;
    }
    const g = (dx3 * dy2 - dx2 * dy3) / denominator,
      h = (dx1 * dy3 - dx3 * dy1) / denominator;
    const matrix = [
      (b.x - a.x + g * b.x) / W,
      (b.y - a.y + g * b.y) / W,
      0,
      g / W,
      (d.x - a.x + h * d.x) / H,
      (d.y - a.y + h * d.y) / H,
      0,
      h / H,
      0,
      0,
      1,
      0,
      a.x,
      a.y,
      0,
      1,
    ];
    el.style.transform =
      entry === 1 && W === this.width && H === this.height
        ? "none"
        : "matrix3d(" + matrix.join(",") + ")";
    el.style.visibility = "visible";
    el.style.zIndex = String(Math.max(1, Math.round(200 - pts[0].z)));
  }
  private displays(
    elements: Displays,
    active: keyof Displays | null,
    entry: number,
  ) {
    const shells = deviceKeys.map((key) => {
      const device = devices[key],
        pts = device.vertices.map((p) => this.project(p));
      const depth = this.project(device.center).z;
      if (
        pts.some((p) => p.z < near) ||
        pts.every((p) => p.x < 0) ||
        pts.every((p) => p.x > this.width) ||
        pts.every((p) => p.y < 0) ||
        pts.every((p) => p.y > this.height)
      )
        return { key, depth, clip: "" };
      const polygon = convexOutline(pts);
      const outline = polygon
        .map((p) => p.x.toFixed(2) + " " + p.y.toFixed(2))
        .join(" L");
      return {
        key,
        depth,
        clip:
          'path(evenodd,"M0 0 H' +
          this.width +
          " V" +
          this.height +
          " H0 Z M" +
          outline +
          ' Z")',
      };
    });
    for (const item of shells) {
      const screen = elements[item.key];
      this.display(
        screen,
        devices[item.key].surface,
        item.key === active ? entry : 0,
      );
      let parent = screen.parentElement!;
      for (const other of shells) {
        if (other.key === item.key) continue;
        parent.style.clipPath =
          other.depth < item.depth && !(item.key === active && entry > 0.25)
            ? other.clip
            : "";
        parent = parent.parentElement!;
      }
      parent.style.zIndex = String(
        item.key === active && entry > 0.25
          ? 30000
          : Math.max(1, Math.round(20000 - item.depth * 100)),
      );
    }
  }
  draw(progress: number, elements: Displays) {
    this.projected.clear();
    const t = exteriorTime(progress);
    const entry = immersion(progress);
    const device = !entry
      ? null
      : entry.device === "menu"
        ? this.width < this.height
          ? "phone"
          : "proof"
        : entry.device;
    const amount = entry?.amount || 0;
    const { eye, focus } = this.pose(t);
    if (device && amount) {
      const { center, surface } = devices[device];
      const [a, b, , d] = surface.corners;
      const tangent = Math.tan((FOV * Math.PI) / 360);
      const distance =
        (0.97 *
          Math.min(
            a.distanceTo(d),
            (a.distanceTo(b) * this.height) / this.width,
          )) /
        (2 * tangent);
      const close = center.clone().addScaledVector(surface.normal, distance);
      eye.lerp(close, amount);
      focus.lerp(center, amount);
    }
    this.cam.position.copy(eye);
    this.cam.lookAt(focus);
    this.cam.updateMatrixWorld();
    if (amount < 1) {
      this.floor(t, galleryPosition(progress));
      for (const model of models) this.shadow(model);
      this.guides(t);
      const state = penState(t);
      const visible = models.map((model) => ({
        depth: this.project(model.center).z,
        draw: () => this.model(model),
      }));
      if (state) {
        const pos = state.path.getPointAt(state.along);
        visible.push({
          depth: state.path === caseTrace ? -1 : this.project(pos).z - 0.15,
          draw: () => this.cursor(state),
        });
      }
      visible.sort((a, b) => b.depth - a.depth);
      for (const item of visible) item.draw();
    }
    this.displays(elements, device, amount);
  }
}
