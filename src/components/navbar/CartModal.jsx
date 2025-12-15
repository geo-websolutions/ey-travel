// components/CartModal.jsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShoppingCart,
  FiX,
  FiTrash2,
  FiCalendar,
  FiUsers,
  FiEdit2,
  FiCheck,
  FiChevronRight,
  FiClock,
  FiMapPin,
} from "react-icons/fi";
import { BsArrowRight } from "react-icons/bs";
import Link from "next/link";
import Portal from "../Portal";
import { useCart } from "@/context/CartContext";
import DatePicker from "react-datepicker";
import { format, parseISO } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

export default function CartModal({ isOpen, onClose }) {
  const {
    cart,
    cartItemCount,
    cartTotal,
    removeFromCart,
    updateCartItem,
    clearCart,
    calculatePrice,
  } = useCart();

  const [isLoading, setIsLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    date: null,
    guests: 1,
  });

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Calculate price for display
  const getItemPriceInfo = (item) => {
    // Check if we have groupPrices directly on the item
    const groupPrices = item.groupPrices || item.tour?.pricing?.groupPrices;
    const guests = item.guests || 1;

    // If no groupPrices, check for basePrice
    if (!groupPrices || !Array.isArray(groupPrices)) {
      const basePrice = item.tour?.pricing?.basePrice || 0;
      const total = basePrice * guests;
      return {
        pricePerPerson: basePrice,
        total,
        perPerson: true,
        tierLabel: "Standard",
      };
    }

    // Ensure groupPrices is properly formatted
    const validGroupPrices = groupPrices
      .filter((group) => group && typeof group.price === "number")
      .map((group) => ({
        label: group.label || "Standard",
        groupSize: group.groupSize,
        price: group.price,
        perPerson: group.perPerson !== false, // Default to true
      }));

    if (validGroupPrices.length === 0) {
      return {
        pricePerPerson: 0,
        total: 0,
        perPerson: true,
        tierLabel: "Custom",
      };
    }

    // Sort groups by minimum size
    const sortedGroups = [...validGroupPrices].sort((a, b) => {
      const getMinSize = (group) => {
        if (typeof group.groupSize === "string") {
          return parseInt(group.groupSize.split("-")[0]) || 0;
        }
        return group.groupSize || 0;
      };
      return getMinSize(a) - getMinSize(b);
    });

    // Find appropriate tier for current guests
    let selectedTier = sortedGroups[0];
    let foundExactMatch = false;

    for (const tier of sortedGroups) {
      if (typeof tier.groupSize === "string") {
        const [min, max] = tier.groupSize.split("-").map(Number);
        if (guests >= min && guests <= max) {
          selectedTier = tier;
          foundExactMatch = true;
          break;
        }
      } else if (tier.groupSize === guests) {
        selectedTier = tier;
        foundExactMatch = true;
        break;
      }
    }

    // If no exact match found and guests exceed all groups, use largest group
    if (!foundExactMatch && guests > 0) {
      const getMaxSize = (group) => {
        if (typeof group.groupSize === "string") {
          const [min, max] = group.groupSize.split("-").map(Number);
          return max || min;
        }
        return group.groupSize;
      };

      // Find the group with the largest size
      let largestGroup = sortedGroups[0];
      let largestSize = getMaxSize(largestGroup);

      for (const group of sortedGroups) {
        const size = getMaxSize(group);
        if (size > largestSize) {
          largestGroup = group;
          largestSize = size;
        }
      }

      selectedTier = largestGroup;
    }

    // Calculate prices
    const isPerPerson = selectedTier.perPerson !== false;
    const total = isPerPerson ? selectedTier.price * guests : selectedTier.price;
    const pricePerPerson = isPerPerson ? selectedTier.price : selectedTier.price / guests;

    // Determine if this is an extended group (using largest group for overflow)
    const isExtendedGroup = !foundExactMatch && guests > getMaxSize(selectedTier);

    return {
      pricePerPerson,
      total,
      perPerson: isPerPerson,
      tierLabel: isExtendedGroup ? `${selectedTier.label} (Extended)` : selectedTier.label,
      isExtendedGroup,
    };
  };

  // Animation variants
  const modalVariants = {
    hidden: {
      x: "100%",
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      x: "100%",
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  // Start editing an item
  const startEditing = (item) => {
    setEditingItem(item.id);
    setEditForm({
      date: item.date ? parseISO(item.date) : null,
      guests: item.guests || 1,
    });
  };

  // Handle edit form submission
  const handleEditSubmit = (itemId) => {
    if (!editForm.date) {
      alert("Please select a date");
      return;
    }

    const updates = {
      date: editForm.date.toISOString(),
      guests: editForm.guests,
    };

    updateCartItem(itemId, updates);
    setEditingItem(null);
    setEditForm({ date: null, guests: 1 });
  };

  // Check if all items have dates selected
  const allItemsHaveDates = cart.every((item) => item.date);

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "EEE, MMM dd, yyyy");
    } catch {
      return "Date not selected";
    }
  };

  // Get available dates from tour
  const getAvailableDates = (item) => {
    const tour = item.tour || item;
    return (tour.availability?.startDates || []).map((dateStr) => parseISO(dateStr));
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] md:bg-black/50"
            />

            {/* Modal */}
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-y-0 right-0 w-full max-w-md z-[9999] flex flex-col bg-gradient-to-b from-stone-900 to-stone-800 text-stone-100 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-stone-700 bg-stone-800/80 sticky top-0 z-10 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <FiShoppingCart className="text-amber-400 text-xl" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                        {cartItemCount}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-white">Your Tour Cart</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-stone-700/50 rounded-lg transition-colors"
                  aria-label="Close cart"
                >
                  <FiX className="text-stone-400 text-xl hover:text-white" />
                </button>
              </div>

              {/* Cart Content */}
              <div className="flex-1 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-amber-900/30 to-amber-800/30 rounded-full flex items-center justify-center mb-6">
                      <FiShoppingCart className="text-amber-400 text-4xl" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Your cart is empty</h3>
                    <p className="text-stone-400 mb-8 max-w-sm">
                      Start building your Egyptian adventure! Add tours and check availability
                      before booking.
                    </p>
                    <button
                      onClick={onClose}
                      className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-600 transition-all shadow-lg"
                    >
                      Browse Tours
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Instructions */}
                    <div className="p-4 md:p-6 bg-gradient-to-r from-amber-900/20 to-amber-800/10 border-b border-amber-900/30">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-amber-500/20 rounded-lg mt-1">
                          <FiCheck className="text-amber-400" />
                        </div>
                        <div>
                          <p className="font-medium text-amber-300">Almost there!</p>
                          <p className="text-sm text-stone-400 mt-1">
                            Review your selected tours. You can update dates or group sizes before
                            proceeding.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Cart Items */}
                    <div className="p-4 md:p-6 space-y-4">
                      {cart.map((item) => {
                        const priceInfo = getItemPriceInfo(item);
                        const tour = item.tour || item;
                        const availableDates = getAvailableDates(item);

                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-stone-800/80 to-stone-900/80 rounded-xl border border-stone-700 overflow-hidden shadow-lg"
                          >
                            {/* Item Header */}
                            <div className="p-4 border-b border-stone-700">
                              <div className="flex justify-between items-start mb-2">
                                <Link
                                  href={`/destinations/${tour.basicInfo?.slug || tour.slug}`}
                                  onClick={onClose}
                                  className="group"
                                >
                                  <h3 className="font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                                    {tour.basicInfo?.title || tour.title}
                                  </h3>
                                </Link>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-stone-500 hover:text-red-400 transition-colors p-1"
                                  aria-label="Remove tour"
                                >
                                  <FiTrash2 size={16} />
                                </button>
                              </div>

                              {/* Tour Meta */}
                              <div className="flex flex-wrap gap-3 text-sm">
                                <span className="flex items-center text-amber-400">
                                  <FiMapPin className="mr-1.5" size={12} />
                                  {tour.basicInfo?.startLocation || tour.location || "Egypt"}
                                </span>
                                <span className="flex items-center text-stone-400">
                                  <FiClock className="mr-1.5" size={12} />
                                  {tour.basicInfo?.duration || tour.duration || "Custom"}
                                </span>
                                <span className="flex items-center text-stone-400">
                                  <FiUsers className="mr-1.5" size={12} />
                                  {item.guests || 1} {item.guests === 1 ? "person" : "people"}
                                </span>
                              </div>
                            </div>

                            {/* Item Content */}
                            <div className="p-4">
                              {/* Current Selection */}
                              <div className="mb-4 p-3 bg-stone-900/50 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm text-stone-400">Selected:</span>
                                  <button
                                    onClick={() => startEditing(item)}
                                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center"
                                  >
                                    <FiEdit2 className="mr-1" size={12} />
                                    Edit
                                  </button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <p className="text-xs text-stone-500">Date</p>
                                    <p className="text-sm font-medium text-white">
                                      {item.date ? formatDate(item.date) : "Not selected"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-stone-500">Travelers</p>
                                    <p className="text-sm font-medium text-white">
                                      {item.guests || 1} {item.guests === 1 ? "person" : "people"}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Edit Form */}
                              {editingItem === item.id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mb-4 p-4 bg-stone-900/70 rounded-lg border border-amber-900/30"
                                >
                                  <h4 className="text-sm font-medium text-amber-300 mb-3">
                                    Edit Booking Details
                                  </h4>

                                  {/* Date Selection */}
                                  <div className="mb-3">
                                    <label className="block text-xs text-stone-400 mb-2">
                                      Select Date <span className="text-red-400">*</span>
                                    </label>
                                    <DatePicker
                                      selected={editForm.date}
                                      onChange={(date) => setEditForm({ ...editForm, date })}
                                      minDate={new Date()}
                                      dateFormat="MMMM d, yyyy"
                                      placeholderText="Choose your tour date"
                                      className="w-full bg-stone-800 border border-stone-600 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                                      calendarClassName="bg-stone-800 border border-stone-700 rounded-lg shadow-2xl z-[10000]"
                                      popperClassName="!z-[10000]"
                                    />
                                    {availableDates.length > 0 && (
                                      <div className="mt-2">
                                        <p className="text-xs text-stone-400 mb-1">
                                          Available dates:
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                          {availableDates.slice(0, 3).map((date, idx) => (
                                            <button
                                              key={idx}
                                              type="button"
                                              onClick={() => setEditForm({ ...editForm, date })}
                                              className={`px-2 py-1 text-xs rounded ${
                                                editForm.date &&
                                                date.getTime() === editForm.date.getTime()
                                                  ? "bg-amber-600 text-white"
                                                  : "bg-stone-700 text-stone-300 hover:bg-stone-600"
                                              }`}
                                            >
                                              {format(date, "MMM dd")}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Guests Selection */}
                                  <div className="mb-4">
                                    <label className="block text-xs text-stone-400 mb-2">
                                      Number of Travelers
                                    </label>
                                    <div className="flex items-center space-x-3">
                                      <button
                                        onClick={() =>
                                          setEditForm({
                                            ...editForm,
                                            guests: Math.max(1, editForm.guests - 1),
                                          })
                                        }
                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-700 hover:bg-stone-600 text-white"
                                      >
                                        -
                                      </button>
                                      <span className="text-lg font-medium text-white w-8 text-center">
                                        {editForm.guests}
                                      </span>
                                      <button
                                        onClick={() =>
                                          setEditForm({
                                            ...editForm,
                                            guests: editForm.guests + 1,
                                          })
                                        }
                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-700 hover:bg-stone-600 text-white"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>

                                  {/* Form Actions */}
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleEditSubmit(item.id)}
                                      disabled={!editForm.date}
                                      className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-700 disabled:text-stone-500 text-white text-sm font-medium rounded-lg transition-colors"
                                    >
                                      Save Changes
                                    </button>
                                    <button
                                      onClick={() => setEditingItem(null)}
                                      className="px-4 py-2 border border-stone-600 text-stone-400 hover:text-white text-sm font-medium rounded-lg hover:bg-stone-700/50 transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </motion.div>
                              )}

                              {/* Price Summary */}
                              <div className="flex justify-between items-center pt-3 border-t border-stone-700">
                                <div>
                                  <p className="text-sm text-stone-400">
                                    {priceInfo.perPerson ? "Price per person" : "Group price"}
                                  </p>
                                  <p className="text-lg font-bold text-amber-400">
                                    ${priceInfo.pricePerPerson.toLocaleString()}
                                    {priceInfo.perPerson && "/person"}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center gap-2 mb-1"></div>
                                  <p className="text-sm text-stone-400">
                                    Total for {item.guests || 1}{" "}
                                    {item.guests === 1 ? "person" : "people"}
                                  </p>
                                  <p className="text-xl font-bold text-white">
                                    ${priceInfo.total.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Summary Section */}
                    <div className="border-t border-stone-700 bg-gradient-to-t from-stone-900 to-stone-900/80 p-4 md:p-6 sticky bottom-0 backdrop-blur-sm">
                      {/* Order Summary */}
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-stone-300">Subtotal</span>
                          <span className="text-xl font-bold text-white">
                            ${cartTotal.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 text-center">
                          Final pricing confirmed after availability check
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <Link
                          href="/booking"
                          onClick={onClose}
                          className={`w-full py-3.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-lg ${
                            allItemsHaveDates
                              ? "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white"
                              : "bg-stone-700/50 text-stone-400 cursor-not-allowed"
                          }`}
                        >
                          <span>Check Availability & Book</span>
                          <BsArrowRight size={18} />
                        </Link>

                        <div className="flex gap-3">
                          <button
                            onClick={onClose}
                            className="flex-1 py-3 border border-stone-600 text-stone-300 font-medium rounded-lg hover:bg-stone-700/50 hover:text-white transition-colors"
                          >
                            Add More Tours
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Remove all tours from your cart?")) {
                                clearCart();
                              }
                            }}
                            className="flex-1 py-3 border border-stone-700 text-stone-400 font-medium rounded-lg hover:bg-stone-800 hover:text-red-400 transition-colors"
                          >
                            Clear All
                          </button>
                        </div>
                      </div>

                      {/* Help Text */}
                      <div className="mt-4 pt-4 border-t border-stone-800">
                        <p className="text-xs text-stone-500 text-center">
                          Your selected tours will be checked for availability. You'll provide
                          contact details on the next page.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Portal>
  );
}
