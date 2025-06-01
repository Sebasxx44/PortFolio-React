import { useTranslation } from 'react-i18next'
import '../Technologies.css'

export function TechnologiesCard({ details }) {
    const { t } = useTranslation()

    const boxShadowStyle = {
        boxShadow: `0 0px 0px 0 ${details.color}, 2px 1px 5px 0 ${details.color}`,
    }

    return (
        <>
            <div className='technologie-card' style={boxShadowStyle}>
                <img src={details.icon} alt={t(details.name)} />
                <div className='technologie-info'>
                    <h1>{t(details.name)}</h1>
                    <p>{t(details.experience)}</p>
                </div>
            </div>
        </>
    )
}
