import { useTranslation } from 'react-i18next';
import Flag from 'react-world-flags';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <li className="language-switcher">
      <button onClick={() => changeLanguage('es')} title="Español" className={i18n.language === 'es' ? 'active' : ''}>
        <Flag code="ES" style={{ width: 24, height: 16 }} /> <span className="lang-code">ES</span>
      </button>
      <button onClick={() => changeLanguage('en')} title="English" className={i18n.language === 'en' ? 'active' : ''}>
        <Flag code="US" style={{ width: 24, height: 16 }} /> <span className="lang-code">EN</span>
      </button>
      <button onClick={() => changeLanguage('pt')} title="Português" className={i18n.language === 'pt' ? 'active' : ''}>
        <Flag code="PT" style={{ width: 24, height: 16 }} /> <span className="lang-code">PT</span>
      </button>
    </li>
  );
}


