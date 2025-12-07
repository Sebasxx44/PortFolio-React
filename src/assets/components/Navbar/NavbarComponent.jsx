import { useState } from "react";
import './Navbar.css'
import { MobileNavbar } from "./MobileNavbar/MobileNavbar";
import logo from '/images/logo.png'
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../buttonLenguage'; 

export function Navbar() {

    const [openMenu, setOpenMenu] = useState(false);
    const { t } = useTranslation();

    const toggleMenu = () => {
        setOpenMenu(!openMenu);
    };

    const handleScroll = (id) => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        }
        setOpenMenu(false);
    };

    return(

        <>

        <MobileNavbar toggleMenu={toggleMenu} isOpen={openMenu} onNavigate={handleScroll}/>

            <nav className="nav-wrapper">
                <div className="nav-content">

                    <img className="logoImg" src={logo} alt="logo" />

                    <ul>
                        <LanguageSwitcher />

                        <li><a className="menu-item" href="#about-me" onClick={(e) => {e.preventDefault(); handleScroll('about-me');}}>{t('navbar.home')}</a></li>
                        <li><a className="menu-item" href="#services" onClick={(e) => {e.preventDefault(); handleScroll('services');}}>{t('navbar.services')}</a></li>
                        <li><a className="menu-item" href="#work-experience" onClick={(e) => {e.preventDefault(); handleScroll('work-experience');}}>{t('navbar.experience')}</a></li>
                        <li><a className="menu-item" href="#technologies" onClick={(e) => {e.preventDefault(); handleScroll('technologies');}}>{t('navbar.skills')}</a></li>
                        <li><a className="menu-item" href="#projects" onClick={(e) => {e.preventDefault(); handleScroll('projects');}}>{t('navbar.projects')}</a></li>

                    </ul>

                    <button className="menu-btn" onClick={toggleMenu}>
                        <span className="material-symbols-outlined" style={{fontSize:'1.8rem'}}>{openMenu ? 'close' : 'menu'}</span>
                    </button>

        
                </div>
            </nav>

        </>
    )
}
