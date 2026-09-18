// src/components/common/Header.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import headerLogo from "@/assets/logo/logo-primary-white.png";
import { useAdminAuth } from "@/pages/admin/hooks/useAdminAuth";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const menuButtonRef = useRef(null);
  const menuRef = useRef(null);
  const lastFocusedRef = useRef(null);
  const wasOpenRef = useRef(false);

  const { isAdmin } = useAdminAuth();
  const showAdminLink = !!isAdmin;

  const handleCallClick = () => {
    window.location.href = "tel:9045550100";
  };

  const closeMenu = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    closeMenu();
  }, [location.pathname, closeMenu]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      if (wasOpenRef.current) {
        menuButtonRef.current?.focus();
      }
      wasOpenRef.current = false;
      return undefined;
    }

    wasOpenRef.current = true;
    lastFocusedRef.current = document.activeElement;

    const focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const focusFirstItem = () => {
      const focusable = menuRef.current?.querySelectorAll(focusableSelector);
      focusable?.[0]?.focus();
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        return;
      }

      if (e.key !== "Tab") return;

      const focusable = Array.from(
        menuRef.current?.querySelectorAll(focusableSelector) || []
      );

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const frame = window.requestAnimationFrame(focusFirstItem);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const navLinkClass = ({ isActive }) =>
    `relative py-2 text-sm font-semibold tracking-wide transition-colors duration-200 ${
      isActive ? "text-white" : "text-white/65 hover:text-white"
    } after:absolute after:left-0 after:-bottom-[2px] after:h-[2px] after:bg-primary after:transition-all after:duration-300 ${
      isActive ? "after:w-full" : "after:w-0 hover:after:w-full"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center justify-between border-b border-white/10 py-4 text-xl font-display font-semibold transition-colors duration-200 ${
      isActive ? "text-white" : "text-white/70 hover:text-white"
    }`;

  const menuVariants = {
    closed: { opacity: 0, y: "-4%" },
    open: {
      opacity: 1,
      y: "0%",
      transition: { duration: 0.25, ease: "easeInOut" },
    },
  };

  return (
    <header className="sticky top-0 z-50 bg-navy-900 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left: Brand */}
          <Link
            to="/"
            className="flex items-center gap-3 shrink-0"
            aria-label="CleanPro Demo home"
          >
            <img
              src={headerLogo}
              alt="CleanPro Demo"
              className="h-11 sm:h-12 md:h-14 w-auto"
              width={224}
              height={56}
              loading="eager"
            />
          </Link>

          {/* Center-right: Navigation */}
          <nav className="hidden md:flex items-center gap-9" aria-label="Primary">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/services" className={navLinkClass}>
              Services
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>

            {/* Admin-only link (visible only for allowed emails) */}
            {showAdminLink && (
              <NavLink to="/admin" className={navLinkClass}>
                Admin
              </NavLink>
            )}
          </nav>

          {/* Right: Call + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:9045550100"
              className="flex items-center gap-2 text-sm font-medium text-white/75 hover:text-white transition-colors"
            >
              <Phone className="h-4 w-4 text-primary" />
              (904) 555-0100
            </a>
            <div className="h-6 w-px bg-white/15" aria-hidden="true" />
            <Button
              asChild
              className="rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900 focus-visible:ring-primary"
            >
              <Link to="/portal" className="flex items-center gap-1.5">
                My Account
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Mobile actions (call + menu) */}
          <div className="md:hidden flex items-center gap-1.5">
            <Button
              size="icon"
              variant="ghost"
              className="rounded-md text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-primary"
              onClick={handleCallClick}
              aria-label="Call CleanPro Demo at (904) 555-0100"
            >
              <Phone className="h-5 w-5" />
            </Button>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              className="text-white p-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-haspopup="dialog"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="md:hidden absolute top-full left-0 w-full bg-navy-900 shadow-pop border-t border-white/10"
          >
            <div className="flex flex-col px-5 sm:px-8 py-6">
              <h2 id="mobile-menu-title" className="sr-only">
                Main navigation
              </h2>

              <NavLink to="/" className={mobileNavLinkClass} onClick={closeMenu} end>
                Home
              </NavLink>
              <NavLink
                to="/services"
                className={mobileNavLinkClass}
                onClick={closeMenu}
              >
                Services
              </NavLink>
              <NavLink
                to="/contact"
                className={mobileNavLinkClass}
                onClick={closeMenu}
              >
                Contact
              </NavLink>

              {/* Admin-only mobile link */}
              {showAdminLink && (
                <NavLink
                  to="/admin"
                  className={mobileNavLinkClass}
                  onClick={closeMenu}
                >
                  Admin Dashboard
                </NavLink>
              )}

              <div className="pt-6 flex flex-col gap-3">
                <Button
                  asChild
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-base py-5 font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900 focus-visible:ring-primary"
                >
                  <Link to="/portal" onClick={closeMenu}>
                    My Account
                  </Link>
                </Button>
                <a
                  href="tel:9045550100"
                  className="flex items-center justify-center gap-2 text-sm font-medium text-white/75 hover:text-white transition-colors py-2"
                >
                  <Phone className="h-4 w-4 text-primary" />
                  (904) 555-0100
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
