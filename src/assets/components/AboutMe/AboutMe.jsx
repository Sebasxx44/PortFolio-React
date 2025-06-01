import { useTranslation } from "react-i18next";
import { ReactTyped } from "react-typed";
import './AboutMe.css';
import photo from '/images/principal.jpg';
import cvEN from '/cvs/CV-Sebastian-Sanchez-English.pdf';
import cvES from '/cvs/CV-Sebastian-Sanchez-Espanol.pdf';
import cvPT from '/cvs/CV-Sebastian-Sanchez-Portugues.pdf';
import gmailIcon from '/images/gmailIcon.svg';
import { useState } from "react";
import Flag from "react-world-flags";

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

    return (

        <>
        
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
                                <p className="selectable">sanchezz3s47@gmail.com</p>
                            </div>
        
                            <div className="content-buttons">
                                 <button onClick={handleOpenModal} className="button-download-cv">
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
        
                {openModal && (
                        <div className="cv-modal-overlay">
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

                                <button className="close-modal" onClick={handleOpenModal}>✖</button>
                            </div>
                        </div>
                )}
        
        </>
    );
}
