// components/tours/BookingModal.jsx
"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { format, parseISO, addDays } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaCalendarAlt,
  FaUsers,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaComment,
  FaShoppingCart,
  FaArrowRight,
  FaExclamationTriangle,
  FaCheck,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import Portal from "../Portal";

export const BookingModal = ({ tour, onClose, onAddToCart, onDirectBook, existingUserInfo }) => {
  const [step, setStep] = useState(1); // 1: Date/Guests, 2: Contact Info
  const [selectedDate, setSelectedDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState(existingUserInfo?.name || "");
  const [email, setEmail] = useState(existingUserInfo?.email || "");
  const [phone, setPhone] = useState(existingUserInfo?.phone || "");
  const [notes, setNotes] = useState(existingUserInfo?.notes || "");
  const [isLoading, setIsLoading] = useState(false);
  const [shouldSkipContactStep, setShouldSkipContactStep] = useState(false);

  useEffect(() => {
    if (existingUserInfo?.name && existingUserInfo?.email) {
      const hasRequiredInfo = existingUserInfo.name && existingUserInfo.email;
      if (hasRequiredInfo) {
        setShouldSkipContactStep(true);
      }
    }
  }, [existingUserInfo]);

  // Calculate price based on pricing structure
  const calculatePrice = () => {
    // Handle old structure with basePrice
    if (tour.pricing.basePrice !== undefined) {
      return {
        price: tour.pricing.basePrice * guests,
        pricePerPerson: tour.pricing.basePrice,
        perPerson: true,
        tierLabel: "Standard",
      };
    }

    // Handle new structure with groupPrices
    if (!tour.pricing?.groupPrices || !Array.isArray(tour.pricing.groupPrices)) {
      return {
        price: 0,
        pricePerPerson: 0,
        perPerson: true,
        tierLabel: "Custom",
      };
    }

    const groupPrices = tour.pricing.groupPrices;

    // Sort groups by their minimum size to find appropriate pricing tier
    const sortedGroups = [...groupPrices].sort((a, b) => {
      const getMinSize = (group) => {
        if (typeof group.groupSize === "string") {
          return parseInt(group.groupSize.split("-")[0]);
        }
        return group.groupSize;
      };
      return getMinSize(a) - getMinSize(b);
    });

    // If no groups defined
    if (sortedGroups.length === 0) {
      return {
        price: 0,
        pricePerPerson: 0,
        perPerson: true,
        tierLabel: "Custom",
      };
    }

    // Find the largest group size
    const getMaxSize = (group) => {
      if (typeof group.groupSize === "string") {
        return parseInt(group.groupSize.split("-")[1]) || parseInt(group.groupSize.split("-")[0]);
      }
      return group.groupSize;
    };

    // Find all group maximum sizes
    const maxSizes = sortedGroups.map(getMaxSize);
    const absoluteMaxSize = Math.max(...maxSizes);

    // If guests exceed all defined group sizes, use the largest group
    if (guests > absoluteMaxSize) {
      const largestGroup = sortedGroups[sortedGroups.length - 1];
      return {
        price: largestGroup.perPerson ? largestGroup.price * guests : largestGroup.price,
        pricePerPerson: largestGroup.perPerson ? largestGroup.price : largestGroup.price / guests,
        perPerson: largestGroup.perPerson,
        tierLabel: `${largestGroup.label} (Extended)`,
        isExtendedGroup: true,
      };
    }

    // Find the appropriate price tier for current guests
    let selectedTier = sortedGroups[0]; // Default to first tier

    for (const tier of sortedGroups) {
      if (typeof tier.groupSize === "string") {
        // Handle ranges like "3-7"
        const [min, max] = tier.groupSize.split("-").map(Number);
        if (guests >= min && guests <= max) {
          selectedTier = tier;
          break;
        }
      } else if (tier.groupSize === guests) {
        // Exact match
        selectedTier = tier;
        break;
      }
    }

    // Calculate final price
    const pricePerPerson = selectedTier.price;
    const totalPrice = selectedTier.perPerson ? pricePerPerson * guests : pricePerPerson;

    return {
      price: totalPrice,
      pricePerPerson: selectedTier.perPerson ? pricePerPerson : pricePerPerson / guests,
      perPerson: selectedTier.perPerson,
      tierLabel: selectedTier.label,
      isExtendedGroup: false,
    };
  };

  const priceInfo = calculatePrice();
  const availableDates = tour.availability?.startDates || [];

  // Format dates for react-datepicker
  const dateOptions = availableDates.map((dateStr) => {
    const date = parseISO(dateStr);
    return {
      value: date,
      label: format(date, "EEE, MMM dd, yyyy"),
    };
  });

  // Filter out past dates
  const minDate = addDays(new Date(), 1); // Tomorrow
  const filteredDates = dateOptions.filter((option) => option.value >= minDate);

  // Validate email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validate form
  const validateStep1 = () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return false;
    }
    if (guests < 1) {
      toast.error("Please select at least 1 guest");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        // Check if we have existing user info and skip to submission
        if (shouldSkipContactStep && existingUserInfo?.name && existingUserInfo?.email) {
          // Auto-fill the form with existing info
          setName(existingUserInfo.name || "");
          setEmail(existingUserInfo.email || "");
          setPhone(existingUserInfo.phone || "");
          setNotes(existingUserInfo.notes || "");

          // You could either:
          // Option A: Auto-proceed to submit
          // handleSubmit("addToCart");

          // Option B: Still show step 2 but pre-filled (more user-friendly)
          setStep(2);
        } else {
          setStep(2);
        }
      }
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (action) => {
    if (step === 1) {
      handleNextStep();
      return;
    }

    if (!validateStep2()) {
      return;
    }

    setIsLoading(true);

    const userSelections = {
      date: selectedDate.toISOString(), // Save as UTC
      guests,
    };

    const contactInfo = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      notes: notes.trim(),
    };

    try {
      if (action === "addToCart") {
        await onAddToCart?.({
          tour,
          userSelections,
          contactInfo,
          priceInfo,
        });
        toast.success("Tour added to cart!");
      } else if (action === "directBook") {
        await onDirectBook?.({
          tour,
          userSelections,
          contactInfo,
          priceInfo,
        });
      }
      onClose();
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <Portal>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          style={{
            position: "fixed",
            zIndex: 1000,
            transform: "translateZ(0)",
            willChange: "transform",
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-gradient-to-b from-stone-900 to-stone-800 rounded-2xl border border-amber-500/20 shadow-2xl shadow-amber-900/20 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-stone-700">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white">Book Your Tour</h2>
                  <p className="text-sm text-amber-300 mt-1">{tour.basicInfo.title}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-stone-700/50 rounded-lg transition-colors"
                >
                  <FaTimes className="text-stone-400 hover:text-white" />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center mt-4">
                <div className="flex-1 h-1 bg-stone-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-600"
                    initial={{ width: step === 1 ? "0%" : "50%" }}
                    animate={{ width: step === 1 ? "50%" : "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="mx-2 flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step >= 1
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white"
                        : "bg-stone-700 text-stone-400"
                    }`}
                  >
                    1
                  </div>
                  <div className="text-xs text-stone-400 mx-2">Details</div>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step === 2
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white"
                        : "bg-stone-700 text-stone-400"
                    }`}
                  >
                    2
                  </div>
                  <div className="text-xs text-stone-400 mx-2">Contact</div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                >
                  {/* Date Selection */}
                  <div className="mb-6">
                    <label className="text-sm font-medium text-amber-400 mb-2 flex items-center">
                      <FaCalendarAlt className="mr-2" /> Select Date
                    </label>
                    <div className="relative">
                      <DatePicker
                        selected={selectedDate}
                        onChange={setSelectedDate}
                        minDate={minDate}
                        dateFormat="MMMM d, yyyy"
                        placeholderText="Choose your tour date"
                        className="w-full bg-stone-700/50 border border-stone-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                        popperClassName="!z-[10000]"
                        popperPlacement="bottom-start"
                        showPopperArrow={false}
                      />
                    </div>

                    {/* Available Dates */}
                    {filteredDates.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-stone-400 mb-2">Available dates:</p>
                        <div className="flex flex-wrap gap-2">
                          {filteredDates.slice(0, 3).map((date, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedDate(date.value)}
                              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                                selectedDate &&
                                date.value.toDateString() === selectedDate.toDateString()
                                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg"
                                  : "bg-stone-700/50 text-stone-300 hover:bg-stone-600 hover:text-white"
                              }`}
                            >
                              {format(date.value, "MMM dd")}
                            </button>
                          ))}
                          {filteredDates.length > 3 && (
                            <span className="px-3 py-1.5 text-sm text-stone-400">
                              +{filteredDates.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Guests Selection */}
                  <div className="mb-8">
                    <label className="text-sm font-medium text-amber-400 mb-2 flex items-center">
                      <FaUsers className="mr-2" /> Number of Travelers
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <button
                            type="button"
                            onClick={() => setGuests(Math.max(1, guests - 1))}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-700 hover:bg-stone-600 text-white text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={guests <= 1}
                          >
                            -
                          </button>
                          <div className="text-center min-w-[80px]">
                            <div className="text-3xl font-bold text-white">{guests}</div>
                            <div className="text-xs text-stone-400 mt-1">
                              {guests === 1 ? "Person" : "People"}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setGuests(guests + 1)}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-700 hover:bg-stone-600 text-white text-lg transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Show warning if exceeding typical group sizes */}
                    {tour.pricing?.groupPrices &&
                      tour.pricing.groupPrices.length > 0 &&
                      guests >
                        tour.pricing.groupPrices.reduce((max, group) => {
                          if (typeof group.groupSize === "string") {
                            return Math.max(max, parseInt(group.groupSize.split("-")[1]));
                          }
                          return Math.max(max, group.groupSize);
                        }, 0) && (
                        <div className="mt-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                          <div className="flex items-start">
                            <FaExclamationTriangle
                              className="text-purple-300 mt-0.5 mr-2 flex-shrink-0"
                              size={14}
                            />
                            <div>
                              <p className="text-purple-300 text-sm font-medium">Large Group</p>
                              <p className="text-purple-400 text-xs mt-1">
                                Your group exceeds typical sizes. Using largest group pricing.
                                Contact us for custom large group rates.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Price Summary */}
                  <div className="p-4 bg-gradient-to-r from-stone-800/50 to-stone-900/50 rounded-xl border border-stone-700">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="text-stone-400 text-sm">Selected Price</p>
                        <p className="text-2xl font-bold text-white">
                          ${priceInfo.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        {priceInfo.isExtendedGroup && (
                          <span className="text-xs text-stone-400">
                            Using largest group pricing
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-stone-400">
                      {priceInfo.perPerson
                        ? `$${priceInfo.pricePerPerson.toLocaleString()} per person × ${guests} ${
                            guests === 1 ? "person" : "people"
                          }`
                        : `Fixed price for ${guests} ${guests === 1 ? "person" : "people"}`}
                    </div>

                    {tour.pricing.discount?.amount > 0 && (
                      <div className="mt-3 pt-3 border-t border-stone-700">
                        <div className="flex justify-between text-sm">
                          <span className="text-green-400">You save</span>
                          <span className="text-green-400 font-medium">
                            ${tour.pricing.discount.amount}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  {existingUserInfo?.name && existingUserInfo?.email && step === 1 && (
                    <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <div className="flex items-center">
                        <FaCheck className="text-blue-300 mr-2" size={14} />
                        <span className="text-blue-300 text-sm">
                          Your contact information is saved. Continue to book with{" "}
                          {existingUserInfo.name}
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                >
                  {/* Contact Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-amber-400 mb-2 flex items-center">
                        <FaUser className="mr-2" /> Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-stone-700/50 border border-stone-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-amber-400 mb-2 flex items-center">
                        <FaEnvelope className="mr-2" /> Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-stone-700/50 border border-stone-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-amber-400 mb-2 flex items-center">
                        <FaPhone className="mr-2" /> Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-stone-700/50 border border-stone-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                        placeholder="+1 (123) 456-7890"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-amber-400 mb-2 flex items-center">
                        <FaComment className="mr-2" /> Special Requests (Optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="w-full bg-stone-700/50 border border-stone-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                        placeholder="Any special requirements or requests..."
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-stone-700 bg-stone-900/50">
              <div className="flex flex-col sm:flex-row gap-3">
                {step === 2 && (
                  <button
                    onClick={handlePrevStep}
                    disabled={isLoading}
                    className="px-4 py-3 border border-stone-600 text-stone-300 font-medium rounded-lg hover:bg-stone-700/50 hover:text-white transition-colors flex-1 sm:flex-none sm:w-auto cursor-pointer"
                  >
                    Back
                  </button>
                )}

                <div className="flex-1 flex flex-col sm:flex-row gap-3">
                  {step === 2 && (
                    <button
                      onClick={() => handleSubmit("addToCart")}
                      disabled={isLoading}
                      className="group flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-stone-700 to-stone-800 hover:from-stone-600 hover:to-stone-700 text-white font-medium rounded-lg transition-all border border-stone-600 cursor-pointer"
                    >
                      <FaShoppingCart className="mr-2" />
                      Add to Cart
                    </button>
                  )}

                  <button
                    onClick={() => handleSubmit("directBook")}
                    disabled={isLoading}
                    className="group flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-amber-500/30 cursor-pointer"
                  >
                    {step === 1 ? (
                      <>
                        Continue
                        <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                      </>
                    ) : (
                      "Complete Booking"
                    )}
                  </button>
                </div>
              </div>

              {/* Security Note */}
              <div className="mt-4 flex items-start text-xs text-stone-500">
                <FaExclamationTriangle className="mr-2 mt-0.5 flex-shrink-0" />
                <span>Your information is secure. We'll contact you to confirm availability.</span>
              </div>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white font-medium">Processing...</p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </Portal>
  );
};
