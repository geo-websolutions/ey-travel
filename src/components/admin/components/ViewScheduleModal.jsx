// components/ViewScheduleModal.js
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  FaTimes,
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaCar,
  FaMapMarkerAlt,
  FaClock,
  FaCalendarDay,
  FaUserFriends,
  FaRoute,
  FaInfoCircle,
  FaCheckCircle,
  FaHourglassHalf,
  FaCalendarCheck,
  FaCalendarTimes,
  FaExclamationTriangle,
  FaCheck,
  FaTimesCircle,
  FaUserClock,
  FaCarSide,
  FaMapMarkedAlt,
  FaListUl,
  FaTools,
  FaStickyNote,
  FaEye,
  FaTrash,
  FaBan,
  FaQuestionCircle,
} from "react-icons/fa";
import { db, auth } from "@/lib/firebase";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";
import { toast } from "react-toastify";

const ViewScheduleModal = ({ booking, isOpen, onClose, onEditSchedule }) => {
  const [activeTourIndex, setActiveTourIndex] = useState(0);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [scheduledTours, setScheduledTours] = useState([]);
  const [completingTourIndex, setCompletingTourIndex] = useState(null);

  // Filter tours that have a schedule
  useEffect(() => {
    if (booking?.tours && isOpen) {
      // Only show tours that are confirmed AND have schedules
      const toursWithSchedule = booking.tours.filter(
        (tour) => tour.status === "confirmed" && !tour.removedFromBooking && tour.schedule
      );

      setScheduledTours(toursWithSchedule);
      setActiveTourIndex(0);
      setActiveDayIndex(0);
    }
  }, [booking, isOpen]);

  // Tour type configuration
  const tourTypes = {
    day_tour: {
      label: "Day Tour",
      icon: FaCalendarDay,
      color: "bg-blue-500",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500/30",
    },
    hourly_tour: {
      label: "Hourly Tour",
      icon: FaClock,
      color: "bg-green-500",
      bgColor: "bg-green-500/20",
      borderColor: "border-green-500/30",
    },
    multi_day_tour: {
      label: "Multi-Day Tour",
      icon: FaCalendarCheck,
      color: "bg-purple-500",
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-500/30",
    },
  };

  // Schedule status based on tour availability
  const getTourStatus = (tour) => {
    // First check if tour is cancelled or removed
    if (tour.status === "cancelled" || tour.removedFromBooking) {
      return "cancelled";
    }

    if (!tour.schedule) return "unscheduled";

    const tourDate = new Date(tour.date || tour.confirmedDate);
    const now = new Date();

    if (tourDate < now) return "completed";
    if (tourDate > now) return "upcoming";

    return "today";
  };

  const statusConfigs = {
    unscheduled: {
      label: "Not Scheduled",
      color: "bg-gray-500",
      icon: FaCalendarTimes,
      description: "Tour not scheduled yet",
    },
    scheduled: {
      label: "Scheduled",
      color: "bg-blue-500",
      icon: FaCalendarAlt,
      description: "Tour is scheduled",
    },
    upcoming: {
      label: "Upcoming",
      color: "bg-emerald-500",
      icon: FaCalendarCheck,
      description: "Tour is coming up",
    },
    today: {
      label: "Today",
      color: "bg-amber-500",
      icon: FaExclamationTriangle,
      description: "Tour is happening today",
    },
    completed: {
      label: "Completed",
      color: "bg-purple-500",
      icon: FaCheckCircle,
      description: "Tour has been completed",
    },
    cancelled: {
      label: "Cancelled",
      color: "bg-red-500",
      icon: FaTimesCircle,
      description: "Tour has been cancelled",
    },
  };

  const handleCompleteTour = async (tourIndex) => {
    try {
      setCompletingTourIndex(tourIndex);

      // Get the specific tour from the scheduled tours
      const tourToComplete = scheduledTours[tourIndex];

      // Update the booking in Firestore
      const bookingRef = doc(db, "bookings", booking.id);

      // Create updated tours array with the completed flag
      const updatedTours = booking.tours.map((tour) => {
        if (tour.id === tourToComplete.id) {
          return {
            ...tour,
            completed: true,
            completedAt: new Date().toISOString(),
            completedBy: auth.currentUser?.email || "Unknown",
          };
        }
        return tour;
      });

      // Prepare log entry
      const completionLog = {
        timestamp: new Date().toISOString(),
        event: "tour_completed",
        changes: {
          tourId: tourToComplete.id,
          tourTitle: tourToComplete.title,
          tourDate: tourToComplete.date || tourToComplete.confirmedDate,
          tourCompleted: true,
        },
        processedBy: auth.currentUser?.email || "Unknown",
      };

      // Update Firestore document
      await updateDoc(bookingRef, {
        tours: updatedTours,
        updatedAt: new Date().toISOString(),
        lastUpdatedBy: auth.currentUser?.email || "Unknown",
        log: arrayUnion(completionLog),
      });

      // Update local state to reflect completion
      setScheduledTours((prev) => {
        const updated = [...prev];
        updated[tourIndex] = {
          ...updated[tourIndex],
          completed: true,
          completedAt: new Date().toISOString(),
          completedBy: auth.currentUser?.email || "Unknown",
        };
        return updated;
      });

      toast.success(`"${tourToComplete.title}" marked as completed!`);
    } catch (error) {
      console.error("Error marking tour as completed:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setCompletingTourIndex(null);
    }
  };

  if (!isOpen || !booking) return null;

  const totalTours = scheduledTours.length;
  const currentTour = scheduledTours[activeTourIndex];

  if (totalTours === 0) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
        <div className="absolute inset-0" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative bg-stone-800 rounded-xl border border-stone-700 w-full max-w-md p-8"
        >
          <div className="text-center">
            <FaCalendarTimes className="text-5xl text-amber-400 mx-auto mb-6 opacity-80" />
            <h3 className="text-2xl font-bold text-white mb-4">No Scheduled Tours</h3>
            <p className="text-stone-400 mb-2">
              This booking doesn't have any scheduled tours yet.
            </p>
            <p className="text-stone-500 text-sm mb-8">
              {booking.tours?.filter((t) => t.status === "confirmed" && !t.removedFromBooking)
                .length || 0}
              confirmable tour
              {booking.tours?.filter((t) => t.status === "confirmed" && !t.removedFromBooking)
                .length !== 1
                ? "s"
                : ""}
              available for scheduling.
              {booking.tours?.filter((t) => t.status === "cancelled" || t.removedFromBooking)
                .length > 0 && (
                <span className="block text-amber-400 mt-2">
                  Note:{" "}
                  {
                    booking.tours?.filter((t) => t.status === "cancelled" || t.removedFromBooking)
                      .length
                  }
                  tour
                  {booking.tours?.filter((t) => t.status === "cancelled" || t.removedFromBooking)
                    .length !== 1
                    ? "s"
                    : ""}
                  were cancelled in this booking
                </span>
              )}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-stone-700 hover:bg-stone-600 text-white rounded-lg font-medium transition-colors cursor-pointer"
              >
                Close
              </button>
              {booking.status === "paid" && (
                <button
                  onClick={() => {
                    onClose();
                    // Trigger schedule modal from parent
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-lg font-medium transition-colors cursor-pointer"
                >
                  Schedule Tours
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const schedule = currentTour?.schedule;
  if (!schedule) return null;

  const tourStatus = getTourStatus(currentTour);
  const statusConfig = statusConfigs[tourStatus];
  const tourTypeConfig = schedule.tourType ? tourTypes[schedule.tourType] : tourTypes.day_tour;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-stone-800 rounded-xl border border-stone-700 w-full max-w-6xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="border-b border-stone-700 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FaCalendarAlt className="text-emerald-400 text-xl" />
                <h2 className="text-2xl font-bold text-white">Tour Schedule</h2>
                <div className="flex items-center gap-2">
                  <div
                    className={`px-3 py-1 rounded-full flex items-center gap-2 ${statusConfig.color} bg-opacity-20 border ${statusConfig.borderColor}`}
                  >
                    <statusConfig.icon className="text-sm" />
                    <span className="text-sm font-medium">{statusConfig.label}</span>
                  </div>
                  <div className="text-sm text-stone-400">{statusConfig.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-stone-400">
                <div className="flex items-center gap-2">
                  <FaInfoCircle className="text-amber-400" />
                  <span>Booking #{booking.requestId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUserFriends className="text-amber-400" />
                  <span>
                    {booking.customer?.name} • {totalTours} Scheduled tour
                    {totalTours !== 1 ? "s" : ""}
                    {(() => {
                      const confirmedTours =
                        booking.tours?.filter(
                          (t) => t.status === "confirmed" && !t.removedFromBooking
                        ).length || 0;
                      const cancelledTours =
                        booking.tours?.filter(
                          (t) => t.status === "cancelled" || t.removedFromBooking
                        ).length || 0;

                      let extraText = "";
                      if (confirmedTours > totalTours) {
                        extraText += ` (${confirmedTours - totalTours} Unscheduled)`;
                      }
                      if (cancelledTours > 0) {
                        extraText += ` • ${cancelledTours} Cancelled`;
                      }
                      return extraText;
                    })()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-blue-400" />
                  <span>
                    {booking.scheduledAt &&
                      format(new Date(booking.scheduledAt), "MMM d, yyyy h:mm a")}
                  </span>
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

          {/* Tour Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTourIndex((i) => Math.max(0, i - 1))}
              disabled={activeTourIndex === 0}
              className="px-3 py-1.5 bg-stone-700 hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed rounded flex items-center gap-2 cursor-pointer"
            >
              ← Previous
            </button>

            <div className="flex-1 overflow-x-auto">
              <div className="flex gap-2">
                {scheduledTours.map((tour, index) => {
                  const tourStatus = getTourStatus(tour);
                  const config = statusConfigs[tourStatus];
                  const typeConfig = tour.schedule?.tourType
                    ? tourTypes[tour.schedule.tourType]
                    : tourTypes.day_tour;

                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setActiveTourIndex(index);
                        setActiveDayIndex(0);
                      }}
                      className={`px-4 py-3 rounded-lg flex items-center gap-2 whitespace-nowrap cursor-pointer border ${
                        activeTourIndex === index
                          ? `${typeConfig.bgColor} ${typeConfig.borderColor} text-white`
                          : "bg-stone-700 hover:bg-stone-600 text-stone-300 border-stone-600"
                      }`}
                    >
                      <config.icon className={config.color.replace("bg-", "text-")} />
                      <div className="text-left">
                        <div className="font-medium">Tour {index + 1}</div>
                        <div className="text-xs opacity-80 truncate max-w-[150px]">
                          {tour.title}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setActiveTourIndex((i) => Math.min(totalTours - 1, i + 1))}
              disabled={activeTourIndex === totalTours - 1}
              className="px-3 py-1.5 bg-stone-700 hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed rounded flex items-center gap-2 cursor-pointer"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {currentTour && schedule && (
            <div className="space-y-6">
              {/* Tour Overview Card */}
              <div className="bg-gradient-to-br from-stone-800/40 to-stone-900/40 rounded-xl p-5 border border-stone-600">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-bold text-white text-xl mb-2">{currentTour.title}</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <tourTypeConfig.icon className="text-blue-400" />
                        <span className="text-stone-300">{tourTypeConfig.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarDay className="text-emerald-400" />
                        <span className="text-stone-300">
                          {format(
                            new Date(currentTour.date || currentTour.confirmedDate),
                            "EEEE, MMMM d, yyyy"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaUserFriends className="text-amber-400" />
                        <span className="text-stone-300">{currentTour.guests} guests</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div
                      className={`px-4 py-2 rounded-lg ${tourTypeConfig.bgColor} border ${tourTypeConfig.borderColor}`}
                    >
                      <div className="flex items-center gap-2">
                        <tourTypeConfig.icon />
                        <span className="font-bold">{tourTypeConfig.label}</span>
                      </div>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-lg ${statusConfig.color} bg-opacity-20 border ${statusConfig.borderColor}`}
                    >
                      <div className="flex items-center gap-2">
                        <statusConfig.icon />
                        <span className="font-bold">{statusConfig.label}</span>
                      </div>
                    </div>
                  </div>
                  {!currentTour.completed &&
                    currentTour.status !== "cancelled" &&
                    !currentTour.removedFromBooking && (
                      <button
                        onClick={() => handleCompleteTour(activeTourIndex)}
                        disabled={completingTourIndex === activeTourIndex}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
                          completingTourIndex === activeTourIndex
                            ? "bg-purple-600 opacity-50"
                            : "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
                        } text-white font-medium transition-colors`}
                      >
                        {completingTourIndex === activeTourIndex ? (
                          <>
                            <svg
                              className="animate-spin h-4 w-4 text-white"
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
                            Marking Complete...
                          </>
                        ) : (
                          <>
                            <FaCheckCircle className="mr-2" />
                            Mark as Completed
                          </>
                        )}
                      </button>
                    )}
                  {currentTour.completed && (
                    <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30 flex items-center gap-2">
                      <FaCheckCircle />
                      <span className="font-bold">Completed</span>
                      {currentTour.completedAt && (
                        <span className="text-xs text-green-300">
                          {format(new Date(currentTour.completedAt), "MMM d, HH:mm")}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Timing Details */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-stone-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaClock className="text-purple-400" />
                      <span className="text-sm font-medium text-stone-400">Duration</span>
                    </div>
                    <div className="text-white font-bold">
                      {schedule.tourType === "multi_day_tour" && (
                        <>{schedule.durationDays || 1} Days</>
                      )}
                      {schedule.tourType === "hourly_tour" && (
                        <>
                          {schedule.startTime} - {schedule.endTime}
                          <span className="text-sm text-stone-400 block">
                            ({schedule.durationHours || 0} hours)
                          </span>
                        </>
                      )}
                      {(schedule.tourType === "day_tour" ||
                        schedule.tourType === "multi_day_tour") && (
                        <>{schedule.durationHours || 8} hours/day</>
                      )}
                    </div>
                  </div>

                  <div className="bg-stone-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaCalendarAlt className="text-blue-400" />
                      <span className="text-sm font-medium text-stone-400">Scheduled By</span>
                    </div>
                    <div className="text-white font-bold">
                      {schedule.scheduledBy || booking.scheduledBy || "Unknown"}
                    </div>
                    <div className="text-stone-400 text-xs mt-1">
                      {schedule.scheduledAt &&
                        format(new Date(schedule.scheduledAt), "MMM d, yyyy HH:mm")}
                    </div>
                  </div>

                  <div className="bg-stone-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaUser className="text-amber-400" />
                      <span className="text-sm font-medium text-stone-400">Price</span>
                    </div>
                    <div className="text-white font-bold">
                      ${currentTour.calculatedPrice?.toLocaleString() || "0"}
                    </div>
                    <div className="text-stone-400 text-xs">
                      {currentTour.guests} guest{currentTour.guests !== 1 ? "s" : ""}
                    </div>
                  </div>

                  <div className="bg-stone-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaExclamationTriangle className="text-yellow-400" />
                      <span className="text-sm font-medium text-stone-400">Booking Status</span>
                    </div>
                    <div className="text-white font-bold">{booking.status?.replace(/_/g, " ")}</div>
                    <div className="text-stone-400 text-xs">
                      {booking.paymentStatus?.replace(/_/g, " ")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Guide & Driver Assignment */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Guide Card */}
                <div
                  className={`bg-gradient-to-br from-stone-800/40 to-stone-900/40 rounded-xl p-5 border ${
                    schedule.guide?.assigned
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-stone-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white flex items-center">
                      <FaUser
                        className={`${
                          schedule.guide?.assigned ? "text-emerald-400" : "text-amber-400"
                        } mr-2`}
                      />
                      Tour Guide
                    </h3>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        schedule.guide?.assigned
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {schedule.guide?.assigned ? "Assigned" : "Not Assigned"}
                    </div>
                  </div>

                  {schedule.guide?.assigned ? (
                    <div className="space-y-4">
                      <div className="bg-stone-700/50 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <FaUser className="text-emerald-400" />
                          </div>
                          <div>
                            <div className="text-white font-bold text-lg">
                              {schedule.guide.name}
                            </div>
                            <div className="text-sm text-stone-400">Tour Guide</div>
                            {schedule.guide.assignedAt && (
                              <div className="text-xs text-stone-500">
                                Assigned:{" "}
                                {format(new Date(schedule.guide.assignedAt), "MMM d, yyyy HH:mm")}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          {schedule.guide.phone && (
                            <div className="flex items-center gap-2">
                              <FaPhone className="text-stone-500" size={14} />
                              <a
                                href={`tel:${schedule.guide.phone}`}
                                className="text-stone-300 hover:text-white"
                              >
                                {schedule.guide.phone}
                              </a>
                            </div>
                          )}
                          {schedule.guide.email && (
                            <div className="flex items-center gap-2">
                              <FaInfoCircle className="text-stone-500" size={14} />
                              <a
                                href={`mailto:${schedule.guide.email}`}
                                className="text-stone-300 hover:text-white"
                              >
                                {schedule.guide.email}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-stone-500">
                      <FaUser className="text-4xl mx-auto mb-3 opacity-50" />
                      <p>No guide assigned yet</p>
                    </div>
                  )}
                </div>

                {/* Driver Card */}
                <div
                  className={`bg-gradient-to-br from-stone-800/40 to-stone-900/40 rounded-xl p-5 border ${
                    schedule.driver?.assigned
                      ? "border-blue-500/30 bg-blue-500/5"
                      : "border-stone-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white flex items-center">
                      <FaCar
                        className={`${
                          schedule.driver?.assigned ? "text-blue-400" : "text-amber-400"
                        } mr-2`}
                      />
                      Driver & Vehicle
                    </h3>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        schedule.driver?.assigned
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {schedule.driver?.assigned ? "Assigned" : "Not Assigned"}
                    </div>
                  </div>

                  {schedule.driver?.assigned ? (
                    <div className="space-y-4">
                      <div className="bg-stone-700/50 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <FaCar className="text-blue-400" />
                          </div>
                          <div>
                            <div className="text-white font-bold text-lg">
                              {schedule.driver.name}
                            </div>
                            <div className="text-sm text-stone-400">Driver</div>
                            {schedule.driver.assignedAt && (
                              <div className="text-xs text-stone-500">
                                Assigned:{" "}
                                {format(new Date(schedule.driver.assignedAt), "MMM d, yyyy HH:mm")}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          {schedule.driver.phone && (
                            <div className="flex items-center gap-2">
                              <FaPhone className="text-stone-500" size={14} />
                              <a
                                href={`tel:${schedule.driver.phone}`}
                                className="text-stone-300 hover:text-white"
                              >
                                {schedule.driver.phone}
                              </a>
                            </div>
                          )}
                          {schedule.driver.vehicle && (
                            <div className="flex items-center gap-2">
                              <FaInfoCircle className="text-stone-500" size={14} />
                              <div className="text-stone-300">{schedule.driver.vehicle}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-stone-500">
                      <FaCar className="text-4xl mx-auto mb-3 opacity-50" />
                      <p>No driver assigned yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Meeting & Drop-off Points */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Meeting Point Card */}
                {schedule.meetingPoint && (
                  <div className="bg-gradient-to-br from-stone-800/40 to-stone-900/40 rounded-xl p-5 border border-green-500/30">
                    <h3 className="font-bold text-white mb-4 flex items-center">
                      <FaMapMarkerAlt className="text-green-400 mr-2" />
                      Meeting Point
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-stone-700/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FaMapMarkedAlt className="text-green-400" />
                          <span className="text-white font-medium">Location</span>
                        </div>
                        <p className="text-stone-300">
                          {schedule.meetingPoint.location || "Not specified"}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaClock className="text-blue-400" />
                          <span className="text-stone-400">Meeting Time:</span>
                          <span className="text-white font-medium">
                            {schedule.meetingPoint.time || "Not specified"}
                          </span>
                        </div>
                      </div>

                      {schedule.meetingPoint.notes && (
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <FaExclamationTriangle className="text-amber-400" />
                            <span className="text-amber-300 text-sm font-medium">Notes</span>
                          </div>
                          <p className="text-amber-200/80 text-sm">{schedule.meetingPoint.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Drop-off Point Card */}
                {schedule.dropoffPoint && (
                  <div className="bg-gradient-to-br from-stone-800/40 to-stone-900/40 rounded-xl p-5 border border-red-500/30">
                    <h3 className="font-bold text-white mb-4 flex items-center">
                      <FaMapMarkerAlt className="text-red-400 mr-2" />
                      Drop-off Point
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-stone-700/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FaMapMarkedAlt className="text-red-400" />
                          <span className="text-white font-medium">Location</span>
                        </div>
                        <p className="text-stone-300">
                          {schedule.dropoffPoint.location || "Not specified"}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaClock className="text-blue-400" />
                          <span className="text-stone-400">Drop-off Time:</span>
                          <span className="text-white font-medium">
                            {schedule.dropoffPoint.time || "Not specified"}
                          </span>
                        </div>
                      </div>

                      {schedule.dropoffPoint.notes && (
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <FaExclamationTriangle className="text-amber-400" />
                            <span className="text-amber-300 text-sm font-medium">Notes</span>
                          </div>
                          <p className="text-amber-200/80 text-sm">{schedule.dropoffPoint.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Itinerary */}
              {schedule.itinerary && schedule.itinerary.length > 0 && (
                <div className="bg-gradient-to-br from-stone-800/40 to-stone-900/40 rounded-xl p-5 border border-purple-500/30">
                  <h3 className="font-bold text-white mb-4 flex items-center">
                    <FaClock className="text-purple-400 mr-2" />
                    {schedule.itineraryType === "multi_day" ||
                    schedule.tourType === "multi_day_tour"
                      ? "Multi-Day Itinerary"
                      : "Daily Itinerary"}
                  </h3>

                  {schedule.itineraryType === "multi_day" ||
                  schedule.tourType === "multi_day_tour" ? (
                    <>
                      {/* Check if itinerary has day structure (multi-day) */}
                      {schedule.itinerary[0]?.day !== undefined ? (
                        <>
                          {/* Day Tabs for Multi-Day */}
                          <div className="flex gap-2 mb-6 overflow-x-auto">
                            {schedule.itinerary.map((daySchedule, dayIndex) => (
                              <button
                                key={dayIndex}
                                onClick={() => setActiveDayIndex(dayIndex)}
                                className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center gap-2 ${
                                  activeDayIndex === dayIndex
                                    ? "bg-purple-600 text-white"
                                    : "bg-stone-700 hover:bg-stone-600 text-stone-300"
                                }`}
                              >
                                <FaCalendarDay />
                                <span>
                                  Day {daySchedule.day}:{" "}
                                  {format(new Date(daySchedule.date), "MMM d")}
                                </span>
                              </button>
                            ))}
                          </div>

                          {/* Activities for selected day */}
                          <div>
                            <h4 className="text-white font-bold mb-4 flex items-center">
                              <FaListUl className="text-blue-400 mr-2" />
                              Day {schedule.itinerary[activeDayIndex]?.day} - Activities
                            </h4>

                            {schedule.itinerary[activeDayIndex]?.activities?.length > 0 ? (
                              <div className="space-y-3">
                                {schedule.itinerary[activeDayIndex].activities.map(
                                  (item, index) => (
                                    <div
                                      key={index}
                                      className="bg-stone-700/50 rounded-lg p-4 border-l-4 border-blue-500"
                                    >
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                          <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                                            {item.time}
                                          </div>
                                          <div className="text-white font-bold">
                                            {item.activity}
                                          </div>
                                        </div>
                                      </div>
                                      {item.description && (
                                        <p className="text-stone-300 text-sm pl-10">
                                          {item.description}
                                        </p>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-stone-500">
                                <FaCalendarTimes className="text-3xl mx-auto mb-3 opacity-50" />
                                <p>No activities scheduled for this day</p>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        // If itinerary doesn't have day structure, show as regular itinerary
                        <div className="space-y-3">
                          {schedule.itinerary.map((item, index) => (
                            <div
                              key={index}
                              className="bg-stone-700/50 rounded-lg p-4 border-l-4 border-blue-500"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                                    {item.time}
                                  </div>
                                  <div className="text-white font-bold">{item.activity}</div>
                                </div>
                              </div>
                              {item.description && (
                                <p className="text-stone-300 text-sm pl-10">{item.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    /* Single Day Itinerary */
                    <div className="space-y-3">
                      {schedule.itinerary.map((item, index) => (
                        <div
                          key={index}
                          className="bg-stone-700/50 rounded-lg p-4 border-l-4 border-blue-500"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                                {item.time}
                              </div>
                              <div className="text-white font-bold">{item.activity}</div>
                            </div>
                          </div>
                          {item.description && (
                            <p className="text-stone-300 text-sm pl-10">{item.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Equipment & Notes */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Equipment */}
                {schedule.equipment && schedule.equipment.length > 0 && (
                  <div className="bg-gradient-to-br from-stone-800/40 to-stone-900/40 rounded-xl p-5 border border-amber-500/30">
                    <h3 className="font-bold text-white mb-4 flex items-center">
                      <FaTools className="text-amber-400 mr-2" />
                      Equipment & Requirements
                    </h3>

                    <div className="space-y-3">
                      {schedule.equipment.map((item, index) => (
                        <div
                          key={index}
                          className="bg-stone-700/50 rounded-lg p-3 border border-amber-500/20"
                        >
                          <div className="flex justify-between items-center">
                            <div className="text-white font-medium">{item.item}</div>
                            <div className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm">
                              Qty: {item.quantity}
                            </div>
                          </div>
                          {item.notes && (
                            <p className="text-stone-400 text-sm mt-2">{item.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Notes */}
                {(schedule.scheduleNotes || schedule.notes) && (
                  <div className="bg-gradient-to-br from-stone-800/40 to-stone-900/40 rounded-xl p-5 border border-emerald-500/30">
                    <h3 className="font-bold text-white mb-4 flex items-center">
                      <FaStickyNote className="text-emerald-400 mr-2" />
                      Additional Notes
                    </h3>

                    <div className="bg-stone-700/50 rounded-lg p-4">
                      <p className="text-stone-300 whitespace-pre-wrap">
                        {schedule.scheduleNotes || schedule.notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tour Status Information */}
              <div className="bg-gradient-to-br from-stone-800/40 to-stone-900/40 rounded-xl p-5 border border-stone-600">
                <h3 className="font-bold text-white mb-4 flex items-center">
                  <FaInfoCircle className="text-blue-400 mr-2" />
                  Tour Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Tour ID:</span>
                      <span className="text-white font-mono text-sm">{currentTour.tourId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Booking Tour ID:</span>
                      <span className="text-white font-mono text-sm">{currentTour.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Availability Status:</span>
                      <span
                        className={`font-medium ${
                          currentTour.availabilityStatus === "available"
                            ? "text-green-400"
                            : currentTour.availabilityStatus === "limited"
                            ? "text-amber-400"
                            : currentTour.availabilityStatus === "alternative"
                            ? "text-blue-400"
                            : "text-red-400"
                        }`}
                      >
                        {currentTour.availabilityStatus || "unknown"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Original Date:</span>
                      <span className="text-white">
                        {currentTour.date &&
                          format(new Date(currentTour.originalDate), "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Confirmed Date:</span>
                      <span className="text-white">
                        {currentTour.confirmedDate &&
                          format(new Date(currentTour.confirmedDate), "MMM d, yyyy")}
                      </span>
                    </div>
                    {currentTour.availabilityNotes && (
                      <div className="pt-2 border-t border-stone-700">
                        <div className="text-stone-400 text-sm mb-1">Availability Notes:</div>
                        <p className="text-stone-300 text-sm">{currentTour.availabilityNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
                {booking.tours?.filter((t) => t.status === "cancelled" || t.removedFromBooking)
                  .length > 0 && (
                  <div className="mt-4 pt-4 border-t border-stone-700">
                    <div className="flex items-center gap-2 text-amber-400 mb-2">
                      <FaExclamationTriangle />
                      <span className="font-medium">Booking Note</span>
                    </div>
                    <p className="text-amber-300/80 text-sm">
                      This booking includes{" "}
                      {
                        booking.tours?.filter(
                          (t) => t.status === "cancelled" || t.removedFromBooking
                        ).length
                      }{" "}
                      Cancelled tour
                      {booking.tours?.filter(
                        (t) => t.status === "cancelled" || t.removedFromBooking
                      ).length !== 1
                        ? "s"
                        : ""}
                      . Only confirmed tours are shown here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-stone-700 p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-stone-400">
              <div className="flex items-center gap-4">
                <div>
                  Tour {activeTourIndex + 1} of {totalTours}
                </div>
                <div className="flex items-center gap-2">
                  <tourTypeConfig.icon />
                  <span>{tourTypeConfig.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <statusConfig.icon />
                  <span>{statusConfig.label}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-stone-700 hover:bg-stone-600 text-white rounded-lg font-medium transition-colors cursor-pointer"
              >
                Close
              </button>
              {/* You can add edit button here if needed */}
              <button
                onClick={onEditSchedule}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg font-medium transition-colors flex items-center cursor-pointer"
              >
                <FaEye className="mr-2" />
                Edit Schedule
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewScheduleModal;
