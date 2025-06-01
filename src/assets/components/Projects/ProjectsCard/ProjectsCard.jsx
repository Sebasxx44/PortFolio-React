import { FaArrowRightLong } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

export function ProjectsCard({ details, styleClass }) {
  const { t } = useTranslation();

  return (
    <div className={styleClass}>
      <div className="project-image">
        <img src={details.image} alt={t(details.name)} />
      </div>

      <div className="project-info">
        <div className="project-links">
          <button className="project-btn-link" onClick={() => window.open(details.link)}>
            {t(details.name)} <FaArrowRightLong style={{ background: 'none' }} />
          </button>
          <button className="project-btn-github" onClick={() => window.open(details.github)}>
            <i className="fa-brands fa-github"></i> Github
          </button>
        </div>

        <p>{t(details.description)}</p>

        <div className="project-technologies">
          {details.technologies.map((tech, idx) => (
            <img key={idx} src={tech} alt="tech-icon" />
          ))}
        </div>
      </div>
    </div>
  );
}
