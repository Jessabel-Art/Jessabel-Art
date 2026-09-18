// src/components/portal/PastBookings.jsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import StatusPill from "@/components/StatusPill";
import { Star, Clock, FileDown, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import logoPrimary from "@/assets/logo/logo-primary.png";

function toDate(tsLike) {
  if (!tsLike) return null;
  if (typeof tsLike.toDate === "function") return tsLike.toDate();
  return new Date(tsLike);
}

function formatDate(tsLike) {
  try {
    const d = toDate(tsLike);
    if (!d || Number.isNaN(d.getTime())) return "TBD";
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "TBD";
  }
}

function formatTime(tsLike) {
  const d = toDate(tsLike);
  if (!d || Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatMoney(n) {
  return Number(n || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function formatServiceAddress(booking) {
  if (booking?.address?.full) return booking.address.full;
  return (
    booking?.address ||
    booking?.fullAddress ||
    (booking?.street && `${booking.street}${booking.city ? `, ${booking.city}` : ""}`) ||
    "On file"
  );
}

// Simple static star renderer for saved review rating (1–5)
function RatingStars({ rating = 0 }) {
  const r = Math.max(0, Math.min(5, Number(rating) || 0));
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${
            i < r ? "text-warning fill-warning" : "text-muted-foreground/30"
          }`}
        />
      ))}
    </span>
  );
}

function getBookingField(booking, keys, fallback = "Not specified") {
  for (const key of keys) {
    const v = booking?.[key];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return fallback;
}

/**
 * PastBookings
 *
 * Props:
 * - bookings: array of normalized bookings
 * - loading: boolean
 * - onReview(booking)
 * - onAction({ type, booking }) // used here for download-pdf
 */
export default function PastBookings({
  bookings = [],
  loading = false,
  onReview,
  onAction,
  onViewPayments,
}) {
  const now = new Date();
  const [activeBooking, setActiveBooking] = useState(null);

  const completedCount = bookings.length;
  const ratings = bookings
    .map((b) => Number(b.reviewRating))
    .filter((n) => !Number.isNaN(n));
  const avgRating =
    ratings.length > 0
      ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) /
        10
      : null;

  const openDetails = (booking) => setActiveBooking(booking);
  const closeDetails = () => setActiveBooking(null);

  const handleDownloadPdf = () => {
    if (!activeBooking || typeof onAction !== "function") return;
    onAction({ type: "download-pdf", booking: activeBooking });
  };

  const resolveStatus = (b) => {
    const end = toDate(b.endAt);
    let status = b.rawStatus || b.status || "pending";
    if (
      end &&
      end < now &&
      ["confirmed", "pending"].includes(String(status).toLowerCase())
    ) {
      status = "completed";
    }
    return status;
  };

  const renderDetailsModal = () => {
    if (!activeBooking) return null;

    const b = activeBooking;
    const orderCode = `CI-${(b.id || "").slice(0, 5).toUpperCase()}`;

    const startDate = toDate(b.startAt || b.date);
    const endDate = toDate(b.endAt);

    const total = formatMoney(b.total);
    const depositDue =
      b.depositDue != null ? formatMoney(b.depositDue) : null;

    const address = formatServiceAddress(b);

    const frequency = getBookingField(
      b,
      ["frequency", "serviceFrequency"],
      "one-time"
    );

    const propertyType = getBookingField(b, ["propertyType", "homeType"]);
    const bedrooms = getBookingField(b, ["bedrooms", "numBedrooms"], "—");
    const bathrooms = getBookingField(b, ["bathrooms", "numBathrooms"], "—");
    const conditionLevel = getBookingField(
      b,
      ["conditionLevel", "condition"],
      "Standard"
    );
    const petsValue = getBookingField(
      b,
      ["petsOnSite", "hasPets"],
      "No"
    );
    const pets =
      typeof petsValue === "boolean"
        ? petsValue
          ? "Yes"
          : "No"
        : petsValue;

    const fragrancePreference = getBookingField(
      b,
      ["fragrancePreference", "scentPreference"],
      "No preference"
    );

    const addOnsRaw =
      b.addOns || b.addons || b.addonList || b.selectedAddOns || [];
    const addOnsArray = Array.isArray(addOnsRaw)
      ? addOnsRaw
      : typeof addOnsRaw === "string"
      ? addOnsRaw.split(",").map((x) => x.trim()).filter(Boolean)
      : [];
    const addOns =
      addOnsArray.length > 0 ? addOnsArray.join(", ") : "None added";

    const notes = b.notes ?? b.clientNotes ?? "";

    return (
      <Dialog open={!!activeBooking} onOpenChange={(open) => !open && closeDetails()}>
        <DialogContent
          className="
            max-w-xl sm:max-w-2xl
            max-h-[85vh] overflow-y-auto
            rounded-lg p-5 sm:p-6
          "
        >
          <DialogHeader className="mb-4 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={logoPrimary}
                  alt="CleanPro Demo"
                  className="h-10 w-auto"
                />
                <div className="leading-tight text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground text-sm">
                    CleanPro Demo
                  </p>
                  <p>Completed appointment summary</p>
                </div>
              </div>
              <div className="text-right text-xs text-muted-foreground space-y-1">
                <p className="font-mono text-[11px]">
                  Order: <span className="font-semibold">{orderCode}</span>
                </p>
                {startDate && (
                  <p>
                    {formatDate(startDate)}{" "}
                    {formatTime(startDate) && <>· {formatTime(startDate)}</>}
                  </p>
                )}
              </div>
            </div>

            <DialogTitle className="text-lg sm:text-xl text-foreground">
              Appointment details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 text-sm text-foreground">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="font-semibold">Service</p>
                <p>{b.service || "Residential Cleaning"}</p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold">Status</p>
                <StatusPill status={resolveStatus(b)} />
              </div>

              <div className="space-y-1">
                <p className="font-semibold">Date / Time</p>
                {startDate ? (
                  <p>
                    {formatDate(startDate)}{" "}
                    {formatTime(startDate) && `· ${formatTime(startDate)}`}
                    {endDate && (
                      <>
                        {" – "}
                        {formatTime(endDate)}
                      </>
                    )}
                  </p>
                ) : (
                  <p>TBD</p>
                )}
              </div>

              <div className="space-y-1">
                <p className="font-semibold">Frequency</p>
                <p>{frequency}</p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold">Total</p>
                <p className="tabular-nums">{total}</p>
              </div>

              {depositDue && (
                <div className="space-y-1">
                  <p className="font-semibold">Deposit due</p>
                  <p className="tabular-nums">{depositDue}</p>
                </div>
              )}

              <div className="space-y-1 sm:col-span-2">
                <p className="font-semibold">Service address</p>
                <p>{address}</p>
              </div>
            </div>

            <div className="mt-2 border-t border-border pt-3 space-y-2">
              <p className="font-semibold text-sm">Home &amp; cleaning details</p>
              <div className="grid gap-2 sm:grid-cols-2 text-sm">
                <div>
                  <span className="text-muted-foreground text-xs block">
                    Property type
                  </span>
                  <span>{propertyType}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block">
                    Bedrooms / Bathrooms
                  </span>
                  <span>
                    {bedrooms} bed · {bathrooms} bath
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block">
                    Condition level
                  </span>
                  <span>{conditionLevel}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block">
                    Pets on site
                  </span>
                  <span>{pets}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block">
                    Fragrance preference
                  </span>
                  <span>{fragrancePreference}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-muted-foreground text-xs block">Add-ons</span>
                  <span>{addOns}</span>
                </div>
              </div>
            </div>

            <div className="mt-2 border-t border-border pt-3 space-y-1">
              <p className="text-xs font-semibold text-foreground">
                Notes on this appointment
              </p>
              <div className="text-sm text-foreground bg-secondary border border-border rounded-md px-3 py-2 whitespace-pre-wrap">
                {notes && notes.trim().length > 0
                  ? notes
                  : "No additional notes were recorded for this appointment."}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6 flex flex-col sm:flex-row sm:justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              className="order-1 sm:order-none"
              onClick={closeDetails}
            >
              Close
            </Button>

            <div className="flex flex-row gap-2 justify-end w-full sm:w-auto">
              {onViewPayments && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onViewPayments(activeBooking)}
                >
                  Invoice
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleDownloadPdf}
              >
                <FileDown className="w-4 h-4" />
                PDF
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-foreground text-lg md:text-xl">
                Completed Appointments
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                View your past cleanings and leave feedback for our team.
              </p>
            </div>
          </div>

          {!loading && completedCount > 0 && (
            <span className="inline-flex items-center rounded-md bg-secondary px-3 py-1 text-xs text-muted-foreground border border-border">
              {completedCount} completed&nbsp;
              {completedCount === 1 ? "appointment" : "appointments"}
            </span>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {!loading && completedCount > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs text-muted-foreground">
              <span>
                You have{" "}
                <span className="font-semibold text-foreground">
                  {completedCount}
                </span>{" "}
                completed {completedCount === 1 ? "appointment" : "appointments"}.
              </span>
              {avgRating != null && (
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-warning fill-warning" />
                  <span>
                    Average rating:{" "}
                    <span className="font-semibold text-foreground">
                      {avgRating}
                    </span>{" "}
                    / 5
                  </span>
                </span>
              )}
            </div>
          )}

          {/* Desktop table */}
          <div className="hidden md:block">
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Feedback</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={5}>
                          <div className="h-4 w-full max-w-sm bg-muted rounded animate-pulse" />
                        </TableCell>
                      </TableRow>
                    ))
                  : bookings.length
                  ? bookings.map((b) => {
                      const canReview = typeof onReview === "function";
                      const displayStatus = resolveStatus(b);
                      const orderCode = `CI-${b.id.slice(0, 5).toUpperCase()}`;
                      const hasRating =
                        b.reviewRating !== undefined &&
                        b.reviewRating !== null &&
                        b.reviewRating !== "";

                      return (
                        <TableRow key={b.id}>
                          <TableCell>
                            <button
                              type="button"
                              className="px-2 py-1 rounded-md bg-secondary text-foreground font-mono text-xs border border-border hover:border-primary/40"
                              onClick={() => openDetails(b)}
                            >
                              {orderCode}
                            </button>
                          </TableCell>

                          <TableCell className="text-foreground">
                            {formatDate(b.date)}
                          </TableCell>

                          <TableCell>
                            <StatusPill status={displayStatus} />
                          </TableCell>

                          <TableCell className="text-right">
                            <span className="font-medium tabular-nums text-foreground">
                              {formatMoney(b.total)}
                            </span>
                          </TableCell>

                          <TableCell>
                            {hasRating ? (
                              <button
                                type="button"
                                className="inline-flex flex-col items-start gap-0.5 text-xs text-muted-foreground hover:text-foreground"
                                onClick={() => canReview && onReview(b)}
                              >
                                <span className="flex items-center gap-1">
                                  <RatingStars rating={b.reviewRating} />
                                  <span className="ml-1">
                                    {Number(b.reviewRating)}/5
                                  </span>
                                </span>
                                <span className="text-[10px] text-muted-foreground/70">
                                  Your feedback
                                  {canReview ? " (tap to edit)" : ""}
                                </span>
                              </button>
                            ) : canReview ? (
                              <button
                                type="button"
                                className="text-primary inline-flex items-center gap-1 text-xs md:text-sm hover:underline"
                                onClick={() => onReview(b)}
                              >
                                <Star className="w-4 h-4" />
                                Leave review
                              </button>
                            ) : (
                              <span className="text-muted-foreground text-xs">—</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-6 text-center text-muted-foreground"
                      >
                        No completed appointments yet.
                      </TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-secondary p-3 animate-pulse space-y-2"
                >
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-4 w-40 bg-muted rounded" />
                  <div className="h-4 w-20 bg-muted rounded" />
                </div>
              ))
            ) : bookings.length ? (
              bookings.map((b) => {
                const canReview = typeof onReview === "function";
                const displayStatus = resolveStatus(b);
                const orderCode = `CI-${b.id.slice(0, 5).toUpperCase()}`;
                const hasRating =
                  b.reviewRating !== undefined &&
                  b.reviewRating !== null &&
                  b.reviewRating !== "";

                return (
                  <div
                    key={b.id}
                    className="rounded-lg border border-border bg-card p-3 flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <button
                        type="button"
                        className="text-left"
                        onClick={() => openDetails(b)}
                      >
                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-mono">
                          {orderCode}
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {b.service || "Cleaning service"}
                        </p>
                      </button>
                      <StatusPill status={displayStatus} />
                    </div>

                    <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <span>{formatServiceAddress(b)}</span>
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {formatDate(b.date)} ·{" "}
                      <span className="font-medium tabular-nums text-foreground">
                        {formatMoney(b.total)}
                      </span>
                    </p>

                    <div className="flex items-center justify-between mt-1">
                      {hasRating ? (
                        <button
                          type="button"
                          className="inline-flex flex-col items-start gap-0.5 text-[11px] text-muted-foreground hover:text-foreground"
                          onClick={() => canReview && onReview(b)}
                        >
                          <span className="flex items-center gap-1">
                            <RatingStars rating={b.reviewRating} />
                            <span className="ml-1">
                              {Number(b.reviewRating)}/5
                            </span>
                          </span>
                          <span className="text-[10px] text-muted-foreground/70">
                            Your feedback
                            {canReview ? " (tap to edit)" : ""}
                          </span>
                        </button>
                      ) : canReview ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-xs"
                          onClick={() => onReview(b)}
                        >
                          <Star className="w-3 h-3 mr-1" />
                          Review
                        </Button>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">
                          Feedback not available
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-secondary p-4 text-center text-sm text-muted-foreground">
                Once you&apos;ve had your first cleaning, your history will
                appear here.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {renderDetailsModal()}
    </>
  );
}
