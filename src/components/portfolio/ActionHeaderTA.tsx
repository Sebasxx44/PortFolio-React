import type { SectionHeaderProps } from "@/components/portfolio/types";

export const ActionHeaderTA = ({
  number,
  label,
  title,
  children,
  light = false,
}: SectionHeaderProps) => (
  <header className={`section-header ${light ? "section-header--light" : ""}`}>
    <p className="eyebrow">
      <span className="section-number">{number}</span>
      {label}
    </p>
    <div className="section-heading-row">
      <h2 id={`section-heading-${number}`}>{title}</h2>
      {children}
    </div>
  </header>
);
