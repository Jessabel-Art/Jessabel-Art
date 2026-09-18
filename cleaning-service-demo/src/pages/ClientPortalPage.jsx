import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CalendarDays, CreditCard, LogOut, UserRound, LayoutGrid, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/logo/logo-primary.png";
import ClientDashboardHome from "@/components/portal/ClientDashboardHome";
import AppointmentsView from "@/components/portal/AppointmentsView";
import ProfileSettingsPanel from "@/components/portal/ProfileSettingsPanel";
import PaymentCenterPage from "@/pages/PaymentCenterPage";
import { getAllDemoAppointments } from "@/data/demoRuntime";
import { getDemoInvoiceByAppointmentId } from "@/data/demoInvoices";
import { demoClients } from "@/data/demoClients";

const PAYMENT_INFO = {
  depositAmount: 50,
  cash: true,
  cashApp: "$cleanprodemo",
  zelle: "(904) 555-0100 (recipient: CleanPro Demo)",
  notes: "Please include your full name in the payment note. (Demo only.)",
};

function toDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function friendlyStatus(raw) {
  const status = String(raw || "pending").toLowerCase();
  return status.charAt(0).toUpperCase() + status.slice(1);
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { id: "appointments", label: "Appointments", icon: CalendarDays },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "profile", label: "Profile", icon: UserRound },
];

export default function ClientPortalPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [section, setSection] = useState("dashboard");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const demoClient = demoClients[0];

  const appointments = useMemo(
    () =>
      getAllDemoAppointments()
        .filter((appointment) =>
          user?.demoRole === "client"
            ? appointment.clientId === demoClient.id || appointment.clientId === "client-demo-new"
            : true
        )
        .map((appointment) => ({
          ...appointment,
          date: appointment.startAt,
          friendly: friendlyStatus(appointment.status),
          rawStatus: appointment.status,
        })),
    [user?.demoRole, demoClient.id]
  );

  const now = new Date("2026-09-18T08:00:00");
  const upcomingBookings = appointments.filter((appointment) => {
    const date = toDate(appointment.startAt);
    return date && date >= now && !["completed", "cancelled", "declined"].includes(appointment.status);
  });
  const completedBookings = appointments.filter((appointment) => {
    const date = toDate(appointment.startAt);
    return appointment.status === "completed" || appointment.status === "cancelled" || (date && date < now);
  });

  const contactProfile = {
    name: user?.displayName || demoClient.name,
    phone: demoClient.phone,
  };
  const addresses = [
    {
      id: "demo-address",
      type: "home",
      street: demoClient.addressLine1,
      city: demoClient.city,
      state: demoClient.state,
      zip: demoClient.zip,
      isDefault: true,
    },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/auth", { replace: true });
  };

  const initial = (contactProfile.name || "C").trim().charAt(0).toUpperCase();

  const NavList = ({ onSelect }) => (
    <nav className="space-y-0.5">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = section === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setSection(item.id);
              onSelect?.();
            }}
            aria-current={active ? "page" : undefined}
            className={`relative w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active ? "bg-accent text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <span
              className={`absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-primary transition-opacity ${
                active ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden="true"
            />
            <Icon className="w-4 h-4 shrink-0" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Portal header */}
      <header className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileNavOpen((v) => !v)}
              className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-secondary text-foreground shrink-0"
              aria-label="Toggle navigation"
              aria-expanded={mobileNavOpen}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <img src={logo} alt="CleanPro Demo" className="h-9 w-auto hidden sm:block" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">Client Portal</p>
              <p className="text-sm font-semibold text-foreground truncate">Welcome back, {contactProfile.name.split(" ")[0]}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground px-2 py-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Public site
            </Link>
            <div className="hidden sm:grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
              {initial}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block h-fit sticky top-24">
            <div className="rounded-xl border border-border bg-card p-3 shadow-card">
              <NavList />
            </div>
          </aside>

          {/* Mobile nav drawer */}
          {mobileNavOpen && (
            <div className="lg:hidden -mt-2 mb-2 rounded-xl border border-border bg-card p-3 shadow-card">
              <NavList onSelect={() => setMobileNavOpen(false)} />
            </div>
          )}

          <main className="min-w-0">
            {section === "dashboard" && (
              <ClientDashboardHome
                upcomingBookings={upcomingBookings}
                completedBookings={completedBookings}
                allBookings={appointments}
                onGoToAppointments={() => setSection("appointments")}
                onGoToBook={() => navigate("/book")}
                primaryAddress={addresses[0]}
              />
            )}

            {section === "appointments" && (
              <AppointmentsView
                upcomingBookings={upcomingBookings}
                completedBookings={completedBookings}
                loadingUpcoming={false}
                loadingCompleted={false}
                isRepeatClient={completedBookings.length > 0}
                onUpcomingAction={({ type, booking }) => {
                  if (type === "book-new") navigate("/book");
                  if (type === "reschedule") navigate(`/book?bookingId=${booking.id}`);
                }}
                onViewPayments={(booking) => {
                  const invoice = booking?.id
                    ? getDemoInvoiceByAppointmentId(booking.id)
                    : null;
                  setSelectedInvoiceId(invoice?.id || "");
                  setSection("payments");
                }}
                depositAmount={PAYMENT_INFO.depositAmount}
              />
            )}

            {section === "profile" && (
              <ProfileSettingsPanel
                profile={contactProfile}
                addresses={addresses}
                savingContact={false}
                preferences={{
                  fragrancePreference: "fragrance_free",
                  focusPreference: "balanced",
                  petPreference: "dogs",
                }}
                preferredContactMethod={demoClient.preferredContactMethod}
                email={demoClient.email}
                onSaveContact={() => {}}
                onOpenAddAddress={() => {}}
                onOpenEditAddress={() => {}}
                onDeleteAddress={() => {}}
                onSetDefaultAddress={() => {}}
                onSendReset={() => {}}
                paymentInfo={PAYMENT_INFO}
                onOpenPaymentCenter={() => setSection("payments")}
              />
            )}

            {section === "payments" && <PaymentCenterPage initialInvoiceId={selectedInvoiceId} />}
          </main>
        </div>
      </div>
    </div>
  );
}
