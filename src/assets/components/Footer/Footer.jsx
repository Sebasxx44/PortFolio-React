import './Footer.css';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import { animate, createScope, stagger } from 'animejs';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa6';
import { FiMail } from 'react-icons/fi';

export function Footer() {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();
    const footerRef = useRef(null);

    useEffect(() => {
        if (!footerRef.current) return;

        const scope = createScope({ root: footerRef });
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;

            scope.add(() => {
                animate('.footer-reveal', {
                    opacity: [0, 1],
                    translateY: [22, 0],
                    delay: stagger(90),
                    duration: 650,
                    ease: 'outExpo',
                });
            });
            observer.disconnect();
        }, { threshold: 0.2 });

        observer.observe(footerRef.current);
        return () => {
            observer.disconnect();
            scope.revert();
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer
            className="footer"
            ref={footerRef}
        >
            <div className="footer-gradient-line"></div>

            <div className="footer-content">
                <div className="footer-main footer-reveal" style={{ opacity: 0 }}>
                    <div className="footer-info">
                        <h3 className="footer-name">Sebastian Sanchez</h3>
                        <p className="footer-tagline">{t('footer.tagline', 'Full Stack Developer — Building fast, accessible & maintainable products.')}</p>
                    </div>

                    <div className="footer-socials">
                        <a href="https://github.com/Sebasxx44" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="GitHub">
                            <FaGithub aria-hidden="true" />
                        </a>
                        <a href="https://www.linkedin.com/in/sebastian-sanchez-osorio/" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="LinkedIn">
                            <FaLinkedinIn aria-hidden="true" />
                        </a>
                        <a href="mailto:sanchezz3s47@gmail.com" className="footer-social-link" aria-label="Email">
                            <FiMail aria-hidden="true" />
                        </a>
                    </div>
                </div>

                <div className="footer-bottom footer-reveal" style={{ opacity: 0 }}>
                    <p className="footer-copy">© {currentYear} Sebastian Sanchez. {t('footer.rights', 'All rights reserved.')}</p>
                    <button className="footer-back-top" onClick={scrollToTop} aria-label="Back to top">
                        <span className="material-symbols-outlined">arrow_upward</span>
                        {t('footer.backToTop', 'Back to top')}
                    </button>
                </div>
            </div>
        </footer>
    );
}
