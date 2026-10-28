import { useEffect, useRef, useState } from "react";
import { createSculptureScene } from "@/components/portfolio/sculptureScene";
import type {
  SculptureControls,
  SculptureRendering,
} from "@/components/portfolio/types";

export const useSculpture = (
  controls: SculptureControls,
): { rendering: SculptureRendering } => {
  // State & references
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef(controls);
  const requestRenderRef = useRef<() => void>(() => {});
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    controlsRef.current = controls;
    requestRenderRef.current();
  }, [controls]);

  // Renderer lifecycle
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let scene: ReturnType<typeof createSculptureScene>;
    try {
      scene = createSculptureScene(canvas);
    } catch {
      return;
    }
    let mounted = true;
    let loaded = false;
    let frame = 0;
    let visible = true;
    let last = 0;
    let time = 1;
    const draw = (now: number) => {
      frame = 0;
      if (!loaded || !visible || document.hidden) {
        last = 0;
        return;
      }
      const { paused, reducedMotion, finish } = controlsRef.current;
      const delta = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      if (!paused && !reducedMotion) time += delta;
      scene.render(time, finish);
      if (!paused && !reducedMotion) frame = requestAnimationFrame(draw);
    };
    const requestRender = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    requestRenderRef.current = requestRender;
    const afterReady = () => {
      if (mounted) { loaded = true; setAvailable(true); requestRender(); }
    };
    if (scene.ready) void scene.ready.then(afterReady).catch(() => { if (mounted) setAvailable(false); });
    else afterReady();
    const resize = () => {
      scene.resize();
      requestRender();
    };
    const onVisibility = () => {
      last = 0;
      requestRender();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        last = 0;
        requestRender();
      }
    });
    const resizeObserver = new ResizeObserver(resize);
    observer.observe(canvas);
    resizeObserver.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);
    requestRender();

    return () => {
      mounted = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      requestRenderRef.current = () => {};
      scene.dispose();
    };
  }, []);

  return { rendering: { canvasRef, available } };
};
