import { useTranslation } from 'react-i18next';
import { SERVICES } from '../../utils/data';
import { ServicesCard } from './ServicesCard/ServicesCard';
import './Services.css';
import { motion } from 'framer-motion';

export function Services() {
  const { t } = useTranslation();

  const cardMotion = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    viewport: { amount: 0.3, once: false }
  };

  return (
    <section className="services-container">
      <div className="services-header">
        <span className="eyebrow">{t('servicesTitle', 'Services')}</span>
        <h5 className="section-title">{t('servicesTitle', 'Services')}</h5> 
        <p className="services-subtitle">{t('servicesSubtitle', 'Diseño y desarrollo de experiencias digitales end-to-end, listas para producción y centradas en accesibilidad.')}</p>
      </div>

      <div className="services-content">
        {SERVICES.map((service, i) => (
          <motion.div key={i} {...cardMotion} transition={{ ...cardMotion.transition, delay: i * 0.05 }}>
            <ServicesCard
              details={{
                title: t(service.title),
                description: t(service.description),
                icon: service.icon,
              }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
