import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useProjectShowcase } from "@/composables/portfolio/useProjectShowcase";
import type { Project } from "@/components/portfolio/types";

const project = (id: string, kind: Project["kind"]): Project => ({
  id,
  title: id,
  kind,
  description: { es: id, en: id, pt: id },
  image: id,
  url: `https://${id}.example.com`,
  stack: ["TypeScript"],
  tone: "silver",
});
const catalog = [
  project("one", "web"),
  project("two", "app"),
  project("three", "web"),
  project("four", "app"),
];

const IndexFixtureTA = () => {
  const { collection, selection, navigation } = useProjectShowcase(catalog);
  return (
    <div>
      {collection.visible.map((item, index) => (
        <button
          key={item.id}
          ref={navigation.setIndexRef(item.id)}
          onKeyDown={(event) => navigation.onIndexKeyDown(event, index)}
          onFocus={() => selection.select(item.id)}
          onPointerEnter={(event) =>
            navigation.onIndexPointerEnter(event, item.id)
          }
          aria-pressed={selection.active?.id === item.id}
        >
          {item.title}
        </button>
      ))}
      <select
        ref={navigation.selectorRef}
        aria-label="Choose project"
        value={selection.active?.id}
        onChange={(event) => selection.select(event.target.value)}
      >
        {collection.visible.map((item) => (
          <option key={item.id} value={item.id}>
            {item.title}
          </option>
        ))}
      </select>
      <div ref={navigation.panelRef}>
        <div key={selection.active?.id}>
          <a href={selection.active?.url}>Demo {selection.active?.title}</a>
        </div>
      </div>
    </div>
  );
};

const hover = (target: HTMLElement) => {
  const event = new Event("pointerover", { bubbles: true });
  Object.defineProperty(event, "pointerType", { value: "mouse" });
  fireEvent(target, event);
};

const mockViewport = () => {
  let mobile = false;
  const query = new EventTarget();
  Object.defineProperty(query, "matches", { get: () => mobile });
  vi.stubGlobal("matchMedia", () => query);
  return {
    setMobile: (next: boolean) => {
      mobile = next;
    },
    dispatch: () => {
      const event = new Event("change");
      Object.defineProperty(event, "matches", { value: mobile });
      act(() => {
        query.dispatchEvent(event);
      });
    },
  };
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("project showcase navigation", () => {
  it("counts filters from the complete catalog and shows every project", () => {
    const { result } = renderHook(() => useProjectShowcase(catalog));
    expect(
      result.current.collection.filters.map(({ value, count }) => [
        value,
        count,
      ]),
    ).toEqual([
      ["all", 4],
      ["web", 2],
      ["app", 2],
    ]);
    expect(result.current.collection.visible.map(({ id }) => id)).toEqual([
      "one",
      "two",
      "three",
      "four",
    ]);
    expect(result.current.selection.position).toBe("01 / 04");
  });

  it("preserves a valid selection and resets it when a filter excludes it", () => {
    const { result } = renderHook(() => useProjectShowcase(catalog));
    act(() => result.current.selection.select("four"));
    act(() => result.current.collection.setFilter("app"));
    expect(result.current.selection.active?.id).toBe("four");
    expect(result.current.selection.position).toBe("02 / 02");
    act(() => result.current.collection.setFilter("web"));
    expect(result.current.selection.active?.id).toBe("one");
    expect(result.current.selection.position).toBe("01 / 02");
    act(() => result.current.collection.setFilter("all"));
    expect(result.current.selection.active?.id).toBe("one");
  });

  it("wraps both directions within the active filter", () => {
    const { result } = renderHook(() => useProjectShowcase(catalog));
    act(() => result.current.collection.setFilter("app"));
    act(() => result.current.navigation.previous());
    expect(result.current.selection.active?.id).toBe("four");
    act(() => result.current.navigation.next());
    expect(result.current.selection.active?.id).toBe("two");
    act(() => result.current.selection.select("one"));
    expect(result.current.selection.active?.id).toBe("two");
  });

  it("handles an empty result without invalid navigation", () => {
    const { result } = renderHook(() => useProjectShowcase([catalog[0]]));
    act(() => result.current.collection.setFilter("app"));
    act(() => {
      result.current.navigation.next();
      result.current.navigation.previous();
    });
    expect(result.current.selection.active).toBeNull();
    expect(result.current.selection.position).toBe("00 / 00");
    expect(result.current.navigation.available).toBe(false);
    act(() => result.current.collection.setFilter("all"));
    expect(result.current.selection.active?.id).toBe("one");
  });

  it("moves keyboard focus with arrows and Home/End while activating the matching preview", () => {
    render(<IndexFixtureTA />);
    act(() => screen.getByRole("button", { name: "one" }).focus());
    fireEvent.keyDown(screen.getByRole("button", { name: "one" }), {
      key: "ArrowUp",
    });
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "four" }),
    );
    expect(
      screen.getByRole("button", { name: "four" }).getAttribute("aria-pressed"),
    ).toBe("true");
    fireEvent.keyDown(document.activeElement!, { key: "Home" });
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "one" }),
    );
    fireEvent.keyDown(document.activeElement!, { key: "End" });
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "four" }),
    );
    fireEvent.keyDown(document.activeElement!, { key: "ArrowDown" });
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "one" }),
    );
  });

  it("keeps a focused preview link mounted when the pointer enters another index row", () => {
    render(<IndexFixtureTA />);
    const link = screen.getByRole("link", { name: "Demo one" });
    act(() => link.focus());
    hover(screen.getByRole("button", { name: "two" }));
    expect(document.activeElement).toBe(link);
    expect(link.isConnected).toBe(true);
    expect(
      screen.getByRole("button", { name: "one" }).getAttribute("aria-pressed"),
    ).toBe("true");
  });

  it("still previews index rows on mouse hover when the panel has no focus", () => {
    render(<IndexFixtureTA />);
    hover(screen.getByRole("button", { name: "two" }));
    expect(screen.getByRole("link", { name: "Demo two" })).toBeTruthy();
  });

  it("lets native keyboard focus scroll the target index row into view", () => {
    render(<IndexFixtureTA />);
    act(() => screen.getByRole("button", { name: "one" }).focus());
    const target = screen.getByRole("button", { name: "four" });
    const focus = vi.spyOn(target, "focus");
    fireEvent.keyDown(screen.getByRole("button", { name: "one" }), {
      key: "End",
    });
    expect(focus).toHaveBeenCalledWith();
    expect(document.activeElement).toBe(target);
  });

  it("transfers focus between the active index row and native selector across the mobile breakpoint", () => {
    const viewport = mockViewport();
    render(<IndexFixtureTA />);
    const selected = screen.getByRole("button", { name: "four" });
    act(() => selected.focus());
    viewport.setMobile(true);
    // A browser may blur the display:none tab before the media event arrives.
    act(() => selected.blur());
    viewport.dispatch();
    expect(document.activeElement).toBe(screen.getByRole("combobox"));
    viewport.setMobile(false);
    viewport.dispatch();
    expect(document.activeElement).toBe(selected);
  });

  it("does not steal focus from a preview link when the breakpoint changes", () => {
    const viewport = mockViewport();
    render(<IndexFixtureTA />);
    const link = screen.getByRole("link", { name: "Demo one" });
    act(() => link.focus());
    viewport.setMobile(true);
    viewport.dispatch();
    expect(document.activeElement).toBe(link);
  });
});
