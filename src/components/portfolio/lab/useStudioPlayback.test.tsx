import { act, cleanup, fireEvent, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { duration, sceneAt } from "./studioTimeline";
import { useStudioPlayback } from "./useStudioPlayback";

function studio(hash = "", reducedMotion = false) {
  history.replaceState(null, "", "/" + hash);
  let pageY = 0;
  let id = 0;
  const frames = new Map<number, FrameRequestCallback>();
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    frames.set(++id, callback);
    return id;
  });
  vi.stubGlobal("cancelAnimationFrame", (key: number) => frames.delete(key));
  vi.stubGlobal("matchMedia", () => ({ matches: reducedMotion }));
  vi.stubGlobal("scrollY", 0);
  function scroll(y: number) {
    pageY = y;
    window.scrollY = y;
  }
  vi.stubGlobal("scrollTo", (options: ScrollToOptions) =>
    scroll(options.top ?? 0),
  );
  const hidden = vi.spyOn(document, "hidden", "get").mockReturnValue(false);
  function makeSection(name: string, offset: number) {
    const el = document.createElement("section");
    el.id = name;
    document.body.append(el);
    vi.spyOn(el, "getBoundingClientRect").mockImplementation(
      () => new DOMRect(0, offset - pageY, 1000, 600),
    );
    return el;
  }
  const work = makeSection("work", 300);
  const section = makeSection("laboratorio", 1200);
  makeSection("about", 1800);
  Object.defineProperty(section, "clientHeight", { value: 600 });
  const regionRef = { current: section };
  const { result, unmount } = renderHook(() => useStudioPlayback(regionRef));
  function frame(time: number) {
    act(() => {
      const pending = [...frames.values()];
      frames.clear();
      for (const callback of pending) callback(time);
    });
  }
  const moveTo = (y: number) => {
    scroll(y);
    fireEvent.scroll(window);
  };
  const wheel = (deltaY: number) => fireEvent.wheel(section, { deltaY });
  return {
    result,
    frame,
    moveTo,
    scroll,
    wheel,
    hidden,
    section,
    work,
    unmount,
  };
}

afterEach(() => {
  cleanup();
  document.body.replaceChildren();
  history.replaceState(null, "", "/");
  vi.unstubAllGlobals();
});

describe("studio playback", () => {
  it("captures a fast crossing, tolerates trackpad bounce and restarts on re-entry", () => {
    const { result, frame, moveTo, wheel } = studio();
    moveTo(900);
    expect(result.current.status).toBe("idle");
    moveTo(1960);
    expect(window.scrollY).toBe(1200);
    expect(result.current.status).toBe("playing");
    const root = document.documentElement;
    expect(root.hasAttribute("data-journey-viewport")).toBe(true);
    frame(0);
    frame(3000);
    expect(result.current.progress).toBe(sceneAt(3));
    for (const delta of [70, 20, -6, 4, -3, -4])
      expect(wheel(delta)).toBe(false);
    expect(result.current.status).toBe("playing");
    wheel(-80);
    expect(location.hash).toBe("#work");
    expect(window.scrollY).toBe(300);
    expect(result.current.progress).toBe(0);
    expect(root.hasAttribute("data-journey-viewport")).toBe(false);
    wheel(100);
    moveTo(1050);
    frame(9000);
    expect(result.current.status).toBe("playing");
    expect(result.current.progress).toBe(0);
  });

  it("recognizes a gentle sustained upward gesture", () => {
    const { section, result, frame } = studio("#laboratorio");
    frame(0);
    for (let i = 0; i < 6; i++) fireEvent.wheel(section, { deltaY: -4 });
    expect(result.current.status).toBe("idle");
    expect(location.hash).toBe("#work");
  });

  it("ignores background time and slides the last scene into About without further input", () => {
    const { result, frame, wheel, hidden } = studio("#laboratorio");
    frame(0);
    frame(20);
    frame(1020);
    expect(result.current.progress).toBe(sceneAt(1));
    hidden.mockReturnValue(true);
    fireEvent(document, new Event("visibilitychange"));
    frame(15000);
    hidden.mockReturnValue(false);
    fireEvent(document, new Event("visibilitychange"));
    frame(20000);
    expect(result.current.progress).toBe(sceneAt(1));
    const end = 20000 + duration * 1000;
    frame(end);
    expect(result.current.status).toBe("leaving");
    expect(result.current.progress).toBe(1);
    expect(window.scrollY).toBe(1200);
    frame(end + 16);
    frame(end + 466);
    expect(window.scrollY).toBeCloseTo(1500);
    expect(result.current.progress).toBe(1);
    expect(document.documentElement.hasAttribute("data-journey-viewport")).toBe(
      true,
    );
    frame(end + 916);
    expect(result.current.status).toBe("idle");
    expect(location.hash).toBe("#about");
    expect(window.scrollY).toBe(1800);
    expect(document.documentElement.hasAttribute("data-journey-viewport")).toBe(
      false,
    );
    expect(wheel(120)).toBe(true);
    expect(fireEvent.keyDown(document.body, { key: " " })).toBe(true);
  });

  it("cancels a partially completed exit when the visitor goes back to Projects", () => {
    const { result, frame, wheel } = studio("#laboratorio");
    frame(0);
    frame(16);
    const end = 16 + duration * 1000;
    frame(end);
    frame(end + 16);
    frame(end + 400);
    expect(window.scrollY).toBeGreaterThan(1200);
    wheel(-70);
    frame(end + 1200);
    expect(result.current.status).toBe("idle");
    expect(result.current.progress).toBe(0);
    expect(location.hash).toBe("#work");
    expect(window.scrollY).toBe(300);
  });

  it("lands directly on About when reduced motion is enabled", () => {
    const { result, frame } = studio("#laboratorio", true);
    frame(0);
    frame(16);
    frame(16 + duration * 1000);
    expect(result.current.status).toBe("idle");
    expect(location.hash).toBe("#about");
    expect(window.scrollY).toBe(1800);
  });

  it("keeps the gallery and replay available when there is no adjacent About section", () => {
    const { result, frame } = studio("#laboratorio");
    document.getElementById("about")?.remove();
    frame(0);
    frame(16);
    frame(16 + duration * 1000);
    expect(result.current.status).toBe("complete");
    expect(result.current.progress).toBe(1);
    act(() => result.current.skip.current?.());
    expect(result.current.status).toBe("playing");
    expect(result.current.progress).toBe(0);
  });

  it("captures a fast mobile crossing when the toolbar resizes before scroll delivery", () => {
    const { result, moveTo, scroll } = studio();
    moveTo(900);
    scroll(1960);
    fireEvent.resize(window);
    fireEvent.scroll(window);
    expect(result.current.status).toBe("playing");
    expect(window.scrollY).toBe(1200);
  });

  it("captures a swipe that started over Projects and accepts a reversal without lifting", () => {
    const { result, moveTo, work } = studio();
    moveTo(900);
    fireEvent.touchStart(work, { touches: [{ clientX: 100, clientY: 400 }] });
    fireEvent.touchMove(work, { touches: [{ clientX: 100, clientY: 350 }] });
    expect(result.current.status).toBe("idle");
    expect(
      fireEvent.touchMove(work, { touches: [{ clientX: 100, clientY: 240 }] }),
    ).toBe(false);
    expect(result.current.status).toBe("playing");
    fireEvent.touchMove(work, { touches: [{ clientX: 100, clientY: 265 }] });
    expect(result.current.status).toBe("idle");
    expect(location.hash).toBe("#work");
    expect(window.scrollY).toBe(300);
  });

  it("keeps fragment, touch, keyboard and Skip navigation independent of wheel speed", () => {
    const { result, section, frame, moveTo, wheel } = studio("#about");
    moveTo(2000);
    expect(result.current.status).toBe("idle");
    act(() => {
      history.pushState(null, "", "#laboratorio");
      window.dispatchEvent(new Event("hashchange"));
    });
    frame(0);
    fireEvent.touchStart(section, {
      touches: [{ clientX: 100, clientY: 170 }],
    });
    fireEvent.touchMove(section, { touches: [{ clientX: 101, clientY: 197 }] });
    expect(location.hash).toBe("#work");
    wheel(120);
    moveTo(1050);
    expect(result.current.status).toBe("playing");
    fireEvent.keyDown(window, { key: "PageUp" });
    expect(window.scrollY).toBe(300);
    wheel(60);
    moveTo(1500);
    act(() => result.current.skip.current?.());
    expect(result.current.status).toBe("idle");
    expect(location.hash).toBe("#about");
    expect(window.scrollY).toBe(1800);
  });

  it("lets End bypass the stage and clears the page lock on unmount", () => {
    const { result, frame, moveTo, unmount } = studio();
    fireEvent.keyDown(window, { key: "End" });
    moveTo(2400);
    expect(result.current.status).toBe("idle");
    act(() => {
      history.pushState(null, "", "#laboratorio");
      window.dispatchEvent(new Event("hashchange"));
    });
    frame(0);
    expect(result.current.status).toBe("playing");
    unmount();
    expect(
      document.documentElement.style.getPropertyValue("--journey-scrollbar"),
    ).toBe("");
    expect(document.documentElement.hasAttribute("data-journey-viewport")).toBe(
      false,
    );
  });
});
