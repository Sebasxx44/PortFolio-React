import { PROJECTS } from "../../utils/data"
import { ProjectsCard } from "./ProjectsCard/ProjectsCard"
import './Projects.css'
import { useTranslation } from "react-i18next";
export function Projects() {

const { t } = useTranslation();

    return(

        <>

            <section className="projects-container">

                 <h5>{t('projects.title')}</h5>

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