// src/components/portal/ClientDashboardHome.jsx
import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import StatusPill from "@/components/StatusPill";
import {
  CalendarDays,
  Clock,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import AppointmentTimeline from "@/components/portal/AppointmentTimeline";
import { getDemoInvoiceByAppointmentId } from "@/data/demoInvoices";

/** Local date helpers so we don't couple tightly to local data everywhere */
function toDate(tsLike) {
  if (!tsLike) return null;
  if (typeof tsLike.toDate === "function") return tsLike.toDate();
  return new Date(tsLike);
}

function formatDate(tsLike) {
  const d = toDate(tsLike);
  if (!d || Number.isNaN(d.getTime())) return "TBD";
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(tsLike) {
  const d = toDate(tsLike);
  if (!d || Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

const money = (n) =>
  Number(n || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

function formatAddressRow(a) {
  if (!a) return null;
  const parts = [a.street, a.city, a.state, a.zip].filter(Boolean);
  const joined = parts.join(", ");
  return joined || null;
}

/**
 * Try to pull a human-readable service address from the booking first,
 * otherwise fall back to the primaryAddress passed in as a prop.
 */
function formatServiceAddress(booking, primaryAddress) {
  if (!booking && !primaryAddress) return null;

  if (booking?.serviceAddressLine) return booking.serviceAddressLine;

  if (booking?.addressLine) {
    if (booking.addressZip) {
      return `${booking.addressLine} ${booking.addressZip}`;
    }
    return booking.addressLine;
  }

  if (booking?.address) {
    const row =
      formatAddressRow(booking.address) ||
      (booking.address.full ? booking.address.full : null);
    if (row) return row;
  }

  const parts = [
    booking?.street,
    booking?.city,
    booking?.state,
    booking?.zip,
  ].filter(Boolean);
  if (parts.length) return parts.join(", ");

  const primaryRow = formatAddressRow(primaryAddress);
  return primaryRow || null;
}

/**
 * Props:
 * - upcomingBookings: array of booking objects (from upcomingBookings memo)
 * - completedBookings: array of booking objects (from completedBookings memo)
 * - allBookings: array of all bookingsWithFriendly
 * - onGoToAppointments: () => void
 * - onGoToBook: () => void
 * - onGoToContactDetails?: () => void
 * - onGoToAccountDetails?: () => void
 * - primaryAddress?: { street?: string; city?: string; state?: string; zip?: string }
 */
export default function ClientDashboardHome({
  upcomingBookings = [],
  completedBookings = [],
  allBookings = [],
  onGoToAppointments,
  onGoToBook,
  onGoToContactDetails, // kept for future use
  onGoToAccountDetails, // kept for future use
  primaryAddress,
}) {
  const { nextBooking, lastCompleted, upcomingPreview } = useMemo(() => {
    const nextBooking =
      upcomingBookings && upcomingBookings.length > 0
        ? upcomingBookings[0]
        : null;

    const completedSorted = [...(completedBookings || [])].sort((a, b) => {
      const aD = toDate(a.endAt || a.date) || new Date(0);
      const bD = toDate(b.endAt || b.date) || new Date(0);
      return bD - aD;
    });
    const lastCompleted = completedSorted[0] || null;

    const upcomingPreview = (upcomingBookings || []).slice(0, 3);

    return { nextBooking, lastCompleted, upcomingPreview };
  }, [upcomingBookings, completedBookings]);

  const handleBook = () => {
    if (typeof onGoToBook === "function") onGoToBook();
  };
  const handleAppointments = () => {
    if (typeof onGoToAppointments === "function") onGoToAppointments();
  };

  const nextServiceAddress = formatServiceAddress(nextBooking, primaryAddress);
  const lastServiceAddress = formatServiceAddress(lastCompleted, primaryAddress);

  const isRepeatClient = (completedBookings || []).length > 0;
  const hasUpcoming = (upcomingBookings || []).length > 0;

  // Next-booking deposit info, derived the same way as admin
  const nextPayment = nextBooking?.payment || {};
  const nextDepositAmount = Number(
    nextBooking?.depositAmount ?? nextPayment.depositAmount ?? nextBooking?.depositDue ?? 0
  );
  const nextDepositPaid = Boolean(
    nextBooking?.depositPaid ?? nextPayment.depositPaid ?? nextBooking?.depositReceived ?? false
  );

  // Cross-reference the invoice generated for the next appointment so we can
  // surface whether a balance is due, without recomputing any financials.
  const nextInvoice = nextBooking?.id
    ? getDemoInvoiceByAppointmentId(nextBooking.id)
    : null;
  const nextAmountDue = Number(nextInvoice?.amountDue ?? 0);

  return (
    <section className="space-y-5 sm:space-y-6">
      <PageHeader
        eyebrow="Client dashboard"
        title="Your cleaning dashboard"
        description="When you're cleaned next, what it costs, and what happened last time — at a glance."
        actions={
          <Button variant="outline" onClick={handleAppointments} className="hidden sm:inline-flex">
            Manage appointments
          </Button>
        }
      />

      {/* Hero: next appointment + last completed */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-4 sm:gap-5 items-start">
        {/* Next appointment — the hero element */}
        <div className="rounded-xl border border-navy-900 bg-navy-900 text-white shadow-pop overflow-hidden">
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-white/70">
                <CalendarDays className="w-4 h-4" />
                <p className="text-xs font-semibold uppercase tracking-wide">Next cleaning</p>
              </div>
              {nextBooking && <StatusPill status={nextBooking.rawStatus || nextBooking.status} />}
            </div>

            {nextBooking ? (
              <>
                <div className="space-y-1.5">
                  <h2 className="font-display text-xl sm:text-2xl font-bold leading-tight">
                    {nextBooking.service || nextBooking.serviceName}
                  </h2>
                  <p className="text-sm text-white/80">
                    {formatDate(nextBooking.date)}
                    {formatTime(nextBooking.date) && <> · {formatTime(nextBooking.date)}</>}
                  </p>
                </div>

                {nextServiceAddress && (
                  <div className="flex items-start gap-2 text-sm text-white/80">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-white/60" />
                    <span>{nextServiceAddress}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-end justify-between gap-3 pt-1 border-t border-white/15">
                  <div className="pt-3">
                    <p className="text-xs text-white/60 uppercase tracking-wide">Total</p>
                    <p className="font-display text-2xl font-bold tabular-nums">
                      {money(nextBooking.total)}
                    </p>
                  </div>

                  <div className="pt-3 text-right">
                    {nextAmountDue > 0 ? (
                      <p className="text-xs font-semibold text-warning bg-warning-bg rounded-md px-2 py-1">
                        Balance due {money(nextAmountDue)}
                      </p>
                    ) : nextInvoice ? (
                      <p className="text-xs font-semibold text-success bg-success-bg rounded-md px-2 py-1">
                        Paid in full
                      </p>
                    ) : null}
                  </div>
                </div>

                {nextDepositAmount > 0 && !isRepeatClient && (
                  <div
                    className={`text-xs rounded-md px-3 py-2 ${
                      nextDepositPaid ? "bg-success-bg text-success" : "bg-warning-bg text-warning"
                    }`}
                  >
                    {nextDepositPaid ? (
                      <>Deposit of {money(nextDepositAmount)} received — this appointment is secured.</>
                    ) : (
                      <>A deposit of {money(nextDepositAmount)} is required to secure this appointment.</>
                    )}
                  </div>
                )}

                {upcomingPreview.length > 1 && (
                  <div className="pt-1 space-y-1.5">
                    <p className="text-xs font-medium text-white/60">Also coming up</p>
                    {upcomingPreview.slice(1).map((b) => (
                      <div
                        key={b.id}
                        className="flex items-center justify-between gap-3 text-xs rounded-md bg-white/10 px-3 py-2"
                      >
                        <span className="truncate">
                          {b.service || b.serviceName} · {formatDate(b.date)}
                        </span>
                        <span className="tabular-nums text-white/80 whitespace-nowrap">
                          {money(b.total)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-1 flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={handleAppointments}
                    className="bg-white text-navy-900 hover:bg-white/90"
                  >
                    Manage appointments
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-3 py-2">
                <p className="text-sm text-white/80">
                  You don&apos;t have any upcoming appointments yet.
                </p>
                <Button
                  onClick={handleBook}
                  className="bg-white text-navy-900 hover:bg-white/90"
                >
                  Book your next cleaning
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Last completed cleaning */}
        <div className="rounded-xl border border-border bg-card shadow-card p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <p className="text-xs font-semibold uppercase tracking-wide">Most recent cleaning</p>
          </div>

          {lastCompleted ? (
            <div className="space-y-3 text-sm">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-foreground">
                  {lastCompleted.service || lastCompleted.serviceName}
                </p>
                <StatusPill status={lastCompleted.rawStatus || lastCompleted.status} />
              </div>
              <p className="text-muted-foreground">{formatDate(lastCompleted.date)}</p>

              {lastServiceAddress && (
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{lastServiceAddress}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">Total paid</span>
                <span className="font-display font-semibold tabular-nums text-foreground">
                  {money(lastCompleted.total)}
                </span>
              </div>

              <Button size="sm" onClick={handleBook} className="w-full">
                <Sparkles className="w-4 h-4 mr-1.5" />
                Book again
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Once you&apos;ve had your first cleaning, you&apos;ll see a quick summary here.
            </p>
          )}

          {hasUpcoming && isRepeatClient && (
            <div className="flex items-start gap-2 rounded-md bg-success-bg text-success px-3 py-2 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <p>As a returning client, deposits are no longer required for your appointments.</p>
            </div>
          )}
        </div>
      </div>

      {/* Timeline for the next appointment — where things stand right now */}
      {nextBooking && (
        <AppointmentTimeline booking={nextBooking} title="Where your next cleaning stands" />
      )}
    </section>
  );
}
