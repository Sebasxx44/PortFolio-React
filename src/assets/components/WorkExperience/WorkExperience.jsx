import { WORK_EXPERIENCE } from '../../utils/data'
import './WorkExperience.css'
import { WorkExperienceCard } from './WorkExperienceCard/WorkExperienceCard'
import { useTranslation } from 'react-i18next';

export function WorkExperience() {
    const { t } = useTranslation();

    return (
        <section className='experience-container'>
            <div className='experience-header'>
                <span className='eyebrow'>{t('work_experience_title')}</span>
                <h2 className="section-title">{t('work_experience_title')}</h2>
                <p className='experience-subtitle'>{t('workExperienceSubtitle', 'Experience building end-to-end products inside multidisciplinary teams.')}</p>
            </div>

            <div className='experience-content'>
                {WORK_EXPERIENCE.map((item, index) => (
                    <WorkExperienceCard key={item.title} details={item} index={index}/>
                ))}
            </div>
        </section>
    );
}
