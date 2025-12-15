"use client";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";

import {
  orderBy,
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
  where,
  Timestamp,
} from "firebase/firestore";
import { FaSearch, FaExclamationTriangle } from "react-icons/fa";
import BookingCard from "./components/BookingCard";
import AvailabilityCheckModal from "./components/AvailabilityCheckModal";
import { BOOKING_STATUSES } from "@/utils/bookingStatuses";
import { toast } from "react-toastify";

// Main BookingsView Component
export default function BookingsView() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [workflowStage, setWorkflowStage] = useState("all");

  useEffect(() => {
    const collectionRef = collection(db, "bookings");
    const q = query(collectionRef, orderBy("submittedAt", "desc"));

    setLoading(true);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const recentBookings = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(recentBookings);
        setFilteredBookings(recentBookings);
        setLoading(false);
      },
      (error) => {
        console.error("Error in snapshot listener:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);
  console.log(bookings);

  // Filter bookings
  useEffect(() => {
    let result = bookings;

    // Workflow phase filter
    switch (workflowStage) {
      case "awaiting_availability":
        result = result.filter((b) => b.status === "pending" && !b.availabilityConfirmed);
        break;
      case "awaiting_feedback":
        result = result.filter((b) => b.status === "pending_feedback" && b.pendingClientFeedback);
        break;
      case "feedback_received":
        result = result.filter((b) => b.status === "feedback_received");
        break;
      case "awaiting_payment":
        result = result.filter((b) => b.status === "confirmed" && b.pendingPayment);
        break;
      case "paid":
        result = result.filter((b) => b.status === "paid");
        break;
      case "scheduled":
        result = result.filter((b) => b.status === "scheduled");
        break;
      case "completed":
        result = result.filter((b) => b.status === "completed");
        break;
      case "cancelled":
        result = result.filter((b) =>
          ["cancelled", "cancelled_by_client", "cancelled_by_admin", "expired"].includes(b.status)
        );
        break;
    }

    // Individual status filter (if not using workflow phase)
    if (statusFilter !== "all") {
      result = result.filter((booking) => booking.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (booking) =>
          booking.customer?.name?.toLowerCase().includes(query) ||
          booking.customer?.email?.toLowerCase().includes(query) ||
          booking.requestId?.toLowerCase().includes(query) ||
          booking.tours?.some((tour) => tour.title.toLowerCase().includes(query))
      );
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      result = result.filter((booking) => {
        const bookingDate = new Date(booking.submittedAt);
        switch (dateFilter) {
          case "today":
            return bookingDate.toDateString() === now.toDateString();
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return bookingDate >= weekAgo;
          case "month":
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return bookingDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredBookings(result);
  }, [bookings, statusFilter, searchQuery, dateFilter, workflowStage]);

  const workflowStats = {
    total: bookings.length,

    // Bookings that need availability check
    awaitingAvailability: bookings.filter((b) => b.status === "pending" && !b.availabilityConfirmed)
      .length,

    // Bookings waiting for client feedback (partial availability)
    awaitingFeedback: bookings.filter(
      (b) => b.status === "pending_feedback" && b.pendingClientFeedback
    ).length,

    // Bookings with feedback received but not processed yet
    feedbackReceived: bookings.filter((b) => b.status === "feedback_received").length,

    // Bookings confirmed but not paid yet
    awaitingPayment: bookings.filter((b) => b.status === "confirmed" && b.pendingPayment).length,

    // NEW: Paid bookings ready for scheduling
    paid: bookings.filter((b) => b.status === "paid").length,

    // NEW: Scheduled bookings (upcoming tours)
    scheduled: bookings.filter((b) => b.status === "scheduled").length,

    // NEW: Completed tours
    completed: bookings.filter((b) => b.status === "completed").length,

    // Cancelled bookings (including all cancellation types)
    cancelled: bookings.filter((b) =>
      ["cancelled", "cancelled_by_client", "cancelled_by_admin", "expired"].includes(b.status)
    ).length,
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const bookingRef = doc(db, "bookings", bookingId);
      await updateDoc(bookingRef, {
        status: newStatus,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleCheckAvailability = (booking) => {
    setSelectedBooking(booking);
    setShowAvailabilityModal(true);
  };

  const handleConfirmAvailability = async (bookingId, availabilityResults, adminNotes) => {
    try {
      const bookingIndex = bookings.findIndex((b) => b.id === bookingId);
      if (bookingIndex === -1) return;

      const updatedBookings = [...bookings];
      const bookingToUpdate = { ...updatedBookings[bookingIndex] };

      // Merge availabilityResults with existing tour data
      if (bookingToUpdate.tours && availabilityResults) {
        bookingToUpdate.tours = bookingToUpdate.tours.map((existingTour) => {
          const availabilityInfo = availabilityResults.find(
            (result) => result.tourId === existingTour.tourId || result.tourId === existingTour.id
          );

          if (availabilityInfo) {
            return {
              ...existingTour,
              availabilityStatus: availabilityInfo.status,
              availabilityNotes: availabilityInfo.notes,
              limitedPlaces: availabilityInfo.limitedPlaces,
              alternativeDate: availabilityInfo.alternativeDate,
              // Ensure we keep the original date in tour.date
              date: existingTour.date,
            };
          }
          return existingTour;
        });
      }

      // API call to finish availability check
      const idToken = await auth.currentUser.getIdToken();

      const response = await fetch("/api/v1/booking/confirm-availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          bookingId,
          availabilityResults,
          adminNotes: adminNotes || "",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to confirm availability");
      }

      const result = await response.json();

      toast.success("Availability confirmed successfully");
      setSelectedBooking(null);
      setShowAvailabilityModal(false);
    } catch (error) {
      console.error("Error confirming availability:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-stone-800/50 rounded-xl border border-stone-700 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-stone-400">Loading bookings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-800/50 rounded-xl border border-stone-700 p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Bookings Management</h3>
          <p className="text-stone-400">Manage tour bookings and check availability</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-amber-400">{workflowStats.total}</div>
          <div className="text-sm text-stone-400">Total Bookings</div>
        </div>
      </div>

      {/* Workflow Stats Overview */}
      <div className="space-y-6 mb-8">
        {/* Main Workflow Stages - Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Active Workflow Stages */}
          <div
            className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-xl p-5 border border-yellow-500/30 hover:border-yellow-400 transition-all cursor-pointer group"
            onClick={() => setWorkflowStage("awaiting_availability")}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-3xl font-bold text-white mb-1">
                  {workflowStats.awaitingAvailability}
                </div>
                <div className="text-sm font-medium text-amber-300">Awaiting Availability</div>
                <div className="text-xs text-amber-400/70 mt-1">Check tour availability</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white font-bold">1</span>
              </div>
            </div>
          </div>

          <div
            className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-5 border border-amber-500/30 hover:border-amber-400 transition-all cursor-pointer group"
            onClick={() => setWorkflowStage("awaiting_feedback")}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-3xl font-bold text-white mb-1">
                  {workflowStats.awaitingFeedback}
                </div>
                <div className="text-sm font-medium text-amber-300">Awaiting Feedback</div>
                <div className="text-xs text-amber-400/70 mt-1">Client decision pending</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white font-bold">2</span>
              </div>
            </div>
          </div>

          <div
            className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-5 border border-blue-500/30 hover:border-blue-400 transition-all cursor-pointer group"
            onClick={() => setWorkflowStage("feedback_received")}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-3xl font-bold text-white mb-1">
                  {workflowStats.feedbackReceived}
                </div>
                <div className="text-sm font-medium text-blue-300">Feedback Received</div>
                <div className="text-xs text-blue-400/70 mt-1">Ready for processing</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white font-bold">3</span>
              </div>
            </div>
          </div>

          <div
            className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-5 border border-green-500/30 hover:border-green-400 transition-all cursor-pointer group"
            onClick={() => setWorkflowStage("confirmed")}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-3xl font-bold text-white mb-1">
                  {workflowStats.awaitingPayment}
                </div>
                <div className="text-sm font-medium text-green-300">
                  Confirmed (Awaiting Payment)
                </div>
                <div className="text-xs text-green-400/70 mt-1">Payment link sent</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white font-bold">4</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tour Execution Stages - Middle Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-5 border border-emerald-500/30 hover:border-emerald-400 transition-all cursor-pointer group"
            onClick={() => setWorkflowStage("paid")}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white mb-1">{workflowStats.paid}</div>
                <div className="text-sm font-medium text-emerald-300">Paid & Ready</div>
                <div className="text-xs text-emerald-400/70 mt-1">Ready to schedule</div>
              </div>
              <div className="text-emerald-400 group-hover:text-emerald-300 transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div
            className="bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-xl p-5 border border-indigo-500/30 hover:border-indigo-400 transition-all cursor-pointer group"
            onClick={() => setWorkflowStage("scheduled")}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white mb-1">{workflowStats.scheduled}</div>
                <div className="text-sm font-medium text-indigo-300">Scheduled</div>
                <div className="text-xs text-indigo-400/70 mt-1">Upcoming tours</div>
              </div>
              <div className="text-indigo-400 group-hover:text-indigo-300 transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div
            className="bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 rounded-xl p-5 border border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer group"
            onClick={() => setWorkflowStage("completed")}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white mb-1">{workflowStats.completed}</div>
                <div className="text-sm font-medium text-purple-300">Completed</div>
                <div className="text-xs text-purple-400/70 mt-1">Bookings finished</div>
              </div>
              <div className="text-purple-400 group-hover:text-purple-300 transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Summary & Cancelled - Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Total & Cancelled */}
          <div className="bg-gradient-to-br from-stone-700/30 to-stone-800/30 rounded-xl p-5 border border-stone-600">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-white mb-1">{workflowStats.total}</div>
                <div className="text-sm font-medium text-stone-300">Total Bookings</div>
                <div className="text-xs text-stone-500 mt-1">All statuses combined</div>
              </div>
              <div className="text-amber-400">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div
            className="bg-gradient-to-br from-red-500/10 to-rose-500/10 rounded-xl p-5 border border-red-500/30 hover:border-red-400 transition-all cursor-pointer group"
            onClick={() => setWorkflowStage("cancelled")}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white mb-1">{workflowStats.cancelled}</div>
                <div className="text-sm font-medium text-red-300">Cancelled</div>
                <div className="text-xs text-red-400/70 mt-1">All cancellation types</div>
              </div>
              <div className="text-red-400 group-hover:text-red-300 transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Filters - Updated */}
      <div className="bg-stone-800/40 rounded-lg border border-stone-700 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-stone-400 mb-2">Workflow Stage</label>
            <select
              value={workflowStage}
              onChange={(e) => setWorkflowStage(e.target.value)}
              className="w-full bg-stone-700 border border-stone-600 rounded px-3 py-2 text-white"
            >
              <option value="all">All Stages</option>
              <option value="awaiting_availability">Awaiting Availability Check</option>
              <option value="awaiting_feedback">Awaiting Client Feedback</option>
              <option value="feedback_received">Feedback Received</option>
              <option value="awaiting_payment">Awaiting Payment</option>
              <option value="paid">Paid - Ready to Schedule</option>
              <option value="scheduled">Scheduled - Upcoming</option>
              <option value="completed">Completed Tours</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-stone-400 mb-2">Status Filter</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setWorkflowStage("all");
              }}
              className="w-full bg-stone-700 border border-stone-600 rounded px-3 py-2 text-white"
            >
              <option value="all">All Statuses</option>
              {Object.entries(BOOKING_STATUSES).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-stone-400 mb-2">Date Range</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full bg-stone-700 border border-stone-600 rounded px-3 py-2 text-white"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-stone-400 mb-2">Search</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or tour..."
                className="w-full bg-stone-700 border border-stone-600 rounded pl-10 pr-4 py-2 text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-white">
            {filteredBookings.length} {filteredBookings.length === 1 ? "Booking" : "Bookings"}
          </h4>
          <div className="text-sm text-stone-400">
            Showing {filteredBookings.length} of {bookings.length}
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="bg-stone-800/40 rounded-lg border border-stone-700 p-8 text-center">
            <FaExclamationTriangle className="text-stone-500 mx-auto mb-4" size={48} />
            <h5 className="text-lg font-bold text-white mb-2">No bookings found</h5>
            <p className="text-stone-400">
              {searchQuery || statusFilter !== "all" || dateFilter !== "all"
                ? "Try adjusting your filters to see more results"
                : "No bookings have been submitted yet"}
            </p>
          </div>
        ) : (
          <div>
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onUpdateStatus={handleUpdateStatus}
                onCheckAvailability={handleCheckAvailability}
              />
            ))}
          </div>
        )}
      </div>

      {/* Availability Check Modal */}
      <AvailabilityCheckModal
        booking={selectedBooking}
        isOpen={showAvailabilityModal}
        onClose={() => setShowAvailabilityModal(false)}
        onConfirmAvailability={handleConfirmAvailability}
      />
    </div>
  );
}
