import { lazy, Suspense } from "react";
import { useReducedMotion } from "framer-motion";
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
      </div>
      <div className="hero-composition">
        <div className="hero-copy">
          <RevealTA>
            <p className="hero-discipline">
              {copy.discipline}
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
              </a>
              <a className="button button--secondary" href={cv[locale]} download>
                {copy.cv}
              </a>
            </div>
          </RevealTA>
        </div>
        <div
          className="sculpture-stage"
          role="group"
          aria-label={copy.sculpture}
        >
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
        </div>
      </div>
    </section>
  );
};
