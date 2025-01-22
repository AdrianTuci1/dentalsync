import React, { useState } from "react";
import "../../styles/components/Accordion.scss"; // Styles for the accordion

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="accordion">
      <div
        className={`accordion-header ${isExpanded ? "expanded" : ""}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {title}
      </div>
      {isExpanded && <div className="accordion-body">{children}</div>}
    </div>
  );
};

export default Accordion;
