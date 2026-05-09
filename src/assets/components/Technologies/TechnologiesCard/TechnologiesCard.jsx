import { useTranslation } from 'react-i18next'
import '../Technologies.css'

export function TechnologiesCard({ details }) {
    const { t } = useTranslation()

    const accentStyle = {
        '--tech-color': details.color,
    }

    return (
        <div className='technologie-card' style={accentStyle}>
            <img src={details.icon} alt={t(details.name)} />
            <div className='technologie-info'>
                <h3>{t(details.name)}</h3>
                <p>{t(details.experience)}</p>
            </div>
        </div>
    )
}
