import { useEffect, useRef } from "react";
import type { ShowcaseFocusState } from "@/components/portfolio/showcase/types";

type FocusArea = "index" | "selector" | null;

export const useShowcaseFocus = (activeId: string): ShowcaseFocusState => {
  const panelRef = useRef<HTMLDivElement>(null);
  const selectorRef = useRef<HTMLButtonElement>(null);
  const indexRefs = useRef(new Map<string, HTMLButtonElement>());

  // Keep the focused control available when its responsive counterpart appears.
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mobile = window.matchMedia("(max-width: 800px)");
    const getArea = (target: EventTarget | null): FocusArea => {
      if (target && target === selectorRef.current) return "selector";
      return [...indexRefs.current.values()].some((button) => button === target)
        ? "index"
        : null;
    };
    let focusedArea = getArea(document.activeElement);
    let previousMobile = mobile.matches;
    const onFocusIn = (event: FocusEvent) => {
      focusedArea = getArea(event.target);
    };
    const onFocusOut = (event: FocusEvent) => {
      if (!getArea(event.target)) return;
      if (event.relatedTarget) focusedArea = getArea(event.relatedTarget);
      else if (mobile.matches === previousMobile) focusedArea = null;
    };
    const onBreakpoint = (event: MediaQueryListEvent) => {
      const currentArea = getArea(document.activeElement);
      // Browsers may blur a newly hidden control before dispatching this event.
      const previousArea =
        document.activeElement === document.body ? focusedArea : null;
      const area = currentArea ?? previousArea;
      if (event.matches && area === "index") selectorRef.current?.focus({ preventScroll: true });
      else if (!event.matches && area === "selector")
        indexRefs.current.get(activeId)?.focus();
      previousMobile = event.matches;
    };
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    mobile.addEventListener("change", onBreakpoint);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      mobile.removeEventListener("change", onBreakpoint);
    };
  }, [activeId]);

  return {
    panelRef,
    selectorRef,
    setIndexRef: (id) => (node) => {
      if (node) indexRefs.current.set(id, node);
      else indexRefs.current.delete(id);
    },
    focusIndex: (id) => indexRefs.current.get(id)?.focus(),
    isPreviewFocused: () =>
      Boolean(panelRef.current?.contains(document.activeElement)),
  };
};
