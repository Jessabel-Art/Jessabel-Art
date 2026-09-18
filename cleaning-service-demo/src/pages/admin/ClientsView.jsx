// src/pages/admin/ClientsView.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronUp, ChevronDown, MapPin } from "lucide-react";
import { formatPhoneForDisplay } from "@/lib/contactModel";
import { demoClients } from "@/data/demoClients";
import { getDemoAppointmentsByClientId } from "@/data/demoAppointments";
import { getDemoInvoicesByClientId } from "@/data/demoInvoices";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import PageHeader from "@/components/PageHeader";
import MetricCard from "@/components/MetricCard";
import ClientDetailsModal from "./components/ClientDetailsModal";

// Static demo "now" — pinned to 2026-09-18, never Date.now(), so segments and
// next/last-cleaning derivations stay honest against the seeded appointments.
const TODAY = new Date("2026-09-18T08:00:00");

const money = (n) =>
  Number(n || 0).toLocaleString("en-US", { style: "currency", currency: "USD" });

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function getDisplayName(profile) {
  const candidate =
    (profile.name && profile.name.trim()) || (profile.email && String(profile.email).split("@")[0]) || "";
  return candidate ? String(candidate).trim() : "Unnamed client";
}

function formatAddressSummary(profile) {
  if (profile.addressSummary && profile.addressSummary.trim()) return profile.addressSummary.trim();
  const parts = [profile.addressLine1, profile.city, profile.state, profile.zip].filter(Boolean);
  return parts.length ? parts.join(", ") : "No address on file";
}

/** Derive per-client booking facts from the canonical appointments/invoices —
 * never hardcoded, so this stays honest as the seed data changes. */
function buildClientFacts(clientId) {
  const appointments = getDemoAppointmentsByClientId(clientId);
  const invoices = getDemoInvoicesByClientId(clientId);

  const upcoming = appointments
    .filter((a) => new Date(a.startAt) >= TODAY && a.status !== "cancelled")
    .sort((a, b) => new Date(a.startAt) - new Date(b.startAt));
  const past = appointments
    .filter((a) => new Date(a.startAt) < TODAY && a.status === "completed")
    .sort((a, b) => new Date(b.startAt) - new Date(a.startAt));
  const mostRecent = [...appointments].sort((a, b) => new Date(b.startAt) - new Date(a.startAt))[0];

  const outstandingBalance = invoices.reduce((sum, inv) => sum + Number(inv.amountDue || 0), 0);

  return {
    nextCleaning: upcoming[0] || null,
    lastCleaning: past[0] || null,
    frequency: mostRecent?.frequency || "—",
    bookingCount: appointments.length,
    outstandingBalance,
  };
}

export default function ClientsView() {
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const navigate = useNavigate();

  const facts = useMemo(() => {
    const map = new Map();
    demoClients.forEach((c) => map.set(c.id, buildClientFacts(c.id)));
    return map;
  }, []);

  const getSegments = (profile) => {
    const segs = [];
    if ((profile.ltv || 0) >= 1000) segs.push({ type: "high", label: "High value" });
    if (profile.lastBookingAt) segs.push({ type: "active", label: "Recently active" });
    const createdMs = new Date(profile.createdAt || 0).getTime();
    if (TODAY.getTime() - createdMs < 1000 * 60 * 60 * 24 * 14) segs.push({ type: "new", label: "New" });
    return segs;
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sorted = useMemo(() => {
    const arr = [...demoClients];
    arr.sort((a, b) => {
      let A = a[sortField];
      let B = b[sortField];
      if (sortField === "displayName") {
        A = getDisplayName(a);
        B = getDisplayName(b);
      } else if (sortField === "outstandingBalance") {
        A = facts.get(a.id)?.outstandingBalance || 0;
        B = facts.get(b.id)?.outstandingBalance || 0;
      } else if (sortField === "createdAt" || sortField === "lastBookingAt") {
        A = new Date(A || 0);
        B = new Date(B || 0);
      }
      if (typeof A === "string") A = A.toLowerCase();
      if (typeof B === "string") B = B.toLowerCase();
      if (A < B) return sortDir === "asc" ? -1 : 1;
      if (A > B) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [sortField, sortDir, facts]);

  const filtered = useMemo(() => {
    const s = search.toLowerCase().trim();
    if (!s) return sorted;
    return sorted.filter((p) => {
      const name = getDisplayName(p).toLowerCase();
      const email = (p.email || "").toLowerCase();
      const phone = (p.phone || "").toLowerCase();
      const addr = formatAddressSummary(p).toLowerCase();
      return name.includes(s) || email.includes(s) || phone.includes(s) || addr.includes(s);
    });
  }, [sorted, search]);

  const metrics = useMemo(() => {
    const total = demoClients.length;
    const highValue = demoClients.filter((p) => (p.ltv || 0) >= 1000).length;
    const outstanding = demoClients.reduce((sum, p) => sum + (facts.get(p.id)?.outstandingBalance || 0), 0);
    const totalLtv = demoClients.reduce((sum, p) => sum + (p.ltv || 0), 0);
    return { total, highValue, outstanding, totalLtv };
  }, [facts]);

  const sortHeader = (field, label, align = "left") => (
    <TableHead
      className={`cursor-pointer select-none hover:text-foreground ${align === "right" ? "text-right" : ""}`}
      onClick={() => toggleSort(field)}
    >
      <div className={`flex items-center gap-1 ${align === "right" ? "justify-end" : ""}`}>
        {label}
        {sortField === field && (sortDir === "asc" ? <ChevronUp size={13} /> : <ChevronDown size={13} />)}
      </div>
    </TableHead>
  );

  return (
    <section className="space-y-5">
      <PageHeader
        eyebrow="Customers"
        title="Clients"
        description={`${filtered.length} of ${metrics.total} customers shown.`}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Total clients" value={metrics.total} sublabel="On file" />
        <MetricCard label="High-value clients" value={metrics.highValue} sublabel="Lifetime value $1,000+" tone="success" />
        <MetricCard label="Outstanding balance" value={money(metrics.outstanding)} sublabel="Across all clients" tone="warning" />
      </div>

      <Input
        className="max-w-sm"
        placeholder="Search by name, email, phone, or address"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Desktop / tablet table */}
      <div className="hidden lg:block rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {sortHeader("displayName", "Client")}
              {sortHeader("addressSummary", "Address")}
              <TableHead>Frequency</TableHead>
              {sortHeader("lastBookingAt", "Last cleaning")}
              <TableHead>Next cleaning</TableHead>
              {sortHeader("ltv", "LTV", "right")}
              {sortHeader("outstandingBalance", "Balance", "right")}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => {
              const segs = getSegments(p);
              const displayName = getDisplayName(p);
              const fact = facts.get(p.id);
              return (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">{displayName}</div>
                    <div className="text-xs text-muted-foreground">{p.email}</div>
                    <div className="text-xs text-muted-foreground">{formatPhoneForDisplay(p.phone)}</div>
                    {segs.length > 0 && (
                      <div className="flex gap-1 mt-1.5 flex-wrap">
                        {segs.map((s) => (
                          <Badge key={s.label} variant={s.type === "high" ? "success" : s.type === "new" ? "default" : "secondary"}>
                            {s.label}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-56">{formatAddressSummary(p)}</TableCell>
                  <TableCell className="text-muted-foreground">{fact?.frequency}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(fact?.lastCleaning?.startAt)}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(fact?.nextCleaning?.startAt)}</TableCell>
                  <TableCell className={`text-right font-medium tabular-nums ${(p.ltv || 0) >= 1000 ? "text-success" : "text-foreground"}`}>
                    {money(p.ltv || 0)}
                  </TableCell>
                  <TableCell className={`text-right tabular-nums ${fact?.outstandingBalance ? "text-warning font-medium" : "text-muted-foreground"}`}>
                    {money(fact?.outstandingBalance || 0)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedClient(p)}>
                        View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/admin/client-bookings?clientId=${encodeURIComponent(p.id)}`)}
                      >
                        Bookings
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  No clients match this search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile / tablet stacked cards */}
      <div className="lg:hidden space-y-3">
        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">No clients match this search.</p>
        )}
        {filtered.map((p) => {
          const segs = getSegments(p);
          const displayName = getDisplayName(p);
          const fact = facts.get(p.id);
          return (
            <div key={p.id} className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-foreground">{displayName}</p>
                  <p className="text-xs text-muted-foreground">{p.email}</p>
                  <p className="text-xs text-muted-foreground">{formatPhoneForDisplay(p.phone)}</p>
                </div>
                <span className={`text-sm font-medium tabular-nums ${(p.ltv || 0) >= 1000 ? "text-success" : "text-foreground"}`}>
                  {money(p.ltv || 0)}
                </span>
              </div>
              <div className="flex items-start gap-1.5 mt-2 text-xs text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{formatAddressSummary(p)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="rounded-md bg-muted/60 p-2">
                  <p className="text-muted-foreground">Last cleaning</p>
                  <p className="text-foreground font-medium">{formatDate(fact?.lastCleaning?.startAt)}</p>
                </div>
                <div className="rounded-md bg-muted/60 p-2">
                  <p className="text-muted-foreground">Next cleaning</p>
                  <p className="text-foreground font-medium">{formatDate(fact?.nextCleaning?.startAt)}</p>
                </div>
              </div>
              {fact?.outstandingBalance > 0 && (
                <p className="mt-2 text-xs text-warning font-medium">{money(fact.outstandingBalance)} outstanding</p>
              )}
              {segs.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {segs.map((s) => (
                    <Badge key={s.label} variant={s.type === "high" ? "success" : s.type === "new" ? "default" : "secondary"}>
                      {s.label}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedClient(p)}>
                  View
                </Button>
                <Button size="sm" className="flex-1" onClick={() => navigate(`/admin/client-bookings?clientId=${encodeURIComponent(p.id)}`)}>
                  Bookings
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <ClientDetailsModal client={selectedClient} onClose={() => setSelectedClient(null)} />
    </section>
  );
}
