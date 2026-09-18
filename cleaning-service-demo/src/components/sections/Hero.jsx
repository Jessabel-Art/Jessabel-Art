// src/components/sections/Hero.jsx
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldCheck, MapPin, Star } from 'lucide-react';
import heroImg from '@/assets/images/hero.jpeg';
import afterImg from '@/assets/before-after/job-001-mixed/after-6.jpg';
import beforeImg from '@/assets/before-after/job-001-mixed/before-6.jpg';
import { getReviewSummary } from '@/lib/reviews';

const Hero = () => {
  const prefersReducedMotion = useReducedMotion();
  const navigate = useNavigate();
  const location = useLocation();
  const { average, count } = getReviewSummary();

  const handleScrollToServices = (e) => {
    const el = document.getElementById('services');
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (location.pathname !== '/') {
      e.preventDefault();
      navigate('/#services');
    }
  };

  return (
    <section className="relative overflow-hidden bg-background pt-12 sm:pt-16 md:pt-20 pb-14 sm:pb-20 md:pb-24">
      {/* Subtle structural backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[70%] bg-gradient-to-b from-secondary/70 to-transparent"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Copy column */}
          <motion.div
            className="lg:col-span-6 xl:col-span-6 text-center lg:text-left"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-1.5 text-xs sm:text-sm font-semibold text-accent-foreground mb-5">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              Serving Jacksonville &amp; Duval County, FL
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.05] mb-5">
              Where Clean
              <br />
              <span className="text-primary">Meets Care.</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8">
              Reliable, background-checked cleaning pros for homes and offices across
              Duval County — transparent estimates, easy online booking, and results
              you can see the moment we walk out the door.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-10">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto rounded-md bg-primary hover:bg-primary/90 text-primary-foreground px-8 font-semibold shadow-card"
              >
                <Link to="/auth">Book Now</Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-md border-border text-foreground hover:bg-secondary px-8 font-semibold"
                onClick={handleScrollToServices}
              >
                <Link to="/services">View Services</Link>
              </Button>
            </div>

            {/* Trust strip */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start gap-1 rounded-lg border border-border bg-card px-3 py-3 shadow-card">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="text-xs sm:text-sm font-semibold text-foreground leading-tight">Fully Insured</span>
              </div>
              <div className="flex flex-col items-center lg:items-start gap-1 rounded-lg border border-border bg-card px-3 py-3 shadow-card">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-primary fill-primary" />
                  <span className="text-xs sm:text-sm font-semibold text-foreground leading-tight">{average.toFixed(1)} rating</span>
                </div>
                <span className="text-[11px] text-muted-foreground">{count} client reviews</span>
              </div>
              <div className="flex flex-col items-center lg:items-start gap-1 rounded-lg border border-border bg-card px-3 py-3 shadow-card">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-xs sm:text-sm font-semibold text-foreground leading-tight">Duval County</span>
              </div>
            </div>
          </motion.div>

          {/* Visual column */}
          <motion.div
            className="lg:col-span-6 xl:col-span-6 relative"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-pop">
              <img
                src={heroImg}
                alt="A freshly cleaned, sunlit living space"
                className="w-full h-[320px] sm:h-[400px] lg:h-[460px] object-cover"
                loading="eager"
                decoding="async"
                {...{ fetchpriority: 'high' }}
              />
            </div>

            {/* Floating before/after proof card */}
            <div className="hidden sm:block absolute -bottom-6 -left-6 w-56 rounded-xl bg-card border border-border shadow-pop overflow-hidden">
              <div className="grid grid-cols-2 gap-px bg-border w-full">
                <div className="relative">
                  <img src={beforeImg} alt="Living room before cleaning" className="h-24 w-full object-cover" loading="lazy" />
                  <span className="absolute top-1 left-1 rounded-sm bg-navy-900/80 px-1.5 py-0.5 text-[10px] font-semibold text-white">Before</span>
                </div>
                <div className="relative">
                  <img src={afterImg} alt="Living room after cleaning" className="h-24 w-full object-cover" loading="lazy" />
                  <span className="absolute top-1 left-1 rounded-sm bg-primary/90 px-1.5 py-0.5 text-[10px] font-semibold text-white">After</span>
                </div>
              </div>
              <span className="sr-only">Real before-and-after cleaning result</span>
            </div>

            {/* Floating rating chip */}
            <div className="absolute top-4 right-4 sm:-right-5 flex items-center gap-2 rounded-lg bg-card border border-border shadow-pop px-3.5 py-2.5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(average) ? 'text-primary fill-primary' : 'text-border'}`} />
                ))}
              </div>
              <span className="text-xs font-semibold text-foreground whitespace-nowrap">{average.toFixed(1)} · {count} reviews</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
