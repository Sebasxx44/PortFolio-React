import '../Navbar.css'

export function MobileNavbar ({isOpen, toggleMenu}) {


    return(

        <>

        <div className={`mobile-menu ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>

            <div className='mobile-menu-container'>
                <p>Sebaz.dev</p>

                <ul>
                    <li><a className="menu-item" href="#about-me" >Home</a></li>
                    <li><a className="menu-item" href="#services" >Services</a></li>
                    <li><a className="menu-item" href="#work-experience">Work Experience</a></li>
                    <li><a className="menu-item" href="#technologies">Skills</a></li>
                </ul>

            </div>

        </div>

        </>

    )

}