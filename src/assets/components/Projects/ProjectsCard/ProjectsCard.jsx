import { FaArrowRightLong } from "react-icons/fa6";
export function ProjectsCard({ details,styleClass }) {

    return(

        <>

            <div className={styleClass}>

                <div className="project-image">
                    <img src={details.image} alt="project-image" />
                </div>

                <div className="project-info">

                    <div className="project-links">
                        <button className="project-btn-link" onClick={() => window.open(details.link)}> {details.name} <FaArrowRightLong style={{ background: 'none' }}/></button>
                        <button className="project-btn-github" onClick={() => window.open(details.github)}><i className="fa-brands fa-github"></i> Github</button>
                    </div>

                    <p>{details.description}</p>

                    <div className="project-technologies">
                        {details.technologies.map((tech) => (
                            <img key={tech} src={tech} alt="image" />
                        ))}
                    </div>


                </div>

            </div>
            
        </>
    )
}