import type {CSSProperties, ReactNode} from 'react';
import clsx from 'clsx';
import styles from './SitePrimitives.module.css';

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  light = false,
  align = 'left',
}: {
  index?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  light?: boolean;
  align?: 'left' | 'center';
}): ReactNode {
  return (
    <header className={clsx(styles.sectionHeading, align === 'center' && styles.centered, light && styles.light)}>
      {index ? <span className={styles.sectionIndex}>{index}</span> : null}
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <h2>{title}</h2>
      {description ? <p className={styles.sectionDescription}>{description}</p> : null}
    </header>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  aside,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  aside?: ReactNode;
  dark?: boolean;
}): ReactNode {
  return (
    <section className={clsx(styles.pageHero, dark && styles.darkHero)}>
      <div className={clsx(styles.pageHeroInner, aside && styles.withAside)}>
        <div className={styles.pageHeroCopy}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1>{title}</h1>
          <p className={styles.pageHeroDescription}>{description}</p>
          {actions ? <div className={styles.heroActions}>{actions}</div> : null}
        </div>
        {aside ? <div className={styles.pageHeroAside}>{aside}</div> : null}
      </div>
    </section>
  );
}

export function CodeWindow({
  filename,
  language = 'TEXT',
  code,
  accent,
}: {
  filename: string;
  language?: string;
  code: string;
  accent?: string;
}): ReactNode {
  return (
    <div className={styles.codeWindow}>
      <div className={styles.codeBar}>
        <span className={styles.windowDots} aria-hidden="true"><i /><i /><i /></span>
        <span className={styles.filename}>{filename}</span>
        <span className={styles.language}>{language}</span>
      </div>
      <pre aria-label={`${filename} 示例代码`}>
        {accent ? <span className={styles.codeAccent}>{accent}</span> : null}
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function StepSequence({steps, dark = false}: {steps: string[]; dark?: boolean}): ReactNode {
  return (
    <ol className={clsx(styles.stepSequence, dark && styles.sequenceDark)}>
      {steps.map((step, index) => (
        <li key={step} style={{'--step-index': index} as CSSProperties}>
          <span className={styles.stepNumber}>{String(index + 1).padStart(2, '0')}</span>
          <strong>{step}</strong>
        </li>
      ))}
    </ol>
  );
}
