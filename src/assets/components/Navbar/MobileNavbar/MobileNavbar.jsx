import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../../buttonLenguage'
import '../Navbar.css'
import logo from '/images/logo.png'

export function MobileNavbar ({isOpen, toggleMenu, onNavigate, activeSection}) {

    const { t } = useTranslation();

    const navLinks = [
        { id: 'about-me', label: t('navbar.home') },
        { id: 'services', label: t('navbar.services') },
        { id: 'work-experience', label: t('navbar.experience') },
        { id: 'technologies', label: t('navbar.skills') },
        { id: 'projects', label: t('navbar.projects') },
    ];

    return(
        <div className={`mobile-menu ${isOpen ? 'active' : ''}`} onClick={toggleMenu} aria-hidden={!isOpen}>
            <div className='mobile-menu-container' onClick={(e) => e.stopPropagation()}>
                <button className="close-menu-btn" onClick={toggleMenu} aria-label="Close menu">
                    <span className="material-symbols-outlined">close</span>
                </button>
                <img className="logoImgMovile" src={logo} alt="Sebastian Sanchez — Portfolio" />

                <ul>
                    <LanguageSwitcher />
                    {navLinks.map(({ id, label }) => (
                        <li key={id}>
                            <a
                                className={`menu-item ${activeSection === id ? 'active' : ''}`}
                                href={`#${id}`}
                                onClick={(e) => { e.preventDefault(); onNavigate(id); }}
                            >
                                {label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
