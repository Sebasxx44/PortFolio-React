import { useRef } from 'react'
import { WORK_EXPERIENCE } from '../../utils/data'
import './WorkExperience.css'
import { WorkExperienceCard } from './WorkExperienceCard/WorkExperienceCard'
import Slider from "react-slick";

export function WorkExperience() {
    const sliderRef = useRef();

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: false,
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
    }

    const sliderLeft = () => {
        sliderRef.current.slickPrev()
    }

    return (
        <section className='experience-container'>
            <h5>Work Experience</h5>

            <div className='experience-content'>

                <div className='arrow-right' onClick={sliderRight}>
                    <span class='material-symbols-outlined'>chevron_right</span>
                </div>

                <div className='arrow-left' onClick={sliderLeft}>
                    <span class='material-symbols-outlined'>chevron_left</span>
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
