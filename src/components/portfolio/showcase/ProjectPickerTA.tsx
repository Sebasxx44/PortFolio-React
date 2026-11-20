// IMPORTS
import { useId } from "react";
import { createPortal } from "react-dom";
import { FiCheck, FiChevronDown, FiSearch, FiX } from "react-icons/fi";
import { showcaseLabels } from "@/components/portfolio/showcase/copy";
import { projectPickerLabels } from "@/components/portfolio/showcase/picker/copy";
import { useProjectPicker } from "@/composables/portfolio/useProjectPicker";
import type { ProjectPickerProps } from "@/components/portfolio/showcase/picker/types";
import "@/components/portfolio/showcase/picker/project-picker.css";

// COMPONENT
export const ProjectPickerTA = ({
  active,
  projects,
  position,
  locale,
  triggerRef,
  onSelect,
}: ProjectPickerProps) => {
  // CONSTANTS
  const id = useId();
  const labels = showcaseLabels[locale];
  const copy = projectPickerLabels[locale];

  // COMPOSABLES
  const { dialog, search, selection } = useProjectPicker({
    projects,
    activeId: active.id,
    triggerRef,
    onSelect,
  });

  // TEMPLATE
  return (
    <div className="showcase-mobile-selector">
      <div className="project-picker-caption">
        <span>{labels.select}</span>
        <span>{position}</span>
      </div>
      <button
        ref={triggerRef}
        type="button"
        className="project-picker-trigger"
        aria-haspopup="dialog"
        aria-expanded={dialog.open}
        aria-controls={`${id}-dialog`}
        aria-label={`${labels.select}: ${active.title}`}
        onClick={dialog.show}
      >
        <img
          src={`/images/optimized/${active.image}.webp`}
          alt=""
          width="144"
          height="100"
          decoding="async"
        />
        <span className="project-picker-trigger-copy">
          <span>
            {active.kind === "web" ? labels.website : labels.application}
          </span>
          <strong>{active.title}</strong>
        </span>
        <span className="project-picker-chevron">
          <FiChevronDown aria-hidden="true" />
        </span>
      </button>
      {createPortal(
        <dialog
          ref={dialog.ref}
          id={`${id}-dialog`}
          className="project-picker-dialog"
          aria-labelledby={`${id}-heading`}
          aria-describedby={`${id}-description`}
          tabIndex={-1}
          onKeyDown={dialog.onKeyDown}
          onClick={dialog.onBackdrop}
          onCancel={(event) => {
            event.preventDefault();
            dialog.close();
          }}
          onClose={dialog.close}
        >
          <div className="project-picker-surface">
            <div className="project-picker-handle" aria-hidden="true" />
            <header className="project-picker-header">
              <div>
                <p id={`${id}-description`}>{copy.subtitle}</p>
                <h2 id={`${id}-heading`}>{copy.title}</h2>
              </div>
              <button
                type="button"
                onClick={dialog.close}
                aria-label={copy.close}
              >
                <FiX aria-hidden="true" />
              </button>
            </header>
            <div className="project-picker-search">
              <FiSearch aria-hidden="true" />
              <input
                  ref={search.inputRef}
                type="search"
                value={search.query}
                onChange={(event) => search.setQuery(event.target.value)}
                placeholder={copy.search}
                aria-label={copy.search}
                maxLength={120}
                autoComplete="off"
              />
              <span>
                {search.query && (
                  <button
                    type="button"
                      onClick={search.clear}
                    aria-label={copy.clear}
                  >
                    <FiX aria-hidden="true" />
                  </button>
                )}
              </span>
            </div>
            <p
              className="project-picker-count"
              role="status"
              aria-live="polite"
            >
              {String(search.results.length).padStart(2, "0")} /{" "}
              {String(projects.length).padStart(2, "0")} {labels.projects}
            </p>
            <ul className="project-picker-list" aria-label={labels.index}>
              {search.results.map((project) => (
                <li key={project.id}>
                  <button
                    type="button"
                    data-project-option
                    aria-current={project.id === active.id ? "true" : undefined}
                    onClick={() => selection.choose(project.id)}
                  >
                    <span className="project-picker-number">
                      {String(projects.indexOf(project) + 1).padStart(2, "0")}
                    </span>
                    <img
                      src={`/images/optimized/${project.image}.webp`}
                      alt=""
                      width="144"
                      height="100"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="project-picker-option-copy">
                      <strong>{project.title}</strong>
                      <span>
                        {project.kind === "web"
                          ? labels.website
                          : labels.application}
                      </span>
                    </span>
                    <span className="project-picker-check">
                      {project.id === active.id && (
                        <FiCheck aria-label={copy.current} />
                      )}
                    </span>
                  </button>
                </li>
              ))}
              {search.results.length === 0 && (
                <li className="project-picker-empty">
                  <FiSearch aria-hidden="true" />
                  <p>{copy.empty}</p>
                </li>
              )}
            </ul>
          </div>
        </dialog>,
        document.body,
      )}
    </div>
  );
};
