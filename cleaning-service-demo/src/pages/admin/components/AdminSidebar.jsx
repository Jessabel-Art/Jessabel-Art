// src/pages/admin/components/AdminSidebar.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AdminUIContext } from "../context/AdminUIContext";
import logo from "@/assets/logo/logo-primary-white.png";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Users,
  MessageCircle,
  Wrench,
  CreditCard,
  BarChart3,
  ArrowLeft,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "bookings", label: "Bookings", icon: ClipboardList },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "clients", label: "Clients", icon: Users },
  { id: "payments", label: "Payments & Deposits", icon: CreditCard },
  { id: "reviews", label: "Reviews", icon: MessageCircle },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "maintenance", label: "Maintenance", icon: Wrench },
];

function NavList({ activeView, onSelect }) {
  return (
    <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            aria-current={isActive ? "page" : undefined}
            className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-white/10 text-white"
                : "text-navy-100/70 hover:bg-white/5 hover:text-white"
            }`}
            style={{ color: isActive ? "#fff" : undefined }}
          >
            <span
              className={`absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-blue-400 transition-opacity ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden="true"
            />
            <Icon className="w-4 h-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default function AdminSidebar({ activeView, onChangeView }) {
  const { mobileMenuOpen, setMobileMenuOpen } = useContext(AdminUIContext);

  const handleNavClick = (viewId) => {
    onChangeView(viewId);
    setMobileMenuOpen(false);
  };

  const Brand = (
    <div className="px-5 py-6 border-b border-white/10">
      <img src={logo} alt="CleanPro Demo" className="h-9 w-auto" />
      <div className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-300/80">
        Operations
      </div>
    </div>
  );

  const ReturnLink = (
    <div className="px-3 py-4 border-t border-white/10">
      <Link
        to="/"
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-navy-100/60 hover:bg-white/5 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to public site
      </Link>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 bg-navy-900 border-r border-white/10">
        {Brand}
        <NavList activeView={activeView} onSelect={handleNavClick} />
        {ReturnLink}
      </aside>

      {/* Mobile menu backdrop */}
      {mobileMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-navy-950/60 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close admin navigation menu"
        />
      )}

      {/* Mobile drawer menu */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-72 bg-navy-900 flex flex-col z-40 lg:hidden transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {Brand}
        <NavList activeView={activeView} onSelect={handleNavClick} />
        {ReturnLink}
      </aside>
    </>
  );
}
