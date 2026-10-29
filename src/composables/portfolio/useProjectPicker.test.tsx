// IMPORTS
import { useRef, useState } from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectPickerTA } from "@/components/portfolio/showcase/ProjectPickerTA";
import type { Locale, Project } from "@/components/portfolio/types";

// CONSTANTS
const project = (id: string, title: string, stack: string[]): Project => ({
  id,
  title,
  kind: "web",
  description: { es: title, en: title, pt: title },
  image: id,
  url: `https://${id}.example.com`,
  stack,
  tone: "silver",
});
const projects = [
  project("andina", "Automotores Andina", ["Vue 3"]),
  project("vertice", "Vértice Drive", ["React"]),
  project("orbit", "Orbit Audio", ["JavaScript"]),
];

// COMPONENT
const PickerFixtureTA = ({ locale = "es" }: { locale?: Locale }) => {
  const [active, setActive] = useState(projects[0]);
  const triggerRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button id={`showcase-tab-${active.id}`} type="button">
        Desktop selection
      </button>
      <ProjectPickerTA
        active={active}
        projects={projects}
        position="01 / 03"
        locale={locale}
        triggerRef={triggerRef}
        onSelect={(id) =>
          setActive(projects.find((item) => item.id === id) ?? projects[0])
        }
      />
      <a href={active.url}>Preview {active.title}</a>
    </>
  );
};

// FUNCTIONS
const mockViewport = () => {
  let desktop = false;
  const query = new EventTarget();
  Object.defineProperty(query, "matches", { get: () => desktop });
  vi.stubGlobal("matchMedia", () => query);
  return {
    query,
    setDesktop: () => {
      desktop = true;
      const event = new Event("change");
      Object.defineProperty(event, "matches", { value: true });
      act(() => query.dispatchEvent(event));
    },
  };
};
const openPicker = () => {
  const trigger = screen.getByRole("button", { name: /Elige un proyecto:/ });
  act(() => trigger.focus());
  fireEvent.click(trigger);
  return { trigger, dialog: screen.getByRole("dialog") };
};

// LIFECYCLE
beforeEach(() => {
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
    configurable: true,
    value: () => document.querySelector("dialog")?.setAttribute("open", ""),
  });
  Object.defineProperty(HTMLDialogElement.prototype, "close", {
    configurable: true,
    value: () => document.querySelector("dialog")?.removeAttribute("open"),
  });
  Object.defineProperty(HTMLDialogElement.prototype, "focus", {
    configurable: true,
    value: (options?: FocusOptions) => {
      const dialog = document.querySelector("dialog");
      if (dialog?.open) HTMLElement.prototype.focus.call(dialog, options);
    },
  });
  mockViewport();
  vi.stubGlobal("scrollTo", vi.fn());
  Object.defineProperty(window, "scrollY", { configurable: true, value: 460 });
});
afterEach(() => {
  cleanup();
  document.body.removeAttribute("style");
  document.documentElement.removeAttribute("style");
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

// TESTS
describe("mobile project picker", () => {
  it("opens a modal with visual options, traps focus and preserves the page position", () => {
    render(<PickerFixtureTA />);
    const { trigger, dialog } = openPicker();
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(dialog);
    expect(document.body.style.position).toBe("fixed");
    expect(document.body.style.top).toBe("-460px");
    expect(dialog.querySelectorAll("img").length).toBe(3);
    fireEvent.keyDown(dialog, { key: "Tab" });
    expect(document.activeElement).toBe(
      within(dialog).getByRole("button", { name: "Cerrar proyectos" }),
    );
    fireEvent.keyDown(document.activeElement!, { key: "Tab", shiftKey: true });
    expect(document.activeElement?.textContent).toContain("Orbit Audio");
    fireEvent.keyDown(document.activeElement!, { key: "Tab" });
    expect(document.activeElement).toBe(
      within(dialog).getByRole("button", { name: "Cerrar proyectos" }),
    );
  });

  it("searches names without accents and technologies, then selects without scrolling the page", () => {
    render(<PickerFixtureTA />);
    const { dialog } = openPicker();
    const input = within(dialog).getByRole("searchbox");
    fireEvent.change(input, { target: { value: "vertice" } });
    const option = within(dialog).getByRole("button", {
      name: /Vértice Drive/,
    });
    expect(
      within(dialog).queryByRole("button", { name: /Automotores Andina/ }),
    ).toBeNull();
    fireEvent.change(input, { target: { value: "Vue" } });
    expect(
      within(dialog).getByRole("button", { name: /Automotores Andina/ }),
    ).toBeTruthy();
    fireEvent.change(input, { target: { value: "vertice" } });
    fireEvent.click(
      within(dialog).getByRole("button", { name: /Vértice Drive/ }),
    );
    expect(option.isConnected).toBe(false);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(
      screen.getByRole("link", { name: "Preview Vértice Drive" }),
    ).toBeTruthy();
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Elige un proyecto: Vértice Drive" }),
    );
    expect(window.scrollTo).toHaveBeenLastCalledWith({
      left: 0,
      top: 460,
      behavior: "auto",
    });
    expect(document.body.style.position).toBe("");
  });

  it("supports arrow keys and Home/End without changing the selected project until activation", () => {
    render(<PickerFixtureTA />);
    const { dialog } = openPicker();
    const input = within(dialog).getByRole("searchbox");
    act(() => input.focus());
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(document.activeElement?.textContent).toContain("Automotores Andina");
    fireEvent.keyDown(document.activeElement!, { key: "End" });
    expect(document.activeElement?.textContent).toContain("Orbit Audio");
    fireEvent.keyDown(document.activeElement!, { key: "Home" });
    expect(document.activeElement?.textContent).toContain("Automotores Andina");
    expect(
      screen.getByRole("link", { name: "Preview Automotores Andina" }),
    ).toBeTruthy();
  });

  it.each(["escape", "backdrop", "cancel"])(
    "closes with %s and restores the trigger focus",
    (method) => {
      render(<PickerFixtureTA />);
      const { dialog, trigger } = openPicker();
      if (method === "escape") fireEvent.keyDown(dialog, { key: "Escape" });
      else if (method === "backdrop") fireEvent.click(dialog);
      else fireEvent(dialog, new Event("cancel", { cancelable: true }));
      expect(screen.queryByRole("dialog")).toBeNull();
      expect(document.activeElement).toBe(trigger);
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
      expect(document.body.style.overflow).toBe("");
    },
  );

  it("keeps the sheet open for an empty search and resets the query when reopened", () => {
    render(<PickerFixtureTA />);
    const { dialog } = openPicker();
    fireEvent.change(within(dialog).getByRole("searchbox"), {
      target: { value: "missing" },
    });
    expect(
      within(dialog).getByText("No hay proyectos con esa búsqueda."),
    ).toBeTruthy();
    fireEvent.keyDown(dialog, { key: "Escape" });
    const reopened = openPicker().dialog;
    expect(within(reopened).getByRole("searchbox").getAttribute("value")).toBe(
      "",
    );
    expect(
      within(reopened).getByRole("button", { name: /Orbit Audio/ }),
    ).toBeTruthy();
  });

  it("restores the input focus when clearing a search so the mobile keyboard stays open", () => {
    render(<PickerFixtureTA />);
    const { dialog } = openPicker();
    const input = within(dialog).getByRole("searchbox");
    fireEvent.change(input, { target: { value: "vertice" } });
    const clear = within(dialog).getByRole("button", { name: "Limpiar búsqueda" });
    act(() => clear.focus());
    fireEvent.click(clear);
    expect(document.activeElement).toBe(input);
    expect(input.getAttribute("value")).toBe("");
    expect(within(dialog).getByRole("button", { name: /Orbit Audio/ })).toBeTruthy();
  });

  it("closes on desktop and restores focus to the visible project index", () => {
    const viewport = mockViewport();
    render(<PickerFixtureTA />);
    openPicker();
    viewport.setDesktop();
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Desktop selection" }),
    );
  });

  it("restores existing body styles and removes its media listener on unmount", () => {
    const viewport = mockViewport();
    const remove = vi.spyOn(viewport.query, "removeEventListener");
    document.body.style.overflow = "clip";
    document.documentElement.style.scrollBehavior = "smooth";
    const view = render(<PickerFixtureTA />);
    openPicker();
    view.unmount();
    expect(document.body.style.position).toBe("");
    expect(document.body.style.overflow).toBe("clip");
    expect(document.documentElement.style.scrollBehavior).toBe("smooth");
    expect(remove).toHaveBeenCalledWith("change", expect.any(Function));
  });

  it.each(["en", "pt"] as const)(
    "renders the translated picker in %s",
    (locale) => {
      render(<PickerFixtureTA locale={locale} />);
      fireEvent.click(
        screen.getByRole("button", {
          name:
            locale === "en"
              ? "Choose a project: Automotores Andina"
              : "Escolha um projeto: Automotores Andina",
        }),
      );
      expect(
        screen.getByRole("dialog", {
          name:
            locale === "en" ? "Explore my projects." : "Explore meus projetos.",
        }),
      ).toBeTruthy();
    },
  );
});
