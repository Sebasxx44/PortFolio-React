import { FiArrowUpRight, FiGlobe, FiMenu, FiX } from "react-icons/fi";
import { useNavigation } from "@/composables/portfolio/useNavigation";
import { navigationSections } from "@/components/portfolio/types";
import type {
  Locale,
  PortfolioPreferences,
} from "@/components/portfolio/types";

export const NavigationTA = ({
  preferences,
}: {
  preferences: PortfolioPreferences;
}) => {
  const { navigation } = useNavigation();
  const { copy, locale, setLocale } = preferences;
  return (
    <header className="site-navigation">
      <a href="#home" className="wordmark" aria-label={`Sebaz · ${copy.home}`}>
        sebaz<span className="wordmark-dot">®</span>
      </a>
      <nav className="desktop-nav" aria-label={copy.menu}>
        {navigationSections.map((id) => (
          <a
            href={`#${id}`}
            key={id}
            aria-current={
              navigation.active === id ? "location" : undefined
            }
          >
            {copy.nav[id]}
            <span className="nav-dot" />
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <label className="language-select">
          <FiGlobe aria-hidden="true" />
          <span className="sr-only">{copy.language}</span>
          <select
            value={locale}
            onChange={(event) => setLocale(event.target.value as Locale)}
          >
            <option value="es">ES</option>
            <option value="en">EN</option>
            <option value="pt">PT</option>
          </select>
        </label>
        <a className="header-contact" href="#contact">
          {copy.contact}
          <FiArrowUpRight aria-hidden="true" />
        </a>
        <button
          className="menu-toggle"
          ref={navigation.toggleRef}
          onClick={navigation.toggle}
          aria-expanded={navigation.open}
          aria-controls="mobile-navigation"
          aria-label={navigation.open ? copy.closeMenu : copy.menu}
        >
          {navigation.open ? <FiX /> : <FiMenu />}
        </button>
      </div>
      <div
        id="mobile-navigation"
        className="mobile-navigation"
        ref={navigation.panelRef}
        hidden={!navigation.open}
      >
        <nav aria-label={copy.menu}>
          {navigationSections.map((id, index) => (
            <a href={`#${id}`} onClick={navigation.close} key={id}>
              <small>0{index + 1}</small>
              {copy.nav[id]}
              <FiArrowUpRight aria-hidden="true" />
            </a>
          ))}
          <a href="#contact" onClick={navigation.close}>
            <small>{String(navigationSections.length + 1).padStart(2,"0")}</small>
            {copy.contact}
            <FiArrowUpRight aria-hidden="true" />
          </a>
        </nav>
      </div>
    </header>
  );
};
