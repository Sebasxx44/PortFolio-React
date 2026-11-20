// IMPORTS
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type {
  ProjectPickerOptions,
  ProjectPickerReturn,
} from "@/components/portfolio/showcase/picker/types";

// CONSTANTS
const normalize = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
const focusableSelector =
  'button:not([disabled]), input:not([disabled]), [href], [tabindex="0"]';

// COMPOSABLE
export const useProjectPicker = ({
  projects,
  activeId,
  triggerRef,
  onSelect,
}: ProjectPickerOptions): ProjectPickerReturn => {
  // STATE
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // COMPUTED
  const results = useMemo(() => {
    const term = normalize(query);
    return projects.filter((project) =>
      normalize(`${project.title} ${project.stack.join(" ")}`).includes(term),
    );
  }, [projects, query]);

  // FUNCTIONS
  const close = (): void => setOpen(false);
  const clear = (): void => {
    setQuery("");
    inputRef.current?.focus({ preventScroll: true });
  };
  const show = (): void => {
    setQuery("");
    setOpen(true);
  };
  const choose = (id: string): void => {
    if (!projects.some((project) => project.id === id)) return;
    onSelect(id);
    close();
  };
  const onBackdrop: ProjectPickerReturn["dialog"]["onBackdrop"] = (event) => {
    if (event.target === event.currentTarget) close();
  };
  const onKeyDown: ProjectPickerReturn["dialog"]["onKeyDown"] = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (event.key === "Tab") {
      const controls = [
        ...dialog.querySelectorAll<HTMLElement>(focusableSelector),
      ];
      const first = controls[0];
      const last = controls.at(-1);
      if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === dialog)
      ) {
        event.preventDefault();
        last?.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last || document.activeElement === dialog)
      ) {
        event.preventDefault();
        first?.focus();
      }
      return;
    }
    const options = [
      ...dialog.querySelectorAll<HTMLButtonElement>("[data-project-option]"),
    ];
    const current = options.findIndex(
      (option) => option === document.activeElement,
    );
    let next: number;
    if (event.key === "ArrowDown")
      next = current < 0 ? 0 : (current + 1) % options.length;
    else if (event.key === "ArrowUp")
      next =
        current < 0
          ? options.length - 1
          : (current - 1 + options.length) % options.length;
    else if (event.key === "Home" && current >= 0) next = 0;
    else if (event.key === "End" && current >= 0) next = options.length - 1;
    else return;
    if (options.length === 0) return;
    event.preventDefault();
    options[next]?.focus();
  };

  // LIFECYCLE
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    const body = document.body;
    const html = document.documentElement;
    const x = window.scrollX;
    const y = window.scrollY;
    const saved = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      width: body.style.width,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
      scrollBehavior: html.style.scrollBehavior,
    };
    const scrollbar = Math.max(0, window.innerWidth - html.clientWidth);
    const padding =
      Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;
    Object.assign(body.style, {
      position: "fixed",
      top: `-${y}px`,
      left: `-${x}px`,
      width: "100%",
      overflow: "hidden",
    });
    if (scrollbar > 0) body.style.paddingRight = `${padding + scrollbar}px`;
    html.style.scrollBehavior = "auto";
    dialog.showModal();
    dialog.focus({ preventScroll: true });

    const desktop = window.matchMedia("(min-width: 801px)");
    const onDesktop = (event: MediaQueryListEvent): void => {
      if (event.matches) setOpen(false);
    };
    desktop.addEventListener("change", onDesktop);
    return () => {
      desktop.removeEventListener("change", onDesktop);
      if (dialog.open) dialog.close();
      Object.assign(body.style, {
        position: saved.position,
        top: saved.top,
        left: saved.left,
        width: saved.width,
        overflow: saved.overflow,
        paddingRight: saved.paddingRight,
      });
      window.scrollTo({ left: x, top: y, behavior: "auto" });
      html.style.scrollBehavior = saved.scrollBehavior;
      const target = desktop.matches
        ? document.getElementById(`showcase-tab-${activeId}`)
        : triggerRef.current;
      target?.focus({ preventScroll: true });
    };
  }, [open, activeId, triggerRef]);

  // RETURN
  return {
    dialog: { ref: dialogRef, open, show, close, onKeyDown, onBackdrop },
    search: { inputRef, query, setQuery, clear, results },
    selection: { choose },
  };
};
