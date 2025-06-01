import { useTranslation } from 'react-i18next';
import { SERVICES } from '../../utils/data';
import { ServicesCard } from './ServicesCard/ServicesCard';
import './Services.css';

export function Services() {
  const { t } = useTranslation();

  return (
    <section className="services-container fade-in">
      <h5>{t('servicesTitle', 'Services')}</h5> 

      <div className="services-content">
        {SERVICES.map((service, i) => (
          <ServicesCard
            key={i}
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
