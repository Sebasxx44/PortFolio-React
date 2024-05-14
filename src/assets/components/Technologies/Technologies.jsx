import './Technologies.css'
import { TECHNOLOGIES } from "../../utils/data"
import { TechnologiesCard } from './TechnologiesCard/TechnologiesCard'

export function Technologies() {

    return(

        <>

            <section className='technologies-container'>

                <h5>Skills</h5>

                <div className='technologies-content'>
                    {TECHNOLOGIES.map((detail) => (
                        <TechnologiesCard key={detail.name} details={detail}/>
                    ))}
                </div>
            </section>

        </>

    )
}