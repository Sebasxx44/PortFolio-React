import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import type { ReactNode } from "react";
import { WorkSectionTA } from "@/components/portfolio/WorkSectionTA";
import { copy, projects } from "@/components/portfolio/content";

vi.mock("@/components/portfolio/RevealTA", () => ({
  RevealTA: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

const scroll = vi.fn();
let originalScroll: PropertyDescriptor | undefined;
beforeEach(() => {
  history.replaceState(null, "", "/");
  originalScroll = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "scrollIntoView",
  );
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    value: scroll,
  });
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }));
});
afterEach(() => {
  cleanup();
  if (originalScroll)
    Object.defineProperty(
      HTMLElement.prototype,
      "scrollIntoView",
      originalScroll,
    );
  else Reflect.deleteProperty(HTMLElement.prototype, "scrollIntoView");
  history.replaceState(null, "", "/");
  scroll.mockClear();
  vi.unstubAllGlobals();
});

const mount = () =>
  render(
    <WorkSectionTA
      preferences={{ locale: "es", setLocale: vi.fn(), copy: copy.es }}
    />,
  );

describe("proyectos destacados", () => {
  it("muestra los seis primeros en el orden del portafolio, con sus enlaces y el archivo al final", () => {
    mount();
    const scenes = screen.getAllByRole("article");
    expect(scenes.map((scene) => scene.dataset.project)).toEqual(
      projects.slice(0, 6).map((p) => p.id),
    );
    for (const [i, scene] of scenes.entries()) {
      expect(
        within(scene)
          .getByRole("link", { name: copy.es.live })
          .getAttribute("href"),
      ).toBe(projects[i].url);
    }
    const more = screen.getByRole("button", { name: "Ver más proyectos" });
    expect(scenes.at(-1)?.contains(more)).toBe(true);
    expect(more.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("tablist")).toBeNull();
  });

  it("abre solo los proyectos restantes y devuelve el foco al sexto al cerrar", async () => {
    mount();
    const more = screen.getByRole("button", { name: "Ver más proyectos" });
    fireEvent.click(more);
    const list = await screen.findByRole("tablist");
    expect(
      within(list)
        .getAllByRole("tab")
        .map((tab) => tab.id),
    ).toEqual(projects.slice(6).map((p) => "showcase-tab-" + p.id));
    expect(more.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(
      screen.getByRole("button", { name: "Volver a los destacados" }),
    );
    expect(document.activeElement).toBe(more);
    expect(more.getAttribute("aria-expanded")).toBe("false");
  });
});
