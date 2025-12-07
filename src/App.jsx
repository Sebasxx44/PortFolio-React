import './index.css'
import { Navbar } from './assets/components/Navbar/NavbarComponent'
import { WorkExperience } from './assets/components/WorkExperience/WorkExperience'
import { AboutMe } from './assets/components/AboutMe/AboutMe'
import { Services } from './assets/components/Services/Services'
import { Technologies } from './assets/components/Technologies/Technologies'
import { Projects } from './assets/components/Projects/Projects'
import './i18n';


function App() {

  return (
    <>

      <Navbar/>

      <main className='renderAppContent'>
        <div id="about-me">
          <AboutMe />
        </div>
        <div id="services">
          <Services />
        </div>
        <div id="work-experience">
          <WorkExperience />
        </div>
        <div id="technologies">
          <Technologies />
        </div>
        <div id="projects">
          <Projects />
        </div>
      </main>

    </>
  )
}

export default App
