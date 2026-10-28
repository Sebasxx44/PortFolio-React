import { useState } from "react";
import { FiArrowDownRight } from "react-icons/fi";
import { ActionHeaderTA } from "@/components/portfolio/ActionHeaderTA";
import { RevealTA } from "@/components/portfolio/RevealTA";
import { stackGroups } from "@/components/portfolio/content";
import type { Copy } from "@/components/portfolio/types";

export const StackSectionTA = ({ copy }: { copy: Copy }) => {
  const [group, setGroup] = useState(0);
  return (
    <section className="stack-section section-shell">
      <RevealTA>
        <ActionHeaderTA
          number="04"
          label={copy.stackLabel}
          title={copy.stackTitle}
        >
          <p>{copy.stackIntro}</p>
        </ActionHeaderTA>
        <div className="stack-layout">
          <div
            className="stack-navigation"
            role="group"
            aria-label={copy.stackLabel}
          >
            {copy.stackGroups.map((label, index) => (
              <button
                key={label}
                aria-pressed={group === index}
                onClick={() => setGroup(index)}
              >
                <span>0{index + 1}</span>
                {label}
                <FiArrowDownRight aria-hidden="true" />
              </button>
            ))}
          </div>
          <ul className="stack-list" aria-live="polite">
            {stackGroups[group].map((name, index) => (
              <li key={name}>
                <span className="stack-symbol" aria-hidden="true">
                  {["⌘", "{ }", "↗", "◎", "⌁", "✳"][index]}
                </span>
                <span>{name}</span>
                <small>0{index + 1}</small>
              </li>
            ))}
          </ul>
        </div>
      </RevealTA>
    </section>
  );
};
