import React, { useMemo, useState } from "react";
import { Download, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import PageHeader from "@/components/PageHeader";
import StatusPill from "@/components/StatusPill";
import { getAllDemoAppointments } from "@/data/demoRuntime";

function money(value) {
  return Number(value || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

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

export default function BookingsView() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const rows = useMemo(() => getAllDemoAppointments(), []);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return rows
      .filter((row) => status === "all" || row.status === status)
      .filter((row) => {
        if (!needle) return true;
        return [row.clientName, row.serviceName, row.contact?.email, row.addressLine, row.status]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(needle));
      })
      .sort((a, b) => new Date(a.startAt) - new Date(b.startAt));
  }, [rows, search, status]);

  const exportCsv = () => {
    const header = ["ID", "Client", "Service", "Status", "Date", "Total", "Payment", "Address"];
    const csv = [
      header.join(","),
      ...filtered.map((row) =>
        [row.id, row.clientName, row.serviceName, row.status, formatDate(row.startAt), row.total, row.paymentStatus, row.addressLine]
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cleanpro-demo-bookings.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-5">
      <PageHeader
        eyebrow="Operations"
        title="Bookings"
        description={`${filtered.length} of ${rows.length} appointments shown, generated from local sample data.`}
        actions={
          <Button variant="outline" size="sm" onClick={exportCsv}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        }
      />

      <Card>
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                className="pl-9"
                placeholder="Search by client, service, email, or address"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="sm:w-44">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Desktop / tablet table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="whitespace-nowrap">{formatDate(row.startAt)}</TableCell>
                    <TableCell>
                      <p className="font-medium text-foreground">{row.clientName}</p>
                      <p className="text-xs text-muted-foreground">{row.contact?.email}</p>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{row.serviceName}</TableCell>
                    <TableCell>
                      <StatusPill status={row.status} />
                    </TableCell>
                    <TableCell>
                      <StatusPill status={row.paymentStatus} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{money(row.total)}</TableCell>
                    <TableCell className="text-muted-foreground max-w-64">{row.addressLine}</TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No bookings match this search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile stacked cards */}
          <div className="md:hidden space-y-3">
            {filtered.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">No bookings match this search.</p>
            )}
            {filtered.map((row) => (
              <div key={row.id} className="rounded-lg border border-border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">{row.clientName}</p>
                    <p className="text-xs text-muted-foreground">{row.serviceName}</p>
                  </div>
                  <span className="tabular-nums font-medium text-foreground">{money(row.total)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">{formatDate(row.startAt)}</p>
                <div className="flex items-start gap-1.5 mt-1 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{row.addressLine}</span>
                </div>
                <div className="flex items-center gap-2 mt-2.5">
                  <StatusPill status={row.status} />
                  <StatusPill status={row.paymentStatus} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
