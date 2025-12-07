import { useRef } from 'react'
import { WORK_EXPERIENCE } from '../../utils/data'
import './WorkExperience.css'
import { WorkExperienceCard } from './WorkExperienceCard/WorkExperienceCard'
import Slider from "react-slick";
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';


export function WorkExperience() {
    
    const sliderRef = useRef();
    const { t } = useTranslation();


    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: false,
        className: 'work-experience-slider',
        responsive: [
            {
                breakpoint: 769,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    const sliderRight = () => {
        sliderRef.current.slickNext()
    };

    const sliderLeft = () => {
        sliderRef.current.slickPrev()
    };

    return (
        <section className='experience-container'>
            <motion.div className='experience-header' initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} viewport={{ amount: 0.3, once: false }}>
                <span className='eyebrow'>{t('work_experience_title')}</span>
                <h5 className="section-title">{t('work_experience_title')}</h5>
                <p className='experience-subtitle'>{t('workExperienceSubtitle', 'Experiencia construyendo productos de extremo a extremo en equipos multidisciplinares.')}</p>
            </motion.div>

            <motion.div className='experience-content' initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.05 }} viewport={{ amount: 0.3, once: false }}>

                <button className='arrow-right' onClick={sliderRight} aria-label="Siguiente experiencia">
                    <span className='material-symbols-outlined'>chevron_right</span>
                </button>

                <button className='arrow-left' onClick={sliderLeft} aria-label="Anterior experiencia">
                    <span className='material-symbols-outlined'>chevron_left</span>
                </button>

                <Slider ref={sliderRef} {...settings}>
                    {WORK_EXPERIENCE.map((item) => (
                        <WorkExperienceCard key={item.title} details={item}/>
                    ))}
                </Slider>

            </motion.div>
        </section>
    );
}
