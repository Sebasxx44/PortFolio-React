import {
  FiArrowDownRight,
  FiArrowLeft,
  FiArrowRight,
  FiArrowUpRight,
  FiCode,
} from "react-icons/fi";
import { ActionHeaderTA } from "@/components/portfolio/ActionHeaderTA";
import { RevealTA } from "@/components/portfolio/RevealTA";
import { showcaseLabels } from "@/components/portfolio/showcase/copy";
import { useProjectShowcase } from "@/composables/portfolio/useProjectShowcase";
import type { PortfolioPreferences } from "@/components/portfolio/types";
import "@/components/portfolio/project-showcase.css";

export const WorkSectionTA = ({
  preferences,
}: {
  preferences: PortfolioPreferences;
}) => {
  const { copy, locale } = preferences;
  const labels = showcaseLabels[locale];
  const { collection, selection, navigation } = useProjectShowcase();
  const active = selection.active;

  return (
    <section
      id="work"
      className="work-section section-shell showcase-section"
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
      <div className="showcase-toolbar">
        <div
          className="showcase-filters"
          role="group"
          aria-label={copy.workLabel}
        >
          {collection.filters.map(({ value, labelIndex, count }) => (
            <button
              key={value}
              type="button"
              aria-pressed={collection.filter === value}
              onClick={() => collection.setFilter(value)}
            >
              {copy.filters[labelIndex]}
              <span>{String(count).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
        <p className="showcase-total" aria-live="polite">
          <span className="showcase-status-dot" aria-hidden="true" />
          {String(collection.visible.length).padStart(2, "0")} {labels.projects}
          <span className="showcase-total-divider" aria-hidden="true">/</span>
          {String(collection.total).padStart(2, "0")}
        </p>
      </div>
      {active && (
        <RevealTA className="showcase-layout">
          <aside className="project-index">
            <div className="project-index-heading">
              <span>{labels.index}</span>
              <FiArrowDownRight aria-hidden="true" />
            </div>
            <div
              className="project-index-list"
              role="tablist"
              aria-orientation="vertical"
              aria-label={labels.index}
            >
              {collection.visible.map((project, index) => (
                <button
                  key={project.id}
                  ref={navigation.setIndexRef(project.id)}
                  id={`showcase-tab-${project.id}`}
                  className="project-index-item"
                  type="button"
                  role="tab"
                  aria-selected={active.id === project.id}
                  aria-controls="project-showcase-panel"
                  tabIndex={active.id === project.id ? 0 : -1}
                  onClick={() => selection.select(project.id)}
                  onFocus={() => selection.select(project.id)}
                  onPointerEnter={(event) => navigation.onIndexPointerEnter(event, project.id)}
                  onKeyDown={(event) => navigation.onIndexKeyDown(event, index)}
                >
                  <span className="project-index-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="project-index-name">{project.title}</span>
                  <FiArrowUpRight className="project-index-arrow" aria-hidden="true" />
                </button>
              ))}
            </div>
            <p className="project-index-hint">{labels.keyboard}</p>
          </aside>
          <div className="showcase-feature">
            <div className="showcase-mobile-selector">
              <label htmlFor="showcase-project-select">{labels.select}</label>
              <select
                ref={navigation.selectorRef}
                id="showcase-project-select"
                value={active.id}
                aria-controls="project-showcase-panel"
                onChange={(event) => selection.select(event.target.value)}
              >
                {collection.visible.map((project, index) => (
                  <option key={project.id} value={project.id}>
                    {String(index + 1).padStart(2, "0")} — {project.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="showcase-preview-topline" aria-hidden="true">
              <span>{active.kind === "web" ? labels.website : labels.application}</span>
              <span>{new URL(active.url).hostname}</span>
            </div>
            <div
              ref={navigation.panelRef}
              id="project-showcase-panel"
              className="showcase-panel"
              role="tabpanel"
              aria-labelledby={`showcase-tab-${active.id}`}
            >
              <div key={active.id} className="showcase-selected-content">
                <a
                  className="showcase-screen"
                  href={active.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${copy.live}: ${active.title}`}
                >
                  <img
                    src={`/images/optimized/${active.image}.webp`}
                    alt={`${labels.preview} ${active.title}`}
                    width="1600"
                    height="1000"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="showcase-screen-link" aria-hidden="true">
                    {copy.live}<FiArrowUpRight />
                  </span>
                </a>
                <div className="showcase-project-details">
                  <div className="showcase-project-copy">
                    <h3>{active.title}</h3>
                    <p>{active.description[locale]}</p>
                  </div>
                  <div className="showcase-project-links">
                    <a href={active.url} target="_blank" rel="noopener noreferrer">
                      {copy.live}<FiArrowUpRight aria-hidden="true" />
                    </a>
                    {active.source && (
                      <a
                        href={active.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="showcase-code-link"
                      >
                        <FiCode aria-hidden="true" />{copy.source}
                      </a>
                    )}
                  </div>
                </div>
                <ul className="showcase-stack" aria-label={labels.stack}>
                  {active.stack.map((technology) => <li key={technology}>{technology}</li>)}
                </ul>
              </div>
            </div>
            <div className="showcase-navigation">
              <span className="showcase-navigation-label">{labels.explore}</span>
              <div className="showcase-navigation-controls">
                <button
                  type="button"
                  onClick={navigation.previous}
                  disabled={!navigation.available}
                  aria-label={labels.previous}
                  aria-controls="project-showcase-panel"
                >
                  <FiArrowLeft aria-hidden="true" />
                </button>
                <span className="showcase-position" role="status" aria-live="polite" aria-atomic="true">
                  <span className="showcase-position-title">{active.title} · </span>{selection.position}
                </span>
                <button
                  type="button"
                  onClick={navigation.next}
                  disabled={!navigation.available}
                  aria-label={labels.next}
                  aria-controls="project-showcase-panel"
                >
                  <FiArrowRight aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </RevealTA>
      )}
    </section>
  );
};
