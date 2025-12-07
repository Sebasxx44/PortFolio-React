import { useState } from "react";
import { PROJECTS } from "../../utils/data";
import { ProjectsCard } from "./ProjectsCard/ProjectsCard";
import './Projects.css';
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

export function Projects() {
    const { t } = useTranslation();
    const [selectedProject, setSelectedProject] = useState(null);

    const handlePreview = (project) => {
        setSelectedProject(project);
    };

    const closePreview = () => {
        setSelectedProject(null);
    };

    return(
        <>
            <section className="projects-container">

                 <motion.div className="projects-header" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} viewport={{ once: false, amount: 0.3 }}>
                    <span className="eyebrow">{t('projects.title')}</span>
                    <h5 className="section-title">{t('projects.title')}</h5>
                    <p className="projects-subtitle">{t('projectsSubtitle', 'Selección de productos recientes con foco en performance, contenido claro y microinteracciones cuidando la accesibilidad.')}</p>
                 </motion.div>

                <div className="projects-content">
                    {PROJECTS.map((project, index) => {
                        return <ProjectsCard key={project.name} details={project} index={index} onPreview={handlePreview} />;
                    })}
                </div>
            </section>

            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        className="project-modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closePreview}
                    >
                        <motion.div
                            className="project-modal__content"
                            initial={{ scale: 0.98, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.98, y: 10, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="project-modal__close" onClick={closePreview} aria-label="Cerrar vista previa">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                            <div className="project-modal__header">
                                <div>
                                    <p className="eyebrow">{t(selectedProject.name)}</p>
                                    <h4>{t(selectedProject.name)}</h4>
                                    <p className="project-modal__desc">{t(selectedProject.description)}</p>
                                </div>
                                <div className="project-modal__links">
                                    <button className="project-btn-link" onClick={() => window.open(selectedProject.link, '_blank', 'noopener')}>
                                        {t('projects.openNewTab', 'Abrir en pestaña nueva')}
                                    </button>
                                    <button className="project-btn-github" onClick={() => window.open(selectedProject.github, '_blank', 'noopener')}>
                                        <i className="fa-brands fa-github"></i> Github
                                    </button>
                                </div>
                            </div>
                            <div className="project-modal__frame">
                                <iframe title={t(selectedProject.name)} src={selectedProject.link} loading="lazy"></iframe>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
