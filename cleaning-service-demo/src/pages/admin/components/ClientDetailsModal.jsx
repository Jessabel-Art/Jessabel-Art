import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { formatPhoneForDisplay } from "@/lib/contactModel";
import { getDemoAppointmentsByClientId } from "@/data/demoAppointments";
import { getDemoInvoicesByClientId } from "@/data/demoInvoices";
import StatusPill from "@/components/StatusPill";

// Static demo "now" — pinned to 2026-09-18, matches every other admin view.
const TODAY = new Date("2026-09-18T08:00:00");

const money = (n) =>
  Number(n || 0).toLocaleString("en-US", { style: "currency", currency: "USD" });

function initials(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return parts.length === 1
    ? parts[0][0].toUpperCase()
    : `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function ClientDetailsModal({ client, onClose }) {
  const navigate = useNavigate();

  const appointments = useMemo(
    () => (client ? getDemoAppointmentsByClientId(client.id) : []),
    [client]
  );
  const invoices = useMemo(() => (client ? getDemoInvoicesByClientId(client.id) : []), [client]);

  if (!client) return null;

  const totalRevenue = invoices.reduce((sum, invoice) => sum + Number(invoice.total || 0), 0);
  const outstandingBalance = invoices.reduce((sum, invoice) => sum + Number(invoice.amountDue || 0), 0);
  const nextAppointment = appointments
    .filter((appointment) => new Date(appointment.startAt) >= TODAY && appointment.status !== "cancelled")
    .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))[0];

  return (
    <Dialog open={!!client} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-card p-0 shadow-pop overflow-hidden">
        <DialogHeader className="px-6 py-5 border-b border-border bg-muted/40">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-navy-900 text-white flex items-center justify-center text-lg font-semibold shrink-0">
              {initials(client.name)}
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-semibold text-foreground truncate">{client.name}</h2>
              <p className="text-sm text-muted-foreground">Client profile</p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 grid gap-5 md:grid-cols-[1fr_1.2fr]">
          <section className="space-y-4">
            <InfoRow icon={Mail} label="Email" value={client.email} />
            <InfoRow icon={Phone} label="Phone" value={formatPhoneForDisplay(client.phone)} />
            <InfoRow icon={MapPin} label="Address" value={client.addressSummary} />
            <InfoRow icon={Sparkles} label="Preference" value={client.servicePreference} />
            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Notes</p>
              <p className="text-sm text-foreground">{client.notes}</p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Metric label="Appointments" value={appointments.length} />
              <Metric label="Revenue" value={money(totalRevenue)} />
              <Metric
                label="Balance"
                value={money(outstandingBalance)}
                tone={outstandingBalance > 0 ? "warning" : "default"}
              />
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              <div className="px-3 py-2 bg-muted/60 text-sm font-semibold text-foreground">
                Recent appointments
              </div>
              <div className="divide-y divide-border">
                {appointments.slice(0, 5).map((appointment) => (
                  <div key={appointment.id} className="px-3 py-2 text-sm flex justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">{appointment.serviceName}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(appointment.startAt)}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <p className="text-foreground tabular-nums">{money(appointment.total)}</p>
                      <StatusPill status={appointment.status} />
                    </div>
                  </div>
                ))}
                {appointments.length === 0 && (
                  <p className="px-3 py-4 text-sm text-muted-foreground text-center">No appointments yet.</p>
                )}
              </div>
            </div>

            {nextAppointment && (
              <div className="rounded-lg border border-primary/20 bg-accent p-3 text-sm text-foreground">
                <div className="flex items-center gap-2 font-semibold">
                  <Calendar className="w-4 h-4 text-primary" />
                  Next appointment
                </div>
                <p className="mt-1">
                  {nextAppointment.serviceName} on {formatDate(nextAppointment.startAt)}
                </p>
              </div>
            )}
          </section>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border bg-muted/40">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => navigate(`/admin/client-bookings?clientId=${encodeURIComponent(client.id)}`)}>
            View bookings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3 text-sm">
      <Icon className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-foreground">{value || "--"}</p>
      </div>
    </div>
  );
}

function Metric({ label, value, tone = "default" }) {
  return (
    <div className={`rounded-lg border p-3 ${tone === "warning" ? "bg-warning-bg border-warning/20" : "bg-muted/40 border-border"}`}>
      <p className={`text-xs ${tone === "warning" ? "text-warning" : "text-muted-foreground"}`}>{label}</p>
      <p className={`font-semibold ${tone === "warning" ? "text-warning" : "text-foreground"}`}>{value}</p>
    </div>
  );
}
