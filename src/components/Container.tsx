import type {HTMLAttributes, ReactNode} from 'react';
import clsx from 'clsx';
import styles from './VisualSystem.module.css';

export type ContainerSize = 'narrow' | 'default' | 'wide';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
}

const sizeClass: Record<ContainerSize, string> = {
  narrow: styles.containerNarrow,
  default: styles.containerDefault,
  wide: styles.containerWide,
};

export default function Container({
  size = 'default',
  className,
  ...props
}: ContainerProps): ReactNode {
  return <div className={clsx(styles.container, sizeClass[size], className)} {...props} />;
}
