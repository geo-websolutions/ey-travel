// components/BookingLogModal.js
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaHistory,
  FaCalendarAlt,
  FaInfoCircle,
  FaUser,
  FaDollarSign,
  FaExchangeAlt,
  FaCheck,
  FaTimesCircle,
  FaComment,
  FaEnvelope,
  FaClock,
  FaCalendarCheck,
  FaCheckCircle,
  FaLink,
  FaCreditCard,
  FaEdit,
} from "react-icons/fa";

const BookingLogModal = ({ booking, isOpen, onClose }) => {
  const [sortedLogs, setSortedLogs] = useState([]);

  useEffect(() => {
    if (booking?.log && Array.isArray(booking.log)) {
      // Sort logs by timestamp (newest first)
      const sorted = [...booking.log].sort((a, b) => {
        const dateA = new Date(a.timestamp || 0);
        const dateB = new Date(b.timestamp || 0);
        return dateB - dateA;
      });
      setSortedLogs(sorted);
    }
  }, [booking]);

  // Get icon and color for each log event
  const getEventConfig = (event) => {
    const configs = {
      // Phase 1: Booking Submission
      booking_submitted: {
        icon: FaUser,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        label: "Booking Submitted",
        description: "Customer submitted booking request",
      },

      // Phase 2: Availability Check
      availability_checked: {
        icon: FaCalendarCheck,
        color: "text-green-400",
        bgColor: "bg-green-500/10",
        label: "Availability Checked",
        description: "Team checked tour availability",
      },
      availability_checked_email_sent: {
        icon: FaEnvelope,
        color: "text-cyan-400",
        bgColor: "bg-cyan-500/10",
        label: "Availability Email Sent",
        description: "Availability email sent to client",
      },

      // Phase 3: Partial Availability Feedback Flow
      feedback_requested: {
        icon: FaComment,
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/10",
        label: "Feedback Requested",
        description: "Client feedback link sent for partial availability",
      },
      feedback_received: {
        icon: FaCheck,
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
        label: "Feedback Received",
        description: "Client submitted feedback on tour modifications",
      },
      feedback_processed: {
        icon: FaExchangeAlt,
        color: "text-orange-400",
        bgColor: "bg-orange-500/10",
        label: "Feedback Processed",
        description: "Admin reviewed and processed client feedback",
      },

      // Phase 4: Payment
      payment_link_generated: {
        icon: FaLink,
        color: "text-indigo-400",
        bgColor: "bg-indigo-500/10",
        label: "Payment Link Generated",
        description: "Payment link created and sent to client",
      },
      stripe_payment_succeeded: {
        icon: FaCreditCard,
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        label: "Stripe Payment Succeeded",
        description: "Payment completed successfully via Stripe",
      },
      async_payment_succeeded: {
        icon: FaCreditCard,
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        label: "Async Payment Succeeded",
        description: "Payment completed via alternative method",
      },
      payment_received: {
        icon: FaDollarSign,
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        label: "Payment Received",
        description: "Client completed payment",
      },
      payment_confirmed: {
        icon: FaCheck,
        color: "text-green-400",
        bgColor: "bg-green-500/10",
        label: "Payment Confirmed",
        description: "Payment confirmed by admin",
      },

      // Phase 5: Scheduling
      tour_scheduled: {
        icon: FaCalendarAlt,
        color: "text-indigo-400",
        bgColor: "bg-indigo-500/10",
        label: "Tour Scheduled",
        description: "Tour schedule confirmed",
      },
      schedule_updated: {
        icon: FaEdit,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        label: "Schedule Updated",
        description: "Tour schedule was modified",
      },
      schedule_email_sent: {
        icon: FaEnvelope,
        color: "text-cyan-400",
        bgColor: "bg-cyan-500/10",
        label: "Schedule Email Sent",
        description: "Tour schedule email sent to client",
      },

      // Phase 6: Completion
      tour_completed: {
        icon: FaCheckCircle,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        label: "Tour Completed",
        description: "Tour marked as completed",
      },

      // Cancellation Events
      booking_cancelled: {
        icon: FaTimesCircle,
        color: "text-red-400",
        bgColor: "bg-red-500/10",
        label: "Booking Cancelled",
        description: "Booking was cancelled",
      },
      tour_cancelled: {
        icon: FaTimesCircle,
        color: "text-red-400",
        bgColor: "bg-red-500/10",
        label: "Tour Cancelled",
        description: "Individual tour was cancelled",
      },

      // Email Events
      client_email_sent: {
        icon: FaEnvelope,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        label: "Confirmation Email Sent",
        description: "Initial confirmation email sent to client",
      },
      notification_email_sent: {
        icon: FaEnvelope,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        label: "Notification Email Sent",
        description: "Notification sent to admin team",
      },

      // Status Changes
      status_updated: {
        icon: FaExchangeAlt,
        color: "text-orange-400",
        bgColor: "bg-orange-500/10",
        label: "Status Updated",
        description: "Booking status was changed",
      },

      default: {
        icon: FaInfoCircle,
        color: "text-gray-400",
        bgColor: "bg-gray-500/10",
        label: event?.replace(/_/g, " ") || "Event",
        description: "Booking event occurred",
      },
    };

    return configs[event] || configs.default;
  };

  // Format changes object for display
  const formatChanges = (changes) => {
    if (!changes) return null;

    // Handle array changes (like empty arrays from booking_submitted)
    if (Array.isArray(changes)) {
      return null;
    }

    // Handle object changes
    if (typeof changes === "object") {
      return Object.entries(changes).map(([key, value]) => {
        // Format key name
        const formattedKey = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())
          .replace(/_/g, " ");

        // Format value
        let formattedValue = value;
        if (typeof value === "boolean") {
          formattedValue = value ? "Yes" : "No";
        } else if (typeof value === "object") {
          formattedValue = JSON.stringify(value);
        }

        return { key: formattedKey, value: formattedValue };
      });
    }

    return null;
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown time";
    try {
      const date = new Date(timestamp);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (typeof amount === "number") {
      return `$${amount.toFixed(2)}`;
    }
    return amount;
  };

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-stone-800 rounded-xl border border-stone-700 w-full max-w-4xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="border-b border-stone-700 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FaHistory className="text-amber-400 text-xl" />
                <h2 className="text-2xl font-bold text-white">Booking Activity Log</h2>
              </div>
              <div className="flex items-center gap-4 text-sm text-stone-400">
                <div className="flex items-center gap-2">
                  <FaInfoCircle className="text-amber-400" />
                  <span>Booking #{booking.requestId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUser className="text-amber-400" />
                  <span>{booking.customer?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-amber-400" />
                  <span>{sortedLogs.length} events</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-2 hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
            >
              <FaTimes size={20} />
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {/* Phase indicators */}
            <div className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
              📋 Booking Submitted
            </div>
            {sortedLogs.some((log) => log.event.includes("availability")) && (
              <div className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                ✅ Availability Checked
              </div>
            )}
            {sortedLogs.some((log) => log.event.includes("feedback")) && (
              <div className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">
                💬 Feedback Processed
              </div>
            )}
            {sortedLogs.some((log) => log.event.includes("payment")) && (
              <div className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
                💰 Payment Processed
              </div>
            )}
            {sortedLogs.some(
              (log) => log.event.includes("scheduled") || log.event.includes("schedule_updated")
            ) && (
              <div className="text-xs px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded-full">
                📅 Tour Scheduled
              </div>
            )}
            {sortedLogs.some((log) => log.event.includes("completed")) && (
              <div className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                🏁 Tour Completed
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {sortedLogs.length === 0 ? (
            <div className="text-center py-12">
              <FaHistory className="text-stone-500 text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-bold text-stone-300 mb-2">No Activity Logs</h3>
              <p className="text-stone-500">
                No activity logs have been recorded for this booking yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedLogs.map((log, index) => {
                const config = getEventConfig(log.event);
                const Icon = config.icon;
                const changes = formatChanges(log.changes);
                const hasChanges = changes && changes.length > 0;
                const isLast = index === sortedLogs.length - 1;

                return (
                  <div key={index} className="relative">
                    {/* Timeline connector */}
                    {!isLast && (
                      <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-stone-700"></div>
                    )}

                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`w-12 h-12 rounded-full ${config.bgColor} flex items-center justify-center flex-shrink-0 relative z-10`}
                      >
                        <Icon className={`text-xl ${config.color}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 bg-stone-700/30 rounded-xl border border-stone-600 overflow-hidden">
                        <div className="p-4">
                          {/* Event header */}
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className={`font-bold text-lg ${config.color}`}>
                                  {config.label}
                                </h4>
                                {hasChanges && (
                                  <span className="text-xs px-2 py-0.5 bg-stone-600 rounded-full text-stone-300">
                                    {changes.length} change{changes.length !== 1 ? "s" : ""}
                                  </span>
                                )}
                              </div>
                              <p className="text-stone-400 text-sm">{config.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-stone-500">
                                <FaCalendarAlt className="inline mr-1" />
                                {formatTimestamp(log.timestamp)}
                              </div>
                              {log.processedBy && log.processedBy !== "system" && (
                                <div className="text-xs text-stone-600 mt-1">
                                  by {log.processedBy}
                                </div>
                              )}
                              {log.generatedBy && (
                                <div className="text-xs text-stone-600 mt-1">
                                  by {log.generatedBy}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* NEW: Payment Link Generated Details */}
                          {log.event === "payment_link_generated" && log.changes && (
                            <div className="mt-4 pt-4 border-t border-stone-600">
                              <h5 className="text-sm font-medium text-stone-400 mb-2">
                                Payment Link Details:
                              </h5>
                              <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-indigo-500/10 rounded-lg p-3">
                                    <div className="text-sm text-indigo-300">Amount Due</div>
                                    <div className="text-xl font-bold text-indigo-400">
                                      {formatCurrency(log.changes.amountDue)}
                                    </div>
                                  </div>
                                  <div className="bg-indigo-500/10 rounded-lg p-3">
                                    <div className="text-sm text-indigo-300">Payment Link ID</div>
                                    <div className="text-sm font-medium text-indigo-400 truncate">
                                      {log.changes.paymentLinkId}
                                    </div>
                                  </div>
                                </div>
                                {log.changes.expiresAt && (
                                  <div className="bg-yellow-500/10 rounded-lg p-3">
                                    <div className="text-sm text-yellow-300">Expires At</div>
                                    <div className="text-sm font-medium text-yellow-400">
                                      {new Date(
                                        log.changes.expiresAt.substring(
                                          0,
                                          log.changes.expiresAt.indexOf("Z") + 1
                                        )
                                      ).toLocaleDateString("en-US", {
                                        weekday: "long",
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* NEW: Stripe/Async Payment Details */}
                          {(log.event === "stripe_payment_succeeded" ||
                            log.event === "async_payment_succeeded") &&
                            log.changes && (
                              <div className="mt-4 pt-4 border-t border-stone-600">
                                <h5 className="text-sm font-medium text-stone-400 mb-2">
                                  Payment Details:
                                </h5>
                                <div className="space-y-3">
                                  <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-emerald-500/10 rounded-lg p-3">
                                      <div className="text-sm text-emerald-300">Amount Paid</div>
                                      <div className="text-xl font-bold text-emerald-400">
                                        {formatCurrency(log.changes.amount)}
                                      </div>
                                    </div>
                                    <div className="bg-emerald-500/10 rounded-lg p-3">
                                      <div className="text-sm text-emerald-300">Payment Method</div>
                                      <div className="text-lg font-bold text-emerald-400">
                                        {log.changes.paymentMethod || "Unknown"}
                                      </div>
                                    </div>
                                    <div className="bg-emerald-500/10 rounded-lg p-3">
                                      <div className="text-sm text-emerald-300">Status</div>
                                      <div
                                        className={`text-lg font-bold ${
                                          log.changes.isFullyPaid
                                            ? "text-green-400"
                                            : "text-amber-400"
                                        }`}
                                      >
                                        {log.changes.isFullyPaid ? "Fully Paid" : "Partial"}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-stone-700/50 rounded-lg p-3">
                                      <div className="text-sm text-stone-300">Previous Paid</div>
                                      <div className="text-lg font-medium text-stone-300">
                                        {formatCurrency(log.changes.previousPaid)}
                                      </div>
                                    </div>
                                    <div className="bg-emerald-500/10 rounded-lg p-3">
                                      <div className="text-sm text-emerald-300">New Total Paid</div>
                                      <div className="text-lg font-bold text-emerald-400">
                                        {formatCurrency(log.changes.newPaid)}
                                      </div>
                                    </div>
                                  </div>

                                  {log.changes.transactionId && (
                                    <div className="bg-blue-500/10 rounded-lg p-3">
                                      <div className="text-sm text-blue-300">Transaction ID</div>
                                      <div className="text-sm font-mono text-blue-400 truncate">
                                        {log.changes.transactionId}
                                      </div>
                                    </div>
                                  )}

                                  {log.changes.stripeSessionId && (
                                    <div className="bg-purple-500/10 rounded-lg p-3">
                                      <div className="text-sm text-purple-300">
                                        Stripe Session ID
                                      </div>
                                      <div className="text-sm font-mono text-purple-400 truncate">
                                        {log.changes.stripeSessionId}
                                      </div>
                                    </div>
                                  )}

                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-blue-500/10 rounded-lg p-3">
                                      <div className="text-sm text-blue-300">New Status</div>
                                      <div className="text-sm font-bold text-blue-400">
                                        {log.changes.newStatus?.replace(/_/g, " ")}
                                      </div>
                                    </div>
                                    <div className="bg-blue-500/10 rounded-lg p-3">
                                      <div className="text-sm text-blue-300">Current Step</div>
                                      <div className="text-sm font-bold text-blue-400">
                                        {log.changes.currentStep?.replace(/_/g, " ")}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                          {/* NEW: Schedule Updated Details */}
                          {log.event === "schedule_updated" && log.changes && (
                            <div className="mt-4 pt-4 border-t border-stone-600">
                              <h5 className="text-sm font-medium text-stone-400 mb-2">
                                Schedule Update Details:
                              </h5>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-blue-500/10 rounded-lg p-3">
                                    <div className="text-sm text-blue-300">Tours Updated</div>
                                    <div className="text-xl font-bold text-blue-400">
                                      {log.changes.toursUpdated || 0}
                                    </div>
                                  </div>
                                  <div className="bg-blue-500/10 rounded-lg p-3">
                                    <div className="text-sm text-blue-300">Changes Summary</div>
                                    <div className="text-lg font-bold text-blue-400">
                                      {log.changes.updatedFields?.length || 0} fields updated
                                    </div>
                                  </div>
                                </div>

                                {/* Updated Fields Details */}
                                {log.changes.updatedFields &&
                                  Array.isArray(log.changes.updatedFields) && (
                                    <div className="space-y-3">
                                      <h6 className="text-sm font-medium text-stone-400">
                                        Updated Tour Fields:
                                      </h6>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {log.changes.updatedFields.map((field, idx) => (
                                          <div key={idx} className="bg-stone-700/50 rounded-lg p-3">
                                            <div className="text-sm text-stone-300 mb-2">
                                              Tour ID:{" "}
                                              <span className="font-mono">{field.tourId}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                              {field.guideUpdated && (
                                                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                                                  Guide
                                                </span>
                                              )}
                                              {field.driverUpdated && (
                                                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                                                  Driver
                                                </span>
                                              )}
                                              {field.itineraryUpdated && (
                                                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
                                                  Itinerary
                                                </span>
                                              )}
                                              {field.equipmentUpdated && (
                                                <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded">
                                                  Equipment
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </div>
                          )}

                          {/* Existing: Feedback details */}
                          {log.event === "feedback_received" && log.feedbackDetails && (
                            <div className="mt-4 pt-4 border-t border-stone-600">
                              <h5 className="text-sm font-medium text-stone-400 mb-2">
                                Feedback Summary:
                              </h5>
                              <div className="grid grid-cols-3 gap-2">
                                <div className="bg-green-500/10 rounded-lg p-3 text-center">
                                  <div className="text-2xl font-bold text-green-400">
                                    {log.changes?.toursKept || 0}
                                  </div>
                                  <div className="text-xs text-green-300">Tours Kept</div>
                                </div>
                                <div className="bg-blue-500/10 rounded-lg p-3 text-center">
                                  <div className="text-2xl font-bold text-blue-400">
                                    {log.changes?.toursModified || 0}
                                  </div>
                                  <div className="text-xs text-blue-300">Tours Modified</div>
                                </div>
                                <div className="bg-red-500/10 rounded-lg p-3 text-center">
                                  <div className="text-2xl font-bold text-red-400">
                                    {log.changes?.toursRemoved || 0}
                                  </div>
                                  <div className="text-xs text-red-300">Tours Removed</div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Existing: Feedback processed details */}
                          {log.event === "feedback_processed" && log.changes && (
                            <div className="mt-4 pt-4 border-t border-stone-600">
                              <h5 className="text-sm font-medium text-stone-400 mb-2">
                                Feedback Decision:
                              </h5>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-stone-300">Action:</span>
                                  <span
                                    className={`font-bold ${
                                      log.changes.action === "confirm"
                                        ? "text-green-400"
                                        : "text-red-400"
                                    }`}
                                  >
                                    {log.changes.action === "confirm" ? "Confirmed" : "Cancelled"}
                                  </span>
                                </div>
                                {log.changes.action === "confirm" && (
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-green-500/10 rounded-lg p-3">
                                      <div className="text-sm text-green-300">Tours Confirmed</div>
                                      <div className="text-xl font-bold text-green-400">
                                        {log.changes.toursConfirmed || 0}
                                      </div>
                                    </div>
                                    <div className="bg-red-500/10 rounded-lg p-3">
                                      <div className="text-sm text-red-300">Tours Cancelled</div>
                                      <div className="text-xl font-bold text-red-400">
                                        {log.changes.toursCancelled || 0}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {log.changes.action === "cancel" &&
                                  log.changes.cancellationNotes && (
                                    <div className="bg-red-500/10 rounded-lg p-3">
                                      <div className="text-sm text-red-300 mb-1">
                                        Cancellation Notes:
                                      </div>
                                      <div className="text-red-200">
                                        {log.changes.cancellationNotes}
                                      </div>
                                    </div>
                                  )}
                                {log.processedBy && (
                                  <div className="text-sm text-stone-400">
                                    Processed by:{" "}
                                    <span className="text-stone-300">{log.processedBy}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Existing: Tour scheduled details */}
                          {log.event === "tour_scheduled" && log.changes && (
                            <div className="mt-4 pt-4 border-t border-stone-600">
                              <h5 className="text-sm font-medium text-stone-400 mb-2">
                                Schedule Details:
                              </h5>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="bg-indigo-500/10 rounded-lg p-3">
                                  <div className="text-sm text-indigo-300">Tours Scheduled</div>
                                  <div className="text-xl font-bold text-indigo-400">
                                    {log.changes.toursScheduled || 0}
                                  </div>
                                </div>
                                <div className="bg-indigo-500/10 rounded-lg p-3">
                                  <div className="text-sm text-indigo-300">Tour Types</div>
                                  <div className="text-xl font-bold text-indigo-400">
                                    {log.changes.tourTypes?.length || 0}
                                  </div>
                                  {log.changes.tourTypes && (
                                    <div className="text-xs text-indigo-300 mt-1">
                                      {log.changes.tourTypes.join(", ")}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-2 mt-3">
                                {log.changes.hasGuide !== undefined && (
                                  <div
                                    className={`text-center px-2 py-1 rounded text-xs ${
                                      log.changes.hasGuide
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-stone-700 text-stone-400"
                                    }`}
                                  >
                                    {log.changes.hasGuide ? "✓ Guide" : "✗ Guide"}
                                  </div>
                                )}
                                {log.changes.hasDriver !== undefined && (
                                  <div
                                    className={`text-center px-2 py-1 rounded text-xs ${
                                      log.changes.hasDriver
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-stone-700 text-stone-400"
                                    }`}
                                  >
                                    {log.changes.hasDriver ? "✓ Driver" : "✗ Driver"}
                                  </div>
                                )}
                                {log.changes.hasModifiedTours !== undefined && (
                                  <div
                                    className={`text-center px-2 py-1 rounded text-xs ${
                                      log.changes.hasModifiedTours
                                        ? "bg-yellow-500/20 text-yellow-400"
                                        : "bg-stone-700 text-stone-400"
                                    }`}
                                  >
                                    {log.changes.hasModifiedTours
                                      ? "Modified Tours"
                                      : "No Modifications"}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Existing: Tour completed details */}
                          {log.event === "tour_completed" && log.changes && (
                            <div className="mt-4 pt-4 border-t border-stone-600">
                              <h5 className="text-sm font-medium text-stone-400 mb-2">
                                Completion Details:
                              </h5>
                              <div className="bg-green-500/10 rounded-lg p-3">
                                <div className="flex items-center gap-2">
                                  <FaCheckCircle className="text-green-400" />
                                  <span className="text-green-400 font-medium">
                                    Booking Successfully Completed
                                  </span>
                                </div>
                                <div className="text-sm text-green-300 mt-2">
                                  Booking marked as completed by admin
                                </div>
                                {log.processedBy && (
                                  <div className="text-xs text-green-200/80 mt-2">
                                    Completed by: {log.processedBy}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Existing: Payment details */}
                          {log.event === "payment_received" && log.changes && (
                            <div className="mt-4 pt-4 border-t border-stone-600">
                              <h5 className="text-sm font-medium text-stone-400 mb-2">
                                Payment Details:
                              </h5>
                              <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-emerald-500/10 rounded-lg p-3">
                                    <div className="text-sm text-emerald-300">Amount</div>
                                    <div className="text-xl font-bold text-emerald-400">
                                      ${log.changes.amount || 0}
                                    </div>
                                  </div>
                                  <div className="bg-emerald-500/10 rounded-lg p-3">
                                    <div className="text-sm text-emerald-300">Payment Method</div>
                                    <div className="text-xl font-bold text-emerald-400">
                                      {log.changes.paymentMethod || "Unknown"}
                                    </div>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-emerald-500/10 rounded-lg p-3">
                                    <div className="text-sm text-emerald-300">New Total Paid</div>
                                    <div className="text-xl font-bold text-emerald-400">
                                      ${log.changes.newPaid || 0}
                                    </div>
                                  </div>
                                  <div className="bg-emerald-500/10 rounded-lg p-3">
                                    <div className="text-sm text-emerald-300">Status</div>
                                    <div
                                      className={`text-xl font-bold ${
                                        log.changes.isFullyPaid
                                          ? "text-green-400"
                                          : "text-amber-400"
                                      }`}
                                    >
                                      {log.changes.isFullyPaid ? "Fully Paid" : "Partial Payment"}
                                    </div>
                                  </div>
                                </div>
                                {log.processedBy && (
                                  <div className="text-sm text-stone-400">
                                    Processed by:{" "}
                                    <span className="text-stone-300">{log.processedBy}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Existing: Availability check details */}
                          {log.event === "availability_checked" && log.changes && (
                            <div className="mt-4 pt-4 border-t border-stone-600">
                              <h5 className="text-sm font-medium text-stone-400 mb-2">
                                Availability Results:
                              </h5>
                              <div className="space-y-2">
                                {log.changes.allToursAvailable !== undefined && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="text-stone-300">All Tours Available:</span>
                                    <span
                                      className={`font-medium ${
                                        log.changes.allToursAvailable
                                          ? "text-green-400"
                                          : "text-amber-400"
                                      }`}
                                    >
                                      {log.changes.allToursAvailable ? "Yes" : "No"}
                                    </span>
                                  </div>
                                )}
                                {log.changes.noToursAvailable !== undefined && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="text-stone-300">No Tours Available:</span>
                                    <span
                                      className={`font-medium ${
                                        log.changes.noToursAvailable
                                          ? "text-red-400"
                                          : "text-green-400"
                                      }`}
                                    >
                                      {log.changes.noToursAvailable ? "Yes" : "No"}
                                    </span>
                                  </div>
                                )}
                                {log.changes.hasAlternativeDates !== undefined && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="text-stone-300">Has Alternative Dates:</span>
                                    <span
                                      className={`font-medium ${
                                        log.changes.hasAlternativeDates
                                          ? "text-blue-400"
                                          : "text-stone-400"
                                      }`}
                                    >
                                      {log.changes.hasAlternativeDates ? "Yes" : "No"}
                                    </span>
                                  </div>
                                )}
                                {log.changes.hasLimitedPlaces !== undefined && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="text-stone-300">Has Limited Places:</span>
                                    <span
                                      className={`font-medium ${
                                        log.changes.hasLimitedPlaces
                                          ? "text-yellow-400"
                                          : "text-stone-400"
                                      }`}
                                    >
                                      {log.changes.hasLimitedPlaces ? "Yes" : "No"}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* General changes display for other events */}
                          {hasChanges &&
                            ![
                              "payment_link_generated",
                              "stripe_payment_succeeded",
                              "async_payment_succeeded",
                              "schedule_updated",
                              "feedback_received",
                              "feedback_processed",
                              "tour_scheduled",
                              "tour_completed",
                              "payment_received",
                              "availability_checked",
                            ].includes(log.event) && (
                              <div className="mt-4 pt-4 border-t border-stone-600">
                                <h5 className="text-sm font-medium text-stone-400 mb-2">
                                  Changes:
                                </h5>
                                <div className="space-y-2">
                                  {changes.map((change, idx) => (
                                    <div
                                      key={idx}
                                      className="flex justify-between items-center text-sm bg-stone-800/50 rounded-lg p-2"
                                    >
                                      <span className="text-stone-300">{change.key}:</span>
                                      <span
                                        className={`font-medium ${
                                          typeof change.value === "boolean"
                                            ? change.value
                                              ? "text-green-400"
                                              : "text-red-400"
                                            : "text-amber-400"
                                        }`}
                                      >
                                        {change.value}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* Footer */}
        <div className="border-t border-stone-700 p-4">
          <div className="text-center text-sm text-stone-500">
            Showing {sortedLogs.length} log entries • Most recent first
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingLogModal;
