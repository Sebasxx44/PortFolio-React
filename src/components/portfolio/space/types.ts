import type { RefObject } from "react";

export interface SpaceStar {
  x: number;
  y: number;
  depth: number;
  radius: number;
  opacity: number;
  phase: number;
  speed: number;
}

export interface SpaceViewport {
  width: number;
  height: number;
  ratio: number;
  compact: boolean;
}

export interface SpacePointer {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
}

export interface SpaceBackdropRendering {
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

export interface SpaceBackdropControls {
  rendering: SpaceBackdropRendering;
}
