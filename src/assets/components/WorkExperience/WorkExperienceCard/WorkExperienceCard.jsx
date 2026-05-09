import '../WorkExperience.css'
import { useTranslation } from 'react-i18next';
import { PiBriefcase, PiCheckCircle } from 'react-icons/pi';

export function WorkExperienceCard({ details, index }) {
  const { t } = useTranslation();

  return (
    <div className="work-experience-card">
      <span className="work-index">0{index + 1}</span>
      <div className="work-card-heading">
        <span className="work-icon" aria-hidden="true"><PiBriefcase /></span>
        <h6>{t(details.title)}</h6>
      </div>
      <div className="work-duration">{t(details.date)}</div>
      <div className="work-tech-stack" aria-label="Technologies">
        {details.technologies.map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
      </div>
      <ul>
        {details.responsabilities.map((key) => (
          <li key={key}><PiCheckCircle aria-hidden="true" /> {t(key)}</li>
        ))}
      </ul>
    </div>
  );
}
