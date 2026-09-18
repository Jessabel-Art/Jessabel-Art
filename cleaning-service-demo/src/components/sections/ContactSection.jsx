// src/components/sections/ContactSection.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  Phone,
  Mail,
  Clock,
  CalendarClock,
  ShieldCheck,
  BadgeDollarSign,
  X,
  AlertCircle,
} from 'lucide-react';
import { SERVICES } from '@/data/services';
import contactImg from '@/assets/images/contact.jpeg';

const BUSINESS_EMAIL = 'demo@example.com';
const FORMSPREE_ENDPOINT = null; // Demo — no live form submissions

const ContactSection = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const errorSummaryRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const [selectedService, setSelectedService] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    message: '',
    agree: false,
  });
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  // map slug → service title
  const serviceFromSlug = (slug) => SERVICES.find((s) => s.slug === slug);

  useEffect(() => {
    const slug = searchParams.get('service');
    if (slug) {
      const svc = serviceFromSlug(slug);
      setSelectedService(svc ? { slug, title: svc.title } : { slug, title: slug });
      const line = `Service: ${svc ? svc.title : slug}`;
      setForm((prev) => {
        if (!prev.message?.includes('Service:')) {
          return { ...prev, message: prev.message ? `${line}\n${prev.message}` : `${line}\n` };
        }
        return prev;
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      errorSummaryRef.current?.focus();
    }
  }, [errors]);

  const validateForm = (currentForm) => {
    const nextErrors = {};

    if (!currentForm.name.trim()) {
      nextErrors.name = 'Please enter your full name.';
    }

    if (!currentForm.email.trim()) {
      nextErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentForm.email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!currentForm.phone.trim()) {
      nextErrors.phone = 'Please enter your phone number.';
    }

    if (!currentForm.message.trim()) {
      nextErrors.message = 'Please tell us about your cleaning needs.';
    }

    if (!currentForm.agree) {
      nextErrors.agree = 'You must agree to the estimate and deposit policy before submitting.';
    }

    return nextErrors;
  };

  const clearSelectedService = () => {
    setSelectedService(null);
    searchParams.delete('service');
    setSearchParams(searchParams, { replace: true });
  };

  const onChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = validateForm(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      setErrors({});
      setPending(true);

      // Build payload for Formspree
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        preferredDate: form.preferredDate,
        message: form.message,
        selectedService: selectedService?.title || '',
        // Helpful metadata
        _subject: `New Estimate Request from ${form.name}`,
        _replyto: form.email,
        _honeypot: '', // you can wire a hidden field if you want
        source: 'contact-section',
      };

      const res = FORMSPREE_ENDPOINT
        ? await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : { ok: true }; // Demo mode: simulate success without submitting

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Failed to send message');
      }

      setSent(true);
      toast({
        title: 'Demo message received ✅',
        description: 'This is a demo — no real message was sent. In a live site, we’d reply within 24 hours.',
      });
    } catch (err) {
      toast({
        title: 'Could not send',
        description: String(err?.message || err),
        variant: 'destructive',
      });
    } finally {
      setPending(false);
    }
  };

  if (sent) {
    return (
    <section id="contact" className="py-14 sm:py-18 md:py-24 px-3 sm:px-4 bg-background">
        <div className="max-w-2xl mx-auto">
          <Card className="p-6 sm:p-8 md:p-10 shadow-card rounded-2xl border-border bg-card">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">Thank you — we've got it!</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Your message has been received. A team member will get back to you
              within <span className="font-semibold text-foreground">24 hours</span> during business hours.
            </p>

            {selectedService && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-border bg-accent text-accent-foreground px-3 py-1 text-xs sm:text-sm">
                <span className="font-medium">Requested Service:</span> {selectedService.title}
              </div>
            )}

            <div className="mt-6 rounded-xl border border-border bg-secondary p-3 sm:p-4 text-xs sm:text-sm text-foreground/80">
              <p className="mb-2">
                Please note: online estimates are approximate and not a final quote until we physically see the property.
              </p>
              <p>
                A <span className="font-semibold">non-refundable deposit</span> is required to hold your appointment; it's applied to your balance.
              </p>
              <p className="mt-2 text-muted-foreground italic">Demo — no real estimate or booking is made.</p>
            </div>

            <div className="mt-6 text-xs sm:text-sm text-muted-foreground">
              Demo contact: Email{' '}
              <a href={`mailto:${BUSINESS_EMAIL}`} className="text-primary underline">{BUSINESS_EMAIL}</a> or call{' '}
              <a href="tel:9045550100" className="text-primary underline">(904) 555-0100</a>.
              <span className="block mt-1 text-muted-foreground italic">This is a demo — no real messages are sent.</span>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-14 sm:py-18 md:py-24 px-3 sm:px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-8 sm:mb-10 md:mb-12"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.5 }}
          viewport={reduceMotion ? undefined : { once: true }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Get In Touch</p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">Request a Custom Estimate</h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mt-2">Have a unique cleaning need or a commercial property? Let's talk.</p>
          <p className="text-xs sm:text-sm text-muted-foreground/80 mt-1">
            We confirm receipt immediately and typically reply within <span className="font-semibold text-foreground">24 hours</span>.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-10">
          {/* Form */}
          <Card className="lg:col-span-7 bg-card border-border rounded-2xl shadow-card">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <form onSubmit={onSubmit} className="space-y-6 sm:space-y-7" noValidate autoComplete="on">
                {Object.keys(errors).length > 0 && (
                  <div
                    ref={errorSummaryRef}
                    tabIndex={-1}
                    role="alert"
                    className="rounded-xl border border-warning/30 bg-warning-bg px-4 py-3 text-sm text-warning"
                  >
                    <p className="font-semibold">Please correct the following before submitting:</p>
                    <ul className="mt-2 list-disc pl-5 space-y-1">
                      {Object.entries(errors).map(([field, message]) => (
                        <li key={field}>{message}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Group: Service */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px]">1</span>
                    Service
                  </div>
                  {selectedService ? (
                    <div className="inline-flex items-center gap-2 rounded-md border border-border bg-accent text-accent-foreground px-3 py-1.5 text-xs sm:text-sm">
                      <span className="font-medium">Service:</span> {selectedService.title}
                      <button
                        type="button"
                        className="ml-1 text-accent-foreground/60 hover:text-accent-foreground"
                        onClick={clearSelectedService}
                        aria-label="Clear selected service"
                        title="Clear selected service"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No specific service selected — tell us what you need in the project details below,
                      or <a href="/services" className="text-primary underline underline-offset-2">browse services</a>.
                    </p>
                  )}
                </div>

                {/* Group: Contact Information */}
                <div className="space-y-3 sm:space-y-4 pt-2 border-t border-border">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary pt-4">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px]">2</span>
                    Contact Information
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <Label htmlFor="name" className="text-xs sm:text-sm font-medium text-foreground">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        aria-invalid={errors.name ? 'true' : 'false'}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        required
                        autoComplete="name"
                        className="mt-2 bg-background border-input rounded-md focus-visible:ring-ring text-sm"
                      />
                      {errors.name && (
                        <p id="name-error" className="mt-2 text-xs text-destructive">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-xs sm:text-sm font-medium text-foreground">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={onChange}
                        aria-invalid={errors.email ? 'true' : 'false'}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        required
                        autoComplete="email"
                        className="mt-2 bg-background border-input rounded-md focus-visible:ring-ring text-sm"
                      />
                      {errors.email && (
                        <p id="email-error" className="mt-2 text-xs text-destructive">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <Label htmlFor="phone" className="text-xs sm:text-sm font-medium text-foreground">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={onChange}
                        aria-invalid={errors.phone ? 'true' : 'false'}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                        required
                        autoComplete="tel"
                        className="mt-2 bg-background border-input rounded-md focus-visible:ring-ring text-sm"
                      />
                      {errors.phone && (
                        <p id="phone-error" className="mt-2 text-xs text-destructive">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="preferredDate" className="text-xs sm:text-sm font-medium text-foreground">
                        Preferred Date
                      </Label>
                      <Input
                        id="preferredDate"
                        name="preferredDate"
                        type="date"
                        value={form.preferredDate}
                        onChange={onChange}
                        className="mt-2 bg-background border-input rounded-md focus-visible:ring-ring text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Group: Project Details */}
                <div className="space-y-3 sm:space-y-4 pt-2 border-t border-border">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary pt-4">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px]">3</span>
                    Project Details
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-xs sm:text-sm font-medium text-foreground">
                      Tell us about your needs
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={onChange}
                      aria-invalid={errors.message ? 'true' : 'false'}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      required
                      className="mt-2 bg-background border-input rounded-md focus-visible:ring-ring text-sm"
                    />
                    {errors.message && (
                      <p id="message-error" className="mt-2 text-xs text-destructive">
                        {errors.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Estimate/Quote/Deposit disclaimer (required agreement) */}
                <div className="rounded-xl border border-border bg-secondary p-3 sm:p-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="mt-0.5">
                      <AlertCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-xs sm:text-sm text-foreground/80">
                      <p className="font-semibold text-foreground">
                        Important: Estimates are not final quotes.
                      </p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>
                          Your request provides an <span className="font-semibold">estimate</span>. The final price will
                          be confirmed after we <span className="font-semibold">physically see the property</span>.
                        </li>
                        <li>
                          A <span className="font-semibold">non-refundable deposit</span> is required to{' '}
                          <span className="font-semibold">hold your appointment</span>; it's applied to your balance.
                        </li>
                      </ul>
                      <label className="mt-3 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="agree"
                          name="agree"
                          checked={form.agree}
                          onChange={onChange}
                          aria-invalid={errors.agree ? 'true' : 'false'}
                          aria-describedby={errors.agree ? 'agree-error' : undefined}
                          required
                          className="h-4 w-4 rounded border-input accent-primary"
                        />
                        <span className="text-xs sm:text-sm">I understand and agree to the estimate and deposit policy.</span>
                      </label>
                      {errors.agree && (
                        <p id="agree-error" className="mt-2 text-xs text-destructive">
                          {errors.agree}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={pending}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-md py-5 sm:py-6 text-sm sm:text-base font-semibold disabled:opacity-60"
                >
                  {pending ? 'Sending…' : 'Send Request'}
                </Button>

                {/* Supporting image */}
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.4 }}
                  viewport={reduceMotion ? undefined : { once: true }}
                  className="mt-5 sm:mt-6"
                >
                  <img
                    src={contactImg}
                    alt="CleanPro Demo team providing quality cleaning"
                    loading="lazy"
                    className="w-full h-40 sm:h-48 md:h-56 lg:h-64 rounded-2xl object-cover border border-border shadow-card"
                  />
                </motion.div>
              </form>
            </CardContent>
          </Card>

          {/* Info card */}
          <div className="lg:col-span-5">
            <div className="h-full bg-card p-4 sm:p-6 md:p-8 rounded-2xl shadow-card border border-border space-y-5 sm:space-y-6">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">Contact Directly</h3>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-accent rounded-md flex items-center justify-center">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base text-foreground">Call Us</p>
                  <a href="tel:9045550100" className="text-primary hover:underline text-sm sm:text-lg">
                    (904) 555-0100
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-accent rounded-md flex items-center justify-center">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base text-foreground">Email Us</p>
                  <a href={`mailto:${BUSINESS_EMAIL}`} className="text-primary hover:underline text-sm sm:text-lg">
                    {BUSINESS_EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-accent rounded-md flex items-center justify-center">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base text-foreground">Business Hours</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Mon–Fri: 8:00 AM – 3:00 PM</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Sat: 9:00 AM – 2:00 PM</p>
                  <p className="text-xs text-muted-foreground mt-1">We typically reply within 24 hours.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="rounded-lg border border-border p-3 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-foreground">Background-Checked</p>
                    <p className="text-xs text-muted-foreground">All cleaners pass background checks.</p>
                  </div>
                </div>
                <div className="rounded-lg border border-border p-3 flex items-start gap-2">
                  <BadgeDollarSign className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Deposit Required</p>
                    <p className="text-xs text-muted-foreground">Non-refundable; applied to your balance.</p>
                  </div>
                </div>
                <div className="rounded-lg border border-border p-3 flex items-start gap-2">
                  <CalendarClock className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">48-Hour Cancellation</p>
                    <p className="text-xs text-muted-foreground">Please give two days' notice.</p>
                  </div>
                </div>
                <div className="rounded-lg border border-border p-3 flex items-start gap-2">
                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Estimates, Not Quotes</p>
                    <p className="text-xs text-muted-foreground">Final price confirmed after on-site review.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
