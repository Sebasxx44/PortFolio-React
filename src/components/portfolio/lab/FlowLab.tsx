import { useEffect, useRef, useState, type CSSProperties } from "react";
import { FiArrowUp, FiPlay, FiPause, FiRotateCcw } from "react-icons/fi";
import type { Locale } from "../types";
import { FlowMap } from "./FlowMap";
import { useStudioPlayback } from "./useStudioPlayback";
import {
  beats,
  captionIndex,
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
  const { progress, status, controls } = useStudioPlayback(region, pin);
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
            <div className="journey-mast-actions">
              <button
                type="button"
                className="journey-skip-control"
                onClick={() => controls.current?.skip()}
                aria-label={copy.skip}
              >
                {copy.skipShort}
              </button>
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
            </div>
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
            <div className="journey-controls">
              <button
                type="button"
                className="journey-control"
                onClick={() => controls.current?.toggle()}
              >
                {status === "playing" ? (
                  <FiPause />
                ) : status === "complete" ? (
                  <FiRotateCcw />
                ) : (
                  <FiPlay />
                )}
                {status === "playing"
                  ? copy.pause
                  : status === "complete"
                    ? copy.replay
                    : copy.play}
              </button>
              <button
                type="button"
                className="journey-control"
                onClick={() => controls.current?.back()}
                aria-label={copy.upHint}
                title={copy.upHint}
              >
                <FiArrowUp />
                {copy.back}
              </button>
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
