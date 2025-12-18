"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheck,
  FaTimes,
  FaCalendarAlt,
  FaUsers,
  FaDollarSign,
  FaExclamationTriangle,
  FaArrowRight,
  FaClock,
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaSave,
  FaInfoCircle,
  FaCalendarPlus,
  FaUserMinus,
  FaExchangeAlt,
  FaBars,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

function AvailabilityFeedbackPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [activeTourIndex, setActiveTourIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch booking data on component mount
  useEffect(() => {
    if (!token) {
      setError("Invalid feedback link - token missing");
      setLoading(false);
      return;
    }

    fetchBookingData();
  }, [token]);

  const fetchBookingData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/v1/booking/verify-feedback-request?token=${encodeURIComponent(token)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to load booking data");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Invalid booking data");
      }

      setBooking(data.booking);

      // Initialize feedback state - FIXED STRUCTURE
      if (data.booking.tours) {
        const initialFeedback = data.booking.tours.map((tour) => {
          let decision = "keep";
          let notes = "";
          let modifiedGuests = tour.guests;
          let modifiedDate = tour.date;

          // Set default decisions based on availability status
          if (tour.availabilityStatus === "available") {
            decision = "keep";
          } else if (tour.availabilityStatus === "limited") {
            decision = "modify";
            modifiedGuests = Math.min(tour.limitedPlaces || 1, tour.guests);
          } else if (tour.availabilityStatus === "alternative") {
            decision = "modify";
            modifiedDate = tour.alternativeDate || tour.date;
          } else if (tour.availabilityStatus === "unavailable") {
            decision = "remove";
          }

          return {
            tour_id: tour.id, // CRITICAL: Match API expectation
            title: tour.title,
            availabilityStatus: tour.availabilityStatus,
            originalDate: tour.date,
            originalGuests: tour.guests,
            decision,
            notes,
            modifiedDate,
            modifiedGuests,
            limitedPlaces: tour.limitedPlaces,
            alternativeDate: tour.alternativeDate,
          };
        });

        setFeedback(initialFeedback);
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
      setError(error.message);
      toast.error(`Failed to load booking: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDecisionChange = (index, decision) => {
    const updatedFeedback = [...feedback];
    const tour = updatedFeedback[index];

    // Reset modifications when decision changes
    if (decision === "keep") {
      tour.modifiedDate = tour.originalDate;
      tour.modifiedGuests = tour.originalGuests;
    } else if (decision === "modify") {
      // Set defaults for modification
      if (tour.availabilityStatus === "limited") {
        tour.modifiedGuests = Math.min(tour.limitedPlaces || 1, tour.originalGuests);
      } else if (tour.availabilityStatus === "alternative" && tour.alternativeDate) {
        tour.modifiedDate = tour.alternativeDate;
      }
    } else if (decision === "remove") {
      // Reset modifications for removal
      tour.modifiedDate = tour.originalDate;
      tour.modifiedGuests = tour.originalGuests;
    }

    updatedFeedback[index] = {
      ...tour,
      decision,
    };

    setFeedback(updatedFeedback);
  };

  const handleNotesChange = (index, notes) => {
    const updatedFeedback = [...feedback];
    updatedFeedback[index] = {
      ...updatedFeedback[index],
      notes,
    };
    setFeedback(updatedFeedback);
  };

  const handleGuestsChange = (index, guests) => {
    const updatedFeedback = [...feedback];
    updatedFeedback[index] = {
      ...updatedFeedback[index],
      modifiedGuests: Math.max(1, parseInt(guests) || 1),
    };
    setFeedback(updatedFeedback);
  };

  const handleDateChange = (index, date) => {
    const updatedFeedback = [...feedback];
    updatedFeedback[index] = {
      ...updatedFeedback[index],
      modifiedDate: date ? date.toISOString() : "", // Store as ISO string
    };
    setFeedback(updatedFeedback);
  };

  const validateFeedback = () => {
    const errors = [];

    feedback.forEach((item, index) => {
      if (item.decision === "modify") {
        if (item.availabilityStatus === "limited") {
          if (!item.modifiedGuests || item.modifiedGuests > item.limitedPlaces) {
            errors.push(`Tour ${index + 1}: Number of guests exceeds available places`);
          }
        }
        if (item.availabilityStatus === "alternative") {
          const selectedDate = item.modifiedDate ? new Date(item.modifiedDate) : null;
          if (!selectedDate || selectedDate < new Date()) {
            errors.push(`Tour ${index + 1}: Please select a future date`);
          }
        }
      }
    });

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return false;
    }

    return true;
  };

  const handleSubmitFeedback = async () => {
    if (!validateFeedback()) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare feedback data structure matching the API
      const feedbackData = feedback.map((item) => ({
        tourId: item.tour_id, // Make sure this matches tour.id
        decision: item.decision, // "keep" | "modify" | "remove"
        modificationDetails: {
          guests: item.modifiedGuests,
          date: item.modifiedDate,
          notes: item.notes,
        },
      }));

      // Call the new API endpoint
      const response = await fetch("/api/v1/booking/client-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token, // The token from URL params
          feedback: feedbackData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit feedback");
      }

      // Success - update local state
      setSubmissionComplete(true);
      setBooking((prev) => ({
        ...prev,
        status: "feedback_received",
        total: data.feedbackSummary?.newTotal || prev.total,
      }));

      toast.success("Feedback submitted successfully!");

      // Optional: Redirect after delay
      setTimeout(() => {
        router.push("/");
      }, 10000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error(`Failed to submit feedback: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      available: {
        label: "Available",
        color: "bg-gradient-to-r from-green-500 to-green-600",
        textColor: "text-green-400",
        icon: "✓",
        description: "Tour is available as requested",
      },
      limited: {
        label: "Limited",
        color: "bg-gradient-to-r from-yellow-500 to-amber-600",
        textColor: "text-yellow-400",
        icon: "⚠",
        description: "Limited places available",
      },
      alternative: {
        label: "Alternative",
        color: "bg-gradient-to-r from-blue-500 to-blue-600",
        textColor: "text-blue-400",
        icon: "📅",
        description: "Available on alternative date",
      },
      unavailable: {
        label: "Not Available",
        color: "bg-gradient-to-r from-red-500 to-red-600",
        textColor: "text-red-400",
        icon: "✗",
        description: "Not available on requested date",
      },
    };

    return configs[status] || configs.available;
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-amber-900/30 to-amber-800/30 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
            <FaSpinner className="text-amber-400 text-2xl sm:text-4xl animate-spin" />
          </div>
          <h1 className="text-xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">
            Loading Your Booking Details
          </h1>
          <p className="text-stone-400 text-sm sm:text-base">
            Please wait while we verify your feedback link...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="text-center max-w-lg">
          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-red-900/30 to-red-800/30 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
            <FaExclamationTriangle className="text-red-400 text-2xl sm:text-4xl" />
          </div>
          <h1 className="text-xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">
            Unable to Load Booking
          </h1>
          <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-xl border border-red-500/30 p-4 sm:p-6 mb-4 sm:mb-6">
            <p className="text-red-300 font-medium text-sm sm:text-base mb-2 sm:mb-4">{error}</p>
            <p className="text-stone-400 text-xs sm:text-sm">
              This feedback link may have expired or is invalid. Please contact us for assistance.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/contact"
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-600 transition-all text-sm sm:text-base"
            >
              Contact Support
            </Link>
            <Link
              href="/"
              className="px-4 sm:px-6 py-2 sm:py-3 border border-stone-600 text-stone-300 font-medium rounded-lg hover:bg-stone-700/50 hover:text-white transition-colors text-sm sm:text-base"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Submission complete state
  if (submissionComplete) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="text-center max-w-lg">
          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-green-900/30 to-green-800/30 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
            <FaCheck className="text-green-400 text-2xl sm:text-4xl" />
          </div>
          <h1 className="text-xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">
            Feedback Submitted Successfully!
          </h1>
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl border border-green-500/30 p-4 sm:p-6 mb-4 sm:mb-6">
            <p className="text-green-300 font-medium text-sm sm:text-base mb-2 sm:mb-4">
              Thank you for providing your feedback. Our team will review your preferences and get
              back to you soon.
            </p>
            <div className="text-left space-y-2 sm:space-y-3 text-xs sm:text-sm text-stone-300">
              <div className="flex items-start">
                <FaEnvelope className="text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                <span>
                  We'll send an updated confirmation to{" "}
                  <span className="text-amber-300 font-medium">{booking?.customer?.email}</span>
                </span>
              </div>
              <div className="flex items-start">
                <FaClock className="text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                <span>You'll receive a response within 24 hours</span>
              </div>
            </div>
          </div>
          <p className="text-stone-400 text-xs sm:text-sm mb-4 sm:mb-6">
            Redirecting to homepage in 5 seconds...
          </p>
          <Link
            href="/"
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-600 transition-all text-sm sm:text-base"
          >
            Return Home Now
          </Link>
        </div>
      </div>
    );
  }

  const currentFeedback = feedback[activeTourIndex];
  const totalTours = feedback.length;
  const statusConfig = getStatusConfig(currentFeedback?.availabilityStatus);

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 pt-16 sm:pt-20 mt-15 lg:mt-0">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-16 right-4 z-170">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-stone-800 rounded-lg border border-stone-700"
        >
          <FaBars className="text-amber-400 text-lg" />
        </button>
      </div>

      {/* Progress Header */}
      <div className="fixed top-0 left-0 right-0 z-150 bg-stone-800/95 backdrop-blur-sm border-b border-stone-700">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">
                Tour Availability Feedback
              </h1>
              <p className="text-stone-400 text-xs sm:text-sm">
                Booking #{booking?.requestId} • {totalTours} tour{totalTours !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-between sm:justify-start">
              <div className="flex items-center">
                <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${statusConfig.color} text-white`}
                >
                  {statusConfig.icon}
                </div>
                <div className="ml-2">
                  <div className="text-xs font-medium text-stone-300">
                    Tour {activeTourIndex + 1} of {totalTours}
                  </div>
                  <div className="text-xs text-stone-500">{statusConfig.label}</div>
                </div>
              </div>
              <div className="hidden sm:block w-8 h-0.5 mx-2 bg-stone-700"></div>
              <div className="hidden sm:block text-xs text-stone-500">Step 2 of 3</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Message */}
            <div className="bg-gradient-to-br from-stone-800/50 to-stone-900/50 rounded-xl border border-stone-700 p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                Help Us Finalize Your Booking
              </h2>
              <p className="text-stone-300 text-sm sm:text-base mb-3 sm:mb-4">
                Thank you for responding to our availability update. We need your feedback to
                proceed with your booking request.
              </p>
              <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/30">
                <div className="flex items-start">
                  <FaInfoCircle className="text-blue-300 mt-0.5 mr-2 sm:mr-3 flex-shrink-0 text-sm sm:text-base" />
                  <div>
                    <p className="text-blue-300 font-medium text-sm sm:text-base mb-1">
                      What happens next?
                    </p>
                    <p className="text-blue-400 text-xs sm:text-sm">
                      Based on your feedback, we'll prepare a revised booking confirmation and
                      payment link. You'll receive an email with the updated details.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tour Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-between bg-stone-800/50 rounded-lg p-4 gap-3 sm:gap-4">
              <button
                onClick={() => setActiveTourIndex((i) => Math.max(0, i - 1))}
                disabled={activeTourIndex === 0}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-stone-700 hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <FaChevronLeft className="text-sm" />
                Previous Tour
              </button>

              <div className="text-center min-w-0">
                <div className="text-base sm:text-lg font-bold text-white truncate max-w-[180px] sm:max-w-md mx-auto">
                  {currentFeedback?.title}
                </div>
                <div className="text-xs sm:text-sm text-stone-400">
                  Tour {activeTourIndex + 1} of {totalTours}
                </div>
              </div>

              <button
                onClick={() => setActiveTourIndex((i) => Math.min(totalTours - 1, i + 1))}
                disabled={activeTourIndex === totalTours - 1}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-stone-700 hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                Next Tour
                <FaChevronRight className="text-sm" />
              </button>
            </div>

            {/* Current Tour Card */}
            {currentFeedback && (
              <div className="bg-gradient-to-br from-stone-800/50 to-stone-900/50 rounded-xl border border-stone-700 p-4 sm:p-6">
                {/* Tour Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 sm:mb-6">
                  <div className="mb-3 sm:mb-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full ${statusConfig.textColor} bg-opacity-20 font-medium text-xs sm:text-sm`}
                      >
                        {statusConfig.icon} {statusConfig.label}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-white">
                        {currentFeedback.title}
                      </h3>
                    </div>
                    <p className="text-stone-400 text-sm">{statusConfig.description}</p>
                  </div>
                </div>

                {/* Original Request */}
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-stone-700/30 rounded-lg">
                  <h4 className="font-bold text-amber-400 mb-2 sm:mb-3 text-sm sm:text-base">
                    Original Request
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <div className="flex items-center text-xs sm:text-sm text-stone-400 mb-1">
                        <FaCalendarAlt className="mr-2 text-xs sm:text-sm" />
                        Date
                      </div>
                      <div className="font-medium text-white text-sm sm:text-base">
                        {formatDate(currentFeedback.originalDate)}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center text-xs sm:text-sm text-stone-400 mb-1">
                        <FaUsers className="mr-2 text-xs sm:text-sm" />
                        Travelers
                      </div>
                      <div className="font-medium text-white text-sm sm:text-base">
                        {currentFeedback.originalGuests}{" "}
                        {currentFeedback.originalGuests === 1 ? "person" : "people"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Specific Information */}
                {currentFeedback.availabilityStatus === "limited" && (
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-yellow-500/10 to-amber-600/10 rounded-lg border border-yellow-500/30">
                    <div className="flex items-start">
                      <FaExclamationTriangle className="text-yellow-300 mt-0.5 mr-2 sm:mr-3 flex-shrink-0 text-sm sm:text-base" />
                      <div>
                        <h4 className="font-bold text-yellow-300 mb-1 sm:mb-2 text-sm sm:text-base">
                          Limited Availability Notice
                        </h4>
                        <p className="text-yellow-400 text-xs sm:text-sm">
                          Only {currentFeedback.limitedPlaces} place
                          {currentFeedback.limitedPlaces !== 1 ? "s" : ""} available for your
                          requested date.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {currentFeedback.availabilityStatus === "alternative" &&
                  currentFeedback.alternativeDate && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg border border-blue-500/30">
                      <div className="flex items-start">
                        <FaCalendarPlus className="text-blue-300 mt-0.5 mr-2 sm:mr-3 flex-shrink-0 text-sm sm:text-base" />
                        <div>
                          <h4 className="font-bold text-blue-300 mb-1 sm:mb-2 text-sm sm:text-base">
                            Alternative Date Available
                          </h4>
                          <p className="text-blue-400 text-xs sm:text-sm">
                            Available on: {formatDate(currentFeedback.alternativeDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                {/* Decision Options */}
                <div className="mb-4 sm:mb-6">
                  <h4 className="font-bold text-amber-400 mb-3 sm:mb-4 text-sm sm:text-base">
                    What would you like to do?
                  </h4>

                  <div className="flex flex-col sm:grid sm:grid-cols-3 gap-2 sm:gap-3">
                    {/* Keep as is */}
                    <button
                      onClick={() => handleDecisionChange(activeTourIndex, "keep")}
                      className={`p-3 sm:p-4 rounded-lg border flex flex-row sm:flex-col items-center justify-start sm:justify-center transition-all gap-3 sm:gap-0 ${
                        currentFeedback.decision === "keep"
                          ? "border-green-500 bg-green-500/10"
                          : "border-stone-600 hover:border-stone-500 hover:bg-stone-700/50"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center sm:mb-3 ${
                          currentFeedback.decision === "keep" ? "bg-green-500" : "bg-stone-700"
                        }`}
                      >
                        <FaCheck className="text-white text-sm sm:text-xl" />
                      </div>
                      <div className="text-left sm:text-center">
                        <span
                          className={`font-bold text-sm sm:text-base ${
                            currentFeedback.decision === "keep"
                              ? "text-green-400"
                              : "text-stone-300"
                          }`}
                        >
                          Keep as is
                        </span>
                        <span className="text-xs text-stone-500 block mt-0.5 sm:mt-1">
                          {currentFeedback.availabilityStatus === "available"
                            ? "Confirm booking"
                            : "Keep original request"}
                        </span>
                      </div>
                    </button>

                    {/* Modify */}
                    <button
                      onClick={() => handleDecisionChange(activeTourIndex, "modify")}
                      disabled={currentFeedback.availabilityStatus === "available"}
                      className={`p-3 sm:p-4 rounded-lg border flex flex-row sm:flex-col items-center justify-start sm:justify-center transition-all gap-3 sm:gap-0 ${
                        currentFeedback.decision === "modify"
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-stone-600 hover:border-stone-500 hover:bg-stone-700/50"
                      } ${
                        currentFeedback.availabilityStatus === "available"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <div
                        className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center sm:mb-3 ${
                          currentFeedback.decision === "modify" ? "bg-blue-500" : "bg-stone-700"
                        }`}
                      >
                        <FaExchangeAlt className="text-white text-sm sm:text-xl" />
                      </div>
                      <div className="text-left sm:text-center">
                        <span
                          className={`font-bold text-sm sm:text-base ${
                            currentFeedback.decision === "modify"
                              ? "text-blue-400"
                              : "text-stone-300"
                          }`}
                        >
                          Modify
                        </span>
                        <span className="text-xs text-stone-500 block mt-0.5 sm:mt-1">
                          {currentFeedback.availabilityStatus === "limited"
                            ? "Adjust group size"
                            : currentFeedback.availabilityStatus === "alternative"
                            ? "Use alternative date"
                            : "Make changes"}
                        </span>
                      </div>
                    </button>

                    {/* Remove */}
                    <button
                      onClick={() => handleDecisionChange(activeTourIndex, "remove")}
                      className={`p-3 sm:p-4 rounded-lg border flex flex-row sm:flex-col items-center justify-start sm:justify-center transition-all gap-3 sm:gap-0 ${
                        currentFeedback.decision === "remove"
                          ? "border-red-500 bg-red-500/10"
                          : "border-stone-600 hover:border-stone-500 hover:bg-stone-700/50"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center sm:mb-3 ${
                          currentFeedback.decision === "remove" ? "bg-red-500" : "bg-stone-700"
                        }`}
                      >
                        <FaTimes className="text-white text-sm sm:text-xl" />
                      </div>
                      <div className="text-left sm:text-center">
                        <span
                          className={`font-bold text-sm sm:text-base ${
                            currentFeedback.decision === "remove"
                              ? "text-red-400"
                              : "text-stone-300"
                          }`}
                        >
                          Remove
                        </span>
                        <span className="text-xs text-stone-500 block mt-0.5 sm:mt-1">
                          Remove from booking
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Modification Options */}
                {currentFeedback.decision === "modify" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 sm:mb-6 p-3 sm:p-4 bg-stone-700/30 rounded-lg border border-stone-600"
                  >
                    <h5 className="font-bold text-amber-400 mb-3 sm:mb-4 text-sm sm:text-base">
                      Modification Details
                    </h5>

                    {currentFeedback.availabilityStatus === "limited" && (
                      <div className="mb-3 sm:mb-4">
                        <label className="block text-xs sm:text-sm font-medium text-stone-400 mb-1 sm:mb-2">
                          Number of Travelers (Max: {currentFeedback.limitedPlaces})
                        </label>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                          <input
                            type="number"
                            min="1"
                            max={currentFeedback.limitedPlaces}
                            value={currentFeedback.modifiedGuests}
                            onChange={(e) => handleGuestsChange(activeTourIndex, e.target.value)}
                            className="flex-1 bg-stone-600 border border-stone-500 rounded-lg px-3 sm:px-4 py-2 text-white text-sm sm:text-base"
                          />
                          <span className="text-stone-400 text-xs sm:text-sm whitespace-nowrap">
                            of {currentFeedback.originalGuests} requested
                          </span>
                        </div>
                      </div>
                    )}

                    {currentFeedback.availabilityStatus === "alternative" && (
                      <div className="mb-3 sm:mb-4">
                        <label className="block text-xs sm:text-sm font-medium text-stone-400 mb-1 sm:mb-2">
                          Select Alternative Date
                        </label>
                        <div className="flex flex-col gap-2 sm:gap-3">
                          <DatePicker
                            selected={
                              currentFeedback.modifiedDate
                                ? new Date(currentFeedback.modifiedDate)
                                : null
                            }
                            onChange={(date) => handleDateChange(activeTourIndex, date)}
                            minDate={new Date()}
                            className="bg-stone-600 border border-stone-500 rounded-lg px-3 sm:px-4 py-2 text-white w-full text-sm sm:text-base"
                            dateFormat="MMMM d, yyyy"
                            placeholderText="Select alternative date"
                            showPopperArrow={false}
                            popperPlacement="bottom-start"
                            calendarClassName="bg-stone-700 border border-stone-600"
                            dayClassName={() => "text-white hover:bg-amber-500"}
                          />
                          {currentFeedback.modifiedDate && (
                            <span className="text-stone-300 text-xs sm:text-sm">
                              Selected:{" "}
                              {format(new Date(currentFeedback.modifiedDate), "MMMM d, yyyy")}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-3 sm:mt-4">
                      <label className="block text-xs sm:text-sm font-medium text-stone-400 mb-1 sm:mb-2">
                        Notes about this modification (optional)
                      </label>
                      <textarea
                        value={currentFeedback.notes}
                        onChange={(e) => handleNotesChange(activeTourIndex, e.target.value)}
                        className="w-full bg-stone-600 border border-stone-500 rounded-lg p-3 text-white text-sm sm:text-base"
                        rows="2"
                        placeholder="Any specific requirements or preferences..."
                      />
                    </div>
                  </motion.div>
                )}

                {/* Notes for other decisions */}
                {(currentFeedback.decision === "keep" || currentFeedback.decision === "remove") && (
                  <div className="mb-4 sm:mb-6">
                    <label className="block text-xs sm:text-sm font-medium text-stone-400 mb-1 sm:mb-2">
                      Notes (optional)
                    </label>
                    <textarea
                      value={currentFeedback.notes}
                      onChange={(e) => handleNotesChange(activeTourIndex, e.target.value)}
                      className="w-full bg-stone-600 border border-stone-500 rounded-lg p-3 text-white text-sm sm:text-base"
                      rows="2"
                      placeholder={
                        currentFeedback.decision === "keep"
                          ? "Any special requests or requirements for this tour..."
                          : "Reason for removing this tour (optional)..."
                      }
                    />
                  </div>
                )}

                {/* Tour Progress */}
                <div className="mt-4 sm:mt-6">
                  <div className="flex justify-between items-center mb-1 sm:mb-2">
                    <span className="text-xs sm:text-sm text-stone-400">Tour Progress</span>
                    <span className="text-xs sm:text-sm text-stone-300">
                      {activeTourIndex + 1}/{totalTours}
                    </span>
                  </div>
                  <div className="h-2 bg-stone-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 transition-all duration-300"
                      style={{ width: `${((activeTourIndex + 1) / totalTours) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div
            className={`lg:col-span-1 lg:sticky lg:top-24 h-fit my-auto fixed inset-y-0 right-0 w-full max-w-sm lg:max-w-nonetransform transition-transform duration-300 ease-in-out z-150 ${
              isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
            } ${isSidebarOpen ? "block" : "hidden lg:block"}`}
          >
            <div className="h-full lg:h-auto bg-stone-900 lg:bg-transparent overflow-y-auto p-4 sm:p-6 lg:p-0 rounded-lg ">
              <div className="space-y-4 sm:space-y-6">
                {/* Booking Summary */}
                <div className="bg-gradient-to-br from-stone-800/50 to-stone-900/50 rounded-xl border border-stone-700 p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
                    Booking Summary
                  </h3>

                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    <div className="flex justify-between">
                      <span className="text-stone-400 text-xs sm:text-sm">Booking ID</span>
                      <span className="text-white font-medium text-xs sm:text-sm">
                        {booking?.requestId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400 text-xs sm:text-sm">Customer</span>
                      <span className="text-white font-medium text-xs sm:text-sm">
                        {booking?.customer?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400 text-xs sm:text-sm">Email</span>
                      <span className="text-white font-medium text-xs sm:text-sm">
                        {booking?.customer?.email}
                      </span>
                    </div>
                    <div className="border-t border-stone-700 pt-2 sm:pt-3">
                      <div className="flex justify-between">
                        <span className="text-base sm:text-lg font-bold text-white">
                          Original Total
                        </span>
                        <span className="text-xl sm:text-2xl font-bold text-amber-400">
                          ${booking?.total?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tour Status Overview */}
                  <div className="mt-4">
                    <h4 className="font-medium text-stone-300 mb-2 sm:mb-3 text-sm sm:text-base">
                      Tour Status Overview
                    </h4>
                    <div className="max-h-[150px] sm:max-h-[200px] overflow-y-auto pr-2 space-y-1 sm:space-y-2">
                      {feedback.map((tour, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setActiveTourIndex(index);
                            setIsSidebarOpen(false);
                          }}
                          className={`p-2 rounded-lg cursor-pointer transition-colors ${
                            activeTourIndex === index ? "bg-stone-700" : "hover:bg-stone-700/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center min-w-0">
                              <div
                                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-2 ${getStatusConfig(
                                  tour.availabilityStatus
                                ).textColor.replace("text-", "bg-")}`}
                              />
                              <span className="text-xs sm:text-sm text-stone-300 truncate max-w-[100px] sm:max-w-[120px]">
                                Tour {index + 1}
                              </span>
                            </div>
                            <span
                              className={`text-xs font-medium ${
                                getStatusConfig(tour.availabilityStatus).textColor
                              }`}
                            >
                              {tour.decision === "keep"
                                ? "✓"
                                : tour.decision === "modify"
                                ? "↻"
                                : "✗"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/30 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-blue-300 mb-2 sm:mb-3">
                    Next Steps
                  </h3>
                  <div className="space-y-2 text-xs sm:text-sm text-stone-300">
                    <div className="flex items-start">
                      <span className="inline-block w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 rounded-full text-center text-blue-900 font-bold mr-2 flex-shrink-0 text-xs">
                        1
                      </span>
                      <span>Provide feedback for all tours</span>
                    </div>
                    <div className="flex items-start">
                      <span className="inline-block w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 rounded-full text-center text-blue-900 font-bold mr-2 flex-shrink-0 text-xs">
                        2
                      </span>
                      <span>Submit your preferences</span>
                    </div>
                    <div className="flex items-start">
                      <span className="inline-block w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 rounded-full text-center text-blue-900 font-bold mr-2 flex-shrink-0 text-xs">
                        3
                      </span>
                      <span>Receive updated confirmation email</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmitFeedback}
                  disabled={isSubmitting || feedback.some((f) => !f.decision)}
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      Submit All Feedback
                    </>
                  )}
                </button>

                {/* Help Section */}
                <div className="pt-4 sm:pt-6 border-t border-stone-700">
                  <h4 className="font-medium text-stone-300 mb-2 sm:mb-3 text-sm sm:text-base">
                    Need help deciding?
                  </h4>
                  <div className="space-y-1 sm:space-y-2">
                    <a
                      href="mailto:info@eytravelegypt.com"
                      className="flex items-center text-xs sm:text-sm text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      <FaEnvelope className="mr-2 text-xs sm:text-sm" />
                      Email our experts
                    </a>
                    <a
                      href="https://wa.me/201278926104"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-xs sm:text-sm text-green-400 hover:text-green-300 transition-colors"
                    >
                      <FaWhatsapp className="mr-2 text-xs sm:text-sm" />
                      WhatsApp chat
                    </a>
                    <a
                      href="tel:+201080174045"
                      className="flex items-center text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <FaPhone className="mr-2 text-xs sm:text-sm" />
                      Call us for advice
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AvailabilityFeedbackPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AvailabilityFeedbackPageContent />
    </Suspense>
  );
}
