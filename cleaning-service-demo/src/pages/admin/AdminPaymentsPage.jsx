import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Download, Search } from "lucide-react";
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
import MetricCard from "@/components/MetricCard";
import StatusPill from "@/components/StatusPill";
import { getAllDemoInvoices } from "@/data/demoRuntime";

const money = (n) =>
  Number(n || 0).toLocaleString("en-US", { style: "currency", currency: "USD" });

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "--" : date.toLocaleDateString();
}

// eslint-disable-next-line no-unused-vars
export default function AdminPaymentsPage({ embedded, onChangeView }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const invoices = useMemo(() => getAllDemoInvoices(), []);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return invoices
      .filter((invoice) => status === "all" || invoice.status.toLowerCase() === status)
      .filter((invoice) => {
        if (!needle) return true;
        return [invoice.invoiceNumber, invoice.clientName, invoice.serviceName, invoice.status]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(needle));
      });
  }, [invoices, search, status]);

  // Every total here is summed straight from demoInvoices, so this panel
  // always reconciles with the ledger rows shown below and with the client
  // Payment Center, which reads the same canonical invoice records.
  const totals = useMemo(
    () => ({
      billed: invoices.reduce((sum, invoice) => sum + Number(invoice.total || 0), 0),
      paid: invoices.reduce((sum, invoice) => sum + Number(invoice.paidAmount || 0), 0),
      due: invoices.reduce((sum, invoice) => sum + Number(invoice.amountDue || 0), 0),
      paidInFull: invoices.filter((invoice) => invoice.status === "Paid").length,
    }),
    [invoices]
  );

  const exportCsv = () => {
    const rows = [
      ["Invoice", "Client", "Service", "Status", "Issue Date", "Total", "Paid", "Due"],
      ...filtered.map((invoice) => [
        invoice.invoiceNumber,
        invoice.clientName,
        invoice.serviceName,
        invoice.status,
        formatDate(invoice.issueDate),
        invoice.total,
        invoice.paidAmount,
        invoice.amountDue,
      ]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cleanpro-demo-invoices.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-5">
      <PageHeader
        eyebrow="Finance"
        title="Payments & invoices"
        description={`${filtered.length} of ${invoices.length} invoices shown, derived from local demo bookings.`}
        actions={
          <Button variant="outline" size="sm" onClick={exportCsv}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total billed" value={money(totals.billed)} sublabel={`${invoices.length} invoices`} />
        <MetricCard label="Collected" value={money(totals.paid)} tone="success" sublabel={`${totals.paidInFull} paid in full`} />
        <MetricCard label="Open balance" value={money(totals.due)} tone="warning" sublabel="Deposits + balances due" />
        <MetricCard
          label="Collection rate"
          value={totals.billed ? `${Math.round((totals.paid / totals.billed) * 100)}%` : "—"}
          sublabel="Paid of total billed"
        />
      </div>

      <Card>
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                className="pl-9"
                placeholder="Search invoices, clients, or services"
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
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Desktop / tablet table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right">Due</TableHead>
                  <TableHead className="text-right">Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium text-foreground">
                      {invoice.invoiceNumber}
                      <p className="text-xs text-muted-foreground font-normal">{formatDate(invoice.issueDate)}</p>
                    </TableCell>
                    <TableCell className="text-foreground">{invoice.clientName}</TableCell>
                    <TableCell className="text-muted-foreground">{invoice.serviceName}</TableCell>
                    <TableCell>
                      <StatusPill status={invoice.status} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{money(invoice.total)}</TableCell>
                    <TableCell className="text-right tabular-nums">{money(invoice.paidAmount)}</TableCell>
                    <TableCell className={`text-right tabular-nums ${invoice.amountDue > 0 ? "text-warning font-medium" : ""}`}>
                      {money(invoice.amountDue)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/invoices/${invoice.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No invoices match this search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile stacked cards */}
          <div className="md:hidden space-y-3">
            {filtered.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">No invoices match this search.</p>
            )}
            {filtered.map((invoice) => (
              <div key={invoice.id} className="rounded-lg border border-border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">{invoice.invoiceNumber}</p>
                    <p className="text-xs text-muted-foreground">{invoice.clientName}</p>
                  </div>
                  <StatusPill status={invoice.status} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{invoice.serviceName} · {formatDate(invoice.issueDate)}</p>
                <div className="grid grid-cols-3 gap-2 mt-2.5 text-xs">
                  <div>
                    <p className="text-muted-foreground">Total</p>
                    <p className="font-medium text-foreground tabular-nums">{money(invoice.total)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Paid</p>
                    <p className="font-medium text-foreground tabular-nums">{money(invoice.paidAmount)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Due</p>
                    <p className={`font-medium tabular-nums ${invoice.amountDue > 0 ? "text-warning" : "text-foreground"}`}>
                      {money(invoice.amountDue)}
                    </p>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline" className="w-full mt-3">
                  <Link to={`/invoices/${invoice.id}`}>View invoice</Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
