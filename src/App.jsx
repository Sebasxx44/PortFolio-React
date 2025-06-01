import { useState, useEffect } from 'react'
import './index.css'
import { Navbar } from './assets/components/Navbar/NavbarComponent'
import { WorkExperience } from './assets/components/WorkExperience/WorkExperience'
import { AboutMe } from './assets/components/AboutMe/AboutMe'
import { Services } from './assets/components/Services/Services'
import { Technologies } from './assets/components/Technologies/Technologies'
import { Projects } from './assets/components/Projects/Projects'
import './i18n';


function App() {
  
  useEffect(() => {
    window.ScrollReveal().reveal('.reveal', {
      distance: '50px',
      duration: 800,
      easing: 'ease-in-out',
      origin: 'bottom',
      reset: true, 
    });
  }, []);

  return (
    <>

      <Navbar/>

      <section className='renderAppContent'>

        <div id="about-me" className="reveal">
          <AboutMe />
        </div>
        <div id="services" className="reveal">
          <Services />
        </div>
        <div id="work-experience" className="reveal">
          <WorkExperience />
        </div>
        <div id="technologies" className="reveal">
          <Technologies />
        </div>
        <div id="projects" className="reveal">
          <Projects />
        </div>
      </section>

    </>
  )
}

export default App
