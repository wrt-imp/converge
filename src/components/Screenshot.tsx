import type {ImgHTMLAttributes, ReactNode} from 'react';
import clsx from 'clsx';
import styles from './VisualSystem.module.css';

export interface ScreenshotProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'width' | 'height' | 'className'> {
  src: string;
  alt: string;
  width: number;
  height: number;
  label?: string;
  meta?: string;
  caption?: ReactNode;
  className?: string;
  imageClassName?: string;
}

export default function Screenshot({
  src,
  alt,
  width,
  height,
  label,
  meta,
  caption,
  className,
  imageClassName,
  loading = 'lazy',
  decoding = 'async',
  ...imageProps
}: ScreenshotProps): ReactNode {
  return (
    <figure className={clsx(styles.screenshotFigure, className)}>
      <div className={styles.screenshotFrame}>
        {label || meta ? (
          <div className={styles.screenshotBar} aria-hidden="true">
            <span className={styles.screenshotLabel}>{label}</span>
            {meta ? <span>{meta}</span> : null}
          </div>
        ) : null}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          decoding={decoding}
          className={clsx(styles.screenshotImage, imageClassName)}
          {...imageProps}
        />
      </div>
      {caption ? <figcaption className={styles.screenshotCaption}>{caption}</figcaption> : null}
    </figure>
  );
}
