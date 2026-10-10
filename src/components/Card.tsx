import type {HTMLAttributes, ReactNode} from 'react';
import clsx from 'clsx';
import styles from './VisualSystem.module.css';

export type CardVariant = 'bordered' | 'soft' | 'plain';
export type CardPadding = 'small' | 'medium' | 'large';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: 'article' | 'div';
  variant?: CardVariant;
  padding?: CardPadding;
  interactive?: boolean;
  children: ReactNode;
}

const variantClass: Record<CardVariant, string> = {
  bordered: styles.cardBordered,
  soft: styles.cardSoft,
  plain: styles.cardPlain,
};

const paddingClass: Record<CardPadding, string> = {
  small: styles.cardPaddingSmall,
  medium: styles.cardPaddingMedium,
  large: styles.cardPaddingLarge,
};

export default function Card({
  as: Element = 'article',
  variant = 'bordered',
  padding = 'medium',
  interactive = false,
  className,
  ...props
}: CardProps): ReactNode {
  return (
    <Element
      className={clsx(
        styles.card,
        variantClass[variant],
        paddingClass[padding],
        interactive && styles.cardInteractive,
        className,
      )}
      {...props}
    />
  );
}
