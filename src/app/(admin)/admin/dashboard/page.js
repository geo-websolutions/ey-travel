"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { RecentTours } from "@/components/admin/RecentTours";
import { QuickActions } from "@/components/admin/QuickActions";
import { ToursList } from "@/components/admin/ToursList";
import { TourFormPlaceholder } from "@/components/admin/TourFormPlaceholder";
import BookingsView from "@/components/admin/BookingsView";
import { AnalyticsView } from "@/components/admin/AnalyticsView";
import EmailTemplates from "@/components/admin/EmailTemplates";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [tours, setTours] = useState([]);

  useEffect(() => {
    const collectionRef = collection(db, "tours");
    const q = query(collectionRef, orderBy("basicInfo.createdAt", "desc"));

    // Create the snapshot listener
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const recentTours = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTours(recentTours);
      },
      (error) => {
        console.error("Error in snapshot listener:", error);
      }
    );

    // Cleanup function to unsubscribe when component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-stone-900 text-stone-200 lg:flex">
      {/* Sidebar Navigation */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Dashboard Header */}
        <AdminHeader activeTab={activeTab} />

        {/* Dashboard Content */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <DashboardStats tours={tours} />

            {/* Recent Tours */}
            <RecentTours tours={tours} setActiveTab={setActiveTab} />

            {/* Quick Actions */}
            <QuickActions setActiveTab={setActiveTab} />
          </div>
        )}

        {/* Tours List View */}
        {activeTab === "tours" && (
          <div className="space-y-8">
            <ToursList tours={tours} setActiveTab={setActiveTab} />
          </div>
        )}

        {/* New Tour Form */}
        {activeTab === "new-tour" && <TourFormPlaceholder />}

        {/* Bookings View */}
        {activeTab === "bookings" && <BookingsView />}

        {/* Analytics View */}
        {activeTab === "analytics" && <AnalyticsView />}

        {/* Email Templates View */}
        {activeTab === "templates" && <EmailTemplates />}
      </div>

      {/* Toast Container */}
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
};

export default AdminDashboard;
