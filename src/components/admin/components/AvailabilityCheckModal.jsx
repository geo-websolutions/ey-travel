"use client";

import { format, set } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheck,
  FaTimes,
  FaCalendarAlt,
  FaUsers,
  FaImage,
  FaEdit,
  FaSave,
  FaClipboardCheck,
  FaStickyNote,
  FaUser,
  FaDollarSign,
  FaEnvelope,
  FaPhone,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationCircle,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AvailabilityCheckModal = ({ booking, isOpen, onClose, onConfirmAvailability }) => {
  const [tourStatuses, setTourStatuses] = useState([]);
  const [currentTourIndex, setCurrentTourIndex] = useState(0);
  const [quickStatus, setQuickStatus] = useState("available");
  const [step, setStep] = useState(1); // 1: Set status, 2: Review & confirm
  const [validationErrors, setValidationErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (booking?.tours) {
      if (!booking?.availabilityConfirmed) {
        // First time checking availability - initialize from booking
        const initialStatuses = booking.tours.map((tour) => ({
          id: tour.id, // Keep the unique booking tour ID
          tourId: tour.tourId, // This is the actual tour document ID
          title: tour.title,
          date: tour.date,
          originalDate: tour.date,
          guests: tour.guests,
          image: tour.image,
          price: tour.calculatedPrice,
          status: "pending",
          notes: "",
          limitedPlaces: null,
          alternativeDate: null,
          confirmed: false,
        }));
        setTourStatuses(initialStatuses);
      } else {
        // Already checked - load existing data
        const existingStatuses = booking.tours.map((tour) => {
          // Parse dates correctly
          const originalDate = tour.date;
          const alternativeDate = tour.alternativeDate || null;

          return {
            id: tour.id, // Keep the unique booking tour ID
            tourId: tour.tourId, // This is the actual tour document ID
            title: tour.title,
            date: originalDate,
            originalDate: originalDate,
            guests: tour.guests,
            image: tour.image,
            price: tour.calculatedPrice,
            status: tour.availabilityStatus || "pending",
            notes: tour.availabilityNotes || "",
            limitedPlaces: tour.limitedPlaces || null,
            alternativeDate: alternativeDate,
            confirmed:
              tour.availabilityStatus &&
              ["available", "limited", "alternative"].includes(tour.availabilityStatus),
          };
        });
        setTourStatuses(existingStatuses);
      }
      setCurrentTourIndex(0);
      setStep(1);
    }
  }, [booking]);

  const currentTour = tourStatuses[currentTourIndex];
  const totalTours = tourStatuses.length;
  const confirmedCount = tourStatuses.filter(
    (t) => t.status === "available" || t.status === "limited" || t.status === "alternative"
  ).length;
  const unavailableCount = tourStatuses.filter((t) => t.status === "unavailable").length;
  const hasMixedStatus = !tourStatuses.every(
    (t) => t.status === "available" || t.status === "unavailable"
  );

  const handleQuickApply = () => {
    const updated = tourStatuses.map((tour) => {
      const newStatus = {
        ...tour,
        status: quickStatus,
        confirmed: ["available", "limited", "alternative"].includes(quickStatus),
      };

      // If applying "limited" globally, prompt for places
      if (quickStatus === "limited") {
        newStatus.limitedPlaces = Math.max(1, Math.floor(tour.guests / 2));
      }

      // If applying "alternative" globally, show date picker
      if (quickStatus === "alternative") {
        // Set default alternative date (7 days after original)
        const originalDate = new Date(tour.date);
        const alternativeDate = new Date(originalDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        newStatus.alternativeDate = alternativeDate.toISOString();
      }

      return newStatus;
    });

    setTourStatuses(updated);

    // If quick status is alternative, prompt for dates
    if (quickStatus === "alternative") {
      setShowDatePicker(true);
    }
  };

  const handleTourStatusChange = (index, status) => {
    const updated = [...tourStatuses];
    const tour = updated[index];

    updated[index] = {
      ...tour,
      status,
      confirmed: ["available", "limited", "alternative"].includes(status),
    };

    // Set defaults if needed
    if (status === "limited") {
      updated[index].limitedPlaces = tour.limitedPlaces || Math.max(1, Math.floor(tour.guests / 2));
    }

    if (status === "alternative") {
      // Convert ISO date string to Date, add 7 days, then back to ISO string
      if (!tour.alternativeDate) {
        const originalDate = new Date(tour.date);
        const alternativeDate = new Date(originalDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        updated[index].alternativeDate = alternativeDate.toISOString();
      }
    }

    setTourStatuses(updated);
    setValidationErrors({});
  };

  const handleLimitedPlacesChange = (index, places) => {
    const updated = [...tourStatuses];
    updated[index] = {
      ...updated[index],
      limitedPlaces: parseInt(places) || 0,
    };
    setTourStatuses(updated);
  };

  const handleAlternativeDateChange = (index, date) => {
    const updated = [...tourStatuses];
    // Store as ISO string
    updated[index] = {
      ...updated[index],
      alternativeDate: date.toISOString(),
    };
    setTourStatuses(updated);
  };

  const handleTourNotesChange = (index, notes) => {
    const updated = [...tourStatuses];
    updated[index] = { ...updated[index], notes };
    setTourStatuses(updated);
  };

  const getStatusConfig = (status) => {
    const configs = {
      available: { label: "Available", color: "bg-green-500", text: "text-white", icon: "✓" },
      limited: { label: "Limited", color: "bg-yellow-500", text: "text-white", icon: "⚠" },
      unavailable: { label: "Unavailable", color: "bg-red-500", text: "text-white", icon: "✗" },
      alternative: {
        label: "Alternative Date",
        color: "bg-blue-500",
        text: "text-white",
        icon: "📅",
      },
      pending: { label: "Pending", color: "bg-gray-500", text: "text-white", icon: "?" },
    };
    return configs[status] || configs.pending;
  };

  const validateInputs = () => {
    const errors = {};

    tourStatuses.forEach((tour, index) => {
      if (tour.status === "limited") {
        if (!tour.limitedPlaces || tour.limitedPlaces <= 0) {
          errors[`tour-${index}-places`] = "Please enter the number of available places";
        }
      }
      if (tour.status === "alternative") {
        if (!tour.alternativeDate) {
          errors[`tour-${index}-date`] = "Please select an alternative date";
        } else if (tour.alternativeDate <= new Date()) {
          errors[`tour-${index}-date`] = "Alternative date must be in the future";
        }
      }
      if (tour.status === "pending") {
        errors[`tour-${index}-status`] = "Please select a status";
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinue = () => {
    if (validateInputs()) {
      if (hasMixedStatus) {
        setStep(2); // Go to review step
      } else {
        // If handleConfirm will be called immediately
        setLoading(true); // Set loading here if it's immediate
        handleConfirm();
      }
    }
  };

  const handleConfirm = async () => {
    if (!validateInputs()) return;

    const availabilityResults = tourStatuses.map((tour) => ({
      id: tour.id, // The unique booking tour ID (e.g., "ac658d68-3667-47e5-8da0-24ff359a3199")
      tourId: tour.tourId, // The actual tour document ID (e.g., "mBSfK0GwbfnYJ4YkQauS")
      title: tour.title,
      date: tour.date,
      guests: tour.guests,
      status: tour.status,
      notes: tour.notes,
      limitedPlaces: tour.limitedPlaces,
      alternativeDate: tour.alternativeDate,
      confirmed: tour.confirmed,
    }));

    setLoading(true);
    await onConfirmAvailability(booking.id, availabilityResults);
    setLoading(false);
  };

  const renderStatusOptions = (tourIndex) => {
    const tour = tourStatuses[tourIndex];
    const config = getStatusConfig(tour.status);

    return (
      <div className="mb-6">
        <h5 className="font-bold text-white mb-3">Set Availability Status</h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {["available", "limited", "unavailable", "alternative"].map((status) => {
            const statusConfig = getStatusConfig(status);
            return (
              <button
                key={status}
                onClick={() => handleTourStatusChange(tourIndex, status)}
                className={`p-3 rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${
                  tour.status === status
                    ? `${statusConfig.color} text-white`
                    : "bg-stone-600 hover:bg-stone-500 text-stone-300"
                }`}
              >
                <span className="text-xl">{statusConfig.icon}</span>
                <span className="text-sm font-medium">{statusConfig.label}</span>
              </button>
            );
          })}
        </div>

        {/* Limited Places Input */}
        {tour.status === "limited" && (
          <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <label className="block text-white mb-2 font-medium">
              <span className="flex items-center gap-2">
                <FaUsers className="text-yellow-400" />
                Available Places (Limited Capacity)
              </span>
              <span className="text-sm text-yellow-300">
                Original request: {tour.guests} guest{tour.guests !== 1 ? "s" : ""}
              </span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max={tour.guests * 2} // Reasonable upper limit
                value={tour.limitedPlaces || ""}
                onChange={(e) => handleLimitedPlacesChange(tourIndex, e.target.value)}
                className="flex-1 bg-stone-600 border border-stone-500 rounded-lg px-4 py-2 text-white"
                placeholder="Enter number of available places"
              />
              <span className="text-stone-400 whitespace-nowrap">places available</span>
            </div>
            {validationErrors[`tour-${tourIndex}-places`] && (
              <div className="text-red-400 text-sm mt-2 flex items-center gap-2">
                <FaExclamationCircle />
                {validationErrors[`tour-${tourIndex}-places`]}
              </div>
            )}
          </div>
        )}

        {/* Alternative Date Picker */}
        {tour.status === "alternative" && (
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <label className="block text-white mb-2 font-medium">
              <span className="flex items-center gap-2">
                <FaCalendarAlt className="text-blue-400" />
                Select Available Date
              </span>
              <span className="text-sm text-blue-300">
                Original date: {format(tour.date, "MMM d, yyyy")} not available
              </span>
            </label>
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <DatePicker
                selected={tour.alternativeDate}
                onChange={(date) => handleAlternativeDateChange(tourIndex, date)}
                minDate={new Date()}
                className="bg-stone-600 border border-stone-500 rounded-lg px-4 py-2 text-white"
                dateFormat="MMM d, yyyy"
                placeholderText="Select alternative date"
                showPopperArrow={false}
              />
              {tour.alternativeDate && (
                <span className="text-stone-300">
                  Selected: {format(tour.alternativeDate, "MMM d, yyyy")}
                </span>
              )}
            </div>
            {validationErrors[`tour-${tourIndex}-date`] && (
              <div className="text-red-400 text-sm mt-2 flex items-center gap-2">
                <FaExclamationCircle />
                {validationErrors[`tour-${tourIndex}-date`]}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderQuickActions = () => (
    <div className="bg-stone-700/50 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-bold text-white mb-1">Quick Actions</h3>
          <p className="text-sm text-stone-400">Set status for all tours at once</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={quickStatus}
            onChange={(e) => setQuickStatus(e.target.value)}
            className="bg-stone-600 border border-stone-500 rounded px-3 py-1.5 text-white text-sm"
          >
            <option value="available">Available</option>
            <option value="limited">Limited</option>
            <option value="unavailable">Unavailable</option>
            <option value="alternative">Alternative Date</option>
          </select>
          <button
            onClick={handleQuickApply}
            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-sm font-medium"
          >
            Apply to All
          </button>
        </div>
      </div>

      {quickStatus === "alternative" && showDatePicker && (
        <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
          <p className="text-sm text-blue-300 mb-2">
            Please review and adjust alternative dates for each tour individually
          </p>
        </div>
      )}
    </div>
  );

  const renderStep1 = () => (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full flex flex-col"
    >
      {renderQuickActions()}

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Tour Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentTourIndex((i) => Math.max(0, i - 1))}
            disabled={currentTourIndex === 0}
            className="px-3 py-2 rounded-lg bg-stone-700 hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FaChevronLeft />
            Previous
          </button>

          <div className="text-center">
            <div className="text-sm text-stone-400">
              Tour {currentTourIndex + 1} of {totalTours}
            </div>
            <div className="text-lg font-bold text-white truncate max-w-md">
              {currentTour?.title}
            </div>
          </div>

          <button
            onClick={() => setCurrentTourIndex((i) => Math.min(totalTours - 1, i + 1))}
            disabled={currentTourIndex === totalTours - 1}
            className="px-3 py-2 rounded-lg bg-stone-700 hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Next
            <FaChevronRight />
          </button>
        </div>

        {/* Current Tour Card */}
        {currentTour && (
          <div className="flex-1 overflow-y-auto">
            <div className="bg-stone-700/30 rounded-xl border border-stone-600 overflow-hidden mb-4">
              <div className="p-5">
                <div className="flex items-start gap-4 mb-4">
                  {currentTour.image && (
                    <img
                      src={currentTour.image}
                      alt={currentTour.title}
                      className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">{currentTour.title}</h4>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-amber-400" />
                        <span className="text-stone-300">
                          {format(currentTour.date, "MMM d, yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaUsers className="text-amber-400" />
                        <span className="text-stone-300">
                          {currentTour.guests} guest{currentTour.guests !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaDollarSign className="text-amber-400" />
                        <span className="text-stone-300">${currentTour.price}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {renderStatusOptions(currentTourIndex)}

                {/* Tour Notes */}
                <div>
                  <h5 className="font-bold text-white mb-3">Tour Notes</h5>
                  <textarea
                    value={currentTour.notes}
                    onChange={(e) => handleTourNotesChange(currentTourIndex, e.target.value)}
                    className="w-full bg-stone-600 border border-stone-500 rounded-lg p-3 text-white"
                    rows="3"
                    placeholder="Add notes specific to this tour..."
                  />
                </div>
              </div>
            </div>

            {/* Tour Progress */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-stone-400">Tour Progress</span>
                <span className="text-sm text-stone-300">
                  {currentTourIndex + 1}/{totalTours}
                </span>
              </div>
              <div className="h-2 bg-stone-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-300"
                  style={{ width: `${((currentTourIndex + 1) / totalTours) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full overflow-y-auto"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-4">Review & Confirm</h3>
        <p className="text-stone-400 mb-6">
          Please review the availability status for each tour. Mixed status bookings require
          confirmation.
        </p>
      </div>

      <div className="space-y-4">
        {tourStatuses.map((tour, index) => {
          const config = getStatusConfig(tour.status);
          return (
            <div key={index} className="bg-stone-700/30 rounded-xl p-4 border border-stone-600">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`px-3 py-1 rounded-full ${config.color} bg-opacity-20`}>
                      <span className={`font-medium ${config.text}`}>{config.label}</span>
                    </div>
                    <h4 className="font-bold text-white">{tour.title}</h4>
                  </div>
                  <div className="text-sm text-stone-400">
                    Original date: {format(tour.date, "MMM d, yyyy")} · {tour.guests} guest
                    {tour.guests !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              {/* Status Details */}
              <div className="space-y-2">
                {tour.status === "limited" && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-stone-400">Available places:</span>
                    <span className="text-yellow-300 font-medium">{tour.limitedPlaces}</span>
                  </div>
                )}

                {tour.status === "alternative" && tour.alternativeDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-stone-400">Alternative date:</span>
                    <span className="text-blue-300 font-medium">
                      {format(tour.alternativeDate, "MMM d, yyyy")}
                    </span>
                  </div>
                )}

                {tour.notes && (
                  <div className="text-sm">
                    <span className="text-stone-400">Notes:</span>
                    <p className="text-stone-300 mt-1">{tour.notes}</p>
                  </div>
                )}
              </div>

              {/* Validation Error */}
              {validationErrors[`tour-${index}-places`] && (
                <div className="text-red-400 text-sm mt-2 flex items-center gap-2">
                  <FaExclamationCircle />
                  {validationErrors[`tour-${index}-places`]}
                </div>
              )}
              {validationErrors[`tour-${index}-date`] && (
                <div className="text-red-400 text-sm mt-2 flex items-center gap-2">
                  <FaExclamationCircle />
                  {validationErrors[`tour-${index}-date`]}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
        <div className="flex items-center gap-3">
          <FaExclamationCircle className="text-amber-400 text-xl" />
          <div>
            <h4 className="font-bold text-amber-400 mb-1">Mixed Status Booking</h4>
            <p className="text-amber-300 text-sm">
              This booking contains both available and unavailable tours. Please confirm that all
              statuses and inputs are correct before proceeding.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );

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
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      step === 1 ? "bg-amber-500" : "bg-green-500"
                    }`}
                  />
                  <span className="text-sm text-stone-400">
                    Step {step} of {hasMixedStatus ? 2 : 1}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {step === 1 ? "Set Tour Availability" : "Review & Confirm"}
                </h2>
              </div>
              <div className="flex items-center gap-4 text-sm text-stone-400">
                <div className="flex items-center gap-2">
                  <FaClipboardCheck className="text-amber-400" />
                  <span>Booking #{booking.requestId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUser className="text-amber-400" />
                  <span>{booking.customer.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaDollarSign className="text-amber-400" />
                  <span>${booking.total}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-2 hover:bg-stone-700 rounded-lg transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mt-4">
            <div
              className={`flex-1 h-1 rounded-full ${step >= 1 ? "bg-amber-500" : "bg-stone-700"}`}
            />
            {hasMixedStatus && (
              <>
                <div className="text-xs text-stone-400">→</div>
                <div
                  className={`flex-1 h-1 rounded-full ${
                    step >= 2 ? "bg-amber-500" : "bg-stone-700"
                  }`}
                />
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto p-6">
            <AnimatePresence mode="wait">
              {step === 1 ? renderStep1() : renderStep2()}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-stone-700 p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-stone-400">
              {Object.keys(validationErrors).length > 0 ? (
                <div className="text-red-400 flex items-center gap-2">
                  <FaExclamationCircle />
                  Please fix {Object.keys(validationErrors).length} error(s)
                </div>
              ) : (
                <span>
                  {confirmedCount} available · {unavailableCount} unavailable
                </span>
              )}
            </div>

            <div className="flex gap-3">
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 bg-stone-700 hover:bg-stone-600 text-white rounded-lg font-medium"
                >
                  Back to Edit
                </button>
              )}

              {step === 1 ? (
                <button
                  onClick={handleContinue}
                  disabled={tourStatuses.some((t) => t.status === "pending") || loading}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-700 disabled:text-stone-500 text-white rounded-lg font-medium transition-colors cursor-pointer"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
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
                      Processing...
                    </span>
                  ) : hasMixedStatus ? (
                    "Continue to Review"
                  ) : (
                    "Confirm Availability"
                  )}
                </button>
              ) : (
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg font-medium transition-colors cursor-pointer"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
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
                      Finalizing...
                    </span>
                  ) : (
                    "Finalize & Notify Customer"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AvailabilityCheckModal;
