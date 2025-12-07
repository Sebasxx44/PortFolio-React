import { useTranslation } from "react-i18next";
import { ReactTyped } from "react-typed";
import './AboutMe.css';
import photo from '/images/fondo-principal.png';
import cvEN from '/cvs/CV-Sebastian-Sanchez-English.pdf';
import cvES from '/cvs/CV-Sebastian-Sanchez-Espanol.pdf';
import cvPT from '/cvs/CV-Sebastian-Sanchez-Portugues.pdf';
import gmailIcon from '/images/gmailIcon.svg';
import { useState } from "react";
import Flag from "react-world-flags";
import { motion } from "framer-motion";

export function AboutMe() {

    const [openModal, setOpenModal] = useState(false);

    const { t } = useTranslation();

    const downloadCv = (lang) => {
    const cvMap = {
        es: cvES,
        en: cvEN,
        pt: cvPT
    };

    const fileUrl = cvMap[lang];

    // Abrir en nueva pestaña
    window.open(fileUrl, '_blank');

    // Descargar archivo
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = `CV-Sebastian-Sanchez-${lang.toUpperCase()}.pdf`;
    document.body.appendChild(link); 
    link.click();
    document.body.removeChild(link);

    setOpenModal(false);
};



    const handleOpenModal = () => {
        setOpenModal(!openModal)
    }

    const motionFade = {
        initial: { opacity: 0, y: 28 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
        viewport: { once: false, amount: 0.3 }
    };

    return (

        <>
        
                <section className="about-container">
                    <motion.div className="about-content" {...motionFade}>
                        <div className="about-info">
                            <p className="eyebrow">{t('about.greeting')} <span className="accented">Sebaz</span></p>
        
                            <ReactTyped
                                className="input-typed"
                                strings={t('about.typed', { returnObjects: true })}
                                typeSpeed={45}
                                backSpeed={55}
                                loop
                            />
        
                            <p className="about-description">{t('about.description')}</p>

                            <div className="about-badges">
                                <span className="pill"><i className="fa-regular fa-circle-check"></i> Full Stack</span>
                                <span className="pill"><i className="fa-solid fa-bolt"></i> React · Node</span>
                                <span className="pill"><i className="fa-solid fa-earth-americas"></i> Remote friendly</span>
                            </div>
        
                            <div className="contact-section" aria-label="Contacto">
                                <img src={gmailIcon} alt="gmail icon" />
                                <p className="selectable">sanchezz3s47@gmail.com</p>
                            </div>
        
                            <div className="content-buttons">
                                 <button onClick={handleOpenModal} className="button-download-cv" aria-label={t('about.download')}>
                                    <i className="fa-regular fa-file"></i> {t('about.download')}
                                </button>
                                <button className="button-github" onClick={() => window.open("https://github.com/Sebasxx44")} aria-label="Abrir Github">
                                    <i className="fa-brands fa-github"></i> Github
                                </button>
                            </div>
                        </div>
        
                        <motion.div className="about-picture" {...motionFade} transition={{ ...motionFade.transition, delay: 0.15 }}>
                            <div className="about-portrait">
                                <span className="glow"></span>
                                <img src={photo} alt="Sebastian Sanchez" />
                            </div>
                            <div className="availability-card">
                                <span className="status-dot"></span>
                                <div>
                                    <p>Disponible para proyectos</p>
                                    <small>Frontend · Backend · UI</small>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>
        
                {openModal && (
                        <div className="cv-modal-overlay" role="dialog" aria-modal="true">
                            <div className="cv-modal">
                                <h4>{t('aboutCv.chooseCvLanguage')}</h4>
                               <div className="cv-options">
                                    <button className="cv-lang-button" onClick={() => downloadCv('es')}>
                                        <Flag code="ES" style={{ width: 24, height: 16 }} />
                                        <span>Español</span>
                                    </button>
                                    <button className="cv-lang-button" onClick={() => downloadCv('en')}>
                                        <Flag code="US" style={{ width: 24, height: 16 }} />
                                        <span>English</span>
                                    </button>
                                    <button className="cv-lang-button" onClick={() => downloadCv('pt')}>
                                        <Flag code="PT" style={{ width: 24, height: 16 }} />
                                        <span>Português</span>
                                    </button>
                                </div>

                                <button className="close-modal" onClick={handleOpenModal} aria-label="Cerrar modal">✖</button>
                            </div>
                        </div>
                )}
        
        </>
    );
}
