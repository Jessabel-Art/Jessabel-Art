// src/pages/Services.jsx
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home, Sparkles, Truck, Building, Leaf,
  CalendarClock, CheckCircle2, ClipboardList, Heart,
  Crown, ShieldCheck, Clock4, MapPin, ArrowRight, Clock
} from "lucide-react";

import { SERVICES, ADD_ONS, FREQUENCIES } from "@/data/services";

// Per-service images (module imports)
import residentialImg from "@/assets/images/residential-cleaning.jpeg";
import commercialImg from "@/assets/images/commercial-cleaning.jpeg";
import movingImg from "@/assets/images/moving-cleaning.jpeg";
import deepImg from "@/assets/images/deep-cleaning.jpeg";

// Banner + service-area visual
import servicesBanner from "@/assets/images/services-banner.jpeg";
import servicesSide from "@/assets/images/services-image.jpeg";

const SERVICE_IMAGES = {
  "residential-cleaning": residentialImg,
  "office-cleaning": commercialImg,
  "move-in-move-out": movingImg,
  "deep-clean": deepImg,
};

const ICONS = { Home, Sparkles, Truck, Building };

const perks = [
  { icon: ShieldCheck, text: "Background-Checked Pros" },
  { icon: CalendarClock, text: "Replies within 24 hours" },
  { icon: Leaf, text: "Eco-Friendly Products" },
];

const steps = [
  { icon: ClipboardList, title: "Tell us about your space", text: "Bedrooms, bathrooms, add-ons, and your preferred time window." },
  { icon: Heart, title: "Get an estimate", text: "Transparent, no-pressure estimates (estimates are not quotes)." },
  { icon: CheckCircle2, title: "We handle the rest", text: "Pro team arrives on time with supplies and smiles." },
];

const serviceAreas = ["Jacksonville & Duval County (Demo)", "Commercial & Residential"];
const hours = [
  { label: "Mon–Fri", value: "8:00 AM – 3:00 PM" },
  { label: "Saturday", value: "9:00 AM – 2:00 PM" },
  { label: "Sunday", value: "Closed" },
];

const fadeUp = (delay = 0, reduceMotion = false) => {
  if (reduceMotion) {
    return {
      initial: false,
      transition: { duration: 0 },
    };
  }

  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.55, ease: "easeOut", delay },
    viewport: { once: true },
  };
};

const ServicesPage = () => {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <Helmet>
        <title>Cleaning Services | CleanPro Demo</title>
        <meta
          name="description"
          content="Explore residential, deep clean, move-in/out, and office cleaning services with transparent pricing estimates. Demo site — no real bookings are created."
        />
      </Helmet>

    <main className="py-8 sm:py-10 md:py-14 px-3 sm:px-4 bg-background">
      <div className="max-w-6xl mx-auto">

        {/* Banner */}
        <motion.div
          className="relative mb-10 sm:mb-14 md:mb-16 overflow-hidden rounded-xl sm:rounded-2xl border border-border"
          aria-label="Professional cleaning services available in Jacksonville and Duval County"
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={reduceMotion ? undefined : { opacity: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.5 }}
          viewport={reduceMotion ? undefined : { once: true }}
          style={{
            backgroundImage:
              `linear-gradient(to top right, rgba(7,22,32,.75), rgba(7,22,32,.45), rgba(7,22,32,.05)), url(${servicesBanner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          >
          <div className="h-[220px] sm:h-[260px] md:h-[340px] w-full" />
          <div className="absolute inset-0 flex items-center">
            <div className="px-4 sm:px-6 md:px-10 max-w-2xl">
              <h1 className="text-white text-xl sm:text-2xl md:text-4xl font-display font-bold leading-tight drop-shadow-sm">
                Spotless spaces, zero guesswork
              </h1>
              <p className="mt-1.5 sm:mt-2 text-white/85 text-xs sm:text-sm md:text-base">
                Clear options, upfront estimates, and flexible add-ons. Browse services and book in minutes.
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  className="rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  <Link to={`/auth?redirect=${encodeURIComponent('/book')}`}>Book a Cleaning</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-md border-white/60 text-white hover:bg-white/10 font-semibold"
                >
                  <Link to="/contact">Request Estimate</Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div className="text-center mb-10 sm:mb-12 md:mb-16" {...fadeUp(0, reduceMotion)}>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Our Services</p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">Choose the Right Clean</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
            Four distinct services, each scoped for a different job — from routine
            upkeep to move-day deadlines. Pricing shown is an estimate; final cost is confirmed at booking.
          </p>
        </motion.div>

        {/* 1) Cleaning Services — alternating feature rows */}
        <div className="flex flex-col gap-8 sm:gap-10 md:gap-12">
          {SERVICES.map((svc, idx) => {
            const Icon = ICONS[svc.icon] || Home;
            const reversed = idx % 2 === 1;
            return (
              <motion.div
                key={svc.slug}
                id={svc.slug}
                initial={reduceMotion ? false : { opacity: 0, y: 30 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : idx * 0.05 }}
                viewport={reduceMotion ? undefined : { once: true }}
                className="scroll-mt-28"
              >
                <Card className="overflow-hidden border-border bg-card shadow-card">
                  <div className="flex flex-col lg:flex-row">
                    {/* Image */}
                    <div className={`relative lg:w-5/12 ${reversed ? 'lg:order-2' : 'lg:order-1'}`}>
                      <img
                        src={SERVICE_IMAGES[svc.slug]}
                        alt={svc.title}
                        className="w-full h-48 sm:h-56 lg:h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      {svc.popular && (
                        <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-md bg-navy-900/90 text-white px-2.5 py-1 text-xs font-semibold">
                          <Crown className="w-3.5 h-3.5 text-primary" /> Most Popular
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className={`lg:w-7/12 ${reversed ? 'lg:order-1' : 'lg:order-2'} p-5 sm:p-7 md:p-8 flex flex-col`}>
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 bg-accent rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" />
                        </div>
                        <div>
                          <CardTitle className="text-lg sm:text-xl font-display text-foreground">{svc.title}</CardTitle>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{svc.bestFor}</p>
                        </div>
                      </div>

                      {/* Price / duration stat row */}
                      <div className="flex items-center gap-4 sm:gap-6 mb-4 pb-4 border-b border-border">
                        <div>
                          <p className="text-2xl sm:text-3xl font-display font-bold text-foreground">${svc.priceFrom}<span className="text-sm font-medium text-muted-foreground"> +</span></p>
                          <p className="text-[11px] sm:text-xs text-muted-foreground">Starting estimate</p>
                        </div>
                        <div className="h-9 w-px bg-border" />
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-primary" />
                          <div>
                            <p className="text-sm font-semibold text-foreground">{svc.duration}</p>
                            <p className="text-[11px] text-muted-foreground">Typical duration</p>
                          </div>
                        </div>
                      </div>

                      <p className="text-foreground/80 text-sm mb-4">{svc.blurb}</p>

                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs sm:text-sm text-foreground/80 mb-4">
                        {svc.includes.map((line, i) => (
                          <li key={i} className="flex gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>

                      <p className="text-[11px] text-muted-foreground mb-5">
                        Prices shown are <strong>estimates</strong> (not quotes). Final pricing may vary — confirmed during booking.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                        <Button
                          asChild
                          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-semibold"
                        >
                          <Link to={`/auth?redirect=${encodeURIComponent(`/book?service=${svc.slug}`)}`}>Book Now</Link>
                        </Button>
                        <Link
                          to={`/contact?service=${svc.slug}`}
                          className="inline-flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors px-2"
                        >
                          Request custom estimate <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Perks strip */}
        <motion.div className="text-center mt-12 sm:mt-14 md:mt-16" {...fadeUp(0.1, reduceMotion)}>
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-8 rounded-xl sm:rounded-full bg-card border border-border p-3 sm:p-4 shadow-card">
            {perks.map((perk, index) => (
              <div key={index} className="flex items-center gap-2">
                <perk.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" aria-hidden="true" />
                <span className="font-medium text-foreground/90 text-xs sm:text-sm">{perk.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Savings banner */}
        <div className="mt-8 sm:mt-10 rounded-xl sm:rounded-2xl bg-secondary border border-border p-4 sm:p-5 md:p-6 text-center">
          <p className="text-xs sm:text-sm md:text-base text-foreground">
            <span className="font-semibold">Ways to save:</span>{" "}
            {FREQUENCIES.filter((frequency) => frequency.discount > 0).map(
              (frequency) => (
                <React.Fragment key={frequency.id}>
                  {frequency.name}{" "}
                  <span className="font-semibold">
                    {Math.round(frequency.discount * 100)}%
                  </span>{" "}
                  ·{" "}
                </React.Fragment>
              )
            )}
            <span className="font-semibold">First-time client discount</span> ·{" "}
            <span className="font-semibold">Referral rewards</span> ·{" "}
            <span className="font-semibold">Bundle packages</span>
          </p>
        </div>

        {/* 2) Popular Add-ons */}
        <div className="mt-12 sm:mt-14 md:mt-16">
          <motion.h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4" {...fadeUp(0, reduceMotion)}>Popular Add-ons</motion.h3>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4" {...fadeUp(0.05, reduceMotion)}>
            {ADD_ONS.map((a) => (
              <div
                key={a.id}
                className="group flex items-center justify-between rounded-lg border border-border bg-card p-3 sm:p-4 transition-all hover:shadow-card hover:-translate-y-0.5"
              >
                <span className="text-sm sm:text-base text-foreground">
                  <span className="relative inline-block">
                    {a.label}
                    <span className="block h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                  </span>
                </span>
                <span className="text-sm sm:text-base text-muted-foreground font-medium">${a.price}</span>
              </div>
            ))}
          </motion.div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            Add-ons can be selected during booking or requested in your estimate.
          </p>
        </div>

        {/* 3) Not sure which to pick? */}
        <div className="mt-12 sm:mt-14 md:mt-16">
          <motion.h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4" {...fadeUp(0, reduceMotion)}>Not sure which to pick?</motion.h3>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6" {...fadeUp(0.05, reduceMotion)}>
            {SERVICES.map((s) => {
              const Icon = ICONS[s.icon] || Home;
              return (
                <Card key={s.slug} className="bg-card border-border transition-all hover:shadow-card hover:-translate-y-0.5">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" aria-hidden="true" />
                      <p className="text-sm sm:text-base font-semibold text-foreground">{s.title}</p>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{s.bestFor}</p>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        </div>

        {/* 4) How it works */}
        <div className="mt-12 sm:mt-14 md:mt-16">
          <motion.h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-5 md:mb-6" {...fadeUp(0, reduceMotion)}>How it works</motion.h3>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6" {...fadeUp(0.05, reduceMotion)}>
            {steps.map((st, i) => (
              <div key={st.title} className="rounded-xl border border-border bg-card p-4 sm:p-5 md:p-6 transition-all hover:-translate-y-0.5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-accent flex items-center justify-center mb-3 sm:mb-4">
                  <st.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" />
                </div>
                <p className="text-sm sm:text-base font-semibold text-foreground">{`${i + 1}. ${st.title}`}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{st.text}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 5) Service Area + Operating Hours */}
        <div className="mt-12 sm:mt-14 md:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7 md:gap-8 items-stretch">
          {/* Visual side */}
          <motion.div
            className="rounded-xl sm:rounded-2xl overflow-hidden border border-border bg-card"
            {...fadeUp(0, reduceMotion)}
            style={{
              backgroundImage: `url(${servicesSide})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="w-full aspect-[4/3]" aria-hidden="true" />
          </motion.div>

          {/* Information panel */}
          <motion.div {...fadeUp(0.05, reduceMotion)}>
            <Card className="h-full flex flex-col border-border bg-card">
              <CardHeader className="space-y-2">
                <CardTitle className="text-foreground text-xl sm:text-2xl flex items-center gap-2 font-display">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" aria-hidden="true" />
                  Service Area & Hours
                </CardTitle>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  We offer <strong className="text-foreground">Jacksonville &amp; Duval County</strong> coverage for our demo clients.
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                  {serviceAreas.map((tag) => (
                    <Badge key={tag} variant="outline" className="px-2.5 py-1 sm:px-3 text-[10px] sm:text-xs font-medium">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {hours.map((h) => (
                    <div key={h.label} className="rounded-lg border border-border bg-background p-3 sm:p-4 flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Clock4 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" aria-hidden="true" />
                        <span className="text-sm sm:text-base font-semibold text-foreground">{h.label}</span>
                      </div>
                      <span className="text-xs sm:text-sm text-muted-foreground">{h.value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3">
                  Need a different time? Add a note with your request — we'll do our best.
                </p>
              </CardContent>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-6 pt-0">
                <Button
                  asChild
                  className="rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  <Link to={`/auth?redirect=${encodeURIComponent('/book')}`}>Book a Cleaning</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-md border-border text-foreground hover:bg-secondary font-semibold"
                >
                  <Link to="/contact">Request an Estimate</Link>
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

      </div>
    </main>
    </>
  );
};

export default ServicesPage;
