import { FaArrowUpRightFromSquare, FaGithub } from "react-icons/fa6";
import { FiEye } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export function ProjectsCard({ details, index, onPreview }) {
  const { t } = useTranslation();
  const reversed = index % 2 !== 0;

  return (
    <article className={`project-card ${reversed ? 'is-reversed' : ''}`}>
      <div className="project-media">
        <img src={details.image} alt={t(details.name)} loading="lazy" />
      </div>

      <div className="project-info">
        <div className="project-heading">
          <span className="project-kicker">0{index + 1}</span>
          <h3>{t(details.name)}</h3>
        </div>

        <p>{t(details.description)}</p>

        <div className="project-technologies" aria-label="Technologies used">
          {details.technologies.map((tech, idx) => (
            <img key={idx} src={tech} alt="technology icon" />
          ))}
        </div>

        <div className="project-links">
          <button className="project-btn-link" onClick={() => onPreview(details)} aria-label={`${t(details.name)} preview`}>
            <FiEye aria-hidden="true" /> {t('projects.preview', 'Preview')}
          </button>
          <button className="project-btn-site" onClick={() => window.open(details.link, '_blank', 'noopener')} aria-label={`${t(details.name)} live demo`}>
            <FaArrowUpRightFromSquare aria-hidden="true" /> {t('projects.visit', 'Visit')}
          </button>
          <button className="project-btn-github" onClick={() => window.open(details.github, '_blank', 'noopener')} aria-label="Open Github repository">
            <FaGithub aria-hidden="true" /> Github
          </button>
        </div>
      </div>
    </article>
  );
}
