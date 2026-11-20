import { useEffect, useRef } from "react";

// Page between projects on vertical input and release scrolling at each end.
export function useFeaturedScroll() {
  const gallery = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const deck = gallery.current;
    if (!deck) return;
    const slides = [...deck.querySelectorAll<HTMLElement>(".feature-slide")];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    const observer = new IntersectionObserver(([entry]) => {
      root.classList.toggle("near-featured-work", entry.isIntersecting);
    });
    observer.observe(deck);

    let target = -1;
    let previousAt = -Infinity;
    let previousDelta = 0;
    let previousDirection = 0;
    let accumulated = 0;
    let deadline = 0;
    let consumed = false;
    let touch: {
      x: number;
      y: number;
      index: number;
      offset: number;
      next: number | null;
      distance: number;
    } | null = null;

    function visibleIndex() {
      const middle = root.clientHeight / 2;
      return slides.findIndex((slide) => {
        const bounds = slide.getBoundingClientRect();
        return bounds.top <= middle && bounds.bottom > middle;
      });
    }
    function go(index: number) {
      slides[index].scrollIntoView({
        block: "start",
        behavior: reduced.matches ? "instant" : "smooth",
      });
    }

    function destination(index: number, direction: number, offset: number) {
      // On entry, first finish bringing the visible project into view.
      return direction * offset > 2 ? index : index + direction;
    }

    function move(event: WheelEvent) {
      if (
        event.ctrlKey ||
        event.shiftKey ||
        !event.cancelable ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
      )
        return;
      const delta =
        event.deltaY *
        (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      const direction = Math.sign(delta);
      if (!direction) return;
      const now = event.timeStamp;
      const gap = now - previousAt;
      const magnitude = Math.abs(delta);
      const reversed = direction !== previousDirection;
      const notch =
        gap >= 70 && magnitude >= 36 && Math.abs(magnitude - previousDelta) < 1;
      const newImpulse =
        gap > 190 ||
        reversed ||
        notch ||
        (gap > 45 && magnitude > previousDelta * 2.6 + 12);
      previousAt = now;
      previousDirection = direction;
      previousDelta = magnitude;

      // A trackpad emits many shrinking deltas after a single swipe. Absorb
      // that tail even on the last slide, but release the next deliberate swipe.
      if (newImpulse) {
        consumed = false;
        accumulated = 0;
      }
      if (consumed) {
        event.preventDefault();
        return;
      }
      const navigating = target !== -1 && now < deadline;
      const current = navigating ? target : visibleIndex();
      if (current === -1) return;
      const slide = slides[current];
      const rect = slide.getBoundingClientRect();
      // Respect oversized panels at large text zoom and an entrance that is
      // still partly above or below the viewport.
      if (
        now >= deadline &&
        (rect.height > innerHeight + 3 ||
          Math.abs(rect.top) > innerHeight * 0.36)
      ) {
        target = -1;
        return;
      }
      const next = destination(current, direction, navigating ? 0 : rect.top);
      if (next < 0 || next >= slides.length) {
        target = -1;
        accumulated = 0;
        return;
      }
      event.preventDefault();
      accumulated += magnitude;
      if (accumulated < 6) return;
      target = next;
      consumed = true;
      accumulated = 0;
      deadline = now + 680;
      go(next);
    }
    const reset = () => {
      target = -1;
      deadline = 0;
      previousAt = -Infinity;
      accumulated = 0;
      consumed = false;
    };
    function startTouch(event: TouchEvent) {
      touch = null;
      if (event.touches.length !== 1) return;
      const index = visibleIndex();
      if (index < 0) return;
      const bounds = slides[index].getBoundingClientRect();
      if (
        bounds.height > innerHeight + 3 ||
        Math.abs(bounds.top) > innerHeight * 0.22
      )
        return;
      const { clientX: x, clientY: y } = event.touches[0];
      touch = { x, y, index, offset: bounds.top, next: null, distance: 0 };
    }
    function moveTouch(event: TouchEvent) {
      if (!touch || event.touches.length !== 1) {
        touch = null;
        return;
      }
      const dx = event.touches[0].clientX - touch.x;
      const dy = touch.y - event.touches[0].clientY;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 6) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        touch = null;
        return;
      }
      const next = destination(touch.index, Math.sign(dy), touch.offset);
      if (!slides[next] || !event.cancelable) {
        touch = null;
        return;
      }
      event.preventDefault();
      touch.distance = Math.abs(dy);
      touch.next = next;
    }
    function endTouch(event: TouchEvent) {
      if (touch?.next != null && touch.distance >= 30) {
        if (event.cancelable) event.preventDefault();
        go(touch.next);
      }
      touch = null;
    }
    const cancelTouch = () => {
      touch = null;
    };
    function key(event: KeyboardEvent) {
      reset();
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey
      )
        return;
      if (!["ArrowDown", "ArrowUp", "PageDown", "PageUp"].includes(event.key))
        return;
      const origin = event.target;
      if (
        origin instanceof Element &&
        (origin.closest(
          "input,textarea,select,dialog,[contenteditable=true]",
        ) ||
          (origin !== document.body &&
            origin !== root &&
            !deck?.contains(origin)))
      )
        return;
      const current = visibleIndex();
      if (
        current < 0 ||
        Math.abs(slides[current].getBoundingClientRect().top) > 6 ||
        slides[current].offsetHeight > innerHeight + 3
      )
        return;
      const next = current + (event.key.endsWith("Down") ? 1 : -1);
      if (!slides[next]) return;
      event.preventDefault();
      slides[next].querySelector("h3")?.focus({ preventScroll: true });
      go(next);
    }
    deck.addEventListener("wheel", move, { passive: false });
    deck.addEventListener("touchstart", startTouch, { passive: true });
    deck.addEventListener("touchmove", moveTouch, { passive: false });
    deck.addEventListener("touchend", endTouch, { passive: false });
    deck.addEventListener("touchcancel", cancelTouch);
    window.addEventListener("pointerdown", reset, { passive: true });
    window.addEventListener("keydown", key);
    window.addEventListener("hashchange", reset);
    return () => {
      observer.disconnect();
      root.classList.remove("near-featured-work");
      deck.removeEventListener("wheel", move);
      deck.removeEventListener("touchstart", startTouch);
      deck.removeEventListener("touchmove", moveTouch);
      deck.removeEventListener("touchend", endTouch);
      deck.removeEventListener("touchcancel", cancelTouch);
      window.removeEventListener("pointerdown", reset);
      window.removeEventListener("keydown", key);
      window.removeEventListener("hashchange", reset);
    };
  }, []);
  return gallery;
}
