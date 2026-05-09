import './index.css'
import { Navbar } from './assets/components/Navbar/NavbarComponent'
import { WorkExperience } from './assets/components/WorkExperience/WorkExperience'
import { AboutMe } from './assets/components/AboutMe/AboutMe'
import { Services } from './assets/components/Services/Services'
import { Technologies } from './assets/components/Technologies/Technologies'
import { Projects } from './assets/components/Projects/Projects'
import { Footer } from './assets/components/Footer/Footer'
import { useAppleScrollMotion } from './assets/hooks/useAppleScrollMotion'
import './i18n';


function App() {
  useAppleScrollMotion();

  return (
    <>
      <div className="scroll-progress" aria-hidden="true">
        <span className="scroll-progress__bar"></span>
      </div>

      <Navbar/>

      <main className='renderAppContent'>
        <div id="about-me" className="scroll-scene scroll-scene--hero">
          <AboutMe />
        </div>
        <div id="services" className="scroll-scene">
          <Services />
        </div>
        <div id="work-experience" className="scroll-scene">
          <WorkExperience />
        </div>
        <div id="technologies" className="scroll-scene">
          <Technologies />
        </div>
        <div id="projects" className="scroll-scene">
          <Projects />
        </div>
      </main>

      <Footer />
    </>
  )
}

export default App
