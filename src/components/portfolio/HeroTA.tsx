import { lazy, Suspense } from "react";
import { useReducedMotion } from "framer-motion";
import {
  FiArrowDown,
  FiArrowDownRight,
  FiArrowUpRight,
  FiDownload,
} from "react-icons/fi";
import { cv } from "@/components/portfolio/content";
import { RevealTA } from "@/components/portfolio/RevealTA";
import type { PortfolioPreferences } from "@/components/portfolio/types";

const SculptureCanvasTA = lazy(
  () => import("@/components/portfolio/SculptureCanvasTA"),
);

export const HeroTA = ({
  preferences,
}: {
  preferences: PortfolioPreferences;
}) => {
  const { copy, locale } = preferences;
  const reducedMotion = Boolean(useReducedMotion());
  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="hero-topline">
        <p className="eyebrow">
          <span className="status-dot" />
          {copy.availability}
        </p>
        <p className="hero-coordinate">
          PEREIRA, CO <span>04°48′ N · 75°41′ W</span>
        </p>
      </div>
      <div className="hero-composition">
        <div className="hero-copy">
          <RevealTA>
            <p className="hero-discipline">
              {copy.discipline}
              <span> / CREATIVE ENGINEER</span>
            </p>
          </RevealTA>
          <RevealTA delay={0.08}>
            <h1 id="hero-title">
              {copy.heroTop}
              <br />
              <span>{copy.heroBottom}</span>
            </h1>
          </RevealTA>
          <RevealTA delay={0.16}>
            <p className="hero-intro">{copy.intro}</p>
            <div className="hero-actions">
              <a href="#work" className="button button--acid">
                {copy.viewWork}
                <FiArrowDownRight aria-hidden="true" />
              </a>
              <a className="text-link" href={cv[locale]} download>
                {copy.cv}
                <FiDownload aria-hidden="true" />
              </a>
            </div>
          </RevealTA>
        </div>
        <div
          className="sculpture-stage"
          role="group"
          aria-label={copy.sculpture}
        >
          <span className="stage-cross stage-cross--one" aria-hidden="true">
            +
          </span>
          <span className="stage-cross stage-cross--two" aria-hidden="true">
            +
          </span>
          <div className="stage-grid" aria-hidden="true" />
          <div className="sculpture-fallback" aria-hidden="true">
            <img src="/models/sebaz-avatar-texture.webp" alt="" width="1200" height="1185" />
          </div>
          <Suspense fallback={null}>
            <SculptureCanvasTA
              finish="natural"
              paused={false}
              reducedMotion={reducedMotion}
            />
          </Suspense>
          <span className="sculpture-caption">
            FIG. 01 — SEBAZ / INTERACTIVE PORTRAIT
          </span>
          <span className="sculpture-index" aria-hidden="true">
            S/01
          </span>
        </div>
      </div>
      <div className="hero-bottom">
        <a className="scroll-cue" href="#work">
          <span className="scroll-cue-icon">
            <FiArrowDown aria-hidden="true" />
          </span>
          {copy.explore}
        </a>
        <p>
          FRONTEND <span>×</span> BACKEND <span>×</span> HUMAN EXPERIENCE
        </p>
        <a className="hero-monogram" href="#about" aria-label={copy.nav[1]}>
          <FiArrowUpRight />
        </a>
      </div>
    </section>
  );
};
