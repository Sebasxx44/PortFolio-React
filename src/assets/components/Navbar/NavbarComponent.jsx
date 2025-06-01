import { useState } from "react";
import './Navbar.css'
import { MobileNavbar } from "./MobileNavbar/MobileNavbar";
import logo from '/images/logo.png'
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../buttonLenguage'; 

export function Navbar() {

    const [openMenu, setOpenMenu] = useState(false);
    const { t,i18n } = useTranslation();

    const toggleMenu = () => {
        setOpenMenu(!openMenu);
    };

    const handleScroll = (id) => {
        const element = document.getElementById(id);
        if (element) {
          element.classList.add('visible');
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const toggleLang = () => {
        const newLang = i18n.language === 'en' ? 'es' : 'en';
        i18n.changeLanguage(newLang);
        localStorage.setItem('language', newLang);
    };


    return(

        <>

        <MobileNavbar toggleMenu={toggleMenu} isOpen={openMenu}/>

            <nav className="nav-wrapper">
                <div className="nav-content">

                    <img className="logoImg" src={logo} alt="logo" />

                    <ul>
                        <li> <LanguageSwitcher /></li>
                        
                       <li><a className="menu-item" href="#about-me">{t('navbar.home')}</a></li>
                        <li><a className="menu-item" href="#services" onClick={() => handleScroll('services')}>{t('navbar.services')}</a></li>
                        <li><a className="menu-item" href="#work-experience">{t('navbar.experience')}</a></li>
                        <li><a className="menu-item" href="#technologies">{t('navbar.skills')}</a></li>
                        <li><a className="menu-item" href="#projects">{t('navbar.projects')}</a></li>

                    </ul>

                    <button className="menu-btn" onClick={toggleMenu}>
                        <span className="material-symbols-outlined" style={{fontSize:'1.8rem'}}>{openMenu ? 'close' : 'menu'}</span>
                    </button>

        
                </div>
            </nav>

        </>
    )
}