import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import PageHeader from "@/components/PageHeader";
import MetricCard from "@/components/MetricCard";
import { getAllDemoAppointments, getAllDemoInvoices } from "@/data/demoRuntime";

// Design-token hex equivalents (index.css HSL vars / tailwind.config.js
// literal scales) — recharts needs resolved colors, not Tailwind classes.
const PRIMARY = "#277EB4";
const PRIMARY_LIGHT = "#3A9FDF";
const SUCCESS = "#2C6D4F";
const WARNING = "#AC7015";
const DESTRUCTIVE = "#B93D31";
const NAVY = "#1A4362";
const GRID = "#E2E8EF";
const AXIS_TEXT = "#5B6B79";

const STATUS_COLORS = { confirmed: PRIMARY, pending: WARNING, completed: SUCCESS, cancelled: DESTRUCTIVE };
const SERVICE_COLORS = [PRIMARY, SUCCESS, WARNING, NAVY, PRIMARY_LIGHT, DESTRUCTIVE];

const money = (n) =>
  Number(n || 0).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const tickStyle = { fontSize: 11, fill: AXIS_TEXT };

export default function ReportsView() {
  const appointments = useMemo(() => getAllDemoAppointments(), []);
  const invoices = useMemo(() => getAllDemoInvoices(), []);

  const report = useMemo(() => {
    const active = appointments.filter((a) => a.status !== "cancelled");

    const byService = new Map();
    const byStatus = new Map();
    const byDay = new Map();

    appointments.forEach((a) => {
      byStatus.set(a.status, (byStatus.get(a.status) || 0) + 1);
    });

    active.forEach((a) => {
      const service = a.serviceName || "Other";
      const serviceEntry = byService.get(service) || { name: service, revenue: 0, count: 0 };
      serviceEntry.revenue += Number(a.total || 0);
      serviceEntry.count += 1;
      byService.set(service, serviceEntry);

      const dateKey = new Date(a.startAt).toISOString().slice(0, 10);
      const label = new Date(a.startAt).toLocaleDateString(undefined, { month: "short", day: "numeric" });
      const dayEntry = byDay.get(dateKey) || { date: dateKey, label, bookings: 0, revenue: 0 };
      dayEntry.bookings += 1;
      dayEntry.revenue += Number(a.total || 0);
      byDay.set(dateKey, dayEntry);
    });

    const revenue = active.reduce((sum, a) => sum + Number(a.total || 0), 0);
    const billed = invoices.reduce((sum, inv) => sum + Number(inv.total || 0), 0);
    const outstanding = invoices.reduce((sum, inv) => sum + Number(inv.amountDue || 0), 0);

    return {
      revenue,
      billed,
      outstanding,
      average: active.length ? revenue / active.length : 0,
      byService: Array.from(byService.values()).sort((a, b) => b.revenue - a.revenue),
      byStatus: Array.from(byStatus.entries()).map(([name, value]) => ({ name, value })),
      byDay: Array.from(byDay.values()).sort((a, b) => a.date.localeCompare(b.date)),
    };
  }, [appointments, invoices]);

  const outstandingByClient = useMemo(() => {
    const map = new Map();
    invoices
      .filter((inv) => Number(inv.amountDue || 0) > 0)
      .forEach((inv) => {
        const entry = map.get(inv.clientName) || { clientName: inv.clientName, due: 0, invoices: 0 };
        entry.due += Number(inv.amountDue || 0);
        entry.invoices += 1;
        map.set(inv.clientName, entry);
      });
    return Array.from(map.values()).sort((a, b) => b.due - a.due);
  }, [invoices]);

  return (
    <section className="space-y-5">
      <PageHeader
        eyebrow="Insights"
        title="Reports"
        description="Revenue, booking, and service performance derived from current appointments and invoices."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard tone="primary" label="Booked revenue" value={money(report.revenue)} sublabel="Confirmed + pending + completed" />
        <MetricCard label="Invoiced" value={money(report.billed)} sublabel={`${invoices.length} invoices`} />
        <MetricCard label="Outstanding" value={money(report.outstanding)} tone="warning" sublabel="Open balance across invoices" />
        <MetricCard label="Average ticket" value={money(report.average)} sublabel="Per active booking" />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Bookings over time</CardTitle>
            <CardDescription>Appointment volume by date, Sept 4–28.</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={report.byDay} margin={{ top: 4, right: 12, left: -12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
                  <XAxis dataKey="label" tick={tickStyle} axisLine={{ stroke: GRID }} tickLine={false} interval={1} />
                  <YAxis tick={tickStyle} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: 8, border: `1px solid ${GRID}`, fontSize: 12 }}
                    formatter={(value) => [value, "Bookings"]}
                  />
                  <Line type="monotone" dataKey="bookings" stroke={PRIMARY} strokeWidth={2.5} dot={{ r: 3, fill: PRIMARY }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue over time</CardTitle>
            <CardDescription>Booking value by date, excluding cancellations.</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={report.byDay} margin={{ top: 4, right: 12, left: -8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
                  <XAxis dataKey="label" tick={tickStyle} axisLine={{ stroke: GRID }} tickLine={false} interval={1} />
                  <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} width={40} />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: 8, border: `1px solid ${GRID}`, fontSize: 12 }}
                    formatter={(value) => [money(value), "Revenue"]}
                  />
                  <Bar dataKey="revenue" fill={PRIMARY_LIGHT} radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue by service</CardTitle>
            <CardDescription>Which services drive the most booked revenue.</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={report.byService} layout="vertical" margin={{ top: 4, right: 20, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID} horizontal={false} />
                  <XAxis type="number" tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                  <YAxis dataKey="name" type="category" tick={tickStyle} axisLine={false} tickLine={false} width={110} />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: 8, border: `1px solid ${GRID}`, fontSize: 12 }}
                    formatter={(value) => [money(value), "Revenue"]}
                  />
                  <Bar dataKey="revenue" radius={[0, 4, 4, 0]} maxBarSize={22}>
                    {report.byService.map((entry, index) => (
                      <Cell key={entry.name} fill={SERVICE_COLORS[index % SERVICE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Booking status breakdown</CardTitle>
            <CardDescription>All {appointments.length} bookings on file.</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64 flex items-center gap-4">
              <ResponsiveContainer width="60%" height="100%">
                <PieChart>
                  <Pie data={report.byStatus} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                    {report.byStatus.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || NAVY} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: 8, border: `1px solid ${GRID}`, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <ul className="space-y-1.5 text-sm">
                {report.byStatus.map((entry) => (
                  <li key={entry.name} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[entry.name] || NAVY }} />
                    <span className="capitalize text-foreground">{entry.name}</span>
                    <span className="text-muted-foreground">({entry.value})</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Outstanding balances by client</CardTitle>
          <CardDescription>Clients with an open invoice balance, highest first.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {outstandingByClient.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No open balances — everything is paid up.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Open invoices</TableHead>
                  <TableHead className="text-right">Balance due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outstandingByClient.map((row) => (
                  <TableRow key={row.clientName}>
                    <TableCell className="font-medium text-foreground">{row.clientName}</TableCell>
                    <TableCell className="text-muted-foreground">{row.invoices}</TableCell>
                    <TableCell className="text-right tabular-nums text-warning font-medium">{money(row.due)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
