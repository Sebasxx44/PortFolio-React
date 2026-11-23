import { useLayoutEffect, useRef, useState } from "react";
import type { Locale } from "../types";
import { JourneyPainter } from "./drawFlow";
import { visualTime } from "./flowScenes";
import { LaptopScreen, CartAssembly, MenuAssembly } from "./StudioScreens";

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
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
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
            <LaptopScreen t={t} locale={locale} />
          </div>
        </ScreenLayer>
        <ScreenLayer>
          <div ref={monitor} className="journey-display monitor-display">
            <CartAssembly t={t} />
          </div>
        </ScreenLayer>
        <ScreenLayer>
          <div ref={proof} className="journey-display proof-display">
            <MenuAssembly t={t} />
          </div>
        </ScreenLayer>
        <ScreenLayer>
          <div ref={phone} className="journey-display phone-display">
            <MenuAssembly t={t} />
          </div>
        </ScreenLayer>
      </div>
    </figure>
  );
}
