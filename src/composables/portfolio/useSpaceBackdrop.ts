import { useEffect, useRef } from "react";
import type {
  SpaceBackdropControls,
  SpacePointer,
  SpaceStar,
  SpaceViewport,
} from "@/components/portfolio/space/types";

// Scene data
const createStars = (count: number): SpaceStar[] => {
  let seed = 18427;
  const random = (): number => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  return Array.from({ length: count }, () => ({
    x: random(),
    y: random(),
    depth: 0.25 + random() * 0.75,
    radius: 0.35 + random() * 0.75,
    opacity: 0.13 + random() * 0.26,
    phase: random() * Math.PI * 2,
    speed: 0.1 + random() * 0.3,
  }));
};

// The broad, soft light is painted once per resize, then composited cheaply.
const createAurora = (viewport: SpaceViewport): HTMLCanvasElement | null => {
  const surface = document.createElement("canvas");
  surface.width = Math.min(1200, Math.ceil(viewport.width * 0.65));
  surface.height = Math.min(800, Math.ceil(viewport.height * 0.65));
  const context = surface.getContext("2d");
  if (!context) return null;

  const { width, height } = surface;
  const radius = Math.max(width, height) * 0.7;
  const indigo = context.createRadialGradient(
    width * 0.88, height * 0.1, 0,
    width * 0.88, height * 0.1, radius,
  );
  indigo.addColorStop(0, "rgba(89, 87, 195, 0.12)");
  indigo.addColorStop(0.45, "rgba(56, 74, 145, 0.045)");
  indigo.addColorStop(1, "rgba(56, 74, 145, 0)");
  context.fillStyle = indigo;
  context.fillRect(0, 0, width, height);

  const cyan = context.createRadialGradient(
    width * 0.04, height * 0.8, 0,
    width * 0.04, height * 0.8, radius * 0.7,
  );
  cyan.addColorStop(0, "rgba(80, 151, 181, 0.065)");
  cyan.addColorStop(0.55, "rgba(46, 86, 119, 0.02)");
  cyan.addColorStop(1, "rgba(46, 86, 119, 0)");
  context.fillStyle = cyan;
  context.fillRect(0, 0, width, height);
  return surface;
};

export const useSpaceBackdrop = (): SpaceBackdropControls => {
  // References
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Renderer lifecycle
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let context: CanvasRenderingContext2D | null;
    try {
      context = canvas.getContext("2d", { alpha: true, desynchronized: true });
    } catch {
      return;
    }
    if (!context) return;
    const drawingContext = context;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    const viewport: SpaceViewport = { width: 1, height: 1, ratio: 1, compact: false };
    const pointer: SpacePointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let stars: SpaceStar[] = [];
    let aurora: HTMLCanvasElement | null = null;
    let animationFrame = 0;
    let lastFrame = 0;
    let elapsed = 0;
    const frameInterval = 1000 / 30;

    // Painting
    const paint = (): void => {
      const { width, height, compact } = viewport;
      drawingContext.clearRect(0, 0, width, height);
      drawingContext.globalAlpha = 1;

      if (aurora) {
        const driftX = Math.sin(elapsed * 0.025) * 12 + pointer.x * 3;
        const driftY = Math.cos(elapsed * 0.018) * 8 + pointer.y * 3;
        drawingContext.drawImage(aurora, -18 + driftX, -14 + driftY, width + 36, height + 28);
      }

      drawingContext.fillStyle = "#d5e2ff";
      stars.forEach((star) => {
        const depth = star.depth;
        const x = ((star.x * width + elapsed * star.speed * depth) % width) + pointer.x * depth * 8;
        const y = star.y * height + Math.sin(elapsed * 0.045 + star.phase) * depth * 2 + pointer.y * depth * 6;
        drawingContext.globalAlpha = star.opacity * (0.9 + Math.sin(elapsed * 0.22 + star.phase) * 0.1);
        drawingContext.beginPath();
        drawingContext.arc(x, y, star.radius, 0, Math.PI * 2);
        drawingContext.fill();
      });

      drawingContext.globalAlpha = 1;
      drawingContext.lineWidth = 0.65;
      drawingContext.strokeStyle = "rgba(146, 166, 241, 0.065)";
      drawingContext.beginPath();
      drawingContext.ellipse(width * 0.91 + pointer.x * 5, height * 0.29, width * 0.32, height * 0.22, -0.35, 0, Math.PI * 2);
      drawingContext.stroke();
      if (!compact) {
        drawingContext.strokeStyle = "rgba(139, 216, 243, 0.035)";
        drawingContext.beginPath();
        drawingContext.ellipse(width * 0.83, height * 0.31 + pointer.y * 3, width * 0.35, height * 0.29, -0.42, 0, Math.PI * 2);
        drawingContext.stroke();
      }
    };

    // Motion scheduling; no painting above 30 frames per second.
    const tick = (now: number): void => {
      animationFrame = 0;
      if (document.hidden || reducedMotion.matches) return;
      const delta = now - lastFrame;
      if (!lastFrame || delta >= frameInterval) {
        const seconds = lastFrame ? Math.min(delta / 1000, 0.06) : 0;
        elapsed += seconds;
        const smoothing = 1 - Math.exp(-seconds * 3);
        pointer.x += (pointer.targetX - pointer.x) * smoothing;
        pointer.y += (pointer.targetY - pointer.y) * smoothing;
        lastFrame = now;
        paint();
      }
      animationFrame = requestAnimationFrame(tick);
    };
    const stop = (): void => {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      lastFrame = 0;
    };
    const start = (): void => {
      if (!animationFrame && !document.hidden && !reducedMotion.matches) {
        if (!lastFrame) lastFrame = performance.now();
        animationFrame = requestAnimationFrame(tick);
      }
    };

    // Viewport and preferences
    const resize = (): void => {
      const bounds = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(bounds.width));
      const height = Math.max(1, Math.round(bounds.height));
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5, 2400 / width, 1600 / height);
      if (viewport.width === width && viewport.height === height && viewport.ratio === ratio && stars.length) return;
      Object.assign(viewport, { width, height, ratio, compact: width <= 640 });
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      drawingContext.setTransform(ratio, 0, 0, ratio, 0, 0);
      stars = createStars(viewport.compact ? 44 : Math.min(118, Math.max(64, Math.round(width * height / 14000))));
      aurora = createAurora(viewport);
      if (!document.hidden) {
        paint();
        lastFrame = performance.now();
      }
      start();
    };
    const resetPointer = (): void => {
      pointer.targetX = 0;
      pointer.targetY = 0;
    };
    const onPointerMove = (event: PointerEvent): void => {
      if (reducedMotion.matches || !finePointer.matches || event.pointerType === "touch") return;
      pointer.targetX = Math.max(-0.5, Math.min(0.5, event.clientX / viewport.width - 0.5));
      pointer.targetY = Math.max(-0.5, Math.min(0.5, event.clientY / viewport.height - 0.5));
    };
    const onVisibility = (): void => {
      if (document.hidden) stop();
      else if (reducedMotion.matches) paint();
      else start();
    };
    const onMotionPreference = (): void => {
      stop();
      resetPointer();
      pointer.x = 0;
      pointer.y = 0;
      if (!document.hidden) paint();
      start();
    };

    // Event bindings
    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
    resizeObserver?.observe(canvas);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", resetPointer, { passive: true });
    window.addEventListener("blur", resetPointer);
    document.addEventListener("visibilitychange", onVisibility);
    reducedMotion.addEventListener("change", onMotionPreference);
    resize();

    // Disposal
    return () => {
      stop();
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", resetPointer);
      window.removeEventListener("blur", resetPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotion.removeEventListener("change", onMotionPreference);
      aurora = null;
      stars = [];
    };
  }, []);

  // Public API
  return { rendering: { canvasRef } };
};
