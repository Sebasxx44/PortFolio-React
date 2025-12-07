import { FaArrowRightLong } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export function ProjectsCard({ details, index, onPreview }) {
  const { t } = useTranslation();
  const reversed = index % 2 !== 0;

  return (
    <motion.article className={`project-card ${reversed ? 'is-reversed' : ''}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }} viewport={{ amount: 0.3, once: false }}>
      <div className="project-media">
        <img src={details.image} alt={t(details.name)} loading="lazy" />
      </div>

      <div className="project-info">
        <div className="project-links">
          <button className="project-btn-link" onClick={() => onPreview(details)} aria-label={`${t(details.name)} live demo`}>
            {t(details.name)} <FaArrowRightLong style={{ background: 'none' }} />
          </button>
          <button className="project-btn-github" onClick={() => window.open(details.github, '_blank', 'noopener')} aria-label="Abrir repositorio en Github">
            <i className="fa-brands fa-github"></i> Github
          </button>
        </div>

        <p>{t(details.description)}</p>

        <div className="project-technologies" aria-label="Tecnologías utilizadas">
          {details.technologies.map((tech, idx) => (
            <img key={idx} src={tech} alt="tech-icon" />
          ))}
        </div>
      </div>
    </motion.article>
  );
}
