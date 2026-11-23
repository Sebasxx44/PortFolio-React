import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { FiArrowDown, FiCheck } from "react-icons/fi";
import type { Locale } from "../types";
import { FlowMap } from "./FlowMap";
import {
  beats,
  captionIndex,
  clamp,
  sourceCode,
  sites,
  chapterSite,
  galleryPosition,
  immersion,
  interval,
  smooth,
  visualTime,
  words,
} from "./flowScenes";
import "./flow-lab.css";

export function FlowLab({
  locale,
  onLocaleChange,
}: {
  locale: Locale;
  onLocaleChange?: (value: Locale) => void;
}) {
  const region = useRef<HTMLElement>(null),
    pin = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const copy = words[locale],
    index = captionIndex(progress),
    chapter = copy.chapters[index];
  const galleryIndex = Math.round(galleryPosition(progress));
  const siteIndex = index === 8 ? galleryIndex : chapterSite[index];
  const featured = sites[siteIndex];
  const entry = immersion(visualTime(progress, reduced));
  const dive = entry?.amount || 0;
  const paper = entry?.device === "menu" ? smooth(interval(dive, 0.7, 1)) : 0;
  useLayoutEffect(() => {
    const section = region.current,
      stage = pin.current;
    if (!section || !stage) return;
    // A fragment opened before React mounts may never match the browser's :target selector.
    const syncFragment = () =>
      document.documentElement.toggleAttribute(
        "data-journey-fragment",
        location.hash === "#laboratorio",
      );
    let fragmentFrame = 0;
    const onFragment = () => {
      syncFragment();
      cancelAnimationFrame(fragmentFrame);
      if (location.hash !== "#laboratorio") return;
      // The browser may start an anchor scroll with the portfolio masthead's old offset.
      // Align after the mobile menu closes so the camera occupies the entire viewport.
      fragmentFrame = requestAnimationFrame(() => {
        window.scrollTo({
          top: window.scrollY + section.getBoundingClientRect().top,
          behavior: "instant",
        });
      });
    };
    syncFragment();
    window.addEventListener("hashchange", onFragment);
    let frame = 0,
      active = true;
    const caption = stage.querySelector<HTMLElement>(".journey-caption");
    const measure = () => {
      frame = 0;
      if (caption && stage.clientHeight) {
        const clearance = stage.clientHeight - caption.offsetTop + 14;
        stage.style.setProperty(
          "--caption-clearance",
          (100 * clearance) / stage.clientHeight + "cqh",
        );
      }
      const rect = section.getBoundingClientRect();
      section.toggleAttribute(
        "data-pinned",
        rect.top <= 1 && rect.bottom >= stage.clientHeight - 1,
      );
      setProgress(
        clamp(-rect.top / Math.max(1, rect.height - stage.clientHeight)),
      );
    };
    const schedule = () => {
      if (active && !frame) frame = requestAnimationFrame(measure);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        measure();
      },
      { rootMargin: "100px 0px" },
    );
    const resize = new ResizeObserver(schedule);
    observer.observe(section);
    resize.observe(section);
    resize.observe(stage);
    if (caption) resize.observe(caption);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const align = () => {
      if (location.hash === "#laboratorio") {
        const rect = section.getBoundingClientRect();
        if (rect.top > 1 || rect.bottom < 0)
          window.scrollTo({
            top: window.scrollY + rect.top,
            behavior: "instant",
          });
      }
      schedule();
    };
    const initial = requestAnimationFrame(align);
    window.addEventListener("load", align, { once: true });
    measure();
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(initial);
      cancelAnimationFrame(fragmentFrame);
      observer.disconnect();
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", align);
      window.removeEventListener("hashchange", onFragment);
      document.documentElement.removeAttribute("data-journey-fragment");
    };
  }, []);
  useEffect(() => {
    const pref = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(pref.matches);
    pref.addEventListener("change", update);
    return () => pref.removeEventListener("change", update);
  }, []);
  return (
    <>
      <section
        id="laboratorio"
        className="journey-lab"
        ref={region}
        lang={locale}
        aria-labelledby="journey-heading"
      >
        <a className="journey-skip" href="#laboratorio-salida">
          {copy.skip}
        </a>
        <div
          className="journey-pin"
          ref={pin}
          data-beat={index}
          data-paper={paper > 0 || undefined}
          style={
            {
              "--studio-accent": featured?.accent || "#ffcf8b",
              "--immersion": dive,
              "--paper": paper,
              "--paper-mix": paper * 100 + "%",
            } as CSSProperties
          }
        >
          <FlowMap progress={progress} reduced={reduced} locale={locale} />
          <header className="journey-mast">
            <div className="journey-identity">
              <span className="journey-brand" aria-hidden="true">
                sebaz<sup>®</sup>
              </span>
              <i />
              <h2 id="journey-heading">{copy.name}</h2>
            </div>
            {onLocaleChange && (
              <select
                className="journey-locale"
                aria-label={locale === "en" ? "Language" : "Idioma"}
                value={locale}
                onChange={(e) => onLocaleChange(e.target.value as Locale)}
              >
                <option value="es">ES</option>
                <option value="en">EN</option>
                <option value="pt">PT</option>
              </select>
            )}
          </header>
          <div className="journey-caption">
            <div className="journey-tech">
              <i />
              {featured?.name || copy.delivery}
            </div>
            <h3>{chapter[0]}</h3>
            <p>{chapter[1]}</p>
          </div>
          {index === 8 && (
            <nav className="journey-sites" aria-label={copy.visit}>
              {sites.map((site, i) => (
                <a
                  key={site.id}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ "--link-accent": site.accent } as CSSProperties}
                  data-featured={i === galleryIndex}
                  aria-label={copy.open + " " + site.name}
                >
                  {site.name}
                </a>
              ))}
            </nav>
          )}
          <footer className="journey-foot">
            <div className="journey-cue">
              {progress < 0.998 ? (
                <FiArrowDown aria-hidden="true" />
              ) : (
                <FiCheck aria-hidden="true" />
              )}
              <span>{progress < 0.998 ? copy.scroll : copy.end}</span>
            </div>
            <div
              className="journey-meter"
              role="progressbar"
              aria-label={copy.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
              aria-valuetext={chapter[0]}
            >
              <i style={{ transform: "scaleX(" + progress + ")" }} />
              {beats.slice(1).map((p) => (
                <b key={p} style={{ left: p * 100 + "%" }} />
              ))}
            </div>
            <span className="journey-counter" aria-hidden="true">
              {String(index + 1).padStart(2, "0")} <i>/</i>{" "}
              {String(beats.length).padStart(2, "0")}
            </span>
          </footer>
        </div>
        <div className="journey-sr">
          <ol>
            {copy.chapters.map((entry, i) => (
              <li key={entry[0]}>
                <strong>
                  {entry[0]}{" "}
                  {chapterSite[i] >= 0 && "· " + sites[chapterSite[i]].name}
                </strong>{" "}
                {entry[1]}
                {i === 2 && <pre>{sourceCode}</pre>}
                {i === 8 && (
                  <ul>
                    {sites.map((site) => (
                      <li key={site.id}>{site.name}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>
      <div className="journey-exit" id="laboratorio-salida" tabIndex={-1} />
    </>
  );
}
