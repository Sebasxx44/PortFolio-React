import { useTranslation } from 'react-i18next'
import './Technologies.css'
import { TECHNOLOGIES } from "../../utils/data"
import { TechnologiesCard } from './TechnologiesCard/TechnologiesCard'
import { motion } from 'framer-motion'

export function Technologies() {
    const { t } = useTranslation()

    const cardMotion = {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        viewport: { once: false, amount: 0.2 }
    };

    return(
        <>
            <section className='technologies-container'>
                <motion.div className='technologies-header' initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} viewport={{ once: false, amount: 0.3 }}>
                    <span className='eyebrow'>{t('skillsTitle', 'Skills')}</span>
                    <h5 className="section-title">{t('skillsTitle', 'Skills')}</h5>
                    <p className='technologies-subtitle'>{t('technologiesSubtitle', 'Stack listo para lanzar productos rápidos, accesibles y mantenibles.')}</p>
                </motion.div>
                <div className='technologies-content'>
                    {TECHNOLOGIES.map((detail, index) => (
                        <motion.div key={detail.name} {...cardMotion} transition={{ ...cardMotion.transition, delay: index * 0.04 }}>
                            <TechnologiesCard details={detail}/>
                        </motion.div>
                    ))}
                </div>
            </section>
        </>
    )
}
