import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../../buttonLenguage'
import '../Navbar.css'
import logo from '/images/logo.png'

export function MobileNavbar ({isOpen, toggleMenu, onNavigate}) {

    const { t } = useTranslation();


    return(

        <>

        <div className={`mobile-menu ${isOpen ? 'active' : ''}`} onClick={toggleMenu} aria-hidden={!isOpen}>

            <div className='mobile-menu-container' onClick={(e) => e.stopPropagation()}>
                <button className="close-menu-btn" onClick={toggleMenu} aria-label="Cerrar menú">
                    <span className="material-symbols-outlined">close</span>
                </button>
            <img className="logoImgMovile" src={logo} alt="logo" />

                <ul>
                    <LanguageSwitcher />
                     <li><a className="menu-item" href="#about-me" onClick={(e) => {e.preventDefault(); onNavigate('about-me');}}>{t('navbar.home')}</a></li>
                    <li><a className="menu-item" href="#services" onClick={(e) => {e.preventDefault(); onNavigate('services');}}>{t('navbar.services')}</a></li>
                    <li><a className="menu-item" href="#work-experience" onClick={(e) => {e.preventDefault(); onNavigate('work-experience');}}>{t('navbar.experience')}</a></li>
                    <li><a className="menu-item" href="#technologies" onClick={(e) => {e.preventDefault(); onNavigate('technologies');}}>{t('navbar.skills')}</a></li>
                    <li><a className="menu-item" href="#projects" onClick={(e) => {e.preventDefault(); onNavigate('projects');}}>{t('navbar.projects')}</a></li>
                </ul>

            </div>

        </div>

        </>

    )

}
