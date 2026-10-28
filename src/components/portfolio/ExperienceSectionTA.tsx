import { ActionHeaderTA } from "@/components/portfolio/ActionHeaderTA";
import { RevealTA } from "@/components/portfolio/RevealTA";
import { experience } from "@/components/portfolio/content";
import type { PortfolioPreferences } from "@/components/portfolio/types";

export const ExperienceSectionTA = ({
  preferences,
}: {
  preferences: PortfolioPreferences;
}) => {
  const { copy, locale } = preferences;
  const companies = ["SENA · CDITI", "Suzuki Motor", "CDITI"];
  const dates = [`2025 — ${copy.now}`, "2023 — 2025", "2022 — 2023"];
  const tech = [
    "Nuxt · Laravel · PostgreSQL · Docker",
    "React · Node.js · PostgreSQL",
    "Laravel · PHP · MySQL",
  ];
  return (
    <section id="experience" className="experience-section section-shell">
      <RevealTA>
        <ActionHeaderTA
          number="03"
          label={copy.experienceLabel}
          title={copy.experienceTitle}
        />
      </RevealTA>
      <div className="experience-list">
        {experience[locale].map((item, index) => (
          <RevealTA key={companies[index]}>
            <article className="experience-row">
              <div className="experience-date">
                <span
                  className={
                    index === 0
                      ? "experience-dot experience-dot--active"
                      : "experience-dot"
                  }
                />
                {dates[index]}
              </div>
              <div className="experience-company">
                <h3>{companies[index]}</h3>
                <p>{item.title}</p>
              </div>
              <div className="experience-description">
                <p>{item.resp[0]}</p>
                <span>{tech[index]}</span>
              </div>
            </article>
          </RevealTA>
        ))}
      </div>
    </section>
  );
};
