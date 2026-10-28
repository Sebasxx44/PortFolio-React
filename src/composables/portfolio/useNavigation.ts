import { useEffect, useRef, useState } from "react";
import type { NavigationState } from "@/components/portfolio/types";

export const useNavigation = (): { navigation: NavigationState } => {
  // State
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("work");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);

  // Effects
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );
    for (const id of ["work", "about", "experience"]) {
      const target = document.getElementById(id);
      if (target) observer.observe(target);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        toggleRef.current?.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth > 760) close();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return {
    navigation: {
      open,
      active,
      toggleRef,
      panelRef,
      close,
      toggle: () => setOpen((value) => !value),
    },
  };
};
