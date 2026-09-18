import React from "react";
import { BadgeDollarSign, DollarSign, Info, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PaymentInstructions = ({ paymentInfo }) => {
  const P = paymentInfo || {};
  const depositAmount = Number.isFinite(Number(P.depositAmount))
    ? Number(P.depositAmount)
    : 50;

  return (
    <Card id="payment-instructions">
      <CardHeader className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BadgeDollarSign className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-foreground">
              Payment &amp; deposit details
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Demo-only payment instructions. No money is collected.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 text-sm text-muted-foreground">
        <div className="rounded-lg bg-secondary border border-border p-4 space-y-2">
          <p className="text-sm text-foreground">
            New clients are shown a{" "}
            <strong className="tabular-nums">${depositAmount.toFixed(2)} demo deposit</strong> to
            illustrate the booking flow. In this frontend demo, the deposit is
            never charged or stored.
          </p>
          <p className="text-xs text-muted-foreground">
            Invoice balances and payment statuses are calculated from local
            sample data.
          </p>
        </div>

        {P.cashApp !== false && (
          <Row
            icon={DollarSign}
            title="Cash App"
            text={`Demo handle: ${P.cashApp || "$cleanprodemo"}`}
          />
        )}

        {P.zelle !== false && (
          <Row
            icon={Mail}
            title="Zelle"
            text={`Demo recipient: ${
              P.zelle || "(000) 000-0000 (recipient: CleanPro Demo)"
            }`}
          />
        )}

        {P.cash && (
          <Row
            icon={DollarSign}
            title="Cash at time of service"
            text="Displayed as an available demo payment option only."
          />
        )}

        <div className="rounded-md bg-accent border border-primary/15 p-3 text-sm text-foreground flex items-start gap-2">
          <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <p>
            {P.notes ||
              "This website is a demonstration environment. No real payments are performed."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const Row = ({ icon: Icon, title, text }) => (
  <div className="rounded-md border border-border bg-card p-4 flex gap-3">
    <Icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
    <div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{text}</p>
    </div>
  </div>
);

export default PaymentInstructions;
