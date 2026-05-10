import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../../buttonLenguage'
import '../Navbar.css'
import logo from '/images/logo.png'

export function MobileNavbar ({isOpen, toggleMenu, onNavigate, activeSection}) {

    const { t } = useTranslation();

    const navLinks = [
        { id: 'about-me', label: t('navbar.home'), icon: 'home' },
        { id: 'services', label: t('navbar.services'), icon: 'design_services' },
        { id: 'work-experience', label: t('navbar.experience'), icon: 'work' },
        { id: 'technologies', label: t('navbar.skills'), icon: 'terminal' },
        { id: 'projects', label: t('navbar.projects'), icon: 'view_cozy' },
    ];

    return(
        <div className={`mobile-menu ${isOpen ? 'active' : ''}`} onClick={toggleMenu} aria-hidden={!isOpen}>
            <div className='mobile-menu-container' onClick={(e) => e.stopPropagation()}>
                <div className="mobile-menu-header">
                    <img className="logoImgMovile" src={logo} alt="Sebastian Sanchez — Portfolio" />
                    <button className="close-menu-btn" onClick={toggleMenu} aria-label="Close menu">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <nav className="mobile-menu-nav">
                    <ul>
                        {navLinks.map(({ id, label, icon }, index) => (
                            <li key={id} style={{ animationDelay: `${index * 0.05}s` }}>
                                <a
                                    className={`menu-item ${activeSection === id ? 'active' : ''}`}
                                    href={`#${id}`}
                                    onClick={(e) => { e.preventDefault(); onNavigate(id); }}
                                >
                                    <span className="material-symbols-outlined">{icon}</span>
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="mobile-menu-footer">
                    <div className="mobile-menu-divider"></div>
                    <LanguageSwitcher />
                </div>
            </div>
        </div>
    )
}
