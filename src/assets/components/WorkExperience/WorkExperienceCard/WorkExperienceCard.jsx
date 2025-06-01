import '../WorkExperience.css'
import { useTranslation } from 'react-i18next';

export function WorkExperienceCard({ details }) {
  const { t } = useTranslation();

  return (
    <div className="work-experience-card">
      <h6>{t(details.title)}</h6>
      <div className="work-duration">{t(details.date)}</div>
      <ul>
        {details.responsabilities.map((key) => (
          <li key={key}>{t(key)}</li>
        ))}
      </ul>
    </div>
  );
}