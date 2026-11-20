import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FiArrowDown, FiArrowUpRight } from "react-icons/fi";
import { projects } from "@/components/portfolio/content";
import { ProjectArchiveTA } from "@/components/portfolio/showcase/ProjectArchiveTA";
import { showcaseLabels } from "@/components/portfolio/showcase/copy";
import { useFeaturedScroll } from "@/composables/portfolio/useFeaturedScroll";
import type { PortfolioPreferences } from "@/components/portfolio/types";
import "@/components/portfolio/featured-work.css";

const featured = projects.slice(0, 6);
const archive = projects.slice(featured.length);
const covers = import.meta.glob<string>("/src/assets/featured/*.webp", {
  eager: true,
  import: "default",
  query: "?url",
});
const thumbnail = (image: string, shape: string) =>
  covers[`/src/assets/featured/${image}-${shape}.webp`];
const sceneId = (id: string) => "proyecto-" + id;
const twoDigits = (n: number) => String(n).padStart(2, "0");

export const WorkSectionTA = ({
  preferences,
}: {
  preferences: PortfolioPreferences;
}) => {
  const { copy, locale } = preferences;
  const labels = showcaseLabels[locale];
  const [expanded, setExpanded] = useState(
    () => location.hash === "#archivo-proyectos",
  );
  const more = useRef<HTMLButtonElement>(null);
  const archiveRequested = useRef(false);
  const returnToFeatured = useRef(false);
  const gallery = useFeaturedScroll();

  // Vite renders the section after the browser's initial fragment lookup.
  useLayoutEffect(() => {
    const fragment = location.hash.slice(1);
    if (
      fragment !== "work" &&
      fragment !== "archivo-proyectos" &&
      !featured.some((project) => sceneId(project.id) === fragment)
    )
      return;
    const section = document.getElementById(fragment);
    if (!section) return;
    const align = () =>
      section.scrollIntoView({ block: "start", behavior: "instant" });
    align();
    let mounted = true;
    document.fonts?.ready.then(() => {
      if (
        mounted &&
        location.hash.slice(1) === fragment &&
        Math.abs(section.getBoundingClientRect().top) < 40
      )
        align();
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const sync = () => setExpanded(location.hash === "#archivo-proyectos");
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useLayoutEffect(() => {
    if (expanded) {
      document
        .getElementById("archive-heading")
        ?.focus({ preventScroll: true });
      document
        .getElementById("archivo-proyectos")
        ?.scrollIntoView({
          block: "start",
          behavior: archiveRequested.current ? "auto" : "instant",
        });
      archiveRequested.current = false;
    } else if (returnToFeatured.current) {
      returnToFeatured.current = false;
      more.current?.focus({ preventScroll: true });
      more.current?.closest("article")?.scrollIntoView({ block: "start" });
    }
  }, [expanded]);

  function showArchive() {
    archiveRequested.current = true;
    if (location.hash !== "#archivo-proyectos")
      location.hash = "archivo-proyectos";
    setExpanded(true);
  }
  function closeArchive() {
    const last = featured.at(-1);
    if (!last) return;
    returnToFeatured.current = true;
    history.replaceState(history.state, "", "#" + sceneId(last.id));
    setExpanded(false);
  }

  return (
    <section id="work" className="featured-work" aria-labelledby="work-heading">
      <h2 id="work-heading" className="sr-only">
        {copy.nav[0]}
      </h2>
      <div ref={gallery} className="featured-sequence">
        {featured.map((project, i) => {
          const next = featured[i + 1];
          const mobileCover = thumbnail(project.image, "mobile");
          const compactCover = thumbnail(project.image, "compact");
          const wideCover = thumbnail(project.image, "wide");
          const titleId = "titulo-" + project.id;
          return (
            <article
              id={sceneId(project.id)}
              className="feature-slide"
              data-project={project.id}
              key={project.id}
              aria-labelledby={titleId}
            >
              <a
                className="feature-media"
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={-1}
                aria-label={copy.live + " · " + project.title}
              >
                <picture>
                  {compactCover && (
                    <source
                      media="(max-width: 550px) and (max-height: 680px) and (orientation: portrait), (min-width: 600px) and (max-aspect-ratio: 1/1), (min-aspect-ratio: 4/5) and (max-aspect-ratio: 1/1)"
                      srcSet={compactCover}
                      width="930"
                      height="1035"
                    />
                  )}
                  {mobileCover && (
                    <source
                      media="(max-aspect-ratio: 4/5)"
                      srcSet={mobileCover}
                      width="828"
                      height="1380"
                    />
                  )}
                  {wideCover && (
                    <source
                      media="(min-aspect-ratio: 3/2)"
                      srcSet={wideCover}
                      width="1760"
                      height="796"
                    />
                  )}
                  <img
                    src={`/images/optimized/${project.image}.webp`}
                    width="1600"
                    height="1000"
                    loading="lazy"
                    decoding="async"
                    alt={labels.preview + " " + project.title}
                  />
                </picture>
              </a>
              <div className="feature-caption">
                <header className="feature-identity">
                  <p className="feature-position">
                    <span>{copy.nav[0]}</span>
                    <span>
                      {twoDigits(i + 1)}{" "}
                      <span className="feature-total">
                        / {twoDigits(featured.length)}
                      </span>
                    </span>
                    {project.source && (
                      <a
                        className="feature-source"
                        href={project.source}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {copy.source}
                      </a>
                    )}
                  </p>
                  <h3 id={titleId} tabIndex={-1}>
                    {project.title}
                  </h3>
                </header>
                <div className="feature-description">
                  <p>{project.description[locale]}</p>
                </div>
                <div className="feature-actions">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="feature-visit"
                  >
                    {copy.live}
                    <FiArrowUpRight aria-hidden="true" />
                  </a>
                  {next ? (
                    <a
                      className="feature-next"
                      href={"#" + sceneId(next.id)}
                      aria-label={labels.next + " · " + next.title}
                      title={next.title}
                    >
                      <FiArrowDown aria-hidden="true" />
                    </a>
                  ) : (
                    archive.length > 0 && (
                      <button
                        ref={more}
                        type="button"
                        className="feature-more"
                        aria-controls="archivo-proyectos"
                        aria-expanded={expanded}
                        onClick={showArchive}
                      >
                        {labels.more}
                      </button>
                    )
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <div id="archivo-proyectos" hidden={!expanded}>
        {expanded && (
          <ProjectArchiveTA
            preferences={preferences}
            projects={archive}
            onClose={closeArchive}
          />
        )}
      </div>
    </section>
  );
};
