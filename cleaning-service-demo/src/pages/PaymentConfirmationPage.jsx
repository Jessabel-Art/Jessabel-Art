import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentConfirmationPage() {
  const [search] = useSearchParams();
  const cancelled = search.get("cancelled") === "1";

  return (
    <div className="min-h-[80vh] bg-background px-4 py-16 flex items-center justify-center">
      <Card className="max-w-xl w-full text-center">
        <CardHeader>
          <div
            className={`mx-auto h-14 w-14 rounded-full flex items-center justify-center ${
              cancelled ? "bg-warning-bg" : "bg-success-bg"
            }`}
          >
            {cancelled ? (
              <XCircle className="w-8 h-8 text-warning" />
            ) : (
              <CheckCircle2 className="w-8 h-8 text-success" />
            )}
          </div>
          <CardTitle className="text-foreground">
            {cancelled ? "Demo payment cancelled" : "Demo payment complete"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            This is a frontend-only demonstration. No card was charged and no
            payment processor was contacted.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link to="/payment-center">Payment Center</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/portal">Client Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
