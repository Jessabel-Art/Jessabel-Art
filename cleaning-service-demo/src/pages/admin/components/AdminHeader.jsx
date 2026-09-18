// src/pages/admin/components/AdminHeader.jsx
import React, { useContext } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { AdminUIContext } from "../context/AdminUIContext";
import { useAuth } from "@/context/AuthContext";

const VIEW_TITLES = {
  dashboard: "Dashboard",
  bookings: "Bookings",
  calendar: "Calendar",
  clients: "Clients",
  payments: "Payments & Deposits",
  reviews: "Reviews",
  reports: "Reports",
  maintenance: "Maintenance",
};

const VIEW_SUBTITLES = {
  dashboard: "Today's operational summary",
  bookings: "Manage upcoming and past appointments",
  calendar: "Crew schedule across all bookings",
  clients: "Customer records and history",
  payments: "Deposits, invoices, and open balances",
  reviews: "Customer reputation and feedback",
  reports: "Revenue and operational trends",
  maintenance: "Local demo data and system status",
};

const AdminHeader = ({ activeView, user }) => {
  const { mobileMenuOpen, setMobileMenuOpen } = useContext(AdminUIContext);
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  const initial = (user?.displayName || user?.email || user?.username || "A")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <header className="w-full bg-card border-b border-border px-4 py-3 sm:px-6 lg:px-8 lg:py-4 flex items-center justify-between gap-3 sticky top-0 z-20">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-lg text-foreground hover:bg-secondary transition-colors shrink-0"
          title="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="min-w-0">
          <h1 className="font-display text-lg sm:text-xl font-bold text-foreground leading-tight truncate">
            {VIEW_TITLES[activeView] || "Dashboard"}
          </h1>
          <p className="hidden sm:block text-xs text-muted-foreground truncate">
            {VIEW_SUBTITLES[activeView] || "CleanPro Demo admin"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden md:flex flex-col text-right leading-tight">
          <span className="text-sm font-semibold text-foreground">
            {user?.displayName || user?.email || user?.username || "Admin"}
          </span>
          <span className="text-[11px] text-muted-foreground">Administrator</span>
        </div>

        <div className="hidden sm:grid h-9 w-9 place-items-center rounded-full bg-navy-900 text-white text-sm font-semibold">
          {initial}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
          title="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
