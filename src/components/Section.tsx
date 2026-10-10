import {useId, type HTMLAttributes, type ReactNode} from 'react';
import clsx from 'clsx';
import Container, {type ContainerSize} from './Container';
import styles from './VisualSystem.module.css';

export type SectionTone = 'default' | 'subtle' | 'ruled';
export type SectionSpacing = 'default' | 'compact';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title?: string;
  intro?: string;
  action?: ReactNode;
  tone?: SectionTone;
  spacing?: SectionSpacing;
  align?: 'left' | 'center';
  containerSize?: ContainerSize;
  children?: ReactNode;
}

const toneClass: Record<SectionTone, string | undefined> = {
  default: undefined,
  subtle: styles.sectionSubtle,
  ruled: styles.sectionRuled,
};

export default function Section({
  eyebrow,
  title,
  intro,
  action,
  tone = 'default',
  spacing = 'default',
  align = 'left',
  containerSize = 'default',
  className,
  children,
  id,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: SectionProps): ReactNode {
  const generatedId = useId().replaceAll(':', '');
  const headingId = title ? `${id ?? `section-${generatedId}`}-title` : undefined;

  return (
    <section
      id={id}
      aria-labelledby={headingId ?? ariaLabelledBy}
      className={clsx(
        styles.section,
        toneClass[tone],
        spacing === 'compact' && styles.sectionCompact,
        className,
      )}
      {...props}
    >
      <Container size={containerSize}>
        {eyebrow || title || intro || action ? (
          <header
            className={align === 'center' ? styles.sectionHeaderCentered : styles.sectionHeader}
          >
            <div>
              {eyebrow ? <p className={styles.sectionEyebrow}>{eyebrow}</p> : null}
              {title ? <h2 id={headingId} className={styles.sectionTitle}>{title}</h2> : null}
              {intro ? <p className={styles.sectionIntro}>{intro}</p> : null}
            </div>
            {action ? <div className={styles.sectionAction}>{action}</div> : null}
          </header>
        ) : null}
        {children ? <div className={styles.sectionBody}>{children}</div> : null}
      </Container>
    </section>
  );
}
