// src/pages/admin/DashboardHome.jsx
import React from "react";
import {
  CalendarClock,
  DollarSign,
  Clock3,
  AlertCircle,
  Sparkles,
  Star,
  CheckCircle2,
  Wallet,
  MessageSquareText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import PageHeader from "@/components/PageHeader";
import MetricCard from "@/components/MetricCard";
import StatusPill from "@/components/StatusPill";
import { money } from "./utils";
import { getAllDemoAppointments, getAllDemoInvoices } from "@/data/demoRuntime";
import { reviews, getReviewSummary, formatRelativeDate } from "@/lib/reviews";

// This is a static portfolio demo pinned to 2026-09-18 — never Date.now().
const TODAY = new Date("2026-09-18T08:00:00");

function startOfDay(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatDateShort(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const STATUS_TONE = {
  confirmed: "bg-primary",
  pending: "bg-warning",
  completed: "bg-success",
  cancelled: "bg-destructive",
};

const ACTIVITY_STYLES = {
  request: { icon: Clock3, wrap: "bg-warning-bg" },
  completed: { icon: CheckCircle2, wrap: "bg-success-bg" },
  payment: { icon: Wallet, wrap: "bg-accent" },
  review: { icon: MessageSquareText, wrap: "bg-accent" },
};

export default function DashboardHome({ onChangeView }) {
  const appointments = React.useMemo(() => getAllDemoAppointments(), []);
  const invoices = React.useMemo(() => getAllDemoInvoices(), []);
  const reviewSummary = React.useMemo(() => getReviewSummary(reviews), []);

  const analytics = React.useMemo(() => {
    const windowStart = startOfDay(TODAY);
    const windowEnd = new Date(windowStart);
    windowEnd.setDate(windowEnd.getDate() + 6);
    windowEnd.setHours(23, 59, 59, 999);

    const weekAppointments = appointments
      .filter((a) => {
        const when = new Date(a.startAt);
        return when >= windowStart && when <= windowEnd;
      })
      .sort((a, b) => new Date(a.startAt) - new Date(b.startAt));

    const weekRevenue = weekAppointments
      .filter((a) => a.status !== "cancelled")
      .reduce((sum, a) => sum + Number(a.total || 0), 0);

    const pendingRequests = appointments.filter((a) => a.status === "pending");

    const statusCounts = appointments.reduce((acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    }, {});

    const nextAppointment = appointments
      .filter((a) => new Date(a.startAt) >= TODAY && a.status !== "cancelled")
      .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))[0] || null;

    const outstandingBalance = invoices.reduce((sum, inv) => sum + Number(inv.amountDue || 0), 0);
    const openInvoiceCount = invoices.filter((inv) => Number(inv.amountDue || 0) > 0).length;

    const serviceMap = new Map();
    appointments
      .filter((a) => a.status !== "cancelled")
      .forEach((a) => {
        const key = a.serviceName || "Other";
        const entry = serviceMap.get(key) || { name: key, count: 0, revenue: 0 };
        entry.count += 1;
        entry.revenue += Number(a.total || 0);
        serviceMap.set(key, entry);
      });
    const topServices = Array.from(serviceMap.values()).sort((a, b) => b.revenue - a.revenue);

    const recentPayments = invoices
      .filter((inv) => Number(inv.paidAmount || 0) > 0)
      .sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate))
      .slice(0, 5);

    const activity = [
      ...pendingRequests.map((a) => ({
        type: "request",
        timestamp: a.startAt,
        text: `${a.clientName} requested ${a.serviceName} for ${formatDateShort(a.startAt)}`,
      })),
      ...appointments
        .filter((a) => a.status === "completed")
        .map((a) => ({
          type: "completed",
          timestamp: a.startAt,
          text: `Completed ${a.serviceName} for ${a.clientName} — ${money(a.total)}`,
        })),
      ...recentPayments.map((inv) => ({
        type: "payment",
        timestamp: inv.issueDate,
        text: `${inv.clientName} paid ${money(inv.paidAmount)} (${inv.paymentMethod})`,
      })),
      ...reviews.map((r) => ({
        type: "review",
        timestamp: r.date,
        text: `${r.name} left a ${r.rating}-star review for ${r.service}`,
      })),
    ]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 8);

    return {
      weekAppointments,
      weekRevenue,
      pendingRequests,
      statusCounts,
      nextAppointment,
      outstandingBalance,
      openInvoiceCount,
      topServices,
      recentPayments,
      activity,
    };
  }, [appointments, invoices]);

  const goTo = (view) => () => onChangeView && onChangeView(view);
  const totalBookings = appointments.length;

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Operations"
        title="Dashboard"
        description="Live snapshot of this week's schedule, revenue, and outstanding work — derived from current bookings and invoices."
        actions={
          <>
            <Button size="sm" onClick={goTo("bookings")}>
              View bookings
            </Button>
            <Button size="sm" variant="outline" onClick={goTo("calendar")}>
              Open calendar
            </Button>
            <Button size="sm" variant="outline" onClick={goTo("reports")}>
              Full reports
            </Button>
          </>
        }
      />

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          tone="primary"
          icon={DollarSign}
          label="Upcoming revenue (7 days)"
          value={money(analytics.weekRevenue)}
          sublabel={`Confirmed + pending, ${formatDateShort(analytics.weekAppointments[0]?.startAt || TODAY)}–${formatDateShort(
            new Date(startOfDay(TODAY).getTime() + 6 * 86400000)
          )}`}
        />
        <MetricCard
          icon={CalendarClock}
          label="Bookings this week"
          value={analytics.weekAppointments.length}
          sublabel={`${totalBookings} total on the books`}
        />
        <MetricCard
          tone="warning"
          icon={Clock3}
          label="Pending requests"
          value={analytics.pendingRequests.length}
          sublabel="Awaiting your approval"
        />
        <MetricCard
          icon={AlertCircle}
          label="Outstanding balance"
          value={money(analytics.outstandingBalance)}
          sublabel={`${analytics.openInvoiceCount} open invoices`}
        />
      </div>

      {/* Schedule + status/services */}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr),minmax(0,1fr)]">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">This week's schedule</CardTitle>
            <CardDescription>
              {analytics.weekAppointments.length
                ? `${analytics.weekAppointments.length} appointments scheduled Sep 18–24.`
                : "Nothing scheduled in the next 7 days."}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {analytics.weekAppointments.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No bookings in this window yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>When</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.weekAppointments.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="whitespace-nowrap text-sm">{formatDateTime(a.startAt)}</TableCell>
                      <TableCell className="font-medium">{a.clientName}</TableCell>
                      <TableCell className="text-muted-foreground">{a.serviceName}</TableCell>
                      <TableCell>
                        <StatusPill status={a.status} />
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{money(a.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Booking status</CardTitle>
              <CardDescription>All {totalBookings} bookings on file.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {["confirmed", "pending", "completed", "cancelled"].map((key) => {
                const count = analytics.statusCounts[key] || 0;
                const pct = totalBookings ? Math.round((count / totalBookings) * 100) : 0;
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="capitalize text-foreground">{key}</span>
                      <span className="text-muted-foreground tabular-nums">{count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${STATUS_TONE[key] || "bg-muted-foreground"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Top services</CardTitle>
              <CardDescription>By revenue, excluding cancellations.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {analytics.topServices.map((service) => (
                <div key={service.name} className="flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-foreground">{service.name}</p>
                    <p className="text-xs text-muted-foreground">{service.count} bookings</p>
                  </div>
                  <span className="tabular-nums text-foreground">{money(service.revenue)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payments + reviews */}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr),minmax(0,1fr)]">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent payments</CardTitle>
            <CardDescription>Most recent deposits and payments on invoices.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {analytics.recentPayments.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No payments recorded yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Paid</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.recentPayments.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">{inv.clientName}</TableCell>
                      <TableCell className="text-muted-foreground">{inv.invoiceNumber}</TableCell>
                      <TableCell className="text-muted-foreground">{inv.paymentMethod}</TableCell>
                      <TableCell className="text-right tabular-nums">{money(inv.paidAmount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-4 w-4 fill-warning text-warning" />
              Customer reviews
            </CardTitle>
            <CardDescription>
              {reviewSummary.average.toFixed(1)} average across {reviewSummary.count} reviews.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {[...reviews]
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 3)
              .map((review) => (
                <div key={review.id} className="border-b border-border last:border-0 pb-3 last:pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-sm text-foreground">{review.name}</p>
                    <span className="text-xs text-muted-foreground">{formatRelativeDate(review.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 mb-1">
                    <span className="inline-flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < review.rating ? "fill-warning text-warning" : "text-muted"}`}
                        />
                      ))}
                    </span>
                    <span className="text-xs text-muted-foreground">{review.service}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{review.body}</p>
                </div>
              ))}
            <Button variant="outline" size="sm" className="w-full" onClick={goTo("reviews")}>
              View all reviews
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Activity feed */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Recent activity
          </CardTitle>
          <CardDescription>Booking requests, completed jobs, payments, and reviews, most recent first.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-3">
            {analytics.activity.map((item, index) => {
              const style = ACTIVITY_STYLES[item.type];
              const Icon = style.icon;
              return (
                <li key={`${item.type}-${index}`} className="flex items-start gap-3 text-sm">
                  <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${style.wrap}`}>
                    <Icon className="h-3.5 w-3.5 text-foreground" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground">{item.text}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                    {formatDateShort(item.timestamp)}
                  </span>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
