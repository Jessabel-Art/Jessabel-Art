import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

// Load all meta.json files (eager so it's available synchronously)
const metaFiles = import.meta.glob('/src/assets/before-after/*/meta.json', {
  eager: true,
  import: 'default',
});

// Load all images and map path -> URL (works in dev and build)
const imageFiles = import.meta.glob('/src/assets/before-after/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  import: 'default',
});

function resolveImage(path) {
  return imageFiles[path];
}

const Gallery = () => {
  const reduceMotion = useReducedMotion();

  // Build slides from each job's meta.json
  const slides = Object.entries(metaFiles).flatMap(([metaPath, metaObj]) => {
    const baseDir = metaPath.replace(/\/meta\.json$/, '');

    const title = metaObj?.title || 'Project';
    const altTemplate = metaObj?.altTemplate || {
      before: '{{label}} before cleaning',
      after: '{{label}} after cleaning',
    };

    return (metaObj?.pairs || []).map((p) => {
      const beforePath = `${baseDir}/${p.before}`;
      const afterPath = `${baseDir}/${p.after}`;

      return {
        title: `${title}${p.label ? ` – ${p.label}` : ''}`,
        beforeSrc: resolveImage(beforePath),
        afterSrc: resolveImage(afterPath),
        beforeAlt: (altTemplate.before || '{{label}} before cleaning').replace('{{label}}', p.label || title),
        afterAlt: (altTemplate.after || '{{label}} after cleaning').replace('{{label}}', p.label || title),
      };
    });
  }).filter(s => s.beforeSrc && s.afterSrc); // guard against missing files

  return (
    <section className="py-14 sm:py-18 md:py-24 px-3 sm:px-4 bg-muted">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-8 sm:mb-12 md:mb-14"
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.6 }}
          viewport={reduceMotion ? undefined : { once: true }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Real Results</p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">Before &amp; After</h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            See the difference a professional clean can make. Our results speak for themselves.
          </p>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.2 }}
          viewport={reduceMotion ? undefined : { once: true }}
        >
          <Carousel className="w-full" opts={{ loop: true }}>
            <CarouselContent>
              {slides.map((item, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className="bg-card rounded-xl shadow-card overflow-hidden border-border">
                      <CardContent className="p-3 sm:p-4 md:p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                          <div className="relative">
                            <img
                              src={item.beforeSrc}
                              alt={item.beforeAlt}
                              className="w-full h-40 sm:h-56 md:h-64 lg:h-96 object-cover rounded-lg"
                              loading="lazy"
                            />
                            <div className="absolute top-2 left-2 bg-navy-900/85 text-white px-2.5 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-semibold shadow-card">
                              Before
                            </div>
                          </div>
                          <div className="relative">
                            <img
                              src={item.afterSrc}
                              alt={item.afterAlt}
                              className="w-full h-40 sm:h-56 md:h-64 lg:h-96 object-cover rounded-lg"
                              loading="lazy"
                            />
                            <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2.5 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-semibold shadow-card">
                              After
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 sm:mt-4 md:mt-6 text-center">
                          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-foreground">{item.title}</h3>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
};

export default Gallery;
