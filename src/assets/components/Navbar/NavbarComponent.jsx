import { useState } from "react";
import './Navbar.css'
import { MobileNavbar } from "./MobileNavbar/MobileNavbar";

export function Navbar() {

    const [openMenu, setOpenMenu] = useState(false);

    const toggleMenu = () => {
        setOpenMenu(!openMenu);
    };

    return(

        <>

        <MobileNavbar toggleMenu={toggleMenu} isOpen={openMenu}/>

            <nav className="nav-wrapper">
                <div className="nav-content">

                    <p>Sebaz.dev</p>

                    <ul>
                        <li><a className="menu-item" href="#">Home</a></li>
                        <li><a className="menu-item" href="#">Skills</a></li>
                        <li><a className="menu-item" href="#">Work Experience</a></li>
                        <li><a className="menu-item" href="#">Contact Me</a></li>
                    </ul>

                    <button className="menu-btn" onClick={toggleMenu}>
                        <span class="material-symbols-outlined" style={{fontSize:'1.8rem'}}>{openMenu ? 'close' : 'menu'}</span>
                    </button>

        
                </div>
            </nav>

        </>
    )
}