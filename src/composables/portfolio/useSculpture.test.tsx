import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSculpture } from "@/composables/portfolio/useSculpture";
import { createSculptureScene } from "@/components/portfolio/sculptureScene";
import type { SculptureControls } from "@/components/portfolio/types";

vi.mock("@/components/portfolio/sculptureScene", () => ({
  createSculptureScene: vi.fn(),
}));

const controls: SculptureControls = {
  finish: "natural",
  paused: false,
  reducedMotion: false,
};
const scene = { render: vi.fn(), resize: vi.fn(), dispose: vi.fn() };
let frames: Map<number, FrameRequestCallback>;
let nextFrame = 1;
let notifyVisibility: (visible: boolean) => void;

const FixtureTA = (props: SculptureControls) => {
  const { rendering } = useSculpture(props);
  return (
    <canvas
      ref={rendering.canvasRef}
      data-testid="scene"
      data-ready={rendering.available}
    />
  );
};

const advanceFrame = (now = 100) => {
  const callbacks = [...frames.values()];
  frames.clear();
  act(() => callbacks.forEach((callback) => callback(now)));
};

beforeEach(() => {
  vi.clearAllMocks();
  frames = new Map();
  nextFrame = 1;
  vi.mocked(createSculptureScene).mockReturnValue(scene);
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    const id = nextFrame++;
    frames.set(id, callback);
    return id;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        notifyVisibility = (visible) =>
          callback(
            [{ isIntersecting: visible } as IntersectionObserverEntry],
            {} as IntersectionObserver,
          );
      }
      observe = vi.fn();
      disconnect = vi.fn();
    },
  );
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe = vi.fn();
      disconnect = vi.fn();
    },
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("Sculpture rendering lifecycle", () => {
  it("runs while visible and releases its GPU resources on unmount", () => {
    const view = render(<FixtureTA {...controls} />);
    advanceFrame();
    expect(scene.render).toHaveBeenCalledOnce();
    expect(frames.size).toBe(1);
    view.unmount();
    expect(scene.dispose).toHaveBeenCalledOnce();
    expect(frames.size).toBe(0);
  });

  it("renders a still frame for reduced motion while retaining appearance controls", () => {
    const view = render(<FixtureTA {...controls} reducedMotion />);
    advanceFrame();
    expect(frames.size).toBe(0);
    view.rerender(
      <FixtureTA {...controls} reducedMotion finish="clay" />,
    );
    advanceFrame();
    expect(scene.render).toHaveBeenLastCalledWith(
      1,
      "clay",
    );
    expect(frames.size).toBe(0);
  });

  it("stops outside the viewport, resumes on reentry, and respects pause", () => {
    const view = render(<FixtureTA {...controls} />);
    advanceFrame();
    act(() => notifyVisibility(false));
    advanceFrame(200);
    expect(frames.size).toBe(0);
    expect(scene.render).toHaveBeenCalledOnce();
    act(() => notifyVisibility(true));
    advanceFrame(300);
    expect(scene.render).toHaveBeenCalledTimes(2);
    view.rerender(<FixtureTA {...controls} paused />);
    advanceFrame(400);
    expect(frames.size).toBe(0);
  });

  it("keeps the fallback when WebGL is unavailable", () => {
    vi.mocked(createSculptureScene).mockImplementation(() => {
      throw new Error("WebGL unavailable");
    });
    render(<FixtureTA {...controls} />);
    expect(screen.getByTestId("scene").getAttribute("data-ready")).toBe(
      "false",
    );
    expect(frames.size).toBe(0);
  });
});
