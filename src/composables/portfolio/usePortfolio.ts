import { useEffect, useState } from "react";
import { copy } from "@/components/portfolio/content";
import type {
  Locale,
  PortfolioPreferences,
} from "@/components/portfolio/types";

// Preferences
const initialLocale = (): Locale => {
  try {
    const saved = localStorage.getItem("sebaz-language");
    if (saved === "es" || saved === "en" || saved === "pt") return saved;
  } catch {
    /* Storage is optional. */
  }
  return "es";
};

export const usePortfolio = (): { preferences: PortfolioPreferences } => {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  // Effects
  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = "Sebaz — Sebastián Sánchez · Full Stack Developer";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", copy[locale].intro);
    try {
      localStorage.setItem("sebaz-language", locale);
    } catch {
      /* Storage is optional. */
    }
  }, [locale]);

  return { preferences: { locale, setLocale, copy: copy[locale] } };
};
