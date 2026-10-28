import { FiArrowUpRight, FiMapPin } from "react-icons/fi";
import { ActionHeaderTA } from "@/components/portfolio/ActionHeaderTA";
import { RevealTA } from "@/components/portfolio/RevealTA";
import { github, linkedin } from "@/components/portfolio/content";
import type { Copy } from "@/components/portfolio/types";

export const AboutSectionTA = ({ copy }: { copy: Copy }) => (
  <section id="about" className="about-section section-shell">
    <RevealTA>
      <ActionHeaderTA
        number="02"
        label={copy.aboutLabel}
        title={copy.aboutTitle}
        light
      />
    </RevealTA>
    <div className="about-grid">
      <RevealTA className="portrait-wrap">
        <div className="portrait-frame">
          <img
            src="/images/optimized/sebastian-waterfall.webp"
            alt="Sebastián Sánchez"
            width="960"
            height="1280"
            loading="lazy"
            decoding="async"
          />
          <div className="portrait-label">
            <FiMapPin aria-hidden="true" />
            <span>Pereira, Colombia</span>
            <span>↗</span>
          </div>
        </div>
        <span className="portrait-signature">Sebastián.</span>
      </RevealTA>
      <RevealTA delay={0.1} className="about-story">
        <span className="about-asterisk" aria-hidden="true">
          ✳
        </span>
        <p className="about-lead">{copy.aboutText}</p>
        <p className="about-note">{copy.aboutNote}</p>
        <div className="about-links">
          <a href={github} target="_blank" rel="noopener noreferrer">
            GitHub
            <FiArrowUpRight />
          </a>
          <a href={linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
            <FiArrowUpRight />
          </a>
        </div>
        <div className="about-details">
          <span>FULL STACK</span>
          <span>COLOMBIA → WORLD</span>
          <span>ES / EN / PT</span>
        </div>
      </RevealTA>
    </div>
  </section>
);
