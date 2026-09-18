// src/pages/admin/components/StatusPill.jsx
// Canonical lifecycle-status chip, shared by admin bookings/calendar/clients
// and the client portal appointment views so "confirmed"/"completed"/etc.
// always mean — and look — the same thing everywhere.
import React from "react";

const STATUS_STYLES = {
  pending: {
    label: "Pending",
    dot: "bg-warning",
    className: "bg-warning-bg text-warning border border-warning/20",
  },
  confirmed: {
    label: "Confirmed",
    dot: "bg-primary",
    className: "bg-accent text-primary border border-primary/20",
  },
  completed: {
    label: "Completed",
    dot: "bg-success",
    className: "bg-success-bg text-success border border-success/20",
  },
  declined: {
    label: "Declined",
    dot: "bg-destructive",
    className: "bg-destructive-bg text-destructive border border-destructive/20",
  },
  cancelled: {
    label: "Cancelled",
    dot: "bg-destructive",
    className: "bg-destructive-bg text-destructive border border-destructive/20",
  },
  paid: {
    label: "Paid",
    dot: "bg-success",
    className: "bg-success-bg text-success border border-success/20",
  },
  partial: {
    label: "Partial",
    dot: "bg-warning",
    className: "bg-warning-bg text-warning border border-warning/20",
  },
  unpaid: {
    label: "Unpaid",
    dot: "bg-destructive",
    className: "bg-destructive-bg text-destructive border border-destructive/20",
  },
};

export default function StatusPill({ status, className = "" }) {
  if (!status) return null;

  const key = String(status).toLowerCase();
  const style = STATUS_STYLES[key] || {
    label: status,
    dot: "bg-muted-foreground",
    className: "bg-muted text-muted-foreground border border-border",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold leading-none ${style.className} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      {style.label}
    </span>
  );
}
