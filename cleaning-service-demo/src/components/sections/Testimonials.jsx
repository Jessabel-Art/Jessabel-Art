// src/components/sections/Testimonials.jsx
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import {
  reviews,
  getReviewerInitial,
  formatRelativeDate,
  getReviewSummary,
} from '@/lib/reviews';

function Stars({ rating, size = 'h-3.5 w-3.5' }) {
  return (
    <div className="flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${size} ${i < rating ? 'text-primary fill-primary' : 'text-border'}`}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const reduceMotion = useReducedMotion();
  const summary = getReviewSummary(reviews);
  const featured = reviews.slice(0, 6);

  return (
    <section className="py-14 sm:py-18 md:py-24 px-3 sm:px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-8 sm:mb-12 md:mb-14"
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.6 }}
          viewport={reduceMotion ? undefined : { once: true }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Reputation</p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
            What Our Clients Say
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Review data modeled after Google, Facebook, and Yelp for this portfolio demo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Aggregate rating card */}
          <motion.div
            className="lg:col-span-4"
            initial={reduceMotion ? false : { opacity: 0, x: -24 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.6 }}
            viewport={reduceMotion ? undefined : { once: true }}
          >
            <Card className="lg:sticky lg:top-28 bg-card border-border shadow-card">
              <CardContent className="p-5 sm:p-6 md:p-7">
                <div className="text-center lg:text-left mb-5">
                  <div className="flex items-baseline gap-2 justify-center lg:justify-start">
                    <span className="font-display text-5xl font-bold text-foreground">{summary.average.toFixed(1)}</span>
                    <span className="text-muted-foreground text-sm">/ 5</span>
                  </div>
                  <div className="flex justify-center lg:justify-start mt-1.5 mb-1.5">
                    <Stars rating={Math.round(summary.average)} size="h-5 w-5" />
                  </div>
                  <p className="text-sm text-muted-foreground">Based on {summary.count} client reviews</p>
                </div>

                <div className="space-y-2">
                  {summary.distribution.map((row) => (
                    <div key={row.stars} className="flex items-center gap-2.5 text-xs sm:text-sm">
                      <span className="w-3 text-muted-foreground font-medium">{row.stars}</span>
                      <Star className="h-3 w-3 text-primary fill-primary shrink-0" />
                      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${row.percent}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-muted-foreground tabular-nums">{row.count}</span>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground mt-5 pt-5 border-t border-border">
                  Ratings aggregate demo reviews sourced across Google, Facebook, and Yelp.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Review cards */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {featured.map((review, i) => (
              <motion.div
                key={review.id}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : i * 0.05 }}
                viewport={reduceMotion ? undefined : { once: true }}
              >
                <Card className="h-full bg-card border-border shadow-card">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-display font-semibold text-sm">
                          {getReviewerInitial(review.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-foreground truncate">{review.name}</p>
                          <p className="text-xs text-muted-foreground">{formatRelativeDate(review.date)}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="shrink-0 text-[10px] text-muted-foreground">{review.source}</Badge>
                    </div>

                    <Stars rating={review.rating} />

                    <p className="text-sm text-foreground/85 leading-relaxed mt-3 line-clamp-5">
                      {review.body}
                    </p>

                    <p className="text-xs text-primary font-medium mt-3">{review.service}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
