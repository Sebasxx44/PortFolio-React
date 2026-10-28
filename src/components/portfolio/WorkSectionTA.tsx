import { useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { projects } from "@/components/portfolio/content";
import { ActionHeaderTA } from "@/components/portfolio/ActionHeaderTA";
import { RevealTA } from "@/components/portfolio/RevealTA";
import type {
  PortfolioPreferences,
  ProjectFilter,
} from "@/components/portfolio/types";

export const WorkSectionTA = ({
  preferences,
}: {
  preferences: PortfolioPreferences;
}) => {
  const { copy, locale } = preferences;
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const filters: ProjectFilter[] = ["all", "web", "app"];
  const visible = projects.filter(
    (project) => filter === "all" || project.kind === filter,
  );
  return (
    <section
      id="work"
      className="work-section section-shell"
      aria-labelledby="section-heading-01"
    >
      <RevealTA>
        <ActionHeaderTA
          number="01"
          label={copy.workLabel}
          title={copy.workTitle}
        >
          <p>{copy.workIntro}</p>
        </ActionHeaderTA>
      </RevealTA>
      <div className="work-toolbar">
        <div
          className="project-filters"
          role="group"
          aria-label={copy.workLabel}
        >
          {filters.map((value, index) => (
            <button
              key={value}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {copy.filters[index]}
              <sup>
                {value === "all"
                  ? projects.length
                  : projects.filter((project) => project.kind === value).length}
              </sup>
            </button>
          ))}
        </div>
        <span className="work-counter" aria-live="polite">
          {String(visible.length).padStart(2, "0")} /{" "}
          {String(projects.length).padStart(2, "0")}
        </span>
      </div>
      <div className="project-grid">
        {visible.map((project) => (
          <RevealTA key={project.id} className="project-reveal">
            <article className={`project-card project-card--${project.tone}`}>
              <a
                className="project-preview"
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${copy.live}: ${project.title}`}
              >
                <div className="project-preview-meta">
                  <span>
                    SEBAZ / {project.kind === "web" ? "WEBSITE" : "APPLICATION"}
                  </span>
                  <span className="project-open">
                    <FiArrowUpRight />
                  </span>
                </div>
                <div className="browser-frame">
                  <div className="browser-toolbar">
                    <i />
                    <i />
                    <i />
                    <span>{new URL(project.url).hostname}</span>
                  </div>
                  <img
                    src={`/images/optimized/${project.image}.webp`}
                    alt=""
                    width="1400"
                    height="850"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <span className="project-ghost" aria-hidden="true">
                  {project.title}
                </span>
              </a>
              <div className="project-info">
                <div>
                  <h3>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {project.title}
                      <FiArrowUpRight aria-hidden="true" />
                    </a>
                  </h3>
                  <p>{project.description[locale]}</p>
                </div>
                {project.source && (
                  <a
                    href={project.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="source-link"
                    aria-label={`${copy.source}: ${project.title}`}
                  >
                    <span aria-hidden="true">{"</>"}</span>
                  </a>
                )}
              </div>
              <ul className="project-stack" aria-label="Stack">
                {project.stack.map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
            </article>
          </RevealTA>
        ))}
      </div>
    </section>
  );
};
