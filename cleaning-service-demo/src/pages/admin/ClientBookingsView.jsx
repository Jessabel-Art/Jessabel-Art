import React, { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import PageHeader from "@/components/PageHeader";
import MetricCard from "@/components/MetricCard";
import StatusPill from "@/components/StatusPill";
import { formatPhoneForDisplay } from "@/lib/contactModel";
import { demoClients } from "@/data/demoClients";
import { getDemoAppointmentsByClientId } from "@/data/demoAppointments";
import { getDemoInvoicesByClientId } from "@/data/demoInvoices";

const money = (n) =>
  Number(n || 0).toLocaleString("en-US", { style: "currency", currency: "USD" });

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ClientBookingsView() {
  const [search] = useSearchParams();
  const clientId = search.get("clientId");
  const client = useMemo(
    () =>
      demoClients.find((item) => item.id === clientId) ||
      demoClients.find((item) => item.email === search.get("email")) ||
      demoClients[0],
    [clientId, search]
  );

  const appointments = useMemo(() => getDemoAppointmentsByClientId(client.id), [client.id]);
  const invoices = useMemo(() => getDemoInvoicesByClientId(client.id), [client.id]);
  const outstandingBalance = useMemo(
    () => invoices.reduce((sum, inv) => sum + Number(inv.amountDue || 0), 0),
    [invoices]
  );

  return (
    <section className="min-h-screen bg-muted/40 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-5">
        <Button asChild variant="outline" size="sm">
          <Link to="/admin">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to admin
          </Link>
        </Button>

        <PageHeader
          eyebrow="Client"
          title={client.name}
          description={
            <span className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {client.addressSummary}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {client.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                {formatPhoneForDisplay(client.phone)}
              </span>
            </span>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Appointments" value={appointments.length} />
          <MetricCard label="Invoices" value={invoices.length} />
          <MetricCard label="Total billed" value={money(invoices.reduce((sum, inv) => sum + inv.total, 0))} />
          <MetricCard
            label="Outstanding balance"
            value={money(outstandingBalance)}
            tone={outstandingBalance > 0 ? "warning" : "default"}
          />
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Appointment history</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="whitespace-nowrap">{formatDate(appointment.startAt)}</TableCell>
                    <TableCell className="text-foreground">{appointment.serviceName}</TableCell>
                    <TableCell>
                      <StatusPill status={appointment.status} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{money(appointment.total)}</TableCell>
                    <TableCell className="text-muted-foreground max-w-72">{appointment.notes}</TableCell>
                  </TableRow>
                ))}
                {appointments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No appointments on file for this client.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
