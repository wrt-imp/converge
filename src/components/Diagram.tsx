import type {ReactNode} from 'react';
import clsx from 'clsx';
import styles from './VisualSystem.module.css';

export interface DiagramProps {
  title: string;
  description?: string;
  children: ReactNode;
  legend?: ReactNode;
  caption?: ReactNode;
  scrollable?: boolean;
  className?: string;
  canvasClassName?: string;
}

export default function Diagram({
  title,
  description,
  children,
  legend,
  caption,
  scrollable = true,
  className,
  canvasClassName,
}: DiagramProps): ReactNode {
  return (
    <figure className={clsx(styles.diagramFigure, className)}>
      <header className={styles.diagramHeader}>
        <h3 className={styles.diagramTitle}>{title}</h3>
        {description ? <p className={styles.diagramDescription}>{description}</p> : null}
      </header>
      <div className={clsx(styles.diagramViewport, scrollable && styles.diagramScrollable)}>
        <div className={clsx(styles.diagramCanvas, canvasClassName)}>{children}</div>
      </div>
      {legend ? <div className={styles.diagramLegend} aria-label="图例">{legend}</div> : null}
      {caption ? <figcaption className={styles.diagramCaption}>{caption}</figcaption> : null}
    </figure>
  );
}
