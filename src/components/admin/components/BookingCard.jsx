"use client";

import { useState } from "react";
import StatusBadge from "./StatusBadge";
import TourCard from "./TourCard";
import {
  FaCalendarAlt,
  FaDollarSign,
  FaCheckCircle,
  FaTimes,
  FaGlobe,
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaCalendarCheck,
  FaUsers,
  FaTag,
  FaComment,
  FaEye,
  FaCheck,
  FaClock,
  FaHourglassHalf,
  FaComments,
  FaExclamationTriangle,
  FaHistory,
  FaCogs,
  FaCalendarDay,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import BookingLogModal from "./BookingLogModal";
import PaymentConfirmationModal from "./PaymentConfirmationModal";
import ScheduleTourModal from "./ScheduleTourModal";
import ViewScheduleModal from "./ViewScheduleModal";
import FeedbackProcessingModal from "./FeedbackProcessingModal";
import { toast } from "react-toastify";
import { auth } from "@/lib/firebase";

const BookingCard = ({ booking, onCheckAvailability }) => {
  const [expanded, setExpanded] = useState(false);
  const [showTours, setShowTours] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [viewScheduleModalOpen, setViewScheduleModalOpen] = useState(false);
  const [completingBooking, setCompletingBooking] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Format dates safely
  const formattedDate = booking.submittedAt
    ? new Date(booking.submittedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Not available";

  const lastEmailDate = booking.emailsSentAt?.seconds
    ? new Date(booking.emailsSentAt.seconds * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Not sent";

  // Format date without time for compact view
  const compactDate = booking.submittedAt
    ? new Date(booking.submittedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "N/A";

  // Calculate upcoming status (within next 7 days)
  const isUpcoming = () => {
    if (!booking.tours || !Array.isArray(booking.tours)) return false;

    const tourDates = booking.tours.filter((tour) => tour.date).map((tour) => new Date(tour.date));

    if (tourDates.length === 0) return false;

    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return tourDates.some((date) => date > now && date < sevenDaysFromNow);
  };

  // Get earliest tour date
  const getEarliestDate = () => {
    if (!booking.tours || !Array.isArray(booking.tours) || booking.tours.length === 0) {
      return "No tours";
    }

    const validDates = booking.tours.filter((tour) => tour.date).map((tour) => new Date(tour.date));

    if (validDates.length === 0) return "No date";

    const earliest = new Date(Math.min(...validDates));
    return earliest.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Calculate total guests
  const getTotalGuests = () => {
    if (!booking.tours || !Array.isArray(booking.tours)) return 0;
    return booking.tours
      .filter((tour) => tour.status !== "cancelled" && !tour.removedFromBooking) // Exclude cancelled/removed
      .reduce((sum, tour) => sum + (tour.guests || 0), 0);
  };
  // Calculate paid amount and balance
  const paidAmount = booking.paidAmount || 0;
  const total = booking.total || 0;
  const balance = total - paidAmount;

  // Get payment status
  const getPaymentStatus = () => {
    if (paidAmount >= total) return { label: "Paid", color: "text-green-400" };
    if (paidAmount > 0) return { label: "Partial", color: "text-yellow-400" };
    return { label: "Unpaid", color: "text-red-400" };
  };

  // Get workflow status info
  const getWorkflowInfo = () => {
    const info = {
      requiresAttention: false,
      statusMessage: "",
      icon: null,
      color: "",
    };

    switch (booking.status) {
      case "pending":
        if (!booking.availabilityConfirmed) {
          info.requiresAttention = true;
          info.statusMessage = "Availability check needed";
          info.icon = FaClock;
          info.color = "text-yellow-400";
        }
        break;

      case "pending_feedback":
        info.requiresAttention = true;
        info.statusMessage = "Awaiting client feedback";
        info.icon = FaHourglassHalf;
        info.color = "text-amber-400";
        break;

      case "feedback_received":
        info.requiresAttention = true;
        info.statusMessage = "Feedback ready for processing";
        info.icon = FaComments;
        info.color = "text-blue-400";
        break;

      case "confirmed":
        if (booking.pendingPayment) {
          info.statusMessage = "Awaiting payment";
          info.icon = FaDollarSign;
          info.color = "text-green-400";
        }
        break;

      case "paid":
        info.statusMessage = "Ready for scheduling";
        info.icon = FaCalendarDay;
        info.color = "text-emerald-400";
        info.requiresAttention = true; // NEW: Needs scheduling
        break;

      case "scheduled":
        info.statusMessage = "Scheduled";
        info.icon = FaCalendarAlt;
        info.color = "text-indigo-400";

        // Check if tour is upcoming
        const upcomingTour = booking.tours?.find((tour) => {
          const tourDate = new Date(tour.date);
          return tourDate > new Date();
        });
        if (upcomingTour) {
          info.statusMessage = "Upcoming tour";
        }
        break;

      case "completed":
        info.statusMessage = "Booking completed";
        info.icon = FaCalendarCheck;
        info.color = "text-purple-400";
        break;

      case "cancelled":
        info.statusMessage = "Cancelled";
        info.icon = FaTimes;
        info.color = "text-red-400";
        break;
    }

    return info;
  };

  const workflowInfo = getWorkflowInfo();

  // Get available actions based on status
  const getAvailableActions = () => {
    const actions = [];

    switch (booking.status) {
      case "pending":
        if (!booking.availabilityConfirmed) {
          actions.push({
            label: "Check Availability",
            action: () => onCheckAvailability(booking),
            icon: FaCheck,
            color: "bg-amber-600 hover:bg-amber-700",
          });
        }
        break;

      case "feedback_received":
        actions.push({
          label: "Confirm or Cancel Booking",
          action: () => handleProcessFeedback(),
          icon: FaCogs,
          color: "bg-indigo-600 hover:bg-indigo-700",
        });
        break;

      case "confirmed":
        if (booking.paymentLink && booking.pendingPayment) {
          actions.push({
            label: "Mark as Paid",
            action: () => handleMarkAsPaid(booking.id),
            icon: FaDollarSign,
            color: "bg-purple-600 hover:bg-purple-700",
          });
        }
        break;
      case "paid":
        // NEW: Schedule the booking
        actions.push({
          label: "Add Schedule",
          action: () => handleScheduleTour(),
          icon: FaCalendarAlt,
          color: "bg-emerald-600 hover:bg-emerald-700",
        });
        break;
      case "scheduled":
        // NEW: Mark as completed
        actions.push({
          label: "View Schedule",
          action: () => handleViewSchedule(),
          icon: FaCalendarAlt,
          color: "bg-indigo-600 hover:bg-indigo-700",
        });
        actions.push({
          label: "Mark as Completed",
          action: () => handleCompleteBooking(),
          icon: FaCheckCircle,
          color: "bg-purple-600 hover:bg-purple-700",
          loading: completingBooking,
        });
        // Optionally: Add "Reschedule" or "Cancel Tour" actions
        break;
    }

    return actions;
  };

  const handleProcessFeedback = async () => {
    setShowFeedbackModal(true);
  };

  const handleCompleteBooking = async () => {
    try {
      setCompletingBooking(true);
      // Call API endpoint
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch("/api/v1/booking/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          booking,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to mark booking as completed");
      }

      toast.success("Booking marked as completed!");
    } catch (error) {
      console.error("Error marking booking as completed:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setCompletingBooking(false);
    }
  };

  const handleViewSchedule = () => {
    setViewScheduleModalOpen(true);
  };

  const handleMarkAsPaid = () => {
    setShowPaymentModal(true);
  };

  const handleScheduleTour = () => {
    setIsEditMode(false);
    setEditingBooking(null);
    setShowScheduleModal(true);
  };
  const handleEditSchedule = (booking) => {
    setEditingBooking(booking);
    setIsEditMode(true);
    setViewScheduleModalOpen(false);
    setShowScheduleModal(true);
  };

  return (
    <div
      className={`bg-stone-800/30 rounded-xl border border-stone-700 overflow-hidden mb-2 ${
        workflowInfo.requiresAttention ? "border-amber-500/50" : ""
      }`}
    >
      {/* Compact Header - Always Visible */}
      <div
        className="p-4 cursor-pointer hover:bg-stone-800/40 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          {/* Left side: Booking Info */}
          <div className="flex items-center space-x-4">
            {/* Status Indicator */}
            <div className="flex flex-col items-center">
              <StatusBadge status={booking.status} />
              {isUpcoming() && (
                <span className="text-xs text-amber-400 mt-1 px-2 py-0.5 bg-amber-400/10 rounded-full">
                  Upcoming
                </span>
              )}
            </div>

            {/* Customer & Tour Info */}
            <div className="flex-1">
              <div className="flex items-center mb-1">
                <h4 className="font-bold text-white text-lg mr-3">#{booking.requestId}</h4>
                <div className="text-sm text-stone-400 flex items-center">
                  <FaUser className="mr-1" size={12} />
                  {booking.customer?.name || "Unknown"}
                </div>
                {workflowInfo.icon && (
                  <div className="ml-3 flex items-center text-sm">
                    <workflowInfo.icon className={`mr-1 ${workflowInfo.color}`} size={12} />
                    <span className={workflowInfo.color}>{workflowInfo.statusMessage}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4 text-sm text-stone-400">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2" size={12} />
                  {compactDate}
                  {booking.tours?.length > 0 && (
                    <span className="ml-2">· Tour: {getEarliestDate()}</span>
                  )}
                </div>
                <div className="flex items-center">
                  <FaTag className="mr-2" size={12} />
                  {booking.tours?.length || 0} tour{booking.tours?.length !== 1 ? "s" : ""}
                </div>
                <div className="flex items-center">
                  <FaUsers className="mr-2" size={12} />
                  {getTotalGuests()} guests
                </div>
                {booking.currentStep && (
                  <div className="flex items-center">
                    <FaHistory className="mr-2" size={12} />
                    {booking.currentStep.replace(/_/g, " ")}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side: Actions & Total */}
          <div className="flex items-center space-x-4">
            {workflowInfo.requiresAttention && (
              <div className="text-amber-400">
                <FaExclamationTriangle />
              </div>
            )}
            <div className="text-right">
              <div className="text-xl font-bold text-amber-400">${total.toLocaleString()}</div>
              <div className="text-xs text-stone-400">Total</div>
            </div>
            <div className="text-stone-400">{expanded ? <FaChevronUp /> : <FaChevronDown />}</div>
          </div>
        </div>

        {/* Quick Actions - Only in compact mode */}
        {!expanded && (
          <div className="mt-3 hidden items-center justify-between">
            <div className="flex items-center space-x-2">
              {getAvailableActions().map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className={`text-xs px-3 py-1 ${action.color} text-white rounded flex items-center cursor-pointer`}
                >
                  <action.icon className="mr-2" size={10} />
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Expanded Details - Animated */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-stone-700">
              {/* Detailed Info Grid */}
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                {/* Customer Info */}
                <div className="bg-stone-800/40 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <FaUser className="text-amber-400 mr-2" />
                    <h5 className="font-bold text-white">Customer</h5>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400 text-sm">Name:</span>
                      <span className="text-white font-medium">
                        {booking.customer?.name || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400 text-sm">Email:</span>
                      <a
                        href={`mailto:${booking.customer?.email}`}
                        className="text-amber-400 hover:text-amber-300 text-sm truncate max-w-[150px]"
                        title={booking.customer?.email}
                      >
                        {booking.customer?.email || "N/A"}
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400 text-sm">Phone:</span>
                      <a href={`tel:${booking.customer?.phone}`} className="text-white text-sm">
                        {booking.customer?.phone || "N/A"}
                      </a>
                    </div>
                    {booking.customer?.notes && (
                      <div className="mt-2 pt-2 border-t border-stone-700">
                        <div className="flex items-start">
                          <FaComment className="text-stone-400 mr-2 mt-0.5" size={12} />
                          <p className="text-stone-400 text-xs">{booking.customer.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location & Date Info */}
                <div className="bg-stone-800/40 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <FaGlobe className="text-amber-400 mr-2" />
                    <h5 className="font-bold text-white">Location & Date</h5>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400 text-sm">Submitted:</span>
                      <span className="text-white text-sm">{formattedDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400 text-sm">Location:</span>
                      <span className="text-white text-sm">
                        {booking.city || "Unknown"}, {booking.country || "Unknown"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400 text-sm">IP Address:</span>
                      <span className="text-white text-sm">{booking.ip || "N/A"}</span>
                    </div>
                    {booking.availabilityConfirmedAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400 text-sm">Availability Checked:</span>
                        <span className="text-white text-sm">
                          {new Date(booking.availabilityConfirmedAt.toDate()).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment & Actions */}
                <div className="bg-stone-800/40 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <FaDollarSign className="text-amber-400 mr-2" />
                    <h5 className="font-bold text-white">Payment & Status</h5>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-stone-400">Total Amount:</span>
                      <span className="text-white font-bold">${total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-400">Paid Amount:</span>
                      <span className="text-white font-bold">${paidAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-400">Balance Due:</span>
                      <span
                        className={`font-bold ${balance > 0 ? "text-amber-400" : "text-green-400"}`}
                      >
                        ${balance.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-400">Payment Status:</span>
                      <span className={getPaymentStatus().color}>{getPaymentStatus().label}</span>
                    </div>
                    {booking.receivedPayment && (
                      <div className="flex justify-between items-center">
                        <span className="text-stone-400">Payment Date:</span>
                        <span className={getPaymentStatus().color}>
                          {new Date(booking.paymentReceivedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Workflow Status Section */}
              <div className="mb-6 p-4 bg-stone-800/40 rounded-lg">
                <h5 className="font-bold text-white mb-3 flex items-center">
                  <FaHistory className="mr-2" />
                  Workflow Status
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-stone-400">Current Step</div>
                    <div className="text-white font-medium">
                      {booking.currentStep?.replace(/_/g, " ") || "booking_submitted"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-stone-400">Availability Confirmed</div>
                    <div
                      className={
                        booking.availabilityConfirmed ? "text-green-400" : "text-amber-400"
                      }
                    >
                      {booking.availabilityConfirmed ? "Yes" : "No"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-stone-400">Pending Feedback</div>
                    <div
                      className={
                        booking.pendingClientFeedback ? "text-amber-400" : "text-stone-400"
                      }
                    >
                      {booking.pendingClientFeedback ? "Yes" : "No"}
                      {booking.feedbackExpiresAt && (
                        <div className="text-xs text-amber-300">
                          Expires: {new Date(booking.feedbackExpiresAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-stone-400">Payment Pending</div>
                    <div className={booking.pendingPayment ? "text-amber-400" : "text-green-400"}>
                      {booking.pendingPayment ? "Yes" : "No"}
                    </div>
                  </div>
                </div>
                {booking.feedbackReceivedAt && (
                  <div className="mt-3 pt-3 border-t border-stone-700">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">Feedback Received:</span>
                      <span className="text-white">
                        {new Date(booking.feedbackReceivedAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                )}
                {booking.scheduledAt && (
                  <div className="mt-3 pt-3 border-t border-stone-700">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">Booking Scheduled At:</span>
                      <span className="text-white">
                        {new Date(booking.scheduledAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                )}
                {booking.completedAt && (
                  <div className="mt-3 pt-3 border-t border-stone-700">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">Booking Completed At:</span>
                      <span className="text-white">
                        {new Date(booking.completedAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Tours Section - Collapsible */}
              <div className="mb-4">
                <div
                  className="flex items-center justify-between mb-3 cursor-pointer hover:bg-stone-800/40 p-2 rounded"
                  onClick={() => setShowTours(!showTours)}
                >
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-amber-400 mr-2" />
                    <h5 className="font-bold text-white">Tours ({booking.tours?.length || 0})</h5>
                  </div>
                  <div className="text-stone-400">
                    {showTours ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </div>

                <AnimatePresence>
                  {showTours && booking.tours && booking.tours.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3">
                        {booking.tours.map((tour, index) => (
                          <TourCard
                            key={index}
                            tour={tour}
                            onCheckAvailability={onCheckAvailability}
                            compact={true}
                            bookingStatus={booking.status}
                            booking={booking}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {(!booking.tours || booking.tours.length === 0) && (
                  <div className="text-center py-4 text-stone-500 text-sm">
                    No tours in this booking
                  </div>
                )}
              </div>

              <div className="my-6 pt-4">
                <button
                  onClick={() => setShowLogModal(true)}
                  className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded-lg font-medium flex items-center cursor-pointer"
                >
                  <FaHistory className="mr-2" />
                  View Activity Log ({booking.log.length} events)
                </button>
              </div>

              {/* Quick Actions Bar */}
              <div className="flex justify-between items-center pt-4 border-t border-stone-700">
                <div className="text-sm text-stone-400">
                  Booking ID: <span className="text-stone-300">{booking.id}</span>
                </div>
                <div className="flex space-x-2">
                  {getAvailableActions().map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className={`px-4 py-2 text-sm ${
                        action.color
                      } text-white rounded flex items-center cursor-pointer ${
                        action.loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={action.loading} // Use specific loading state
                    >
                      {action.loading ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 text-white mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <action.icon className="mr-2" size={12} />
                          {action.label}
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Log Modal */}
      <BookingLogModal
        booking={booking}
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
      />
      {/* Feedback Processing Modal */}
      <FeedbackProcessingModal
        booking={booking}
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
      {/* Schedule Tour Modal */}
      <ScheduleTourModal
        booking={booking} // Use editingBooking in edit mode
        isOpen={showScheduleModal}
        onClose={() => {
          setShowScheduleModal(false);
          setIsEditMode(false); // Reset edit mode on close
          setEditingBooking(null); // Clear editing booking
        }}
        isEditMode={isEditMode} // Pass edit mode flag
      />
      {/* View Schedule Modal */}
      <ViewScheduleModal
        booking={booking}
        isOpen={viewScheduleModalOpen}
        onClose={() => setViewScheduleModalOpen(false)}
        onEditSchedule={handleEditSchedule} // Add this
      />
      {/* Payment Confirmation Modal */}
      <PaymentConfirmationModal
        booking={booking}
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      />
    </div>
  );
};

export default BookingCard;
