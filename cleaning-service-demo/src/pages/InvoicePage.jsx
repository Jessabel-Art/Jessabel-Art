import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import InvoiceDocument from "@/components/invoices/InvoiceDocument";
import { getAllDemoInvoices } from "@/data/demoRuntime";

export default function InvoicePage() {
  const { invoiceId } = useParams();
  const invoices = useMemo(() => getAllDemoInvoices(), []);
  const invoice =
    invoices.find(
      (item) => item.id === invoiceId || item.invoiceNumber === invoiceId
    ) || invoices[0];

  return (
    <div className="min-h-screen bg-background px-3 py-8 sm:px-4 md:py-12 print:bg-white print:py-0">
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Demo Invoice</h1>
            <p className="text-sm text-muted-foreground">
              Rendered from local hardcoded demo data only. Linkable and printable.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-1.5" />
              Print
            </Button>
            <Button asChild variant="outline">
              <Link to="/payment-center">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Back to payment center
              </Link>
            </Button>
          </div>
        </div>

        <InvoiceDocument invoice={invoice} />
      </div>
    </div>
  );
}
