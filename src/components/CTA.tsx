import type {HTMLAttributes, ReactNode} from 'react';
import Container, {type ContainerSize} from './Container';
import styles from './VisualSystem.module.css';

export interface CTAProps extends HTMLAttributes<HTMLElement> {
  title: string;
  description?: string;
  actions: ReactNode;
  containerSize?: ContainerSize;
}

export default function CTA({
  title,
  description,
  actions,
  containerSize = 'default',
  className,
  ...props
}: CTAProps): ReactNode {
  return (
    <aside className={className} {...props}>
      <Container size={containerSize}>
        <div className={styles.cta}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>{title}</h2>
            {description ? <p className={styles.ctaDescription}>{description}</p> : null}
          </div>
          <div className={styles.ctaActions}>{actions}</div>
        </div>
      </Container>
    </aside>
  );
}
