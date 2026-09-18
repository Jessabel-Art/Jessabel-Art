import React from "react";
import logoPrimary from "@/assets/logo/logo-primary.png";
import StatusPill from "@/components/StatusPill";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const money = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "--"
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
}

export default function InvoiceDocument({ invoice }) {
  if (!invoice) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
        No demo invoice selected.
      </div>
    );
  }

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <div className="border-t-4 border-navy-900 p-5 sm:p-7">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <img src={logoPrimary} alt="CleanPro Demo" className="h-12 w-auto" />
            <div>
              <p className="text-lg font-semibold text-foreground">CleanPro Demo</p>
              <p className="text-xs text-muted-foreground">Professional Cleaning Services</p>
            </div>
          </div>

          <div className="rounded-lg bg-secondary px-4 py-3 text-sm text-foreground sm:text-right space-y-1">
            <p className="font-semibold">{invoice.invoiceNumber}</p>
            <p className="text-muted-foreground">Created {formatDate(invoice.createdAt || invoice.issueDate)}</p>
            <p className="text-muted-foreground">Due {formatDate(invoice.dueDate)}</p>
            <div className="sm:flex sm:justify-end pt-1">
              <StatusPill status={invoice.paymentStatus} />
            </div>
          </div>
        </header>

        <div className="my-7 flex items-center justify-between">
          <h1 className="text-2xl font-bold uppercase tracking-wide text-foreground font-display">
            Invoice
          </h1>
          <p className="hidden sm:block text-sm text-muted-foreground tabular-nums">
            Amount due:{" "}
            <span className="font-display text-lg font-bold text-foreground">
              {money(invoice.amountDue)}
            </span>
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-2">
          <InfoBlock title="Bill To">
            <p className="font-semibold text-foreground">{invoice.clientName}</p>
            <p>{invoice.clientAddress}</p>
          </InfoBlock>

          <InfoBlock title="Appointment">
            <Detail label="Service" value={invoice.serviceName} />
            <Detail
              label="Date / Time"
              value={`${formatDate(invoice.appointmentDate)} at ${invoice.appointmentTime}`}
            />
            <Detail label="Frequency" value={invoice.frequency} />
            <Detail label="Status" value={invoice.status} />
            <Detail label="Service address" value={invoice.serviceAddress} />
          </InfoBlock>
        </section>

        <section className="mt-7 overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-navy-900 hover:bg-navy-900 border-navy-900">
                <TableHead className="text-white/80">Description</TableHead>
                <TableHead className="text-right text-white/80">Qty</TableHead>
                <TableHead className="text-right text-white/80">Unit</TableHead>
                <TableHead className="text-right text-white/80">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(invoice.lineItems || []).map((item) => (
                <TableRow key={item.label || item.description}>
                  <TableCell className="text-foreground">{item.label || item.description}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{item.quantity}</TableCell>
                  <TableCell className="text-right text-muted-foreground tabular-nums">
                    {money(item.unitPrice)}
                  </TableCell>
                  <TableCell className="text-right font-medium text-foreground tabular-nums">
                    {money(item.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <InfoBlock title="Payment Details">
              <Detail label="Payment status" value={invoice.paymentStatus} />
              <Detail label="Payment method" value={invoice.paymentMethod} />
            </InfoBlock>

            <InfoBlock title="Notes For Cleaner">
              <p>{invoice.cleanerNotes}</p>
            </InfoBlock>

            <InfoBlock title="Terms And Conditions">
              <p>{invoice.terms}</p>
            </InfoBlock>
          </div>

          <div className="h-fit rounded-lg border border-border bg-secondary p-4 text-sm">
            <TotalRow label="Subtotal" value={invoice.subtotal} />
            {invoice.discount > 0 && (
              <TotalRow label="Discount" value={-invoice.discount} tone="success" />
            )}
            <TotalRow label="Deposit received" value={invoice.depositReceived} tone="muted" />
            <TotalRow label="Amount paid" value={invoice.amountPaid ?? invoice.paidAmount} tone="muted" />
            <div className="mt-3 border-t border-border pt-3">
              <div className="flex items-center justify-between text-lg font-bold text-foreground font-display">
                <span>Amount due</span>
                <span className="tabular-nums">{money(invoice.amountDue)}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}

function InfoBlock({ title, children }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">
        {title}
      </h2>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <p>
      <span className="font-semibold text-foreground">{label}: </span>
      <span>{value || "--"}</span>
    </p>
  );
}

function TotalRow({ label, value, tone = "default" }) {
  const toneClass =
    tone === "success" ? "text-success" : tone === "muted" ? "text-muted-foreground" : "text-foreground";
  return (
    <div className="flex items-center justify-between border-b border-border py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold tabular-nums ${toneClass}`}>{money(value)}</span>
    </div>
  );
}
