import React from "react";
import { CheckCircle2, Database, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/PageHeader";
import { demoClients } from "@/data/demoClients";
import { demoAppointments } from "@/data/demoAppointments";
import { demoInvoices } from "@/data/demoInvoices";
import { demoCalendarEvents } from "@/data/demoCalendarEvents";

export default function MaintenanceView() {
  const checks = [
    ["Clients loaded locally", demoClients.length],
    ["Appointments loaded locally", demoAppointments.length],
    ["Invoices loaded locally", demoInvoices.length],
    ["Calendar events loaded locally", demoCalendarEvents.length],
  ];

  const backendStatus = [
    ["Backend services", "Disabled for demo"],
    ["Local data reads/writes", "Disabled for demo routes"],
    ["Payments", "Simulated with local invoice data"],
    ["Email delivery", "Simulated with on-screen messaging"],
  ];

  return (
    <section className="space-y-5">
      <PageHeader
        eyebrow="System"
        title="Maintenance"
        description="This environment is self-contained. There are no backend repair jobs, seeders, sweepers, or database mutations."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" />
              Local data health
            </CardTitle>
            <CardDescription>Record counts loaded from the demo data modules.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {checks.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                <span className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  {label}
                </span>
                <span className="font-semibold text-foreground tabular-nums">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Backend status
            </CardTitle>
            <CardDescription>What's real versus simulated in this portfolio build.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {backendStatus.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                <span className="text-sm text-foreground">{label}</span>
                <Badge variant="secondary">{value}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
