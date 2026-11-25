import { memo, useLayoutEffect, useRef, useState } from "react";
import type { Locale } from "../types";
import { JourneyPainter } from "./drawFlow";
import { clamp, visualTime } from "./flowScenes";
import { LaptopScreen, CartAssembly, MenuAssembly } from "./StudioScreens";

const Laptop = memo(LaptopScreen);
const Cart = memo(CartAssembly);
const Menu = memo(MenuAssembly);
// The models share a raster surface. The HTML inside each display stays at native resolution.
const maxCanvasPixels = 2560 * 1440;

// A separate viewport clip for each nearer device preserves overlaps during the camera move.
function ScreenLayer({ children }: { children: React.ReactNode }) {
  return (
    <div className="device-layer">
      <div className="device-mask">
        <div className="device-mask">
          <div className="device-mask">{children}</div>
        </div>
      </div>
    </div>
  );
}
export function FlowMap({
  progress,
  reduced,
  locale,
}: {
  progress: number;
  reduced: boolean;
  locale: Locale;
}) {
  const surface = useRef<HTMLCanvasElement>(null),
    laptop = useRef<HTMLDivElement>(null),
    monitor = useRef<HTMLDivElement>(null),
    phone = useRef<HTMLDivElement>(null),
    proof = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0, dpr: 1 });
  const t = visualTime(progress, reduced);
  useLayoutEffect(() => {
    const el = surface.current;
    if (!el) return;
    const measure = () => {
      const bounds = el.getBoundingClientRect(),
        width = Math.round(bounds.width),
        height = Math.round(bounds.height);
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2,
        Math.sqrt(maxCanvasPixels / Math.max(1, width * height)),
      );
      setSize((prev) =>
        prev.width === width && prev.height === height && prev.dpr === dpr
          ? prev
          : { width, height, dpr },
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  const painter = useRef<JourneyPainter | null>(null);
  useLayoutEffect(() => {
    const canvas = surface.current,
      ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx || !size.width || !size.height) return;
    canvas.width = Math.round(size.width * size.dpr);
    canvas.height = Math.round(size.height * size.dpr);
    ctx.setTransform(
      canvas.width / size.width,
      0,
      0,
      canvas.height / size.height,
      0,
      0,
    );
    painter.current = new JourneyPainter(ctx, size.width, size.height);
    return () => {
      painter.current = null;
    };
  }, [size]);
  useLayoutEffect(() => {
    if (laptop.current && monitor.current && phone.current && proof.current)
      painter.current?.draw(t, {
        laptop: laptop.current,
        monitor: monitor.current,
        phone: phone.current,
        proof: proof.current,
      });
  }, [t, size, locale]);
  return (
    <figure className="journey-world" aria-hidden="true">
      <canvas ref={surface} className="journey-canvas" />
      <div className="journey-panels">
        <ScreenLayer>
          <div ref={laptop} className="journey-display laptop-display">
            <Laptop t={t < 0.84 ? Math.min(0.239, t) : t} locale={locale} />
          </div>
        </ScreenLayer>
        <ScreenLayer>
          <div ref={monitor} className="journey-display monitor-display">
            <Cart t={clamp(t, 0.385, 0.535)} />
          </div>
        </ScreenLayer>
        <ScreenLayer>
          <div ref={proof} className="journey-display proof-display">
            <Menu t={clamp(t, 0.655, 0.816)} />
          </div>
        </ScreenLayer>
        <ScreenLayer>
          <div ref={phone} className="journey-display phone-display">
            <Menu t={clamp(t, 0.655, 0.816)} />
          </div>
        </ScreenLayer>
      </div>
    </figure>
  );
}
