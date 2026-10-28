import { FiArrowUp, FiArrowUpRight, FiCheck, FiCopy } from "react-icons/fi";
import { email, github, linkedin } from "@/components/portfolio/content";
import { RevealTA } from "@/components/portfolio/RevealTA";
import { AsteriskTA } from "@/components/portfolio/AsteriskTA";
import { useContact } from "@/composables/portfolio/useContact";
import type { Copy } from "@/components/portfolio/types";

export const ContactSectionTA = ({ copy }: { copy: Copy }) => {
  const { contact } = useContact();
  return (
    <footer id="contact" className="contact-section section-shell">
      <RevealTA>
        <div className="contact-topline">
          <p className="eyebrow">
            <span className="section-number">05</span>
            {copy.contactLabel}
          </p>
          <span className="contact-star" aria-hidden="true">
            <AsteriskTA />
          </span>
        </div>
        <a className="contact-heading" href={`mailto:${email}`}>
          <h2>
            {copy.contactTop}
            <br />
            <span>{copy.contactBottom}</span>
          </h2>
          <span className="contact-arrow">
            <FiArrowUpRight aria-hidden="true" />
          </span>
        </a>
        <div className="contact-bottom">
          <div>
            <p>{copy.contactText}</p>
            <div className="email-row">
              <a href={`mailto:${email}`}>{email}</a>
              <button onClick={contact.copyEmail} aria-label={copy.copyEmail}>
                {contact.status === "copied" ? <FiCheck /> : <FiCopy />}
              </button>
            </div>
            <span role="status" className="copy-status">
              {contact.status === "copied"
                ? copy.copied
                : contact.status === "error"
                  ? copy.copyFailed
                  : ""}
            </span>
          </div>
          <div className="contact-socials">
            <a href={github} target="_blank" rel="noopener noreferrer">
              GitHub
              <FiArrowUpRight />
            </a>
            <a href={linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
              <FiArrowUpRight />
            </a>
          </div>
        </div>
      </RevealTA>
      <div className="footer-line">
        <a className="wordmark" href="#home">
          sebaz<span className="wordmark-dot">®</span>
        </a>
        <p>
          © {new Date().getFullYear()} · {copy.made}
        </p>
        <a className="back-top" href="#home" aria-label={copy.home}>
          <FiArrowUp />
        </a>
      </div>
    </footer>
  );
};
