import type { ReactNode, RefObject } from "react";

export type Locale = "es" | "en" | "pt";
export type ProjectFilter = "all" | "web" | "app";
export type Finish = "natural" | "clay";

export interface Copy {
  nav: string[];
  contact: string;
  availability: string;
  discipline: string;
  heroTop: string;
  heroBottom: string;
  intro: string;
  viewWork: string;
  cv: string;
  explore: string;
  sculpture: string;
  pause: string;
  play: string;
  chrome: string;
  acid: string;
  home: string;
  now: string;
  workLabel: string;
  workTitle: string;
  workIntro: string;
  filters: [string, string, string];
  live: string;
  source: string;
  aboutLabel: string;
  aboutTitle: string;
  aboutText: string;
  aboutNote: string;
  experienceLabel: string;
  experienceTitle: string;
  stackLabel: string;
  stackTitle: string;
  stackIntro: string;
  stackGroups: [string, string, string];
  contactLabel: string;
  contactTop: string;
  contactBottom: string;
  contactText: string;
  copyEmail: string;
  copied: string;
  copyFailed: string;
  made: string;
  skip: string;
  menu: string;
  closeMenu: string;
  language: string;
}

export interface Project {
  id: string;
  title: string;
  kind: "web" | "app";
  description: Record<Locale, string>;
  image: string;
  url: string;
  source?: string;
  stack: string[];
  tone: string;
}

export interface SectionHeaderProps {
  number: string;
  label: string;
  title: string;
  children?: ReactNode;
  light?: boolean;
}

export interface PortfolioPreferences {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  copy: Copy;
}

export interface SculptureControls {
  finish: Finish;
  paused: boolean;
  reducedMotion: boolean;
}

export interface NavigationState {
  open: boolean;
  active: string;
  toggleRef: RefObject<HTMLButtonElement | null>;
  panelRef: RefObject<HTMLDivElement | null>;
  close: () => void;
  toggle: () => void;
}

export interface ContactActions {
  status: "idle" | "copied" | "error";
  copyEmail: () => Promise<void>;
}

export interface SculptureRendering {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  available: boolean;
}
