
export function ProjectsCard({ details,styleClass }) {

    return(

        <>

            <div className={styleClass}>

                <div className="project-image">
                    <img src={details.image} alt="project-image" />
                </div>

                <div className="project-info">

                    <div className="project-links">
                        <button className="project-btn-link" onClick={() => window.open(details.link)}>{details.name}</button>
                        <button className="project-btn-github" onClick={() => window.open(details.github)}><i class="fa-brands fa-github"></i> Github</button>
                    </div>

                    <p>{details.description}</p>

                    <div className="project-technologies">
                        {details.technologies.map((tech) => (
                            <img src={tech} alt="image" />
                        ))}
                    </div>


                </div>

            </div>
            
        </>
    )
}