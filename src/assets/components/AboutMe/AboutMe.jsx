import { useTranslation } from "react-i18next";
import { ReactTyped } from "react-typed";
import './AboutMe.css';
import photo from '/images/principal.jpg';
import cv from '/cvs/CV-Sebastian-Sanchez.pdf';
import gmailIcon from '/images/gmailIcon.svg';

export function AboutMe() {
    const { t } = useTranslation();

    const downloadCv = () => {
        const urlPDF = cv;
        const link = document.createElement('a');
        link.href = urlPDF;
        link.download = 'CV-Sebastian-Sanchez.pdf'; 
        link.click();
    };

    return (
        <section className="about-container">
            <div className="about-content">
                <div className="about-info">
                    <h5>
                        {t('about.greeting')}<span> Sebaz</span>
                    </h5>

                    <ReactTyped
                        strings={t('about.typed', { returnObjects: true })}
                        typeSpeed={55}
                        backSpeed={70}
                        loop
                    >
                        <input disabled type="text" className="input-typed"/>
                    </ReactTyped>

                    <p>{t('about.description')}</p>

                    <div className="contact-section">
                        <img src={gmailIcon} alt="gmailIcon" />
                        <p>sanchezz3s47@gmail.com</p>
                    </div>

                    <div className="content-buttons">
                        <button onClick={downloadCv} className="button-download-cv">
                            <i className="fa-regular fa-file"></i> {t('about.download')}
                        </button>
                        <button className="button-github" onClick={() => window.open("https://github.com/Sebasxx44")}>
                            <i className="fa-brands fa-github"></i> Github
                        </button>
                    </div>
                </div>

                <div className="about-picture">
                    <img src={photo} alt="photo" />
                </div>
            </div>
        </section>
    );
}
