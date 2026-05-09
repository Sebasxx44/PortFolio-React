import { useTranslation } from 'react-i18next'
import './Technologies.css'
import { TECHNOLOGIES } from "../../utils/data"
import { TechnologiesCard } from './TechnologiesCard/TechnologiesCard'

export function Technologies() {
    const { t } = useTranslation()

    return(
        <section className='technologies-container'>
            <div className='technologies-header'>
                <span className='eyebrow'>{t('skillsTitle', 'Skills')}</span>
                <h2 className="section-title">{t('skillsTitle', 'Skills')}</h2>
                <p className='technologies-subtitle'>{t('technologiesSubtitle', 'A stack ready to ship fast, accessible and maintainable products.')}</p>
            </div>
            <div className='technologies-content'>
                {TECHNOLOGIES.map((detail) => (
                    <TechnologiesCard key={detail.name} details={detail}/>
                ))}
            </div>
        </section>
    )
}
