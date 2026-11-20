// IMPORTS
import type { KeyboardEvent, MouseEvent, RefObject } from "react";
import type { Locale, Project } from "@/components/portfolio/types";

// TYPES
export interface ProjectPickerProps {
  active: Project;
  projects: readonly Project[];
  position: string;
  locale: Locale;
  triggerRef: RefObject<HTMLButtonElement | null>;
  onSelect: (id: string) => void;
}

export interface ProjectPickerLabels {
  title: string;
  subtitle: string;
  search: string;
  close: string;
  clear: string;
  empty: string;
  current: string;
}

export interface ProjectPickerOptions {
  projects: readonly Project[];
  activeId: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
  onSelect: (id: string) => void;
}

export interface ProjectPickerReturn {
  dialog: {
    ref: RefObject<HTMLDialogElement | null>;
    open: boolean;
    show: () => void;
    close: () => void;
    onKeyDown: (event: KeyboardEvent<HTMLDialogElement>) => void;
    onBackdrop: (event: MouseEvent<HTMLDialogElement>) => void;
  };
  search: {
    inputRef: RefObject<HTMLInputElement | null>;
    query: string;
    setQuery: (value: string) => void;
    clear: () => void;
    results: readonly Project[];
  };
  selection: {
    choose: (id: string) => void;
  };
}
