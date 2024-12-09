import {type ReactNode, useState} from 'react';
import {clx} from 'beeftools';

import SvgIconPlus from '@src/assets/svg/icon-plus.svg?react';

import styles from './Accordion.module.css';

// TODO: Consider allowing a ReactNode for `title`.
export interface AccordionProps {
  id: string;
  title: string;
  children: ReactNode;
  initialExpanded?: boolean;
}

// Reference:
// https://www.w3.org/WAI/ARIA/apg/patterns/accordion/examples/accordion/
export function Accordion({
  id,
  title,
  children,
  initialExpanded = false,
}: AccordionProps) {
  const [expanded, setExpanded] = useState(initialExpanded);

  const buttonId = `${id}-Button`;
  const contentId = `${id}-Content`;

  function handleToggle() {
    setExpanded((current) => !current);
  }

  return (
    <div id={id} className={styles.Accordion}>
      <button
        type="button"
        id={buttonId}
        className={clx('button-basic', styles.Action)}
        aria-controls={contentId}
        aria-label={`Toggle content for: ${title}`}
        aria-expanded={expanded}
        onClick={handleToggle}
      >
        <p className={styles.Title}>{title}</p>

        <div className={clx('icon-wrapper', styles.IconWrapper)}>
          <SvgIconPlus />
        </div>
      </button>

      <div
        id={contentId}
        className={styles.Body}
        aria-labelledby={buttonId}
        hidden={!expanded}
      >
        <div className={styles.Interior}>{children}</div>
      </div>
    </div>
  );
}

interface AccordionContentProps {
  children: ReactNode;
}

function AccordionContent({children}: AccordionContentProps) {
  return <div className={styles.AccordionContent}>{children}</div>;
}

interface AccordionTextProps {
  children: ReactNode;
}

function AccordionText({children}: AccordionTextProps) {
  return <p className={styles.AccordionText}>{children}</p>;
}

// Attached sub-components.
Accordion.Content = AccordionContent;
Accordion.Text = AccordionText;
