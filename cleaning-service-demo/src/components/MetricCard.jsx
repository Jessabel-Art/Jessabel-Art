// Shared operational metric tile — dashboards (admin + client) compose
// these so every "number in a box" across the app shares one visual
// language instead of each screen inventing its own card treatment.
import React from "react";
import { cn } from "@/lib/utils";

const TONE_STYLES = {
  default: "bg-card border-border",
  primary: "bg-navy-900 border-navy-900 text-white",
  success: "bg-success-bg border-success/20",
  warning: "bg-warning-bg border-warning/20",
};

export default function MetricCard({ label, value, sublabel, icon: Icon, tone = "default", className }) {
  const isDark = tone === "primary";
  return (
    <div
      className={cn(
        "rounded-xl border p-4 sm:p-5 shadow-card flex items-start justify-between gap-3",
        TONE_STYLES[tone] || TONE_STYLES.default,
        className,
      )}
    >
      <div className="min-w-0">
        <p className={cn("text-xs font-medium uppercase tracking-wide", isDark ? "text-white/60" : "text-muted-foreground")}>
          {label}
        </p>
        <p className={cn("mt-1.5 font-display text-2xl font-bold tabular-nums leading-none", isDark ? "text-white" : "text-foreground")}>
          {value}
        </p>
        {sublabel ? (
          <p className={cn("mt-1.5 text-xs", isDark ? "text-white/55" : "text-muted-foreground")}>{sublabel}</p>
        ) : null}
      </div>
      {Icon ? (
        <div
          className={cn(
            "shrink-0 grid place-items-center h-9 w-9 rounded-lg",
            isDark ? "bg-white/10 text-white" : "bg-accent text-primary",
          )}
        >
          <Icon className="h-4.5 w-4.5" size={18} />
        </div>
      ) : null}
    </div>
  );
}
