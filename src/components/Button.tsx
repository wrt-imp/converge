import type {ButtonHTMLAttributes, ReactNode} from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './VisualSystem.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  to?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  icon?: ReactNode;
  iconPosition?: 'start' | 'end';
  isLoading?: boolean;
  loadingLabel?: string;
  fullWidth?: boolean;
  fullWidthMobile?: boolean;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: styles.buttonPrimary,
  secondary: styles.buttonSecondary,
  text: styles.buttonText,
  danger: styles.buttonDanger,
};

const sizeClass: Record<ButtonSize, string> = {
  small: styles.buttonSmall,
  medium: styles.buttonMedium,
  large: styles.buttonLarge,
};

export default function Button({
  children,
  className,
  variant = 'primary',
  size = 'medium',
  to,
  target,
  rel,
  icon,
  iconPosition = 'start',
  isLoading = false,
  loadingLabel = '处理中',
  fullWidth = false,
  fullWidthMobile = false,
  disabled = false,
  type = 'button',
  ...buttonProps
}: ButtonProps): ReactNode {
  const unavailable = disabled || isLoading;
  const classes = clsx(
    styles.button,
    variantClass[variant],
    sizeClass[size],
    fullWidth && styles.buttonFull,
    fullWidthMobile && styles.buttonFullMobile,
    className,
  );
  const content = (
    <>
      {isLoading ? <span className={styles.spinner} aria-hidden="true" /> : null}
      {!isLoading && icon && iconPosition === 'start' ? (
        <span className={styles.buttonIcon} aria-hidden="true">{icon}</span>
      ) : null}
      <span>{children}</span>
      {!isLoading && icon && iconPosition === 'end' ? (
        <span className={styles.buttonIcon} aria-hidden="true">{icon}</span>
      ) : null}
      {isLoading ? <span className={styles.visuallyHidden}>{loadingLabel}</span> : null}
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        target={target}
        rel={rel}
        className={classes}
        aria-disabled={unavailable || undefined}
        aria-busy={isLoading || undefined}
        tabIndex={unavailable ? -1 : undefined}
        onClick={unavailable ? (event) => event.preventDefault() : undefined}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={unavailable}
      aria-busy={isLoading || undefined}
      {...buttonProps}
    >
      {content}
    </button>
  );
}
