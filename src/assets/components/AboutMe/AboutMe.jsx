import { useTranslation } from "react-i18next";
import { ReactTyped } from "react-typed";
import './AboutMe.css';
import photo from '/images/fondo-principal.png';
import cvEN from '/cvs/CV-Sebastian-Sanchez-English.pdf';
import cvES from '/cvs/CV-Sebastian-Sanchez-Espanol.pdf';
import cvPT from '/cvs/CV-Sebastian-Sanchez-Portugues.pdf';
import { useState, useCallback, useEffect, useRef } from "react";
import Flag from "react-world-flags";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { FiCheckCircle, FiDownload, FiFileText, FiGlobe, FiMail, FiX, FiZap } from "react-icons/fi";

export function AboutMe() {

    const [openModal, setOpenModal] = useState(false);
    const { t } = useTranslation();
    const modalRef = useRef(null);
    const firstCvButtonRef = useRef(null);

    const downloadCv = useCallback((lang) => {
        const cvMap = { es: cvES, en: cvEN, pt: cvPT };
        const fileUrl = cvMap[lang];

        window.open(fileUrl, '_blank');

        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = `CV-Sebastian-Sanchez-${lang.toUpperCase()}.pdf`;
        document.body.appendChild(link); 
        link.click();
        document.body.removeChild(link);

        setOpenModal(false);
    }, []);

    const handleOpenModal = useCallback(() => {
        setOpenModal(prev => !prev);
    }, []);

    const cvOptions = [
        { lang: 'es', flag: 'ES', label: t('aboutCv.spanish', 'Spanish'), meta: 'ES' },
        { lang: 'en', flag: 'US', label: t('aboutCv.english', 'English'), meta: 'EN' },
        { lang: 'pt', flag: 'PT', label: t('aboutCv.portuguese', 'Portuguese'), meta: 'PT' },
    ];

    useEffect(() => {
        if (!openModal) return undefined;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        firstCvButtonRef.current?.focus();

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') setOpenModal(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [openModal]);

    return (
        <>
            <section className="about-container">
                <div className="about-content">
                    <div className="about-info">
                        <p className="eyebrow hero-reveal">{t('about.greeting')} <span className="accented">Sebaz</span></p>
    
                        <ReactTyped
                            className="input-typed hero-reveal"
                            strings={t('about.typed', { returnObjects: true })}
                            typeSpeed={45}
                            backSpeed={55}
                            loop
                        />
    
                        <p className="about-description hero-reveal">{t('about.description')}</p>

                        <div className="about-badges hero-reveal">
                            <span className="pill"><FiCheckCircle aria-hidden="true" /> Full Stack</span>
                            <span className="pill"><FiZap aria-hidden="true" /> React · Node</span>
                            <span className="pill"><FiGlobe aria-hidden="true" /> Remote friendly</span>
                        </div>
    
                        <div className="contact-section hero-reveal" aria-label="Contact">
                            <FiMail aria-hidden="true" />
                            <p className="selectable">sanchezz3s47@gmail.com</p>
                        </div>
    
                        <div className="content-buttons hero-reveal">
                             <button onClick={handleOpenModal} className="button-download-cv" aria-label={t('about.download')}>
                                <FiDownload aria-hidden="true" /> {t('about.download')}
                            </button>
                            <button className="button-github" onClick={() => window.open("https://github.com/Sebasxx44", '_blank', 'noopener')} aria-label="Open Github profile">
                                <FaGithub aria-hidden="true" /> Github
                            </button>
                            <button className="button-linkedin" onClick={() => window.open("https://www.linkedin.com/in/sebastian-sanchez-osorio/", '_blank', 'noopener')} aria-label="Open LinkedIn profile">
                                <FaLinkedinIn aria-hidden="true" /> LinkedIn
                            </button>
                        </div>
                    </div>
    
                    <div className="about-picture">
                        <div className="about-portrait">
                            <span className="glow"></span>
                            <img src={photo} alt="Sebastian Sanchez" />
                        </div>
                        <div className="availability-card">
                            <span className="status-dot"></span>
                            <div>
                                <p>{t('about.available')}</p>
                                <small>{t('about.availableSub')}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
    
            {openModal && (
                <div className="cv-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="cv-modal-title" onClick={handleOpenModal}>
                    <div className="cv-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal" onClick={handleOpenModal} aria-label="Close modal">
                            <FiX aria-hidden="true" />
                        </button>

                        <div className="cv-modal-icon" aria-hidden="true">
                            <FiFileText />
                        </div>

                        <p className="cv-modal-kicker">{t('aboutCv.format', 'Updated PDF')}</p>
                        <h4 id="cv-modal-title">{t('aboutCv.chooseCvLanguage')}</h4>
                        <p className="cv-modal-description">{t('aboutCv.description', 'Download a clean updated version in the language you need.')}</p>

                       <div className="cv-options">
                            {cvOptions.map((option, index) => (
                                <button
                                    key={option.lang}
                                    ref={index === 0 ? firstCvButtonRef : null}
                                    className="cv-lang-button"
                                    onClick={() => downloadCv(option.lang)}
                                >
                                    <span className="cv-flag">
                                        <Flag code={option.flag} style={{ width: 26, height: 18 }} />
                                    </span>
                                    <span className="cv-lang-text">{option.label}</span>
                                    <span className="cv-lang-meta">{option.meta}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
