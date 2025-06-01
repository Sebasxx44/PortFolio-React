import { LanguageSwitcher } from '../../buttonLenguage'
import '../Navbar.css'
import logo from '/images/logo.png'

export function MobileNavbar ({isOpen, toggleMenu}) {


    return(

        <>

        <div className={`mobile-menu ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>

            <div className='mobile-menu-container'>
            <img className="logoImgMovile" src={logo} alt="logo" />

                <ul>
                    <LanguageSwitcher />
                    <li><a className="menu-item" href="#about-me" >Home</a></li>
                    <li><a className="menu-item" href="#services" >Services</a></li>
                    <li><a className="menu-item" href="#work-experience">Work Experience</a></li>
                    <li><a className="menu-item" href="#technologies">Skills</a></li>
                    <li><a className="menu-item" href="#projects">Projects</a></li>
                </ul>

            </div>

        </div>

        </>

    )

}