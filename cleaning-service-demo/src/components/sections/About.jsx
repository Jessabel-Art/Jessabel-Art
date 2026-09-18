// src/components/sections/About.jsx
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Leaf, Star, Heart } from 'lucide-react';

// Import mascot image directly
import mascotImg from '@/assets/mascot/mascot-standalone.png';

const About = () => {
  const reduceMotion = useReducedMotion();

  const whyChooseUs = [
    {
      icon: Leaf,
      title: "Eco-Friendly Products",
      text: "We favor pet-safe, low-odor cleaners and microfiber methods whenever possible."
    },
    {
      icon: Star,
      title: "Satisfaction Focused",
      text: "Clear communication, consistent results, and friendly service — every visit."
    }
  ];

  return (
    <section className="py-14 sm:py-18 md:py-24 px-3 sm:px-4 bg-secondary">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 md:gap-16 items-center">
          {/* Mascot visual */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -50 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.8 }}
            viewport={reduceMotion ? undefined : { once: true }}
            className="flex justify-center order-2 lg:order-1"
          >
            <img
              src={mascotImg}
              alt="CleanPro Demo mascot"
              className="drop-shadow-md max-w-[380px] w-full h-auto"
              loading="eager"
            />
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 50 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.8 }}
            viewport={reduceMotion ? undefined : { once: true }}
            className="order-1 lg:order-2"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">About CleanPro</p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">A Higher Standard of Clean</h2>
            <p className="text-base sm:text-lg font-medium text-foreground/80 mb-5">
              Small, local, and people-first — serving <span className="font-semibold text-foreground">Jacksonville &amp; Duval County</span>.
            </p>

            <p className="text-sm sm:text-base text-muted-foreground mb-5">
              CleanPro is a locally run cleaning business that brings professional-grade results
              to every home we visit. We believe a clean home should feel calm and effortless.
              You'll get consistent results and clear communication — every visit.
            </p>

            {/* Mission */}
            <div className="rounded-lg border border-border bg-card p-4 sm:p-5 mb-6 shadow-card">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-md bg-accent flex items-center justify-center">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base text-foreground font-semibold">Our Mission</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    We're committed to providing quality cleaning services that bring relief and a
                    fresh start to every household we serve — regardless of circumstance.
                  </p>
                </div>
              </div>
            </div>

            {/* Why choose us */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              {whyChooseUs.map((item, index) => (
                <div key={index} className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-accent rounded-md flex items-center justify-center">
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-foreground">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
