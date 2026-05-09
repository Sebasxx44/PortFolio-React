import { useState, useEffect, useCallback } from "react";
import './Navbar.css'
import { MobileNavbar } from "./MobileNavbar/MobileNavbar";
import logo from '/images/logo.png'
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../buttonLenguage'; 

const NAV_SECTIONS = ['about-me', 'services', 'work-experience', 'technologies', 'projects'];

export function Navbar() {

    const [openMenu, setOpenMenu] = useState(false);
    const [activeSection, setActiveSection] = useState('about-me');
    const { t } = useTranslation();

    const toggleMenu = useCallback(() => {
        setOpenMenu(prev => !prev);
    }, []);

    const handleScroll = useCallback((id) => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        }
        setOpenMenu(false);
    }, []);

    // IntersectionObserver for active nav link
    useEffect(() => {
        const observers = [];
        const options = { rootMargin: '-20% 0px -60% 0px', threshold: 0 };

        NAV_SECTIONS.forEach((id) => {
            const el = document.getElementById(id);
            if (!el) return;

            const observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    setActiveSection(id);
                }
            }, options);

            observer.observe(el);
            observers.push(observer);
        });

        return () => observers.forEach(obs => obs.disconnect());
    }, []);

    const navLinks = [
        { id: 'about-me', label: t('navbar.home') },
        { id: 'services', label: t('navbar.services') },
        { id: 'work-experience', label: t('navbar.experience') },
        { id: 'technologies', label: t('navbar.skills') },
        { id: 'projects', label: t('navbar.projects') },
    ];

    return(
        <header>
            <MobileNavbar toggleMenu={toggleMenu} isOpen={openMenu} onNavigate={handleScroll} activeSection={activeSection}/>

            <nav className="nav-wrapper">
                <div className="nav-content">
                    <img className="logoImg" src={logo} alt="Sebastian Sanchez — Portfolio" />

                    <ul>
                        <LanguageSwitcher />
                        {navLinks.map(({ id, label }) => (
                            <li key={id}>
                                <a
                                    className={`menu-item ${activeSection === id ? 'active' : ''}`}
                                    href={`#${id}`}
                                    onClick={(e) => { e.preventDefault(); handleScroll(id); }}
                                >
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <button className="menu-btn" onClick={toggleMenu} aria-label="Toggle navigation menu">
                        <span className="material-symbols-outlined" style={{fontSize:'1.8rem'}}>{openMenu ? 'close' : 'menu'}</span>
                    </button>
                </div>
            </nav>
        </header>
    )
}
