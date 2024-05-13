import { useState } from 'react'
import './index.css'
import { Navbar } from './assets/components/Navbar/NavbarComponent'
import { WorkExperience } from './assets/components/WorkExperience/WorkExperience'
import { AboutMe } from './assets/components/AboutMe/AboutMe'
import { Services } from './assets/components/Services/Services'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      <Navbar/>

      <section className='renderAppContent'>
        <AboutMe/>
        <Services/>
        <WorkExperience/>
      </section>

    </>
  )
}

export default App
