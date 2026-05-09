import { useTranslation } from 'react-i18next';
import { SERVICES } from '../../utils/data';
import { ServicesCard } from './ServicesCard/ServicesCard';
import './Services.css';

export function Services() {
  const { t } = useTranslation();

  return (
    <section className="services-container">
      <div className="services-header">
        <span className="eyebrow">{t('servicesTitle', 'Services')}</span>
        <h2 className="section-title">{t('servicesTitle', 'Services')}</h2>
        <p className="services-subtitle">{t('servicesSubtitle', 'End-to-end digital experiences, production-ready with accessibility-first thinking.')}</p>
      </div>

      <div className="services-content">
        {SERVICES.map((service) => (
          <ServicesCard
            key={service.title}
            details={{
              title: t(service.title),
              description: t(service.description),
              icon: service.icon,
            }}
          />
        ))}
      </div>
    </section>
  );
}
