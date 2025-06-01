import { useRef } from 'react'
import { WORK_EXPERIENCE } from '../../utils/data'
import './WorkExperience.css'
import { WorkExperienceCard } from './WorkExperienceCard/WorkExperienceCard'
import Slider from "react-slick";
import { useTranslation } from 'react-i18next';


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
            <h5>{t('work_experience_title')}</h5>

            <div className='experience-content'>

                <div className='arrow-right' onClick={sliderRight}>
                    <span className='material-symbols-outlined'>chevron_right</span>
                </div>

                <div className='arrow-left' onClick={sliderLeft}>
                    <span disabled className='material-symbols-outlined'>chevron_left</span>
                </div>

                <Slider ref={sliderRef} {...settings}>
                    {WORK_EXPERIENCE.map((item) => (
                        <WorkExperienceCard key={item.title} details={item}/>
                    ))}
                </Slider>

            </div>
        </section>
    );
}
