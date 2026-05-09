import { useState } from "react";
import { PROJECTS } from "../../utils/data";
import { ProjectsCard } from "./ProjectsCard/ProjectsCard";
import './Projects.css';
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowUpRightFromSquare, FaGithub } from "react-icons/fa6";

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

                 <div className="projects-header">
                    <span className="eyebrow">{t('projects.title')}</span>
                    <h2 className="section-title">{t('projects.title')}</h2>
                    <p className="projects-subtitle">{t('projectsSubtitle', 'Selection of recent builds focused on performance, clear storytelling, and thoughtful micro-interactions.')}</p>
                 </div>

                <div className="projects-content">
                    {PROJECTS.map((project, index) => {
                        return <ProjectsCard key={project.name} details={project} index={index} onPreview={handlePreview} />;
                    })}
                </div>
            </section>

            {/* Modal still uses framer-motion for enter/exit */}
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
                            <button className="project-modal__close" onClick={closePreview} aria-label="Close preview">
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
                                        <FaArrowUpRightFromSquare aria-hidden="true" /> {t('projects.openNewTab', 'Open in new tab')}
                                    </button>
                                    <button className="project-btn-github" onClick={() => window.open(selectedProject.github, '_blank', 'noopener')}>
                                        <FaGithub aria-hidden="true" /> Github
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
