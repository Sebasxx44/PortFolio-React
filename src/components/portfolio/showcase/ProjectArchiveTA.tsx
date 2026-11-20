import { FiArrowLeft, FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { RevealTA } from "@/components/portfolio/RevealTA";
import { ProjectPickerTA } from "@/components/portfolio/showcase/ProjectPickerTA";
import { showcaseLabels } from "@/components/portfolio/showcase/copy";
import { useProjectShowcase } from "@/composables/portfolio/useProjectShowcase";
import type {
  PortfolioPreferences,
  Project,
} from "@/components/portfolio/types";
import "@/components/portfolio/project-showcase.css";

export const ProjectArchiveTA = ({
  preferences,
  projects,
  onClose,
}: {
  preferences: PortfolioPreferences;
  projects: readonly Project[];
  onClose: () => void;
}) => {
  const { copy, locale } = preferences;
  const labels = showcaseLabels[locale];
  const { collection, selection, navigation } = useProjectShowcase(projects);
  const active = selection.active;

  return (
    <section
      className="project-archive section-shell showcase-section"
      aria-labelledby="archive-heading"
    >
      <header className="archive-heading">
        <h2 id="archive-heading" tabIndex={-1}>
          {labels.archive}
        </h2>
        <button type="button" className="archive-close" onClick={onClose}>
          {labels.backToFeatured}
        </button>
      </header>
      <div className="showcase-toolbar">
        <div
          className="showcase-filters"
          role="group"
          aria-label={copy.filterByType}
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
          {String(collection.visible.length).padStart(2, "0")} {labels.projects}
        </p>
      </div>
      {active && (
        <RevealTA className="showcase-layout">
          <aside className="project-index">
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
                  onPointerEnter={(event) =>
                    navigation.onIndexPointerEnter(event, project.id)
                  }
                  onKeyDown={(event) => navigation.onIndexKeyDown(event, index)}
                >
                  <span className="project-index-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="project-index-name">{project.title}</span>
                </button>
              ))}
            </div>
          </aside>
          <div className="showcase-feature">
            <ProjectPickerTA
              active={active}
              projects={collection.visible}
              position={selection.position}
              locale={locale}
              triggerRef={navigation.selectorRef}
              onSelect={selection.select}
            />
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
                </a>
                <div className="showcase-project-details">
                  <div className="showcase-project-copy">
                    <h3>{active.title}</h3>
                    <p>{active.description[locale]}</p>
                  </div>
                  <div className="showcase-project-links">
                    <a
                      href={active.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {copy.live}
                      <FiArrowUpRight aria-hidden="true" />
                    </a>
                    {active.source && (
                      <a
                        href={active.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="showcase-code-link"
                      >
                        {copy.source}
                      </a>
                    )}
                  </div>
                </div>
                <ul className="showcase-stack" aria-label={labels.stack}>
                  {active.stack.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="showcase-navigation">
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
                <span
                  className="showcase-position"
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <span className="showcase-position-title">
                    {active.title} ·{" "}
                  </span>
                  {selection.position}
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
