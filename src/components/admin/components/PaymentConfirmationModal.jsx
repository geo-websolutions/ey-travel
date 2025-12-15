// components/PaymentConfirmationModal.js
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaDollarSign,
  FaCalendarAlt,
  FaCreditCard,
  FaCheck,
  FaExclamationTriangle,
  FaReceipt,
  FaEnvelope,
  FaHistory,
  FaInfoCircle,
  FaMoneyBillWave,
  FaTag,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { auth } from "@/lib/firebase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const PaymentConfirmationModal = ({ booking, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    receivedAmount: 0,
    currency: "USD",
    paymentMethod: "credit_card",
    transactionId: "",
    receiptNumber: "",
    paymentDate: new Date().toISOString(),
    notes: "",
    sendConfirmationEmail: true,
    markAsFullyPaid: false,
  });
  const [paymentBreakdown, setPaymentBreakdown] = useState([]);

  // Calculate payment summary
  const total = booking?.total || 0;
  const paidAmount = booking?.paidAmount || 0;
  const balance = total - paidAmount;
  const remainingBalance = balance - formData.receivedAmount;

  // Initialize form with remaining balance
  useEffect(() => {
    if (booking && isOpen) {
      setFormData({
        receivedAmount: balance,
        currency: "USD",
        paymentMethod: "credit_card",
        transactionId: "",
        receiptNumber: "",
        paymentDate: new Date().toISOString(),
        notes: "",
        sendConfirmationEmail: true,
        markAsFullyPaid: balance > 0,
      });
      setPaymentBreakdown(getPaymentBreakdown());
    }
  }, [booking, isOpen, balance]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      paymentDate: date.toISOString(), // Convert Date to ISO string
    });
  };

  const getDateFromISO = (isoString) => {
    try {
      return isoString ? new Date(isoString) : new Date();
    } catch {
      return new Date();
    }
  };

  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData({
      ...formData,
      receivedAmount: Math.min(value, balance), // Can't exceed remaining balance
      markAsFullyPaid: value >= balance,
    });
  };

  const handleMarkFullyPaid = () => {
    setFormData({
      ...formData,
      receivedAmount: balance,
      markAsFullyPaid: true,
    });
  };

  const validateForm = () => {
    if (formData.receivedAmount <= 0) {
      toast.error("Please enter a valid payment amount");
      return false;
    }
    if (formData.receivedAmount > balance) {
      toast.error("Payment amount cannot exceed remaining balance");
      return false;
    }
    if (!formData.paymentDate) {
      toast.error("Please select a payment date");
      return false;
    }
    return true;
  };

  const getPaymentBreakdown = () => {
    if (!booking?.tours) return [];

    return booking.tours
      .map((tour) => {
        // Determine tour type and status
        const hasOriginalPrice = tour.originalPrice !== undefined;
        const hasModifications = tour.modifications !== undefined;
        const isCancelled =
          tour.status === "cancelled" || tour.availabilityStatus === "unavailable";

        // For modified tours (partial availability case)
        if (hasOriginalPrice || hasModifications) {
          return {
            title: tour.title,
            originalPrice: tour.originalPrice || tour.calculatedPrice,
            currentPrice: isCancelled ? 0 : tour.calculatedPrice || 0,
            guests: tour.guests,
            originalGuests: tour.originalGuests || tour.guests,
            date: tour.date,
            originalDate: tour.originalDate || tour.date,
            status: isCancelled ? "cancelled" : "confirmed",
            modified:
              hasModifications &&
              (tour.modifications.dateChanged || tour.modifications.guestsChanged),
            modifications: tour.modifications,
            tourType: "modified",
          };
        }

        // For original tours (full availability case)
        return {
          title: tour.title,
          currentPrice: isCancelled ? 0 : tour.calculatedPrice || 0,
          guests: tour.guests,
          date: tour.date,
          status: isCancelled ? "cancelled" : "confirmed",
          tourType: "original",
        };
      })
      .filter((tour) => tour.currentPrice > 0 || tour.status === "cancelled"); // Include cancelled for transparency
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Prepare payment data
      const paymentData = {
        bookingId: booking.id,
        requestId: booking.requestId,
        customerEmail: booking.customer.email,
        paymentDetails: {
          receivedAmount: parseFloat(formData.receivedAmount),
          currency: formData.currency,
          paymentMethod: formData.paymentMethod,
          transactionId: formData.transactionId || "",
          receiptNumber: formData.receiptNumber || "",
          paymentDate: formData.paymentDate,
          notes: formData.notes || "",
        },
        sendConfirmationEmail: formData.sendConfirmationEmail,
        markAsFullyPaid: formData.markAsFullyPaid || formData.receivedAmount >= balance,
      };

      //Call API endpoint
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch("/api/v1/booking/confirm-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to confirm payment");
      }
      console.log("Payment data:", paymentData);

      if (data.success) {
        toast.success(data.message);

        onClose();
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
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
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FaDollarSign className="text-green-400 text-xl" />
                <h2 className="text-2xl font-bold text-white">Confirm Payment</h2>
              </div>
              <div className="flex items-center gap-4 text-sm text-stone-400">
                <div className="flex items-center gap-2">
                  <FaTag className="text-amber-400" />
                  <span>Booking #{booking.requestId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaInfoCircle className="text-amber-400" />
                  <span>{booking.customer?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaHistory className="text-amber-400" />
                  <span>Balance: ${balance.toLocaleString()}</span>
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
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Payment Summary */}
          <div className="bg-gradient-to-r from-stone-700/50 to-stone-800/50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-sm text-stone-400 mb-1">Total Amount</div>
                <div className="text-2xl font-bold text-white">${total.toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-stone-400 mb-1">Already Paid</div>
                <div className="text-2xl font-bold text-green-400">
                  ${paidAmount.toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-stone-400 mb-1">Balance Due</div>
                <div className="text-2xl font-bold text-amber-400">${balance.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Payment Details Form */}
          <div className="space-y-6">
            {/* Amount Section */}
            <div className="bg-stone-700/30 rounded-lg p-4 border border-stone-600">
              <h3 className="font-bold text-white mb-4 flex items-center">
                <FaMoneyBillWave className="text-amber-400 mr-2" />
                Payment Amount
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-400 mb-2">
                    Amount Received
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-stone-400">$</span>
                    <input
                      type="number"
                      name="receivedAmount"
                      value={formData.receivedAmount}
                      onChange={handleAmountChange}
                      min="0"
                      max={balance}
                      step="0.01"
                      className="w-full bg-stone-600 border border-stone-500 rounded-lg pl-8 pr-4 py-3 text-white text-lg font-bold"
                    />
                    <div className="text-xs text-stone-500 mt-1">
                      Maximum: ${balance.toLocaleString()}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleMarkFullyPaid}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold rounded-lg transition-all cursor-pointer"
                >
                  <FaCheck className="inline mr-2" />
                  Mark as Fully Paid (${balance.toLocaleString()})
                </button>
              </div>
            </div>

            {/* Payment Method & Details */}
            <div className="bg-stone-700/30 rounded-lg p-4 border border-stone-600">
              <h3 className="font-bold text-white mb-4 flex items-center">
                <FaCreditCard className="text-blue-400 mr-2" />
                Payment Details
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-400 mb-2">
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full bg-stone-600 border border-stone-500 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                    <option value="check">Check</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-400 mb-2">Currency</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full bg-stone-600 border border-stone-500 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="EGP">EGP (E£)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-400 mb-2">
                    Transaction ID (Optional)
                  </label>
                  <input
                    type="text"
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleInputChange}
                    placeholder="e.g., TXN-123456"
                    className="w-full bg-stone-600 border border-stone-500 rounded-lg px-4 py-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-400 mb-2">
                    Receipt Number (Optional)
                  </label>
                  <input
                    type="text"
                    name="receiptNumber"
                    value={formData.receiptNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., REC-789012"
                    className="w-full bg-stone-600 border border-stone-500 rounded-lg px-4 py-3 text-white"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-stone-400 mb-2">
                  Payment Date
                </label>
                <DatePicker
                  selected={getDateFromISO(formData.paymentDate)}
                  onChange={handleDateChange}
                  dateFormat="MMMM d, yyyy"
                  maxDate={new Date()}
                  className="w-full bg-stone-600 border border-stone-500 rounded-lg px-4 py-3 text-white"
                  placeholderText="Select payment date"
                  showPopperArrow={false}
                  popperPlacement="bottom-start"
                  isClearable={false}
                />
                <div className="text-xs text-stone-500 mt-1">
                  Selected: {format(formData.paymentDate, "MMMM d, yyyy")}
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-stone-700/30 rounded-lg p-4 border border-stone-600">
              <h3 className="font-bold text-white mb-4 flex items-center">
                <FaReceipt className="text-purple-400 mr-2" />
                Additional Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-stone-400 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Add any notes about this payment..."
                  rows="3"
                  className="w-full bg-stone-600 border border-stone-500 rounded-lg p-3 text-white"
                />
              </div>
            </div>

            {/* Options Section */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/30">
              <h3 className="font-bold text-white mb-4 flex items-center">
                <FaEnvelope className="text-blue-400 mr-2" />
                Confirmation Options
              </h3>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="sendConfirmationEmail"
                    checked={formData.sendConfirmationEmail}
                    onChange={handleInputChange}
                    className="mr-3 w-5 h-5 rounded bg-stone-600 border-stone-500 text-amber-500 focus:ring-amber-500 focus:ring-offset-stone-800"
                  />
                  <span className="text-stone-300">
                    Send payment confirmation email to {booking.customer?.email}
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="markAsFullyPaid"
                    checked={formData.markAsFullyPaid}
                    onChange={handleInputChange}
                    className="mr-3 w-5 h-5 rounded bg-stone-600 border-stone-500 text-green-500 focus:ring-green-500 focus:ring-offset-stone-800"
                  />
                  <span className="text-stone-300">
                    Mark booking as fully paid
                    {remainingBalance > 0 && (
                      <span className="text-amber-400 ml-2">
                        (${remainingBalance.toLocaleString()} will remain as balance)
                      </span>
                    )}
                  </span>
                </label>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/30">
              <h3 className="font-bold text-white mb-4">Payment Summary</h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-400">New Payment:</span>
                  <span className="text-xl font-bold text-green-400">
                    ${formData.receivedAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Previous Paid Amount:</span>
                  <span className="text-white">${paidAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">New Total Paid:</span>
                  <span className="text-lg font-bold text-white">
                    ${(paidAmount + formData.receivedAmount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-stone-700">
                  <span className="text-stone-400">New Balance Due:</span>
                  <span
                    className={`text-lg font-bold ${
                      remainingBalance > 0 ? "text-amber-400" : "text-green-400"
                    }`}
                  >
                    ${remainingBalance.toLocaleString()}
                    {remainingBalance <= 0 && " (Paid in Full)"}
                  </span>
                </div>
              </div>
            </div>
            {/* Payment Breakdown Section */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/30 mt-6">
              <h3 className="font-bold text-white mb-4 flex items-center">
                <FaInfoCircle className="text-purple-400 mr-2" />
                Payment Breakdown
              </h3>

              <div className="space-y-3">
                {paymentBreakdown.map((tour, index) => (
                  <div key={index} className="bg-stone-700/50 rounded p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium">{tour.title}</span>
                          {tour.status === "cancelled" ? (
                            <span className="px-2 py-0.5 text-xs bg-red-500/20 text-red-300 rounded-full">
                              Cancelled
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-300 rounded-full">
                              Confirmed
                            </span>
                          )}
                        </div>

                        {/* Original vs Modified Details */}
                        {tour.tourType === "modified" && tour.modified && (
                          <div className="text-xs text-amber-400 mb-1">
                            Modified from original request
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-stone-400">Guests: </span>
                            <span className="text-white">
                              {tour.guests}
                              {tour.originalGuests && tour.originalGuests !== tour.guests && (
                                <span className="text-amber-400 ml-1">
                                  (was {tour.originalGuests})
                                </span>
                              )}
                            </span>
                          </div>
                          <div>
                            <span className="text-stone-400">Price: </span>
                            <span className="text-white">
                              ${tour.currentPrice.toLocaleString()}
                              {tour.originalPrice && tour.originalPrice !== tour.currentPrice && (
                                <span
                                  className={`ml-1 ${
                                    tour.currentPrice > tour.originalPrice
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  (was ${tour.originalPrice.toLocaleString()})
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`text-lg font-bold ${
                            tour.status === "cancelled" ? "text-red-400 line-through" : "text-white"
                          }`}
                        >
                          ${tour.currentPrice.toLocaleString()}
                        </div>
                        {tour.status === "cancelled" && (
                          <div className="text-xs text-red-400">Not included in total</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Summary of totals */}
                <div className="border-t border-stone-700 pt-3 mt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-400">Confirmed tours total:</span>
                    <span className="text-white font-medium">
                      $
                      {paymentBreakdown
                        .filter((t) => t.status === "confirmed")
                        .reduce((sum, t) => sum + t.currentPrice, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                  {paymentBreakdown.some((t) => t.status === "cancelled") && (
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-stone-400">Cancelled tours value:</span>
                      <span className="text-red-400">
                        $
                        {paymentBreakdown
                          .filter((t) => t.status === "cancelled")
                          .reduce((sum, t) => sum + (t.originalPrice || t.currentPrice), 0)
                          .toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-stone-700 p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-stone-400">
              {remainingBalance > 0 ? (
                <div className="text-amber-400 flex items-center">
                  <FaExclamationTriangle className="mr-2" />
                  Booking will remain partially paid
                </div>
              ) : (
                <div className="text-green-400 flex items-center">
                  <FaCheck className="mr-2" />
                  Booking will be marked as fully paid
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-6 py-3 bg-stone-700 hover:bg-stone-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex items-center cursor-pointer"
              >
                {loading ? (
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
                    <FaCheck className="mr-2" />
                    Confirm Payment
                  </>
                )}
              </button>
            </div>
          </div>
          {/* Warning for the user that this action cannot be undone */}
          <div className="flex items-center justify-center mt-4">
            <FaExclamationTriangle className="mr-2" />
            <span className="text-stone-400">This action cannot be undone</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentConfirmationModal;
