import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import { duration, sceneAt } from "./studioTimeline";

type Playback = "idle" | "playing" | "complete";

export function useStudioPlayback(region: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<Playback>("idle");
  const skip = useRef<(() => void) | null>(null);

  useLayoutEffect(() => {
    if (!region.current) return;
    const section: HTMLElement = region.current;
    const root = document.documentElement;
    let mode: Playback = "idle";
    let elapsed = 0,
      lastTime: number | null = null,
      frame = 0,
      entryFrame = 0;
    let lastTop = section.getBoundingClientRect().top,
      lastY = window.scrollY;
    let bypass = Boolean(location.hash && location.hash !== "#laboratorio");
    let reverseDistance = 0,
      lastReverse = 0;
    let contact: { x: number; y: number } | null = null;

    function change(next: Playback) {
      if (mode === next) return;
      if (next === "playing") {
        // Keep the page behind the full-width stage at its original desktop width.
        const gutter = Math.max(0, window.innerWidth - root.clientWidth);
        root.style.setProperty("--journey-scrollbar", gutter + "px");
      }
      root.toggleAttribute("data-journey-viewport", next === "playing");
      if (next !== "playing") root.style.removeProperty("--journey-scrollbar");
      if (mode === "idle") {
        window.addEventListener("wheel", wheel, { passive: false });
        window.addEventListener("touchmove", touchMove, { passive: false });
      }
      if (next === "idle") {
        window.removeEventListener("wheel", wheel);
        window.removeEventListener("touchmove", touchMove);
      }
      mode = next;
      section.dataset.playback = next;
      setStatus(next);
    }
    function align() {
      window.scrollTo({
        top: window.scrollY + section.getBoundingClientRect().top,
        behavior: "instant",
      });
      lastTop = section.getBoundingClientRect().top;
      lastY = window.scrollY;
    }
    function stopClock() {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = null;
    }
    function finish() {
      stopClock();
      setProgress(1);
      change("complete");
      align();
    }
    function tick(now: number) {
      frame = 0;
      if (mode !== "playing" || document.hidden) return;
      if (lastTime !== null) elapsed += Math.max(0, now - lastTime) / 1000;
      if (elapsed >= duration) {
        finish();
        return;
      }
      lastTime = now;
      setProgress(sceneAt(elapsed));
      frame = requestAnimationFrame(tick);
    }
    function run() {
      if (!frame && mode === "playing" && !document.hidden)
        frame = requestAnimationFrame(tick);
    }
    function start() {
      stopClock();
      elapsed = reverseDistance = 0;
      bypass = false;
      setProgress(0);
      change("playing");
      align();
      run();
    }
    function reset() {
      stopClock();
      elapsed = reverseDistance = 0;
      change("idle");
      setProgress(0);
    }
    function leave(up: boolean) {
      cancelAnimationFrame(entryFrame);
      const target = document.getElementById(up ? "work" : "about");
      if (!target) {
        // In the standalone experience, the same header action replays the finished shot.
        if (up || mode === "complete") start();
        else finish();
        return;
      }
      bypass = true;
      reset();
      history.replaceState(history.state, "", "#" + target.id);
      if (section.contains(document.activeElement)) {
        if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
        target.focus({ preventScroll: true });
      }
      window.scrollTo({
        top: window.scrollY + target.getBoundingClientRect().top,
        behavior: "instant",
      });
      lastTop = section.getBoundingClientRect().top;
      lastY = window.scrollY;
    }
    skip.current = () => leave(false);

    function onScroll() {
      const top = section.getBoundingClientRect().top,
        y = window.scrollY;
      const before = lastTop,
        down = y > lastY;
      lastTop = top;
      lastY = y;
      const h = section.clientHeight;
      if (bypass || !h || mode === "playing") return;
      if (mode === "complete") {
        if (top < -h * 0.55 || top > h * 0.55) reset();
        return;
      }
      // Test the crossing, including a wheel fling that travels past the entire section in one frame.
      if (down && before >= -1 && top < before && top <= h * 0.3) start();
    }
    const gesture = () => {
      bypass = false;
    };
    function wheel(event: WheelEvent) {
      if (
        mode === "idle" ||
        event.ctrlKey ||
        event.metaKey ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
      )
        return;
      if (event.deltaY < 0) {
        if (event.cancelable) event.preventDefault();
        // Small direction reversals are common at the end of a precision-trackpad fling.
        if (event.timeStamp - lastReverse > 180) reverseDistance = 0;
        lastReverse = event.timeStamp;
        reverseDistance -= event.deltaY;
        if (event.deltaMode !== 0 || reverseDistance >= 24) leave(true);
      } else if (event.deltaY > 0) {
        reverseDistance = 0;
        if (mode === "playing" && event.cancelable) event.preventDefault();
      }
    }
    const touchStart = (event: TouchEvent) => {
      gesture();
      const first = event.touches[0];
      contact =
        event.touches.length === 1
          ? { x: first.clientX, y: first.clientY }
          : null;
    };
    function touchMove(event: TouchEvent) {
      if (mode === "idle" || !contact || event.touches.length !== 1) return;
      const finger = event.touches[0],
        dy = finger.clientY - contact.y;
      if (Math.abs(dy) <= Math.abs(finger.clientX - contact.x)) return;
      if ((dy > 0 || mode === "playing") && event.cancelable)
        event.preventDefault();
      if (dy >= 14) {
        contact = null;
        leave(true);
      }
    }
    const endTouch = () => {
      contact = null;
    };
    const key = (event: KeyboardEvent) => {
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.defaultPrevented
      )
        return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("input,textarea,select,[contenteditable=true]"))
        return;
      if (event.key === "Home" || event.key === "End") {
        bypass = true;
        cancelAnimationFrame(entryFrame);
        if (mode !== "idle") reset();
        return;
      }
      if (
        !["ArrowUp", "PageUp", "ArrowDown", "PageDown", " "].includes(event.key)
      )
        return;
      gesture();
      if (mode === "idle" || (event.key === " " && target?.closest("a,button")))
        return;
      if (
        event.key === "ArrowUp" ||
        event.key === "PageUp" ||
        (event.key === " " && event.shiftKey)
      ) {
        event.preventDefault();
        leave(true);
      } else if (mode === "playing") event.preventDefault();
    };
    const visibility = () => {
      if (document.hidden) stopClock();
      else run();
    };
    const onFragment = () => {
      cancelAnimationFrame(entryFrame);
      bypass = true;
      if (location.hash === "#laboratorio") {
        entryFrame = requestAnimationFrame(() => {
          if (mode === "playing") {
            bypass = false;
            align();
          } else start();
        });
      } else if (mode !== "idle") reset();
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
      bypass = true;
      cancelAnimationFrame(entryFrame);
      if (link.hash === "#laboratorio") {
        if (link.hash === location.hash) onFragment();
      } else if (mode !== "idle") reset();
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
      if (mode === "playing") align();
      else {
        lastTop = section.getBoundingClientRect().top;
        lastY = window.scrollY;
      }
    };
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
    window.addEventListener("touchend", endTouch);
    window.addEventListener("touchcancel", endTouch);
    window.addEventListener("keydown", key);
    window.addEventListener("hashchange", onFragment);
    document.addEventListener("visibilitychange", visibility);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("click", onAnchor);
    section.dataset.playback = "idle";
    if (location.hash === "#laboratorio") onFragment();
    else if (!bypass && Math.abs(lastTop) <= 2) start();

    return () => {
      stopClock();
      cancelAnimationFrame(entryFrame);
      skip.current = null;
      delete section.dataset.playback;
      root.removeAttribute("data-journey-viewport");
      root.style.removeProperty("--journey-scrollbar");
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("wheel", gesture, true);
      window.removeEventListener("pointerdown", gesture, true);
      window.removeEventListener("touchstart", touchStart, true);
      window.removeEventListener("touchend", endTouch);
      window.removeEventListener("touchcancel", endTouch);
      window.removeEventListener("keydown", key);
      window.removeEventListener("hashchange", onFragment);
      document.removeEventListener("visibilitychange", visibility);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("click", onAnchor);
      window.removeEventListener("wheel", wheel);
      window.removeEventListener("touchmove", touchMove);
    };
  }, [region]);

  return { progress, status, skip };
}
