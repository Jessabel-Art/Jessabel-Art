import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import AdminHeader from "./components/AdminHeader";
import AdminSidebar from "./components/AdminSidebar";
import DashboardHome from "./DashboardHome";
import BookingsView from "./BookingsView";
import CalendarView from "./CalendarView";
import ReviewsView from "./ReviewsView";
import ReportsView from "./ReportsView";
import MaintenanceView from "./MaintenanceView";
import ClientsView from "./ClientsView";
import AdminPaymentsPage from "./AdminPaymentsPage";
import { AdminUIProvider } from "./context/AdminUIContext";

const AdminDashboard = ({ initialView = "dashboard" }) => {
  const { user } = useAuth();
  const location = useLocation();
  const forcedView =
    location.state?.activeView || location.state?.initialView || null;
  const [activeView, setActiveView] = useState(
    forcedView || initialView || "dashboard"
  );

  useEffect(() => {
    if (forcedView && forcedView !== activeView) setActiveView(forcedView);
  }, [forcedView, activeView]);

  const renderView = () => {
    switch (activeView) {
      case "bookings":
        return <BookingsView />;
      case "calendar":
        return <CalendarView />;
      case "clients":
        return <ClientsView />;
      case "reviews":
        return <ReviewsView />;
      case "reports":
        return <ReportsView />;
      case "maintenance":
        return <MaintenanceView />;
      case "payments":
        return <AdminPaymentsPage embedded onChangeView={setActiveView} />;
      default:
        return <DashboardHome onChangeView={setActiveView} />;
    }
  };

  return (
    <AdminUIProvider>
      <div className="min-h-screen flex bg-muted/40">
        <AdminSidebar activeView={activeView} onChangeView={setActiveView} />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader activeView={activeView} user={user} />
          <main className="flex-1 px-4 sm:px-6 py-5 sm:py-6 lg:px-10 lg:py-8 bg-muted/40 max-w-[1400px] w-full mx-auto">
            {renderView()}
          </main>
        </div>
      </div>
    </AdminUIProvider>
  );
};

export default AdminDashboard;
