import React, { useEffect, useMemo, useState } from "react";
import { CreditCard, FileText, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import StatusPill from "@/components/StatusPill";
import PaymentInstructions from "@/components/portal/PaymentInstructions";
import InvoiceDocument from "@/components/invoices/InvoiceDocument";
import { getAllDemoInvoices } from "@/data/demoRuntime";

const PAYMENT_INFO = {
  depositAmount: 50,
  cash: true,
  cashApp: "$cleanprodemo",
  zelle: "(904) 555-0100 (recipient: CleanPro Demo)",
  notes: "Please include your full name in the payment note. (Demo only.)",
};

const money = (n) =>
  Number(n || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "--" : date.toLocaleDateString();
}

export default function PaymentCenterPage({ initialInvoiceId = "" }) {
  const invoices = useMemo(() => getAllDemoInvoices(), []);
  const [selectedId, setSelectedId] = useState(initialInvoiceId || invoices[0]?.id || "");
  const selected = invoices.find((invoice) => invoice.id === selectedId) || invoices[0];

  useEffect(() => {
    if (initialInvoiceId) setSelectedId(initialInvoiceId);
  }, [initialInvoiceId]);

  return (
    <div className="min-h-[70vh] bg-background">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader
        eyebrow="Billing"
        title="Payment Center"
        description="Local demo invoices only. No payments are processed."
      />

      <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)] items-start">
        <Card className="h-fit lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2 text-base">
              <CreditCard className="w-4.5 h-4.5 text-primary" size={18} />
              Invoices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {invoices.map((invoice) => {
              const isSelected = selected?.id === invoice.id;
              return (
                <button
                  type="button"
                  key={invoice.id}
                  onClick={() => setSelectedId(invoice.id)}
                  className={`w-full text-left rounded-lg border p-3 transition-colors ${
                    isSelected
                      ? "border-primary bg-accent"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">
                        {invoice.invoiceNumber}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{invoice.serviceName}</p>
                      <p className="text-[11px] text-muted-foreground/80 mt-0.5 truncate">
                        {invoice.clientName} · Due {formatDate(invoice.dueDate)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-foreground text-sm tabular-nums">
                        {money(invoice.total)}
                      </p>
                      <StatusPill status={invoice.paymentStatus} className="mt-1" />
                    </div>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <div className="space-y-5 min-w-0">
          <InvoiceDocument invoice={selected} />

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2 text-base">
                <FileText className="w-4.5 h-4.5 text-primary" size={18} />
                Invoice details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {selected ? (
                <>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <Detail label="Invoice" value={selected.invoiceNumber} />
                    <Detail label="Client" value={selected.clientName} />
                    <Detail label="Issue date" value={formatDate(selected.createdAt || selected.issueDate)} />
                    <Detail label="Due date" value={formatDate(selected.dueDate)} />
                  </div>

                  <div className="border-t border-border pt-3 space-y-2">
                    {selected.lineItems.map((item) => (
                      <div key={item.label} className="flex justify-between gap-3 text-foreground">
                        <span>{item.label}</span>
                        <span className="tabular-nums">{money(item.amount)}</span>
                      </div>
                    ))}
                    {selected.discount > 0 && (
                      <div className="flex justify-between gap-3 text-success">
                        <span>Recurring service discount</span>
                        <span className="tabular-nums">-{money(selected.discount)}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border pt-3 space-y-1.5 text-foreground">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="tabular-nums">{money(selected.subtotal)}</span>
                    </div>
                    {selected.depositReceived > 0 && (
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Deposit received</span>
                        <span className="tabular-nums">-{money(selected.depositReceived)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Paid</span>
                      <span className="tabular-nums">{money(selected.amountPaid ?? selected.paidAmount)}</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t border-border">
                      <span>Total</span>
                      <span className="tabular-nums">{money(selected.total)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="font-display text-base font-bold">Amount due</span>
                      <span className="font-display text-lg font-bold tabular-nums">
                        {money(selected.amountDue)}
                      </span>
                    </div>
                  </div>

                  <Button className="w-full" disabled>
                    <Lock className="w-4 h-4 mr-1.5" />
                    Demo payment disabled
                  </Button>
                </>
              ) : (
                <p className="text-muted-foreground">No demo invoice selected.</p>
              )}
            </CardContent>
          </Card>

          <PaymentInstructions paymentInfo={PAYMENT_INFO} />
        </div>
      </div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground truncate">{value}</p>
    </div>
  );
}
