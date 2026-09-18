// src/components/sections/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

// Bundled logo + image
import footerLogo from "@/assets/logo/logo-primary-white.png";

const Footer = () => {
  return (
    <footer className="bg-navy-900 text-white pt-14 sm:pt-16 md:pt-20 pb-6 sm:pb-8 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 text-center md:text-left items-start">
          {/* Brand + blurb */}
          <div className="md:col-span-1">
            <Link
              to="/"
              aria-label="CleanPro Demo home"
              className="flex items-center justify-center md:justify-start mb-4"
            >
              <img
                src={footerLogo}
                alt="CleanPro Demo"
                className="h-16 sm:h-[4.5rem] w-auto"
                width={224}
                height={72}
                loading="eager"
              />
            </Link>
            <p className="text-white/70 mb-4 text-sm leading-relaxed max-w-md mx-auto md:mx-0">
              Professional cleaning services you can trust. Where clean meets care.
            </p>

            <div className="flex justify-center md:justify-start">
              <p className="text-xs text-white/45 italic">Demo site — no real services are offered.</p>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-display font-semibold uppercase tracking-wide mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2.5 text-white/70 text-sm">
              <li>
                <Link to="/services" className="hover:text-primary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/auth" className="hover:text-primary transition-colors">
                  Book Now
                </Link>
              </li>
              <li>
                <Link to="/portal" className="hover:text-primary transition-colors">
                  Client Portal
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Area */}
          <div>
            <h4 className="text-sm font-display font-semibold uppercase tracking-wide mb-4 text-white">Service Area</h4>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-2.5 justify-center md:justify-start">
                <span className="inline-flex h-2 w-2 rounded-full bg-success" />
                <p className="text-sm text-white/90 font-medium">Now booking (Demo)</p>
              </div>

              <p className="text-sm text-white/70 leading-relaxed">
                Serving <span className="font-semibold text-white/90">Jacksonville &amp; Duval County</span>,
                including Jacksonville Beach, Neptune Beach, Atlantic Beach, and Baldwin.
                <span className="block mt-1.5 text-white/40 text-xs">Demo — no real service area.</span>
              </p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-display font-semibold uppercase tracking-wide mb-4 text-white">Contact Info</h4>
            <div className="space-y-3 text-white/70 text-sm">
              <div className="flex items-center gap-2.5 justify-center md:justify-start">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href="tel:9045550100" className="hover:text-primary transition-colors">
                  (904) 555-0100
                </a>
              </div>

              <div className="flex items-center gap-2.5 justify-center md:justify-start">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a
                  href="mailto:demo@example.com"
                  className="hover:text-primary transition-colors"
                >
                  demo@example.com
                </a>
              </div>

              <div className="flex items-center gap-2.5 justify-center md:justify-start">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>Jacksonville, FL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/15 mt-10 sm:mt-12 pt-5 sm:pt-6 text-center">
          <div className="text-white/55 text-xs sm:text-sm flex flex-wrap justify-center gap-x-3 gap-y-2 sm:gap-x-4">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <span aria-hidden="true">|</span>

            <Link to="/terms-of-service" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>

            <span aria-hidden="true">|</span>
            <Link to="/auth" className="hover:text-primary transition-colors">
              Admin Login
            </Link>

            <span aria-hidden="true">|</span>
            <a href="https://jessabel.art/" className="hover:text-primary transition-colors">
              Return to Portfolio
            </a>
          </div>

          <p className="text-white/50 mt-4 text-xs">
            &copy; 2026 Alchemize Business Services × Jessabel.Art. Portfolio Product.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
