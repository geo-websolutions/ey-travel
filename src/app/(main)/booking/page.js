// app/booking/page.jsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
  FaCheck,
  FaCreditCard,
  FaCalendarAlt,
  FaUsers,
  FaEnvelope,
  FaLock,
  FaShieldAlt,
  FaClock,
  FaPhone,
  FaWhatsapp,
  FaExclamationTriangle,
  FaShoppingCart,
  FaMapMarkerAlt,
  FaArrowRight,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import { toast } from "react-toastify";

export default function BookingPage() {
  const router = useRouter();
  const { cart, cartItemCount, cartTotal, userInfo, updateUserInfo, clearCart } = useCart();
  const [step, setStep] = useState(1); // 1: Review, 2: Contact, 3: Confirm
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
    agreeToTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error', null
  const [submissionMessage, setSubmissionMessage] = useState("");

  // Initialize form with saved user info
  useEffect(() => {
    if (userInfo) {
      setFormData((prev) => ({
        ...prev,
        name: userInfo.name || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        notes: userInfo.notes || "",
      }));
    }
  }, [userInfo]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const validateStep1 = () => {
    return cart.length > 0 && cart.every((item) => item.date && item.guests);
  };

  const validateStep2 = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email address");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!formData.agreeToTerms) {
      toast.error("Please agree to the terms and conditions");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      scrollToTop(); // Add this
    } else if (step === 2 && validateStep2()) {
      // Update user info in context
      updateUserInfo({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        notes: formData.notes.trim(),
      });
      setStep(3);
      scrollToTop(); // Add this
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      scrollToTop(); // Add this
    }
  };

  const handleSubmitBooking = async () => {
    setIsSubmitting(true);
    setSubmissionStatus(null);
    setSubmissionMessage("");

    try {
      // Validation
      if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
        throw new Error("Please fill in all required fields");
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        throw new Error("Please enter a valid email address");
      }

      // Prepare booking data
      const bookingData = {
        tours: cart,
        customer: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          notes: formData.notes.trim(),
        },
        total: cartTotal,
        submittedAt: new Date().toISOString(),
        status: "pending",
      };

      // Call API
      const response = await fetch("/api/v1/tour/book-tour", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingData }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || `HTTP ${response.status}`);
      }

      // Success
      setSubmissionStatus("success");
      setSubmissionMessage(result.message || "Booking request submitted successfully!");

      // Clear cart and user info
      clearCart();
      updateUserInfo({ name: "", email: "", phone: "", notes: "" });

      // Redirect after delay
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      console.error("Booking submission error:", error);
      setSubmissionStatus("error");
      setSubmissionMessage(`Booking failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Date not set";
    }
  };

  // Calculate price for an item
  const calculateItemPrice = (item) => {
    if (item.calculatedPrice !== undefined) {
      return item.calculatedPrice;
    }

    // Fallback calculation
    const guests = item.guests || 1;
    if (item.groupPrices?.length > 0) {
      // Find appropriate price tier
      let selectedPrice = item.groupPrices[0]?.price || 0;
      let perPerson = item.groupPrices[0]?.perPerson !== false;

      for (const tier of item.groupPrices) {
        if (typeof tier.groupSize === "string") {
          const [min, max] = tier.groupSize.split("-").map(Number);
          if (guests >= min && guests <= max) {
            selectedPrice = tier.price;
            perPerson = tier.perPerson !== false;
            break;
          }
        } else if (tier.groupSize === guests) {
          selectedPrice = tier.price;
          perPerson = tier.perPerson !== false;
          break;
        }
      }

      return perPerson ? selectedPrice * guests : selectedPrice;
    }

    return 0;
  };

  if (cart.length === 0 && submissionStatus !== "success" && submissionStatus !== "error") {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4 mt-15">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-900/30 to-amber-800/30 rounded-full flex items-center justify-center mb-6 mx-auto">
            <FaShoppingCart className="text-amber-400 text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Your cart is empty</h1>
          <p className="text-stone-400 mb-8 max-w-sm">
            Please add tours to your cart before proceeding with booking.
          </p>
          <Link
            href="/destinations"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-600 transition-all shadow-lg"
          >
            Browse Tours
          </Link>
        </div>
      </div>
    );
  }

  // Add this condition after the cart empty check but before the main return
  if (submissionStatus === "success") {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4 mt-15">
        <div className="text-center max-w-lg">
          <div className="w-24 h-24 bg-gradient-to-br from-green-900/30 to-green-800/30 rounded-full flex items-center justify-center mb-6 mx-auto">
            <FaCheck className="text-green-400 text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Booking Submitted Successfully!</h1>
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl border border-green-500/30 p-6 mb-6">
            <p className="text-green-300 font-medium mb-4">{submissionMessage}</p>
            <div className="text-left space-y-3 text-sm text-stone-300">
              <div className="flex items-start">
                <FaEnvelope className="text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                <span>
                  A confirmation email will be sent to{" "}
                  <span className="text-amber-300 font-medium">{formData.email}</span>
                </span>
              </div>
              <div className="flex items-start">
                <FaClock className="text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                <span>You'll receive availability confirmation within 24 hours</span>
              </div>
              <div className="flex items-start">
                <FaExclamationTriangle className="text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
                <span>Please check your spam folder if you don't see our email</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setSubmissionStatus(null);
                router.push("/destinations");
              }}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-600 transition-all"
            >
              Browse More Tours
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submissionStatus === "error") {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4 mt-15">
        <div className="text-center max-w-lg">
          <div className="w-24 h-24 bg-gradient-to-br from-red-900/30 to-red-800/30 rounded-full flex items-center justify-center mb-6 mx-auto">
            <FaExclamationTriangle className="text-red-400 text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Booking Failed</h1>
          <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-xl border border-red-500/30 p-6 mb-6">
            <p className="text-red-300 font-medium mb-4">{submissionMessage}</p>
            <p className="text-stone-400 text-sm">
              Please try again or contact us directly for assistance.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setSubmissionStatus(null)}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-600 transition-all"
            >
              Try Again
            </button>
            <Link
              href="/contact"
              className="px-6 py-3 border border-stone-600 text-stone-300 font-medium rounded-lg hover:bg-stone-700/50 hover:text-white transition-colors text-center"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const reservationSteps = [
    {
      step: 1,
      icon: FaShoppingCart,
      title: "Review Your Selection",
      description: "Check your selected tours, dates, and group sizes",
      active: step === 1,
      completed: step > 1,
    },
    {
      step: 2,
      icon: FaEnvelope,
      title: "Contact Information",
      description: "Provide your details for booking confirmation",
      active: step === 2,
      completed: step > 2,
    },
    {
      step: 3,
      icon: FaCheck,
      title: "Confirmation",
      description: "Review and submit your booking request",
      active: step === 3,
      completed: false,
    },
  ];

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 mt-15">
      {/* Progress Header */}
      <div className="sticky top-0 z-40 bg-stone-800/90 backdrop-blur-sm border-b border-stone-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Complete Your Booking</h1>
              <p className="text-stone-400 text-sm">
                {cartItemCount} tour{cartItemCount !== 1 ? "s" : ""} • Total: $
                {cartTotal.toLocaleString()}
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between md:justify-end space-x-4">
              {reservationSteps.map((stepItem) => (
                <div key={stepItem.step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      stepItem.active
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white"
                        : stepItem.completed
                        ? "bg-green-500 text-white"
                        : "bg-stone-700 text-stone-400"
                    }`}
                  >
                    {stepItem.completed ? <FaCheck size={14} /> : stepItem.step}
                  </div>
                  <div className="hidden md:block ml-2">
                    <div className="text-xs font-medium text-stone-300">{stepItem.title}</div>
                    <div className="text-xs text-stone-500">{stepItem.description}</div>
                  </div>
                  {stepItem.step < 3 && (
                    <div className="hidden md:block w-12 h-0.5 mx-2 bg-stone-700"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Cart Review */}
                <div className="bg-gradient-to-br from-stone-800/50 to-stone-900/50 rounded-xl border border-stone-700 p-6">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <FaShoppingCart className="text-amber-400 mr-3" />
                    Review Your Tours
                  </h2>

                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="bg-stone-700/30 rounded-lg p-4 border border-stone-600"
                      >
                        <div className="flex flex-col md:flex-row md:items-start gap-4">
                          {/* Tour Image */}
                          <div className="md:w-24 md:h-24 w-full h-48 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Tour Details */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <Link href={`/destinations/${item.slug}`} className="group">
                                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                                  {item.title}
                                </h3>
                              </Link>
                            </div>

                            {/* Booking Details */}
                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <div>
                                <div className="flex items-center text-sm text-stone-400 mb-1">
                                  <FaCalendarAlt className="mr-2" />
                                  Date
                                </div>
                                <div className="font-medium text-white">
                                  {item.date ? formatDate(item.date) : "Not selected"}
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center text-sm text-stone-400 mb-1">
                                  <FaUsers className="mr-2" />
                                  Travelers
                                </div>
                                <div className="font-medium text-white">
                                  {item.guests} {item.guests === 1 ? "person" : "people"}
                                </div>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="flex justify-between items-center pt-3 border-t border-stone-600">
                              <div>
                                <div className="text-sm text-stone-400">Price</div>
                                <div className="text-lg font-bold text-amber-400">
                                  ${calculateItemPrice(item).toLocaleString()}
                                </div>
                              </div>
                              <Link
                                href={`/destinations/tours/${item.slug}`}
                                className="text-sm text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                              >
                                View tour details →
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Missing Dates Warning */}
                  {!cart.every((item) => item.date) && (
                    <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <div className="flex items-start">
                        <FaExclamationTriangle className="text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-red-300 font-medium">Missing Dates</p>
                          <p className="text-red-400 text-sm mt-1">
                            Some tours don't have dates selected. Please add dates in your cart
                            before proceeding.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reservation Procedures Notice */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/30">
                    <div className="flex items-start">
                      <FaExclamationTriangle className="text-blue-300 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-blue-300 font-medium mb-1">Reservation Procedures</p>
                        <p className="text-blue-400 text-sm">
                          Please review our reservation procedures and policies before proceeding.
                          This includes important information about payments, cancellations, and
                          requirements.
                        </p>
                        <Link
                          href="/reservation"
                          className="inline-flex items-center text-blue-300 hover:text-blue-200 text-sm font-medium mt-2 transition-colors"
                        >
                          View reservation procedures →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Contact Form */}
                <div className="bg-gradient-to-br from-stone-800/50 to-stone-900/50 rounded-xl border border-stone-700 p-6">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <FaEnvelope className="text-amber-400 mr-3" />
                    Contact Information
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-amber-400 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-stone-700/50 border border-stone-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-amber-400 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-stone-700/50 border border-stone-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    {/* Email Importance Notice */}
                    <div className="p-3 bg-gradient-to-r from-amber-500/10 to-amber-600/10 rounded-lg border border-amber-500/30 mt-2">
                      <div className="flex items-start">
                        <FaEnvelope className="text-amber-300 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-amber-300 text-sm font-medium">
                            Important: Email Address is Critical
                          </p>
                          <ul className="text-stone-300 text-xs mt-1 space-y-1">
                            <li>
                              • All tour availability confirmations will be sent to this email
                            </li>
                            <li>• Booking confirmations and payment links are sent via email</li>
                            <li>• Itinerary updates and important notifications use this email</li>
                            <li>• Please ensure this is a valid email you check regularly</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-amber-400 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-stone-700/50 border border-stone-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                        placeholder="+1 (123) 456-7890"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-amber-400 mb-2">
                        Special Requests (Optional)
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full bg-stone-700/50 border border-stone-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                        placeholder="Any special requirements, dietary restrictions, or requests..."
                      />
                    </div>

                    <div className="flex items-start mt-6">
                      <input
                        type="checkbox"
                        id="agreeToTerms"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-stone-600 rounded mt-1 mr-3"
                      />
                      <label htmlFor="agreeToTerms" className="text-sm text-stone-300">
                        I agree to the{" "}
                        <Link href="/terms" className="text-amber-400 hover:underline">
                          Terms & Conditions
                        </Link>{" "}
                        and understand that this is a booking request. Availability will be
                        confirmed within 24 hours, and payment will be required to secure the
                        booking.
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Confirmation */}
                <div className="bg-gradient-to-br from-stone-800/50 to-stone-900/50 rounded-xl border border-stone-700 p-6">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <FaCheck className="text-amber-400 mr-3" />
                    Confirm Your Booking
                  </h2>

                  <div className="space-y-6">
                    {/* Booking Summary */}
                    <div className="bg-stone-700/30 rounded-lg p-4">
                      <h3 className="text-lg font-bold text-white mb-4">Booking Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-stone-400">Number of tours</span>
                          <span className="text-white font-medium">{cartItemCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">Total travelers</span>
                          <span className="text-white font-medium">
                            {cart.reduce((sum, item) => sum + (item.guests || 1), 0)} people
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-stone-600 pt-3">
                          <span className="text-stone-400">Total amount</span>
                          <span className="text-2xl font-bold text-amber-400">
                            ${cartTotal.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info Summary */}
                    <div className="bg-stone-700/30 rounded-lg p-4">
                      <h3 className="text-lg font-bold text-white mb-4">Contact Information</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-stone-400">Name</span>
                          <span className="text-white font-medium">{formData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">Email</span>
                          <span className="text-white font-medium">{formData.email}</span>
                        </div>
                        {formData.phone && (
                          <div className="flex justify-between">
                            <span className="text-stone-400">Phone</span>
                            <span className="text-white font-medium">{formData.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 rounded-lg p-4 border border-amber-500/30">
                      <h3 className="text-lg font-bold text-amber-300 mb-3">What happens next?</h3>
                      <ol className="space-y-2 text-stone-300 text-sm">
                        <li className="flex items-start">
                          <span className="inline-block w-6 h-6 bg-amber-500 rounded-full text-center text-amber-900 font-bold mr-2 flex-shrink-0">
                            1
                          </span>
                          <span>We&apos;ll verify availability for your selected dates</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-6 h-6 bg-amber-500 rounded-full text-center text-amber-900 font-bold mr-2 flex-shrink-0">
                            2
                          </span>
                          <span>You&apos;ll receive a confirmation email within 24 hours</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-6 h-6 bg-amber-500 rounded-full text-center text-amber-900 font-bold mr-2 flex-shrink-0">
                            3
                          </span>
                          <span>A secure payment link will be sent to complete your booking</span>
                        </li>
                      </ol>
                    </div>

                    {/* Important Reminders */}
                    <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/30">
                      <h4 className="text-lg font-bold text-purple-300 mb-2 flex items-center">
                        <FaExclamationTriangle className="mr-2" />
                        Important Reminders
                      </h4>
                      <div className="space-y-2 text-sm text-stone-300">
                        <div className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-purple-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                          <span>
                            <span className="font-medium text-white">Email is primary:</span> All
                            communications including availability confirmations will be sent to{" "}
                            <span className="text-amber-300 font-medium">{formData.email}</span>
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-purple-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                          <span>
                            <span className="font-medium text-white">Check spam folder:</span> If
                            you don't see our emails within 24 hours, please check your spam/junk
                            folder
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-purple-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                          <Link
                            href="/reservation"
                            className="text-amber-400 hover:text-amber-300 font-medium"
                          >
                            Review full reservation procedures here →
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Security Note */}
                    <div className="flex items-start text-sm text-stone-500 bg-stone-700/30 rounded-lg p-4">
                      <FaLock className="mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        Your information is secure and protected. We use industry-standard
                        encryption and never share your personal data with third parties.
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {step > 1 && (
                <button
                  onClick={handlePrevStep}
                  disabled={isSubmitting}
                  className="px-6 py-3 border border-stone-600 text-stone-300 font-medium rounded-lg hover:bg-stone-700/50 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Back
                </button>
              )}

              {step < 3 ? (
                <button
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                  className="ml-auto px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={handleSubmitBooking}
                  disabled={isSubmitting}
                  className="ml-auto px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    "Submit Booking Request"
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Sidebar - Order Summary */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-stone-800/50 to-stone-900/50 rounded-xl border border-stone-700 p-6 top-24">
              <h3 className="text-xl font-bold text-white mb-4">Order Summary</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-stone-400">Subtotal</span>
                  <span className="text-white font-medium">${cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Taxes & Fees</span>
                  <span className="text-white font-medium">Included</span>
                </div>
                <div className="border-t border-stone-700 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-white">Total</span>
                    <span className="text-2xl font-bold text-amber-400">
                      ${cartTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-stone-400">
                  <FaShieldAlt className="mr-2 text-green-400" />
                  Secure SSL encryption
                </div>
                <div className="flex items-center text-sm text-stone-400">
                  <FaClock className="mr-2 text-amber-400" />
                  24-hour availability check
                </div>
                <div className="flex items-center text-sm text-stone-400">
                  <FaCreditCard className="mr-2 text-blue-400" />
                  Stripe secured payments
                </div>
              </div>

              {/* Help Section */}
              <div className="mt-8 pt-6 border-t border-stone-700">
                <h4 className="font-medium text-stone-300 mb-3">Need help?</h4>
                <div className="space-y-2">
                  <a
                    href="mailto:info@eytravelegypt.com"
                    className="flex items-center text-sm text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    <FaEnvelope className="mr-2" />
                    Email support
                  </a>
                  <a
                    href="https://wa.me/201278926104"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-green-400 hover:text-green-300 transition-colors"
                  >
                    <FaWhatsapp className="mr-2" />
                    WhatsApp chat
                  </a>
                  <a
                    href="tel:+201080174045"
                    className="flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <FaPhone className="mr-2" />
                    Call us
                  </a>
                </div>
              </div>
            </div>

            {/* Return to Cart */}
            <Link
              href="/destinations"
              className="block p-4 bg-stone-700/30 rounded-xl border border-stone-600 hover:border-amber-500/50 transition-colors text-center"
            >
              <div className="text-amber-400 font-medium">← Return to Tours</div>
              <div className="text-sm text-stone-400 mt-1">Add more tours to your booking</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
