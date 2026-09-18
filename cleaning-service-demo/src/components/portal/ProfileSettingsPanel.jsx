// src/components/portal/ProfileSettingsPanel.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PaymentInstructions from "@/components/portal/PaymentInstructions";
import {
  UserRound,
  Phone,
  MapPin,
  Edit2,
  Trash2,
  Star,
  Plus,
  Save,
  X,
  ArrowUp,
  ArrowDown,
  Mail,
  Lock,
  Sparkles,
  CreditCard,
  ArrowRight,
} from "lucide-react";

function formatAddressRow(a) {
  if (!a) return "No address on file yet.";
  const parts = [a.street, a.city, a.state, a.zip].filter(Boolean);
  return parts.join(", ");
}

const PHONE_LS_KEY = "cleanpro_client_phone";

const SECTIONS = [
  { id: "section-contact", label: "Contact details", icon: UserRound },
  { id: "section-addresses", label: "Service addresses", icon: MapPin },
  { id: "section-preferences", label: "Cleaning preferences", icon: Sparkles },
  { id: "section-payment", label: "Payment & billing", icon: CreditCard },
  { id: "section-security", label: "Password & account", icon: Lock },
];

function SectionCard({ id, icon: Icon, title, description, actions, children }) {
  return (
    <Card id={id} className="scroll-mt-24">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent grid place-items-center shrink-0">
            <Icon className="w-4.5 h-4.5 text-primary" size={18} />
          </div>
          <div>
            <CardTitle className="text-foreground text-lg">{title}</CardTitle>
            {description ? (
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            ) : null}
          </div>
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

/**
 * Try to read a phone number from the profile in as many shapes as possible,
 * then fall back to localStorage.
 */
function getInitialPhone(profile) {
  let fromProfile = "";

  if (profile) {
    fromProfile =
      profile.phone ||
      profile.phoneNumber ||
      profile.primaryPhone ||
      profile.contact?.phone ||
      profile.contact?.phoneNumber ||
      profile.contact?.primaryPhone ||
      "";
  }

  if (fromProfile) return fromProfile;

  if (typeof window !== "undefined") {
    try {
      const ls = window.localStorage.getItem(PHONE_LS_KEY);
      if (ls) return ls;
    } catch {
      // ignore
    }
  }

  return "";
}

/**
 * ProfileSettingsPanel
 */
export default function ProfileSettingsPanel({
  profile,
  addresses = [],
  onSaveContact,
  onOpenAddAddress,
  onOpenEditAddress,
  onDeleteAddress,
  onSetDefaultAddress,
  onMoveAddressUp,
  onMoveAddressDown,
  savingContact = false,

  preferences,
  onSavePreferences,

  preferredContactMethod,
  onSavePreferredContactMethod,

  email,
  onEmailChange,
  onSaveEmail,
  onSendReset,

  paymentInfo,
  onOpenPaymentCenter,
}) {
  // CONTACT INFO
  const initialName = profile?.name || "";
  const initialPhone = getInitialPhone(profile);

  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [isEditingContact, setIsEditingContact] = useState(false);

  useEffect(() => {
    setName(initialName);
    setPhone(initialPhone);
  }, [initialName, initialPhone]);

  const contactDirty =
    name.trim() !== initialName.trim() ||
    phone.trim() !== initialPhone.trim();

  // EMAIL STATE (local, saved together with contact)
  const [emailValue, setEmailValue] = useState(email || "");

  // keep local email in sync when auth email changes from outside
  useEffect(() => {
    setEmailValue(email || "");
  }, [email]);

  const emailDirty = emailValue.trim() !== (email || "").trim();

  const hasAddresses = addresses.length > 0;

  // CLEANING PREFS (autosave)
  const normalizedInitialPrefs = {
    fragrancePreference: preferences?.fragrancePreference || "standard",
    focusPreference: preferences?.focusPreference || "balanced",
    petPreference: preferences?.petPreference || "none",
  };

  const [localPrefs, setLocalPrefs] = useState(normalizedInitialPrefs);
  const [lastSavedPrefs, setLastSavedPrefs] = useState(
    normalizedInitialPrefs
  );
  const prefsFirstRender = useRef(true);

  useEffect(() => {
    const next = {
      fragrancePreference:
        preferences?.fragrancePreference || "standard",
      focusPreference: preferences?.focusPreference || "balanced",
      petPreference: preferences?.petPreference || "none",
    };
    setLocalPrefs(next);
    setLastSavedPrefs(next);
  }, [
    preferences?.fragrancePreference,
    preferences?.focusPreference,
    preferences?.petPreference,
  ]);

  const preferencesDirty =
    JSON.stringify(localPrefs) !== JSON.stringify(normalizedInitialPrefs);

  const handlePrefChange = (field, value) => {
    setLocalPrefs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (!onSavePreferences) return;
    if (prefsFirstRender.current) {
      prefsFirstRender.current = false;
      return;
    }
    if (JSON.stringify(localPrefs) === JSON.stringify(lastSavedPrefs)) return;

    const timeout = setTimeout(async () => {
      try {
        const maybe = onSavePreferences(localPrefs);
        if (maybe && typeof maybe.then === "function") {
          await maybe;
        }
        setLastSavedPrefs(localPrefs);
      } catch (err) {
        console.error("Failed to auto-save preferences", err);
      }
    }, 600);

    return () => clearTimeout(timeout);
  }, [localPrefs, lastSavedPrefs, onSavePreferences]);

  // CONTACT METHOD (autosave)
  const [contactMethod, setContactMethod] = useState(
    preferredContactMethod || "email"
  );
  const [lastSavedContactMethod, setLastSavedContactMethod] = useState(
    preferredContactMethod || "email"
  );
  const contactFirstRender = useRef(true);

  useEffect(() => {
    const next = preferredContactMethod || "email";
    setContactMethod(next);
    setLastSavedContactMethod(next);
  }, [preferredContactMethod]);

  useEffect(() => {
    if (!onSavePreferredContactMethod) return;
    if (contactFirstRender.current) {
      contactFirstRender.current = false;
      return;
    }
    if (contactMethod === lastSavedContactMethod) return;

    const timeout = setTimeout(async () => {
      try {
        const maybe = onSavePreferredContactMethod(contactMethod);
        if (maybe && typeof maybe.then === "function") {
          await maybe;
        }
        setLastSavedContactMethod(contactMethod);
      } catch (err) {
        console.error("Failed to auto-save contact method", err);
      }
    }, 600);

    return () => clearTimeout(timeout);
  }, [
    contactMethod,
    lastSavedContactMethod,
    onSavePreferredContactMethod,
  ]);

  const anyContactDirty = contactDirty || emailDirty;

  const handleSaveContact = async () => {
    if (!anyContactDirty) {
      setIsEditingContact(false);
      return;
    }

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = emailValue.trim();

    try {
      // Persist to localStorage as a safety net so the phone always shows up
      if (typeof window !== "undefined") {
        try {
          if (trimmedPhone) {
            window.localStorage.setItem(PHONE_LS_KEY, trimmedPhone);
          } else {
            window.localStorage.removeItem(PHONE_LS_KEY);
          }
        } catch {
          // ignore
        }
      }

      // update profile (name + phone) — write to multiple keys to be backend-agnostic
      if (onSaveContact) {
        const maybeProfile = onSaveContact({
          name: trimmedName,
          phone: trimmedPhone,
          phoneNumber: trimmedPhone,
          primaryPhone: trimmedPhone,
          contact: {
            ...(profile?.contact || {}),
            phone: trimmedPhone,
            phoneNumber: trimmedPhone,
            primaryPhone: trimmedPhone,
          },
        });
        if (maybeProfile && typeof maybeProfile.then === "function") {
          await maybeProfile;
        }
      }

      // update auth email
      if (emailDirty && onSaveEmail) {
        if (onEmailChange) {
          onEmailChange(trimmedEmail);
        }
        const maybeEmail = onSaveEmail();
        if (maybeEmail && typeof maybeEmail.then === "function") {
          await maybeEmail;
        }
      }
    } catch (err) {
      console.error("Failed to save contact/email", err);
    }

    setIsEditingContact(false);
  };

  const handleCancelContact = () => {
    setName(initialName);
    setPhone(initialPhone);
    setEmailValue(email || "");
    setIsEditingContact(false);
  };

  const depositAmount = Number.isFinite(Number(paymentInfo?.depositAmount))
    ? Number(paymentInfo.depositAmount)
    : 50;

  return (
    <section className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[180px_minmax(0,1fr)]">
        {/* In-page section nav (desktop: sticky sidebar, mobile: horizontal pills) */}
        <nav className="lg:sticky lg:top-24 lg:h-fit">
          <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0 lg:gap-1">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="shrink-0 lg:shrink flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground whitespace-nowrap lg:whitespace-normal transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {s.label}
                </a>
              );
            })}
          </div>
        </nav>

        <div className="space-y-6 min-w-0">
          {/* CONTACT INFO / EMAIL / CONTACT PREFS */}
          <SectionCard
            id="section-contact"
            icon={UserRound}
            title="Contact details"
            description="How we reach you for confirmations and reminders."
            actions={
              !isEditingContact && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingContact(true)}
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              )
            }
          >
            {/* 2-column layout: left = name + phone, right = email */}
            <div className="grid gap-4 md:grid-cols-2 items-start">
              {/* Left column: name + phone */}
              <div className="space-y-4">
                {/* Full name */}
                <div className="space-y-1">
                  <Label className="flex items-center gap-2 text-muted-foreground">
                    <UserRound className="w-4 h-4" />
                    Full name
                  </Label>
                  {isEditingContact ? (
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                    />
                  ) : (
                    <p className="rounded-md bg-secondary px-3 py-2 text-foreground">
                      {initialName || "Add your name"}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <Label className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    Phone number
                  </Label>
                  {isEditingContact ? (
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  ) : (
                    <p className="rounded-md bg-secondary px-3 py-2 text-foreground">
                      {initialPhone || "Add a phone number"}
                    </p>
                  )}
                  {!isEditingContact && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Used for confirmations and reminders only. Never shared.
                    </p>
                  )}
                </div>
              </div>

              {/* Right column: email */}
              <div className="space-y-1">
                <Label
                  htmlFor="account-email"
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <Mail className="w-4 h-4" />
                  Sign-in email
                </Label>
                {isEditingContact ? (
                  <Input
                    id="account-email"
                    type="email"
                    value={emailValue}
                    onChange={(e) => setEmailValue(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                ) : (
                  <p className="rounded-md bg-secondary px-3 py-2 text-foreground break-all">
                    {email || "Add an email address"}
                  </p>
                )}
                <p className="text-[11px] text-muted-foreground mt-1">
                  You may be asked to re-authenticate for security when
                  changing your email.
                </p>
              </div>
            </div>

            {/* Contact preferences */}
            <div className="pt-3 mt-1 border-t border-border">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Contact preferences
                </Label>
                <div className="flex flex-wrap items-center gap-4 text-xs text-foreground">
                  {[
                    { value: "email", label: "Email" },
                    { value: "sms", label: "Text message (SMS)" },
                    { value: "both", label: "Both" },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className="inline-flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="contactMethod"
                        value={opt.value}
                        checked={contactMethod === opt.value}
                        onChange={() => setContactMethod(opt.value)}
                        className="h-3.5 w-3.5 border border-input text-primary focus:ring-ring"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                We&apos;ll use this for confirmations, reminders, and
                important updates.
              </p>
            </div>

            {isEditingContact && (
              <div className="flex flex-wrap justify-end gap-2 pt-2 border-t border-border mt-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelContact}
                  disabled={savingContact}
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSaveContact}
                  disabled={!anyContactDirty || savingContact}
                >
                  <Save className="w-4 h-4 mr-1" />
                  {savingContact ? "Saving…" : "Save changes"}
                </Button>
              </div>
            )}
          </SectionCard>

          {/* SERVICE ADDRESSES CARD */}
          <SectionCard
            id="section-addresses"
            icon={MapPin}
            title="Service addresses"
            description="Where we clean. Set a default for faster booking."
            actions={
              <Button size="sm" onClick={onOpenAddAddress}>
                <Plus className="w-4 h-4 mr-1" />
                Add address
              </Button>
            }
          >
            {!hasAddresses && (
              <p className="text-sm text-muted-foreground">
                You don&apos;t have a saved service address yet. Add one to
                make booking faster next time.
              </p>
            )}

            {hasAddresses && (
              <div className="space-y-3">
                {addresses.map((addr, index) => {
                  const nickname = addr.nickname || addr.type || "Home";
                  return (
                    <div
                      key={addr.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-border bg-secondary px-3 py-2"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <span className="font-semibold">
                            {nickname}
                          </span>
                          {addr.isDefault && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-success-bg text-success text-[11px] px-2 py-0.5">
                              <Star className="w-3 h-3" /> Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 break-words">
                          {formatAddressRow(addr)}
                        </p>
                        {addr.accessInstructions && (
                          <p className="text-[11px] text-muted-foreground mt-0.5 break-words">
                            <span className="font-semibold">
                              Access:
                            </span>{" "}
                            {addr.accessInstructions}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 justify-end">
                        {onMoveAddressUp && index > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs px-2 py-1 h-auto"
                            onClick={() => onMoveAddressUp(addr)}
                            title="Move up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </Button>
                        )}
                        {onMoveAddressDown &&
                          index < addresses.length - 1 && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs px-2 py-1 h-auto"
                              onClick={() => onMoveAddressDown(addr)}
                              title="Move down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </Button>
                          )}

                        {!addr.isDefault && onSetDefaultAddress && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-success/30 text-success text-xs px-2 py-1 h-auto"
                            onClick={() => onSetDefaultAddress(addr)}
                          >
                            Set default
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs px-2 py-1 h-auto"
                          onClick={() => onOpenEditAddress(addr)}
                        >
                          <Edit2 className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs px-2 py-1 h-auto border-destructive/30 text-destructive hover:bg-destructive-bg"
                          onClick={() => onDeleteAddress(addr)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>

          {/* CLEANING PREFERENCES CARD */}
          <SectionCard
            id="section-preferences"
            icon={Sparkles}
            title="Cleaning preferences"
            description={
              preferencesDirty
                ? "Saving your changes automatically…"
                : "Applied to every future booking automatically."
            }
          >
            {/* Fragrance */}
            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Fragrance preference
              </Label>
              <div className="flex flex-wrap items-center gap-4 text-xs text-foreground">
                {[
                  { value: "standard", label: "Standard" },
                  { value: "light", label: "Light scent" },
                  { value: "fragrance_free", label: "Fragrance-free" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className="inline-flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="fragrancePreference"
                      value={opt.value}
                      checked={
                        localPrefs.fragrancePreference === opt.value
                      }
                      onChange={() =>
                        handlePrefChange("fragrancePreference", opt.value)
                      }
                      className="h-3.5 w-3.5 border border-input text-primary focus:ring-ring"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Focus areas */}
            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Focus areas
              </Label>
              <div className="flex flex-wrap items-center gap-4 text-xs text-foreground">
                {[
                  { value: "balanced", label: "Balanced clean" },
                  {
                    value: "kitchen_bathroom",
                    label: "Extra focus on kitchen & bathrooms",
                  },
                  {
                    value: "living_areas",
                    label: "Extra focus on living areas & bedrooms",
                  },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className="inline-flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="focusPreference"
                      value={opt.value}
                      checked={localPrefs.focusPreference === opt.value}
                      onChange={() =>
                        handlePrefChange("focusPreference", opt.value)
                      }
                      className="h-3.5 w-3.5 border border-input text-primary focus:ring-ring"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pets */}
            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Pets in the home
              </Label>
              <div className="flex flex-wrap items-center gap-4 text-xs text-foreground">
                {[
                  { value: "none", label: "No pets" },
                  { value: "dogs", label: "Dog(s)" },
                  { value: "cats", label: "Cat(s)" },
                  { value: "other", label: "Other pets" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className="inline-flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="petPreference"
                      value={opt.value}
                      checked={localPrefs.petPreference === opt.value}
                      onChange={() =>
                        handlePrefChange("petPreference", opt.value)
                      }
                      className="h-3.5 w-3.5 border border-input text-primary focus:ring-ring"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground">
                This helps us plan for allergies, supplies, and how your
                pets might react to visitors.
              </p>
            </div>

            <p className="text-[11px] text-muted-foreground">
              We&apos;ll use these preferences for all future bookings.
              You can still add special notes per appointment.
            </p>
          </SectionCard>

          {/* PAYMENT & BILLING */}
          <div id="section-payment" className="scroll-mt-24 space-y-4">
            <SectionCard
              icon={CreditCard}
              title="Payment & billing"
              description="Deposit info and where to review invoices."
              actions={
                onOpenPaymentCenter && (
                  <Button variant="outline" size="sm" onClick={onOpenPaymentCenter}>
                    Open Payment Center
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                )
              }
            >
              <p className="text-sm text-muted-foreground">
                A ${depositAmount.toFixed(0)} deposit secures a first-time
                appointment. View invoices, balances due, and past payments
                for every booking in the Payment Center.
              </p>
            </SectionCard>
            <PaymentInstructions paymentInfo={paymentInfo} />
          </div>

          {/* PASSWORD CARD */}
          <SectionCard
            id="section-security"
            icon={Lock}
            title="Password & account"
            description="Manage sign-in security for this account."
          >
            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <Button type="button" onClick={onSendReset}>
                Send password reset email
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              We&apos;ll email you a secure link so you can choose a new password.
            </p>
          </SectionCard>
        </div>
      </div>
    </section>
  );
}
