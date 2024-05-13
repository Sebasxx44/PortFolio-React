import { useState } from 'react'
import './index.css'
import { Navbar } from './assets/components/Navbar/NavbarComponent'
import { WorkExperience } from './assets/components/WorkExperience/WorkExperience'
import { AboutMe } from './assets/components/AboutMe/AboutMe'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      <Navbar/>

      <section className='renderAppContent'>
        <AboutMe/>
        <WorkExperience/>
      </section>

    </>
  )
}

export default App
