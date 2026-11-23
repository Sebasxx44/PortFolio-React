import { act, cleanup, fireEvent, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { duration, sceneAt } from "./studioTimeline";
import { useStudioPlayback } from "./useStudioPlayback";

function studio(hash = "") {
  history.replaceState(null, "", "/" + hash);
  let pageY = 0;
  let id = 0;
  const frames = new Map<number, FrameRequestCallback>();
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    frames.set(++id, callback);
    return id;
  });
  vi.stubGlobal("cancelAnimationFrame", (key: number) => frames.delete(key));
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
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
  makeSection("work", 300);
  const section = makeSection("laboratorio", 1200);
  makeSection("about", 1800);
  const stage = document.createElement("div");
  Object.defineProperty(stage, "clientHeight", { value: 600 });
  section.append(stage);
  const regionRef = { current: section },
    pinRef = { current: stage };
  const { result } = renderHook(() => useStudioPlayback(regionRef, pinRef));
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
  return { result, frame, moveTo, wheel, hidden, section };
}

afterEach(() => {
  cleanup();
  document.body.replaceChildren();
  history.replaceState(null, "", "/");
  vi.unstubAllGlobals();
});

describe("studio playback", () => {
  it("starts on entry, ignores downward inertia, exits upward and starts the next visit at zero", () => {
    const { result, frame, moveTo, wheel } = studio();
    moveTo(950);
    expect(result.current.status).toBe("idle");
    moveTo(1040);
    expect(result.current.status).toBe("playing");
    expect(window.scrollY).toBe(1200);
    // Browsers may center a control before an accessible click or focus change.
    moveTo(885);
    expect(result.current.status).toBe("playing");
    expect(window.scrollY).toBe(1200);
    expect(wheel(60)).toBe(false);
    frame(0);
    frame(7000);
    expect(result.current.progress).toBe(sceneAt(7));
    expect(wheel(-70)).toBe(false);
    expect(result.current.status).toBe("idle");
    expect(result.current.progress).toBe(0);
    expect(location.hash).toBe("#work");
    expect(window.scrollY).toBe(300);
    wheel(80);
    moveTo(1100);
    frame(9000);
    expect(result.current.status).toBe("playing");
    expect(result.current.progress).toBe(0);
  });

  it("excludes paused and background time, then releases downward scrolling at the gallery", () => {
    const { result, frame, wheel, hidden } = studio("#laboratorio");
    frame(0);
    frame(16);
    frame(1016);
    act(() => result.current.controls.current?.toggle());
    frame(5000);
    expect(result.current.status).toBe("paused");
    expect(result.current.progress).toBe(sceneAt(1));
    act(() => result.current.controls.current?.toggle());
    frame(5016);
    frame(6016);
    hidden.mockReturnValue(true);
    fireEvent(document, new Event("visibilitychange"));
    frame(30000);
    hidden.mockReturnValue(false);
    fireEvent(document, new Event("visibilitychange"));
    frame(31000);
    expect(result.current.progress).toBe(sceneAt(2));
    frame(31000 + duration * 1000);
    expect(result.current.progress).toBe(1);
    expect(result.current.status).toBe("complete");
    expect(wheel(120)).toBe(true);
    expect(fireEvent.keyDown(document.body, { key: " " })).toBe(true);
    expect(result.current.status).toBe("complete");
  });

  it("resets on a single downward swipe or Page Up and respects Skip", () => {
    const { result, section, frame } = studio("#laboratorio");
    frame(0);
    fireEvent.touchStart(section, {
      touches: [{ clientX: 100, clientY: 200 }],
    });
    fireEvent.touchMove(section, { touches: [{ clientX: 103, clientY: 230 }] });
    expect(location.hash).toBe("#work");
    expect(result.current.progress).toBe(0);
    act(() => result.current.controls.current?.toggle());
    fireEvent.keyDown(window, { key: "PageUp" });
    expect(window.scrollY).toBe(300);
    expect(result.current.status).toBe("idle");
    act(() => result.current.controls.current?.toggle());
    act(() => result.current.controls.current?.skip());
    expect(location.hash).toBe("#about");
    expect(window.scrollY).toBe(1800);
    expect(result.current.status).toBe("idle");
  });
});
