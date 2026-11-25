import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Locale } from "../types";
import { FlowMap } from "./FlowMap";
import { useStudioPlayback } from "./useStudioPlayback";
import {
  chapterIndex,
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
  standalone = false,
}: {
  locale: Locale;
  onLocaleChange?: (value: Locale) => void;
  standalone?: boolean;
}) {
  const region = useRef<HTMLElement>(null);
  const { progress, status, skip } = useStudioPlayback(region);
  const replay = standalone && status === "complete";
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const copy = words[locale],
    index = chapterIndex(progress);
  const galleryIndex = Math.round(galleryPosition(progress));
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
          data-beat={index}
          data-paper={paper > 0 || undefined}
          style={
            {
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
                onClick={() => skip.current?.()}
                aria-label={replay ? copy.replay : copy.skip}
              >
                {replay ? copy.replay : copy.skipShort}
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
