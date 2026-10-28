import { LazyMotion, domAnimation, m, useScroll } from "framer-motion";
import { NavigationTA } from "@/components/portfolio/NavigationTA";
import { HeroTA } from "@/components/portfolio/HeroTA";
import { WorkSectionTA } from "@/components/portfolio/WorkSectionTA";
import { AboutSectionTA } from "@/components/portfolio/AboutSectionTA";
import { ExperienceSectionTA } from "@/components/portfolio/ExperienceSectionTA";
import { StackSectionTA } from "@/components/portfolio/StackSectionTA";
import { ContactSectionTA } from "@/components/portfolio/ContactSectionTA";
import { usePortfolio } from "@/composables/portfolio/usePortfolio";
import "@/components/portfolio/portfolio.css";

export const PortfolioPageTA = () => {
  const { preferences } = usePortfolio();
  const { scrollYProgress } = useScroll();
  return (
    <LazyMotion features={domAnimation} strict>
      <a href="#main-content" className="skip-link">
        {preferences.copy.skip}
      </a>
      <m.div
        className="reading-progress"
        style={{ scaleX: scrollYProgress }}
        aria-hidden="true"
      />
      <NavigationTA preferences={preferences} />
      <main id="main-content">
        <HeroTA preferences={preferences} />
        <WorkSectionTA preferences={preferences} />
        <AboutSectionTA copy={preferences.copy} />
        <ExperienceSectionTA preferences={preferences} />
        <StackSectionTA copy={preferences.copy} />
      </main>
      <ContactSectionTA copy={preferences.copy} />
    </LazyMotion>
  );
};
