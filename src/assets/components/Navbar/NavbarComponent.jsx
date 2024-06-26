import { useState } from "react";
import './Navbar.css'
import { MobileNavbar } from "./MobileNavbar/MobileNavbar";
import logo from '/images/logo.png'

export function Navbar() {

    const [openMenu, setOpenMenu] = useState(false);

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


    return(

        <>

        <MobileNavbar toggleMenu={toggleMenu} isOpen={openMenu}/>

            <nav className="nav-wrapper">
                <div className="nav-content">

                    <img className="logoImg" src={logo} alt="logo" />

                    <ul>
                        <li><a className="menu-item" href="#about-me" >Home</a></li>
                        <li><a className="menu-item" href="#services" onClick={() => handleScroll('services')}>Services</a></li>
                        <li><a className="menu-item" href="#work-experience">Work Experience</a></li>
                        <li><a className="menu-item" href="#technologies">Skills</a></li>
                        <li><a className="menu-item" href="#projects">Projects</a></li>
                    </ul>

                    <button className="menu-btn" onClick={toggleMenu}>
                        <span className="material-symbols-outlined" style={{fontSize:'1.8rem'}}>{openMenu ? 'close' : 'menu'}</span>
                    </button>

        
                </div>
            </nav>

        </>
    )
}