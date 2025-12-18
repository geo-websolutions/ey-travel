"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FaCheckCircle,
  FaCalendarAlt,
  FaUsers,
  FaDollarSign,
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaSpinner,
  FaTimesCircle,
  FaClock,
  FaFileInvoiceDollar,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaArrowRight,
  FaPrint,
  FaShare,
  FaHome,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Link from "next/link";
import { format } from "date-fns";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

function PaymentSuccessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);

  // Fetch payment success data on component mount
  useEffect(() => {
    if (!token) {
      setError("Invalid payment link - token missing");
      setLoading(false);
      return;
    }

    fetchPaymentData();
  }, [token]);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/v1/booking/verify-payment-success?token=${encodeURIComponent(token)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to load payment data");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Invalid payment data");
      }

      setBooking(data.booking);
    } catch (error) {
      console.error("Error fetching payment data:", error);
      setError(error.message);
      toast.error(`Failed to load payment details: ${error.message}`);
    } finally {
      setLoading(false);
    }
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

  const formatDateTime = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      confirmed: {
        label: "Confirmed",
        color: "bg-gradient-to-r from-green-500 to-green-600",
        textColor: "text-green-400",
        icon: FaCheckCircle,
        badgeColor: "bg-green-500/20 text-green-400 border-green-500/30",
      },
      cancelled: {
        label: "Cancelled",
        color: "bg-gradient-to-r from-red-500 to-red-600",
        textColor: "text-red-400",
        icon: FaTimesCircle,
        badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
      },
      pending: {
        label: "Pending",
        color: "bg-gradient-to-r from-yellow-500 to-amber-600",
        textColor: "text-yellow-400",
        icon: FaClock,
        badgeColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      },
    };

    return configs[status] || configs.pending;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: `Booking Confirmation #${booking?.requestId}`,
      text: `My ${booking?.tours?.length} tour${
        booking?.tours?.length !== 1 ? "s" : ""
      } with EY Travel Egypt have been confirmed!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  // Calculate confirmed tours total
  const confirmedTours = booking?.tours?.filter((tour) => tour.status === "confirmed") || [];
  const confirmedTotal = confirmedTours.reduce((sum, tour) => sum + (tour.calculatedPrice || 0), 0);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-900/30 to-amber-800/30 rounded-full flex items-center justify-center mb-6 mx-auto">
            <FaSpinner className="text-amber-400 text-4xl animate-spin" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Processing Your Payment</h1>
          <p className="text-stone-400">Please wait while we verify your payment details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="text-center max-w-lg">
          <div className="w-24 h-24 bg-gradient-to-br from-red-900/30 to-red-800/30 rounded-full flex items-center justify-center mb-6 mx-auto">
            <FaTimesCircle className="text-red-400 text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Unable to Verify Payment</h1>
          <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-xl border border-red-500/30 p-6 mb-6">
            <p className="text-red-300 font-medium mb-4">{error}</p>
            <p className="text-stone-400 text-sm">
              This payment link may have expired or is invalid. Please contact us for assistance.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-600 transition-all"
            >
              Contact Support
            </Link>
            <Link
              href="/"
              className="px-6 py-3 border border-stone-600 text-stone-300 font-medium rounded-lg hover:bg-stone-700/50 hover:text-white transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 mt-15 print:mt-0">
      {/* Success Header */}
      <div className="sticky top-0 z-40 bg-stone-800/90 backdrop-blur-sm border-b border-stone-700 print:hidden">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Payment Successful!</h1>
              <p className="text-stone-400 text-sm">
                Booking #{booking?.requestId} • {confirmedTours.length} confirmed tour
                {confirmedTours.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaPrint />
                <span className="hidden sm:inline">Print</span>
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg flex items-center gap-2 transition-all"
              >
                <FaShare />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Success Message */}
            <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 rounded-xl border border-green-700 p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-white text-3xl" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Payment Confirmed Successfully!
                  </h2>
                  <p className="text-green-300 mb-4">
                    Thank you for your payment. Your booking has been confirmed and you're all set
                    for your Egyptian adventure!
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                      Booking ID: {booking?.requestId}
                    </div>
                    <div className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium">
                      Total Paid: ${booking?.total?.toLocaleString()}
                    </div>
                    <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                      {formatDateTime(booking?.submittedAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/20 rounded-xl border border-amber-700 p-6">
              <div className="flex items-start gap-3">
                <FaInfoCircle className="text-amber-400 text-xl mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-amber-300 mb-3">What Happens Next?</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <span className="inline-block w-6 h-6 bg-amber-500 rounded-full text-center text-amber-900 font-bold mr-2 flex-shrink-0">
                          1
                        </span>
                        <span className="text-stone-300">
                          You'll receive a detailed confirmation email with all tour information
                        </span>
                      </div>
                      <div className="flex items-start">
                        <span className="inline-block w-6 h-6 bg-amber-500 rounded-full text-center text-amber-900 font-bold mr-2 flex-shrink-0">
                          2
                        </span>
                        <span className="text-stone-300">
                          Our tour coordinator will contact you within 24 hours
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <span className="inline-block w-6 h-6 bg-amber-500 rounded-full text-center text-amber-900 font-bold mr-2 flex-shrink-0">
                          3
                        </span>
                        <span className="text-stone-300">
                          Receive meeting point details and guide contact information
                        </span>
                      </div>
                      <div className="flex items-start">
                        <span className="inline-block w-6 h-6 bg-amber-500 rounded-full text-center text-amber-900 font-bold mr-2 flex-shrink-0">
                          4
                        </span>
                        <span className="text-stone-300">
                          Prepare for your adventure - check our packing list
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tours List */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <FaMapMarkerAlt className="text-amber-400" />
                Your Confirmed Tours
              </h3>

              <div className="space-y-6">
                {booking?.tours?.map((tour, index) => {
                  const statusConfig = getStatusConfig(tour.status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <div
                      key={tour.id}
                      className="bg-gradient-to-br from-stone-800/50 to-stone-900/50 rounded-xl border border-stone-700 overflow-hidden"
                    >
                      {/* Tour Header */}
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-2">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.badgeColor} border whitespace-nowrap`}
                              >
                                <StatusIcon className="inline mr-1" /> {statusConfig.label}
                              </span>
                              <h4 className="text-xl font-bold text-white">{tour.title}</h4>
                            </div>
                            {tour.availabilityNotes && (
                              <p className="text-stone-400 text-sm">{tour.availabilityNotes}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-amber-400">
                              ${tour.calculatedPrice?.toLocaleString()}
                            </div>
                            <div className="text-sm text-stone-500">
                              for {tour.guests} {tour.guests === 1 ? "person" : "people"}
                            </div>
                          </div>
                        </div>

                        {/* Tour Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-stone-700/30 rounded-lg p-4">
                            <div className="flex items-center text-sm text-stone-400 mb-2">
                              <FaCalendarAlt className="mr-2" />
                              Tour Date
                            </div>
                            <div className="font-medium text-white">{formatDate(tour.date)}</div>
                          </div>

                          <div className="bg-stone-700/30 rounded-lg p-4">
                            <div className="flex items-center text-sm text-stone-400 mb-2">
                              <FaUsers className="mr-2" />
                              Travelers
                            </div>
                            <div className="font-medium text-white">
                              {tour.guests} {tour.guests === 1 ? "person" : "people"}
                            </div>
                          </div>

                          <div className="bg-stone-700/30 rounded-lg p-4">
                            <div className="flex items-center text-sm text-stone-400 mb-2">
                              <FaFileInvoiceDollar className="mr-2" />
                              Status
                            </div>
                            <div className={`font-medium ${statusConfig.textColor}`}>
                              {tour.status === "confirmed" ? "Confirmed & Paid" : "Cancelled"}
                            </div>
                          </div>
                        </div>

                        {/* Special Notes */}
                        {tour.availabilityStatus === "limited" && (
                          <div className="mt-4 p-3 bg-gradient-to-r from-yellow-500/10 to-amber-600/10 rounded-lg border border-yellow-500/30">
                            <p className="text-yellow-400 text-sm">
                              Note: Limited to {tour.limitedPlaces} place
                              {tour.limitedPlaces !== 1 ? "s" : ""}
                            </p>
                          </div>
                        )}

                        {tour.availabilityStatus === "alternative" && tour.alternativeDate && (
                          <div className="mt-4 p-3 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg border border-blue-500/30">
                            <p className="text-blue-400 text-sm">
                              Note: Booked for alternative date: {formatDate(tour.alternativeDate)}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Tour Link */}
                      {tour.slug && (
                        <div className="border-t border-stone-700 p-4 bg-stone-800/50">
                          <Link
                            href={`/destinations/tours/${tour.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-2"
                          >
                            View tour details
                            <FaArrowRight />
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Summary */}
            <div className="bg-gradient-to-br from-stone-800/50 to-stone-900/50 rounded-xl border border-stone-700 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Booking Summary</h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-stone-400">Booking ID</span>
                    <span className="text-white font-medium">{booking?.requestId}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-stone-400">Status</span>
                    <span className="text-green-400 font-medium">Confirmed & Paid</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-stone-400">Payment Date</span>
                    <span className="text-white font-medium text-sm">
                      {formatDateTime(booking?.submittedAt)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-stone-700 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-stone-300">Confirmed Tours</span>
                      <span className="text-white font-medium">
                        {confirmedTours.length} tour{confirmedTours.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-300">Cancelled Tours</span>
                      <span className="text-white font-medium">
                        {(booking?.tours?.length || 0) - confirmedTours.length}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-stone-700 mt-4 pt-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-lg font-bold text-white">Total Paid</span>
                      <span className="text-2xl font-bold text-green-400">
                        ${booking?.total?.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-stone-500 text-right">
                      Includes all confirmed tours
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="mt-6 pt-6 border-t border-stone-700">
                <h4 className="font-medium text-stone-300 mb-3">Customer Information</h4>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-stone-400">Name</div>
                    <div className="font-medium text-white">{booking?.customer?.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-stone-400">Email</div>
                    <div className="font-medium text-white text-sm">{booking?.customer?.email}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/30 p-6">
              <h3 className="text-lg font-bold text-blue-300 mb-3">Important Reminders</h3>
              <div className="space-y-3 text-sm text-stone-300">
                <div className="flex items-start">
                  <FaCheckCircle className="text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Save or print this confirmation for your records</span>
                </div>
                <div className="flex items-start">
                  <FaCheckCircle className="text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Check your email for detailed tour information</span>
                </div>
                <div className="flex items-start">
                  <FaCheckCircle className="text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Contact us 48 hours before your tour for any changes</span>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-gradient-to-br from-stone-800/50 to-stone-900/50 rounded-xl border border-stone-700 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Need Assistance?</h3>
              <div className="space-y-3">
                <a
                  href="mailto:info@eytravelegypt.com"
                  className="flex items-center text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <FaEnvelope className="mr-3" />
                  <div>
                    <div className="font-medium">Email Support</div>
                    <div className="text-sm text-stone-500">info@eytravelegypt.com</div>
                  </div>
                </a>
                <a
                  href="https://wa.me/201278926104"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-green-400 hover:text-green-300 transition-colors"
                >
                  <FaWhatsapp className="mr-3" />
                  <div>
                    <div className="font-medium">WhatsApp</div>
                    <div className="text-sm text-stone-500">+20 127 892 6104</div>
                  </div>
                </a>
                <a
                  href="tel:+201080174045"
                  className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <FaPhone className="mr-3" />
                  <div>
                    <div className="font-medium">Emergency Phone</div>
                    <div className="text-sm text-stone-500">+20 108 017 4045</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/"
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <FaHome />
                Return to Homepage
              </Link>
              <Link
                href="/tours"
                className="w-full py-3 border border-stone-600 text-stone-300 hover:text-white hover:bg-stone-700/50 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Browse More Tours
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .print\\:hidden {
            display: none;
          }

          body {
            background: white;
            color: black;
          }

          .bg-stone-900,
          .bg-stone-800,
          .from-stone-800,
          .to-stone-900,
          .from-green-900,
          .to-green-800,
          .from-amber-900,
          .to-amber-800,
          .from-blue-500,
          .to-purple-500 {
            background: white !important;
            background-image: none !important;
          }

          .text-stone-100,
          .text-white {
            color: black !important;
          }

          .text-stone-400,
          .text-stone-300,
          .text-stone-500 {
            color: #666 !important;
          }

          .border-stone-700 {
            border-color: #ccc !important;
          }

          .mt-15 {
            margin-top: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PaymentSuccessPageContent />
    </Suspense>
  );
}
