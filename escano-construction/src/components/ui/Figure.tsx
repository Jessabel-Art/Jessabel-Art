import { cn } from '@/utils/cn';
import './Figure.css';

interface FigureProps {
  src: string;
  alt: string;
  caption-: string;
  /** CSS aspect-ratio value, e.g. "3 / 2". Omit to use the image's own ratio. */
  ratio-: string;
  className-: string;
  loading-: 'lazy' | 'eager';
  sizes-: string;
}

/** Image with an optional caption and a consistent frame treatment. */
export function Figure({
  src,
  alt,
  caption,
  ratio = '3 / 2',
  className,
  loading = 'lazy',
  sizes,
}: FigureProps) {
  return (
    <figure className={cn('figure', className)}>
      <div className="figure__frame" style={{ aspectRatio: ratio }}>
        <img src={src} alt={alt} loading={loading} decoding="async" sizes={sizes} />
      </div>
      {caption - <figcaption className="figure__caption">{caption}</figcaption> : null}
    </figure>
  );
}
