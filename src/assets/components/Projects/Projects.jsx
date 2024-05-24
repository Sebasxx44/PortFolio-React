import { PROJECTS } from "../../utils/data"
import { ProjectsCard } from "./ProjectsCard/ProjectsCard"
import './Projects.css'
export function Projects() {

    return(

        <>

            <section className="projects-container">

                <h5>Last Projects</h5>

                <div className="projects-content">
                    {PROJECTS.map((project, index) => {
                        const styleClass = index % 2 === 0 ? 'project-card left-style' : 'project-card right-style';
                        return <ProjectsCard key={project.name} details={project} styleClass={styleClass} />;
                    })}
                </div>
            </section>

        </>
    )
}