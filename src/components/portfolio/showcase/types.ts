import type {
  KeyboardEvent,
  PointerEvent,
  RefCallback,
  RefObject,
} from "react";
import type { Project, ProjectFilter } from "@/components/portfolio/types";

export interface ShowcaseFilterOption {
  value: ProjectFilter;
  labelIndex: number;
  count: number;
}

export interface ShowcaseCollection {
  visible: readonly Project[];
  filters: readonly ShowcaseFilterOption[];
  filter: ProjectFilter;
  total: number;
  setFilter: (filter: ProjectFilter) => void;
}

export interface ShowcaseSelection {
  active: Project | null;
  index: number;
  position: string;
  select: (id: string) => void;
}

export interface ShowcaseNavigation {
  available: boolean;
  previous: () => void;
  next: () => void;
  panelRef: RefObject<HTMLDivElement | null>;
  selectorRef: RefObject<HTMLButtonElement | null>;
  setIndexRef: (id: string) => RefCallback<HTMLButtonElement>;
  onIndexPointerEnter: (
    event: PointerEvent<HTMLButtonElement>,
    id: string,
  ) => void;
  onIndexKeyDown: (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => void;
}

export interface ShowcaseFocusState {
  panelRef: RefObject<HTMLDivElement | null>;
  selectorRef: RefObject<HTMLButtonElement | null>;
  setIndexRef: (id: string) => RefCallback<HTMLButtonElement>;
  focusIndex: (id: string) => void;
  isPreviewFocused: () => boolean;
}

export interface ProjectShowcaseState {
  collection: ShowcaseCollection;
  selection: ShowcaseSelection;
  navigation: ShowcaseNavigation;
}

export interface ShowcaseLabels {
  index: string;
  selected: string;
  previous: string;
  next: string;
  select: string;
  preview: string;
  website: string;
  application: string;
  explore: string;
  keyboard: string;
  projects: string;
  project: string;
  stack: string;
}
