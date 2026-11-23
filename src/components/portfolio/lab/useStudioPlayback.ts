import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import { duration, sceneAt } from "./studioTimeline";

type Playback = "idle" | "playing" | "paused" | "complete";
interface Controls {
  toggle(): void;
  back(): void;
  skip(): void;
}

export function useStudioPlayback(
  region: RefObject<HTMLElement | null>,
  pin: RefObject<HTMLDivElement | null>,
) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<Playback>("idle");
  const controls = useRef<Controls | null>(null);

  useLayoutEffect(() => {
    const section = region.current,
      stage = pin.current;
    if (!section || !stage) return;
    const caption = stage.querySelector<HTMLElement>(".journey-caption");
    const root = document.documentElement;
    let mode: Playback = "idle",
      elapsed = 0,
      lastTime: number | null = null,
      frame = 0,
      entryFrame = 0;
    let lastTop = section.getBoundingClientRect().top;
    let bypass = Boolean(location.hash && location.hash !== "#laboratorio");
    let reverseDelta = 0;
    let contact: { x: number; y: number } | null = null;

    function change(next: Playback) {
      if (mode === "idle" && next !== "idle") {
        window.addEventListener("wheel", wheel, { passive: false });
        window.addEventListener("touchmove", touchMove, { passive: false });
      } else if (next === "idle") {
        window.removeEventListener("wheel", wheel);
        window.removeEventListener("touchmove", touchMove);
      }
      mode = next;
      setStatus(next);
      section!.dataset.playback = next;
      section!.toggleAttribute("data-pinned", next !== "idle");
      root.toggleAttribute("data-journey-viewport", next !== "idle");
    }
    function stopClock() {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = null;
    }
    function tick(now: number) {
      frame = 0;
      if (mode !== "playing" || document.hidden) return;
      if (lastTime !== null)
        elapsed = Math.min(
          duration,
          elapsed + Math.max(0, now - lastTime) / 1000,
        );
      lastTime = now;
      setProgress(sceneAt(elapsed));
      if (elapsed >= duration) {
        lastTime = null;
        change("complete");
        return;
      }
      frame = requestAnimationFrame(tick);
    }
    function run() {
      if (!frame && mode === "playing" && !document.hidden)
        frame = requestAnimationFrame(tick);
    }
    function align() {
      const y = window.scrollY + section!.getBoundingClientRect().top;
      window.scrollTo({ top: y, behavior: "instant" });
      lastTop = section!.getBoundingClientRect().top;
    }
    function begin() {
      stopClock();
      elapsed = 0;
      reverseDelta = 0;
      bypass = false;
      setProgress(0);
      change("playing");
      align();
      run();
    }
    function reset() {
      stopClock();
      elapsed = 0;
      reverseDelta = 0;
      change("idle");
      setProgress(0);
    }
    function leave(up: boolean) {
      cancelAnimationFrame(entryFrame);
      const target = document.getElementById(up ? "work" : "about");
      if (!target) {
        // The downloadable version contains the studio on its own.
        stopClock();
        elapsed = up ? 0 : duration;
        setProgress(up ? 0 : 1);
        change(up ? "paused" : "complete");
        return;
      }
      bypass = true;
      reset();
      history.replaceState(history.state, "", "#" + target.id);
      if (section!.contains(document.activeElement)) {
        if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
        target.focus({ preventScroll: true });
      }
      window.scrollTo({
        top: window.scrollY + target.getBoundingClientRect().top,
        behavior: "instant",
      });
      lastTop = section!.getBoundingClientRect().top;
    }
    function toggle() {
      if (mode === "playing") {
        stopClock();
        change("paused");
      } else if (mode === "paused") {
        change("playing");
        run();
      } else begin();
    }
    controls.current = {
      toggle,
      back: () => leave(true),
      skip: () => leave(false),
    };

    const measureCaption = () => {
      if (!caption || !stage.clientHeight) return;
      const gap = stage.clientHeight - caption.offsetTop + 14;
      stage.style.setProperty(
        "--caption-clearance",
        (100 * gap) / stage.clientHeight + "cqh",
      );
    };
    const onScroll = () => {
      const top = section.getBoundingClientRect().top,
        previous = lastTop;
      const h = stage.clientHeight;
      lastTop = top;
      if (!h || bypass) return;
      if (mode === "idle") {
        if (previous > top && top <= h * 0.3 && top > -h * 0.45) begin();
        else if (
          previous < top &&
          previous <= -h * 0.35 &&
          top > -h * 0.35 &&
          top <= h * 0.1
        )
          leave(true);
        return;
      }
      if (mode === "complete") {
        if (top > 5 && top > previous) leave(true);
        else if (top < -h * 0.55) reset();
        return;
      }
      // Layout changes and scrolling a control into view must not count as an upward gesture.
      if (Math.abs(top) > 2) align();
    };
    const gesture = () => {
      bypass = false;
    };
    const wheel = (event: WheelEvent) => {
      if (
        mode === "idle" ||
        event.ctrlKey ||
        event.metaKey ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
      )
        return;
      if (event.deltaY < 0) {
        event.preventDefault();
        reverseDelta -=
          event.deltaY *
          (event.deltaMode === 1
            ? 16
            : event.deltaMode === 2
              ? stage.clientHeight
              : 1);
        if (reverseDelta >= 5) leave(true);
      } else if (event.deltaY > 0) {
        reverseDelta = 0;
        if (mode !== "complete") event.preventDefault();
      }
    };
    const touchStart = (event: TouchEvent) => {
      gesture();
      const first = event.touches[0];
      contact =
        event.touches.length === 1
          ? { x: first.clientX, y: first.clientY }
          : null;
    };
    const touchMove = (event: TouchEvent) => {
      if (mode === "idle" || !contact || event.touches.length !== 1) return;
      const finger = event.touches[0],
        dy = finger.clientY - contact.y;
      if (Math.abs(dy) <= Math.abs(finger.clientX - contact.x)) return;
      if (dy > 0 || mode !== "complete") event.preventDefault();
      if (dy >= 14) {
        contact = null;
        leave(true);
      }
    };
    const endTouch = () => {
      contact = null;
    };
    const key = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      gesture();
      if (mode === "idle" || event.defaultPrevented) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("input,textarea,select,[contenteditable=true]"))
        return;
      if (
        event.key === "ArrowUp" ||
        event.key === "PageUp" ||
        (event.key === " " && event.shiftKey)
      ) {
        event.preventDefault();
        leave(true);
      } else if (
        event.key === " " &&
        mode !== "complete" &&
        !target?.closest("a,button")
      ) {
        event.preventDefault();
        if (!event.repeat) toggle();
      } else if (
        (event.key === "ArrowDown" || event.key === "PageDown") &&
        mode !== "complete"
      ) {
        event.preventDefault();
      } else if (event.key === "Home" || event.key === "End") {
        bypass = true;
        reset();
      }
    };
    const visibility = () => {
      if (document.hidden) stopClock();
      else run();
    };
    const onFragment = () => {
      cancelAnimationFrame(entryFrame);
      const here = location.hash === "#laboratorio";
      root.toggleAttribute("data-journey-viewport", here);
      if (here) {
        bypass = false;
        entryFrame = requestAnimationFrame(begin);
      } else {
        bypass = true;
        if (mode !== "idle") reset();
      }
    };
    const onAnchor = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[href^='#']")
          : null;
      if (!link) return;
      if (link.hash === "#laboratorio" && location.hash === link.hash)
        onFragment();
      else if (link.hash !== "#laboratorio") {
        bypass = true;
        if (mode !== "idle") reset();
      }
    };
    const onFocus = (event: FocusEvent) => {
      if (
        mode !== "idle" &&
        event.target instanceof Element &&
        !section.contains(event.target)
      ) {
        bypass = true;
        reset();
      }
    };
    const onResize = () => {
      measureCaption();
      if (mode === "playing" || mode === "paused") align();
    };
    const resize = new ResizeObserver(measureCaption);
    resize.observe(stage);
    if (caption) resize.observe(caption);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("wheel", gesture, { passive: true, capture: true });
    window.addEventListener("pointerdown", gesture, {
      passive: true,
      capture: true,
    });
    window.addEventListener("touchstart", touchStart, {
      passive: true,
      capture: true,
    });
    window.addEventListener("keydown", key);
    window.addEventListener("hashchange", onFragment);
    document.addEventListener("visibilitychange", visibility);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("click", onAnchor);
    window.addEventListener("touchend", endTouch);
    window.addEventListener("touchcancel", endTouch);
    measureCaption();
    section.dataset.playback = "idle";
    if (location.hash === "#laboratorio") onFragment();
    else if (!bypass && Math.abs(lastTop) <= 2) begin();
    return () => {
      stopClock();
      cancelAnimationFrame(entryFrame);
      resize.disconnect();
      controls.current = null;
      delete section.dataset.playback;
      section.removeAttribute("data-pinned");
      root.removeAttribute("data-journey-viewport");
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("wheel", gesture, true);
      window.removeEventListener("pointerdown", gesture, true);
      window.removeEventListener("touchstart", touchStart, true);
      window.removeEventListener("keydown", key);
      window.removeEventListener("hashchange", onFragment);
      document.removeEventListener("visibilitychange", visibility);
      document.removeEventListener("click", onAnchor);
      document.removeEventListener("focusin", onFocus);
      window.removeEventListener("wheel", wheel);
      window.removeEventListener("touchmove", touchMove);
      window.removeEventListener("touchend", endTouch);
      window.removeEventListener("touchcancel", endTouch);
    };
  }, [region, pin]);
  return { status, progress, controls };
}
