import { useState } from 'react';
import type { ProjectImage } from '@/types/project';
import './ProjectGallery.css';

interface ProjectGalleryProps {
  images: readonly ProjectImage[];
  title: string;
}

/**
 * Project gallery: one large active image with selectable thumbnails.
 * Keyboard operable and captioned; no lightbox dependency.
 */
export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  if (!active) return null;

  return (
    <div className="gallery">
      <figure className="gallery__main">
        <div className="gallery__frame">
          <img src={active.src} alt={active.alt} loading="lazy" decoding="async" />
        </div>
        {active.caption ? (
          <figcaption className="gallery__caption">
            <span className="gallery__counter">
              {activeIndex + 1} / {images.length}
            </span>
            {active.caption}
          </figcaption>
        ) : null}
      </figure>

      {images.length > 1 ? (
        <div className="gallery__thumbs" role="group" aria-label={`${title} images`}>
          {images.map((image, index) => (
            <button
              key={image.src + index}
              type="button"
              className={index === activeIndex ? 'gallery__thumb is-active' : 'gallery__thumb'}
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            >
              <img src={image.src} alt="" loading="lazy" decoding="async" />
              <span className="visually-hidden">
                Show image {index + 1}: {image.alt}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
