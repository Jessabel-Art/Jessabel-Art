import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Sparkles, Truck, Building, ArrowRight } from "lucide-react";
import { SERVICES } from "@/data/services";

const ICONS = { Home, Sparkles, Truck, Building };

const ServicesHighlight = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section id="services" className="py-14 sm:py-18 md:py-24 px-3 sm:px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Sticky intro column */}
          <motion.div
            className="lg:col-span-4"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.6 }}
            viewport={reduceMotion ? undefined : { once: true }}
          >
            <div className="lg:sticky lg:top-28 text-center lg:text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">What We Clean</p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                Four ways we keep your space spotless
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md mx-auto lg:mx-0">
                From routine upkeep to move-day deadlines, pick the service that fits —
                every visit includes a transparent, upfront estimate.
              </p>
              <Button asChild className="rounded-md bg-primary hover:bg-primary/90 text-primary-foreground px-6">
                <Link to="/services">Explore All Services</Link>
              </Button>
            </div>
          </motion.div>

          {/* Service rows */}
          <div className="lg:col-span-8 flex flex-col divide-y divide-border border-t border-b border-border">
            {SERVICES.map((svc, i) => {
              const Icon = ICONS[svc.icon] || Home;
              return (
                <motion.div
                  key={svc.slug}
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : i * 0.06 }}
                  viewport={reduceMotion ? undefined : { once: true }}
                >
                  <Link
                    to={`/services#${svc.slug}`}
                    className="group flex items-center gap-4 sm:gap-6 py-5 sm:py-6 hover:bg-secondary/50 transition-colors -mx-3 sm:-mx-4 px-3 sm:px-4 rounded-md"
                  >
                    <div className="flex-shrink-0 w-11 h-11 sm:w-14 sm:h-14 rounded-lg bg-accent flex items-center justify-center">
                      <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display text-base sm:text-lg font-semibold text-foreground">{svc.title}</h3>
                        {svc.popular && (
                          <Badge variant="secondary" className="bg-accent text-accent-foreground">Most Popular</Badge>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-1">{svc.blurb}</p>
                    </div>

                    <div className="hidden sm:flex flex-col items-end shrink-0">
                      <span className="text-sm font-semibold text-foreground">From ${svc.priceFrom}</span>
                      <span className="text-xs text-muted-foreground">{svc.duration}</span>
                    </div>

                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesHighlight;
