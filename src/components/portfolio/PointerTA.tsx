import { useEffect, useRef } from "react";

export function PointerTA() {
  const ring = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = ring.current;
    if (!element) return;
    const available = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    let x = 0,
      y = 0,
      toX = 0,
      toY = 0,
      frame = 0;
    let visible = false;
    let preview: HTMLElement | null = null;
    function releasePreview() {
      preview?.style.removeProperty("--look-x");
      preview?.style.removeProperty("--look-y");
      preview = null;
    }
    function hide() {
      visible = false;
      element!.classList.remove("is-visible", "over-control");
      cancelAnimationFrame(frame);
      frame = 0;
      releasePreview();
    }
    function render() {
      x += (toX - x) * 0.34;
      y += (toY - y) * 0.34;
      element!.style.transform =
        "translate3d(" + x.toFixed(2) + "px," + y.toFixed(2) + "px,0)";
      frame =
        Math.abs(toX - x) + Math.abs(toY - y) > 0.3
          ? requestAnimationFrame(render)
          : 0;
    }
    function point(event: PointerEvent) {
      if (
        event.pointerType !== "mouse" ||
        !available.matches ||
        !(event.target instanceof Element)
      )
        return;
      toX = event.clientX;
      toY = event.clientY;
      if (!visible) {
        x = toX;
        y = toY;
        visible = true;
      }
      element!.classList.add("is-visible");
      element!.classList.toggle(
        "over-control",
        Boolean(event.target.closest("a,button,select,summary")),
      );
      const next = event.target.closest<HTMLElement>(".feature-media");
      if (next !== preview) {
        releasePreview();
        preview = next;
      }
      if (preview) {
        const box = preview.getBoundingClientRect();
        preview.style.setProperty(
          "--look-x",
          (((toX - box.left) / box.width) * 6 - 3).toFixed(2) + "px",
        );
        preview.style.setProperty(
          "--look-y",
          (((toY - box.top) / box.height) * 6 - 3).toFixed(2) + "px",
        );
      }
      if (!frame) frame = requestAnimationFrame(render);
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Tab") hide();
    };
    function listen() {
      document.removeEventListener("pointermove", point);
      hide();
      if (available.matches)
        document.addEventListener("pointermove", point, { passive: true });
    }
    listen();
    available.addEventListener("change", listen);
    document.documentElement.addEventListener("pointerleave", hide);
    document.addEventListener("visibilitychange", hide);
    document.addEventListener("keydown", onKey);
    window.addEventListener("blur", hide);
    window.addEventListener("scroll", hide, { passive: true });
    return () => {
      hide();
      document.removeEventListener("pointermove", point);
      available.removeEventListener("change", listen);
      document.documentElement.removeEventListener("pointerleave", hide);
      document.removeEventListener("visibilitychange", hide);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("blur", hide);
      window.removeEventListener("scroll", hide);
    };
  }, []);
  return <span className="pointer-halo" aria-hidden="true" ref={ring} />;
}
