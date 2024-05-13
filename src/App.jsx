import { useState } from 'react'
import './index.css'
import { Navbar } from './assets/components/Navbar/NavbarComponent'
import { WorkExperience } from './assets/components/WorkExperience/WorkExperience'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      <Navbar/>

      <section className='renderAppContent'>
        <WorkExperience/>
      </section>

    </>
  )
}

export default App
