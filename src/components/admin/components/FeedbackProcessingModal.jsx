"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  FaCheck,
  FaTimes,
  FaCalendarAlt,
  FaUsers,
  FaDollarSign,
  FaExclamationCircle,
  FaFileInvoiceDollar,
  FaBan,
  FaClipboardCheck,
  FaUser,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { auth } from "@/lib/firebase";
import { calculateTourPrice, getOriginalTourPrice } from "@/utils/priceCalculations";

const FeedbackProcessingModal = ({ booking, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [processingType, setProcessingType] = useState(null); // 'confirm' or 'cancel'
  const [adminNotes, setAdminNotes] = useState("");
  const [toursToProcess, setToursToProcess] = useState([]);
  const [priceCalculations, setPriceCalculations] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [originalTotal, setOriginalTotal] = useState(0);
  const [removedToursPrice, setRemovedToursPrice] = useState(0);
  const [keptModifiedToursPrice, setKeptModifiedToursPrice] = useState(0);
  const [cancellationNotes, setCancellationNotes] = useState("");

  useEffect(() => {
    if (booking && isOpen) {
      // Initialize tours based on client feedback decisions
      const toursWithDecisions = booking.tours.map((tour) => {
        const feedback = booking.feedbackDecisions?.find((f) => f.tourId === tour.id);

        // Use the helper function to get original price
        const originalPrice = getOriginalTourPrice(tour);

        return {
          ...tour,
          feedbackDecision: feedback?.decision || "no_decision",
          modificationDetails: feedback?.modificationDetails || null,
          originalGuests: tour.originalGuests || tour.guests,
          originalDate: tour.originalDate || tour.date,
          originalPrice: originalPrice,
        };
      });

      setToursToProcess(toursWithDecisions);
      calculatePrices(toursWithDecisions);

      // Check if we should auto-select confirm or cancel
      const remainingTours = toursWithDecisions.filter(
        (t) => t.feedbackDecision !== "remove" && t.feedbackDecision !== "no_decision"
      );

      if (remainingTours.length === 0) {
        setProcessingType("cancel");
      } else {
        setProcessingType("confirm");
      }
    }
  }, [booking, isOpen]);

  const calculatePrices = (tours) => {
    const calculations = {};
    let newTotal = 0;
    let originalTotalReconstructed = 0;
    let priceOfRemovedTours = 0;
    let priceOfKeptModifiedTours = 0;

    tours.forEach((tour) => {
      // Get the original price using the helper function
      const originalPrice = getOriginalTourPrice(tour);

      // Add to reconstructed original total
      originalTotalReconstructed += originalPrice;

      if (tour.feedbackDecision === "remove") {
        // Tour removed - price becomes 0
        priceOfRemovedTours += originalPrice;

        calculations[tour.id] = {
          status: "cancelled",
          newPrice: 0,
          originalPrice: originalPrice,
          priceDifference: -originalPrice,
          reason: "Client requested removal",
          notes: tour.modificationDetails?.notes || "Tour removed per client request",
        };
      } else if (tour.feedbackDecision === "modify") {
        const newGuests = tour.modificationDetails?.guests || tour.originalGuests || tour.guests;
        const newDate = tour.modificationDetails?.date || tour.originalDate || tour.date;

        // Use the calculateTourPrice function for consistency
        const newPrice = calculateTourPrice(tour, newGuests, tour.groupPrices);

        calculations[tour.id] = {
          status: "confirmed",
          newPrice,
          newGuests,
          newDate,
          originalPrice: originalPrice,
          priceDifference: newPrice - originalPrice,
          notes: tour.modificationDetails?.notes || "Modified per client request",
        };

        newTotal += newPrice;
        priceOfKeptModifiedTours += originalPrice;
      } else if (tour.feedbackDecision === "keep") {
        calculations[tour.id] = {
          status: "confirmed",
          newPrice: originalPrice,
          newGuests: tour.originalGuests || tour.guests,
          newDate: tour.originalDate || tour.date,
          originalPrice: originalPrice,
          priceDifference: 0,
          notes: "Tour confirmed as requested",
        };

        newTotal += originalPrice;
        priceOfKeptModifiedTours += originalPrice;
      }
    });

    setPriceCalculations(calculations);
    setTotalPrice(newTotal);
    setOriginalTotal(originalTotalReconstructed);
    setRemovedToursPrice(priceOfRemovedTours);
    setKeptModifiedToursPrice(priceOfKeptModifiedTours);
  };

  const handleProcessFeedback = async () => {
    if (!processingType || !booking) return;

    // Validate cancellation notes if cancelling
    if (processingType === "cancel" && !cancellationNotes.trim()) {
      toast.error("Please provide cancellation notes");
      return;
    }
    setLoading(true);

    try {
      const idToken = await auth.currentUser.getIdToken();

      // Prepare modifiedTours data
      const modifiedTours = toursToProcess.map((tour) => ({
        tourId: tour.id,
        action:
          tour.feedbackDecision === "remove"
            ? "remove"
            : tour.feedbackDecision === "modify"
            ? "modify"
            : "keep",
        newDate: tour.modificationDetails?.date || tour.date,
        newGuests: tour.modificationDetails?.guests || tour.guests,
        newPrice: priceCalculations[tour.id]?.newPrice || tour.calculatedPrice,
        notes: tour.modificationDetails?.notes || "",
      }));

      const response = await fetch("/api/v1/booking/confirm-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          bookingId: booking.id,
          action: processingType, // 'confirm' or 'cancel'
          adminNotes: adminNotes,
          cancellationNotes: processingType === "cancel" ? cancellationNotes : undefined,
          totalPrice: totalPrice,
          modifiedTours: processingType === "confirm" ? modifiedTours : undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to confirm availability");
      }

      toast.success(
        `Booking ${processingType === "confirm" ? "confirmed" : "cancelled"} successfully!`
      );
      onClose();
    } catch (error) {
      console.error("Error processing feedback:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderTourSummary = () => {
    return toursToProcess.map((tour) => {
      const calculation = priceCalculations[tour.id];
      const feedback = booking.feedbackDecisions?.find((f) => f.tourId === tour.id);

      return (
        <div key={tour.id} className="bg-stone-700/30 rounded-lg p-4 mb-3 border border-stone-600">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-bold text-white mb-1">{tour.title}</h4>
              <div className="flex items-center gap-4 text-sm text-stone-400">
                <div className="flex items-center gap-1">
                  <FaCalendarAlt size={12} />
                  <span>Original: {format(new Date(tour.originalDate), "MMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaUsers size={12} />
                  <span>{tour.originalGuests} guests</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaDollarSign size={12} />
                  <span>${tour.originalPrice}</span>
                </div>
              </div>
            </div>

            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                feedback?.decision === "remove"
                  ? "bg-red-500/20 text-red-300"
                  : feedback?.decision === "modify"
                  ? "bg-yellow-500/20 text-yellow-300"
                  : "bg-green-500/20 text-green-300"
              }`}
            >
              {feedback?.decision === "remove"
                ? "Remove"
                : feedback?.decision === "modify"
                ? "Modify"
                : "Keep"}
            </div>
          </div>

          {/* Client's modifications */}
          {feedback?.decision === "modify" && feedback?.modificationDetails && (
            <div className="mb-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
              <div className="text-sm text-blue-300 font-medium mb-1">
                Client requested changes:
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <FaCalendarAlt size={12} />
                  <span className="text-stone-300">New date: </span>
                  <span className="text-white">
                    {format(new Date(feedback.modificationDetails.date), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <FaUsers size={12} />
                  <span className="text-stone-300">New guests: </span>
                  <span className="text-white">{feedback.modificationDetails.guests}</span>
                </div>
                {feedback.modificationDetails.notes && (
                  <div className="col-span-2 text-sm text-stone-300 mt-1">
                    <span className="text-stone-400">Notes: </span>
                    {feedback.modificationDetails.notes}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Price calculation */}
          {calculation && (
            <div className="mt-2 p-2 bg-stone-800/50 rounded">
              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-400">New calculation:</span>
                <div className="flex items-center gap-3">
                  <span
                    className={`font-medium ${
                      calculation.priceDifference > 0
                        ? "text-green-400"
                        : calculation.priceDifference < 0
                        ? "text-red-400"
                        : "text-stone-300"
                    }`}
                  >
                    ${calculation.newPrice}
                  </span>
                  {calculation.priceDifference !== 0 && (
                    <span
                      className={`text-xs ${
                        calculation.priceDifference > 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      ({calculation.priceDifference > 0 ? "+" : "-"}$
                      {Math.abs(calculation.priceDifference)})
                    </span>
                  )}
                </div>
              </div>
              <div className="text-xs text-stone-500 mt-1">
                Status: <span className="text-stone-300 capitalize">{calculation.status}</span>
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  const renderActionPanel = () => {
    const confirmedTours = toursToProcess.filter(
      (t) => t.feedbackDecision === "modify" || t.feedbackDecision === "keep"
    ).length;

    const removedTours = toursToProcess.filter((t) => t.feedbackDecision === "remove").length;

    return (
      <div className="mt-6 p-4 border rounded-lg bg-stone-800/50">
        <div className="grid grid-cols-2 gap-6">
          {/* Confirm Booking */}
          <div
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              processingType === "confirm"
                ? "border-2 border-green-500 bg-green-500/10"
                : "border border-stone-600 hover:border-stone-500"
            }`}
            onClick={() => setProcessingType("confirm")}
          >
            <div className="flex items-start gap-3 mb-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  processingType === "confirm" ? "bg-green-500" : "bg-stone-700"
                }`}
              >
                <FaCheck className="text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white">Confirm Booking</h4>
                <p className="text-sm text-stone-400 mt-1">
                  Keep {confirmedTours} tour{confirmedTours !== 1 ? "s" : ""}, remove {removedTours}
                </p>
              </div>
            </div>
            <div className="text-sm text-stone-300">
              <div className="flex justify-between mb-1">
                <span>New Total:</span>
                <span className="font-bold text-white">${totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment required:</span>
                <span className="text-green-400">${totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Cancel Booking */}
          <div
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              processingType === "cancel"
                ? "border-2 border-red-500 bg-red-500/10"
                : "border border-stone-600 hover:border-stone-500"
            }`}
            onClick={() => setProcessingType("cancel")}
          >
            <div className="flex items-start gap-3 mb-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  processingType === "cancel" ? "bg-red-500" : "bg-stone-700"
                }`}
              >
                <FaBan className="text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white">Cancel Booking</h4>
                <p className="text-sm text-stone-400 mt-1">All tours will be cancelled</p>
              </div>
            </div>
            <div className="text-sm text-stone-300">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-red-400">Fully Cancelled</span>
              </div>
            </div>
          </div>
        </div>
        {processingType === "cancel" && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded">
            <div className="flex items-center gap-2 text-red-300">
              <FaExclamationCircle />
              <span className="text-sm font-medium">
                Warning: This will cancel the entire booking
              </span>
            </div>
            <p className="text-sm text-red-400/80 mt-1">
              The client will receive a cancellation email with your notes below.
            </p>
          </div>
        )}

        {/* Admin Notes */}
        <div className="mt-4">
          <label className="block text-sm text-stone-400 mb-2">
            <FaFileInvoiceDollar className="inline mr-2" />
            Notes (optional)
          </label>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            className="w-full bg-stone-700 border border-stone-600 rounded-lg p-3 text-white"
            rows="2"
            placeholder="Add internal notes about this decision..."
          />
        </div>
        {processingType === "cancel" && (
          <div className="mt-4">
            <label className="block text-sm text-stone-400 mb-2">
              <FaFileInvoiceDollar className="inline mr-2" />
              Cancellation Notes (required)
            </label>
            <textarea
              value={cancellationNotes}
              onChange={(e) => setCancellationNotes(e.target.value)}
              className="w-full bg-stone-700 border border-stone-600 rounded-lg p-3 text-white"
              rows="3"
              placeholder="Explain why this booking is being cancelled. This will be included in the email to the client..."
              required
            />
            <p className="text-sm text-stone-500 mt-1">
              These notes will be sent to the client in the cancellation email.
            </p>
          </div>
        )}
      </div>
    );
  };

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-stone-800 rounded-xl border border-stone-700 w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="border-b border-stone-700 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Process Client Feedback</h2>
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
                  <span>Original: ${originalTotal}</span>
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
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <h3 className="text-lg font-bold text-white">Client Feedback Summary</h3>
            </div>
            <p className="text-stone-400 mb-4">
              Client has submitted feedback on tour availability. Review changes and decide whether
              to confirm or cancel the booking.
            </p>
          </div>

          {/* Tours List */}
          <div className="mb-6">
            <h4 className="font-bold text-white mb-3">Tours & Client Decisions</h4>
            {renderTourSummary()}
          </div>

          {/* Price Summary */}
          <div className="bg-gradient-to-br from-stone-700/50 to-stone-800/50 rounded-lg p-4 mb-6 border border-stone-600">
            <h4 className="font-bold text-white mb-3 flex items-center gap-2">
              <FaDollarSign className="text-amber-400" />
              Price Breakdown
            </h4>
            <div className="space-y-2">
              {/* Original total (reconstructed) */}
              <div className="flex justify-between">
                <span className="text-stone-400">Original booking total:</span>
                <span className="text-stone-300">${originalTotal}</span>
              </div>

              {/* Removed tours */}
              <div className="flex justify-between">
                <span className="text-stone-400">
                  Tours removed: <span className="text-red-400">(-${removedToursPrice})</span>
                </span>
                <span className="text-red-400">-${removedToursPrice}</span>
              </div>

              {/* Original price of remaining tours */}
              <div className="flex justify-between border-t border-stone-600 pt-2">
                <span className="text-stone-400">Original price of remaining tours:</span>
                <span className="text-stone-300">${keptModifiedToursPrice}</span>
              </div>

              {/* Adjustments from modifications */}
              <div className="flex justify-between">
                <span className="text-stone-400">Price adjustments from modifications:</span>
                <span
                  className={`font-medium ${
                    totalPrice > keptModifiedToursPrice
                      ? "text-green-400"
                      : totalPrice < keptModifiedToursPrice
                      ? "text-red-400"
                      : "text-stone-300"
                  }`}
                >
                  {totalPrice > keptModifiedToursPrice ? "+" : ""}$
                  {totalPrice - keptModifiedToursPrice}
                </span>
              </div>

              {/* Current total after feedback */}
              <div className="flex justify-between">
                <span className="text-stone-400">Current total (after client feedback):</span>
                <span className="text-stone-300">${booking.total}</span>
              </div>

              {/* New total after processing */}
              <div className="flex justify-between border-t border-stone-600 pt-2 mt-2">
                <span className="text-stone-400 font-medium">New total after processing:</span>
                <span
                  className={`font-bold text-lg ${
                    totalPrice > booking.total
                      ? "text-green-400"
                      : totalPrice < booking.total
                      ? "text-red-400"
                      : "text-white"
                  }`}
                >
                  ${totalPrice}
                </span>
              </div>

              {/* Final change */}
              <div className="flex justify-between">
                <span className="text-stone-400">Final change from client's submission:</span>
                <span
                  className={`font-medium ${
                    totalPrice > booking.total
                      ? "text-green-400"
                      : totalPrice < booking.total
                      ? "text-red-400"
                      : "text-stone-300"
                  }`}
                >
                  {totalPrice > booking.total ? "+" : ""}${totalPrice - booking.total}
                </span>
              </div>
            </div>
          </div>

          {/* Action Panel */}
          {renderActionPanel()}
        </div>

        {/* Footer */}
        <div className="border-t border-stone-700 p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-stone-400">
              {processingType === "confirm" ? (
                <span className="text-green-400">
                  {
                    toursToProcess.filter(
                      (t) => t.feedbackDecision === "modify" || t.feedbackDecision === "keep"
                    ).length
                  }{" "}
                  tour(s) will be confirmed
                </span>
              ) : (
                <span className="text-red-400">
                  All {toursToProcess.length} tour(s) will be cancelled
                </span>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-stone-700 hover:bg-stone-600 text-white rounded-lg font-medium"
                disabled={loading}
              >
                Cancel
              </button>

              <button
                onClick={handleProcessFeedback}
                disabled={
                  !processingType ||
                  loading ||
                  (processingType === "cancel" && !cancellationNotes.trim())
                }
                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 text-white rounded-lg font-medium transition-all cursor-pointer"
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
                ) : processingType === "confirm" ? (
                  "Confirm & Send Payment Link"
                ) : (
                  "Cancel Booking & Notify Client"
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FeedbackProcessingModal;
