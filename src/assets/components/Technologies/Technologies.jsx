import { useTranslation } from 'react-i18next'
import './Technologies.css'
import { TECHNOLOGIES } from "../../utils/data"
import { TechnologiesCard } from './TechnologiesCard/TechnologiesCard'

export function Technologies() {
    const { t } = useTranslation()

    return(
        <>
            <section className='technologies-container'>
                <h5>{t('skillsTitle', 'Skills')}</h5>
                <div className='technologies-content'>
                    {TECHNOLOGIES.map((detail) => (
                        <TechnologiesCard key={detail.name} details={detail}/>
                    ))}
                </div>
            </section>
        </>
    )
}
