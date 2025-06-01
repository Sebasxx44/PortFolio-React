import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../../buttonLenguage'
import '../Navbar.css'
import logo from '/images/logo.png'

export function MobileNavbar ({isOpen, toggleMenu}) {

    const { t,i18n } = useTranslation();


    return(

        <>

        <div className={`mobile-menu ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>

            <div className='mobile-menu-container'>
            <img className="logoImgMovile" src={logo} alt="logo" />

                <ul>
                    <LanguageSwitcher />
                     <li><a className="menu-item" href="#about-me">{t('navbar.home')}</a></li>
                    <li><a className="menu-item" href="#services" onClick={() => handleScroll('services')}>{t('navbar.services')}</a></li>
                    <li><a className="menu-item" href="#work-experience">{t('navbar.experience')}</a></li>
                    <li><a className="menu-item" href="#technologies">{t('navbar.skills')}</a></li>
                    <li><a className="menu-item" href="#projects">{t('navbar.projects')}</a></li>
                </ul>

            </div>

        </div>

        </>

    )

}