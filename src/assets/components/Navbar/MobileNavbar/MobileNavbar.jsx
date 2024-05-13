import '../Navbar.css'

export function MobileNavbar ({isOpen, toggleMenu}) {

    return(

        <>

        <div className={`mobile-menu ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>

            <div className='mobile-menu-container'>
                <p>Sebaz.dev</p>

                <ul>
                    <li><a className="menu-item" href="#">Home</a></li>
                    <li><a className="menu-item" href="#">Skills</a></li>
                    <li><a className="menu-item" href="#">Work Experience</a></li>
                    <li><a className="menu-item" href="#">Contact Me</a></li>
                </ul>

            </div>

        </div>

        </>

    )

}