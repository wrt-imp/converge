import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import Card from './Card';
import styles from './VisualSystem.module.css';

export interface FeatureCardProps {
  title: string;
  description: string;
  eyebrow?: string;
  icon?: ReactNode;
  to?: string;
  linkLabel?: string;
  className?: string;
}

export default function FeatureCard({
  title,
  description,
  eyebrow,
  icon,
  to,
  linkLabel = '了解更多',
  className,
}: FeatureCardProps): ReactNode {
  return (
    <Card
      variant="bordered"
      interactive={Boolean(to)}
      className={clsx(styles.featureCard, className)}
    >
      {icon ? <div className={styles.featureIcon} aria-hidden="true">{icon}</div> : null}
      {eyebrow ? <p className={styles.featureEyebrow}>{eyebrow}</p> : null}
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDescription}>{description}</p>
      {to ? <Link className={styles.featureLink} to={to}>{linkLabel} →</Link> : null}
    </Card>
  );
}
