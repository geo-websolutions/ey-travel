// components/ScheduleTourModal.js
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  FaPlus,
  FaTrash,
  FaInfoCircle,
  FaCheck,
  FaHourglassHalf,
  FaCalendarCheck,
} from "react-icons/fa";
import { auth, db } from "@/lib/firebase";
import { toast } from "react-toastify";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";

const ScheduleTourModal = ({ booking, isOpen, onClose, isEditMode }) => {
  const [loading, setLoading] = useState(false);
  const [activeTourIndex, setActiveTourIndex] = useState(0);
  const [tourSchedules, setTourSchedules] = useState([]);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // Initialize tour schedules when modal opens
  useEffect(() => {
    if (booking?.tours && isOpen) {
      const confirmedTours = booking.tours.filter(
        (tour) => tour.status === "confirmed" && !tour.removedFromBooking
      );
      if (isEditMode) {
        // EDIT MODE: Use existing schedule data from tour.schedule
        const initialSchedules = confirmedTours
          .filter((tour) => tour.schedule) // Only tours with schedules
          .map((tour) => {
            const schedule = tour.schedule || {};

            return {
              tourId: tour.id,
              title: tour.title || schedule.title,
              date: schedule.date
                ? new Date(schedule.date)
                : tour.date
                ? new Date(tour.date)
                : new Date(),
              tourType: schedule.tourType || "day_tour",
              startTime: schedule.startTime || "09:00",
              endTime: schedule.endTime || "17:00",
              durationHours: schedule.durationHours || 8,
              durationDays: schedule.durationDays || 1,
              guide: schedule.guide || {
                name: "",
                phone: "",
                email: "",
                assigned: false,
              },
              driver: schedule.driver || {
                name: "",
                phone: "",
                vehicle: "",
                assigned: false,
              },
              meetingPoint: schedule.meetingPoint || {
                location: "",
                time: "08:30",
                notes: "",
              },
              dropoffPoint: schedule.dropoffPoint || {
                location: "",
                time: "17:30",
                notes: "",
              },
              itinerary: schedule.itinerary || [],
              // Handle multi-day itinerary properly
              dayItinerary:
                schedule.dayItinerary || (schedule.itineraryType === "multi_day" ? [] : []),
              equipment: schedule.equipment || [],
              notes: schedule.scheduleNotes || schedule.notes || "",
            };
          });
        setTourSchedules(initialSchedules);
      } else {
        // NEW SCHEDULE: Original initialization logic
        const initialSchedules = confirmedTours.map((tour) => ({
          tourId: tour.id,
          title: tour.title,
          date: tour.date ? new Date(tour.date) : new Date(),
          tourType: "day_tour",
          startTime: "09:00",
          endTime: "17:00",
          durationHours: 8,
          durationDays: 1,
          guide: {
            name: "",
            phone: "",
            email: "",
            assigned: false,
          },
          driver: {
            name: "",
            phone: "",
            vehicle: "",
            assigned: false,
          },
          meetingPoint: {
            location: "",
            time: "08:30",
            notes: "",
          },
          dropoffPoint: {
            location: "",
            time: "17:30",
            notes: "",
          },
          itinerary: [
            {
              time: "09:00",
              activity: "Hotel Pickup",
              description: "Pick up from hotel lobby",
            },
          ],
          dayItinerary: [
            {
              day: 1,
              date: tour.date ? new Date(tour.date) : new Date(),
              itinerary: [],
            },
          ],
          equipment: [],
          notes: "",
        }));
        setTourSchedules(initialSchedules);
      }
      setActiveTourIndex(0);
    }
  }, [booking, isOpen, isEditMode]);

  const currentSchedule = tourSchedules[activeTourIndex];
  const totalTours = tourSchedules.length;

  // Tour type configuration
  const tourTypes = [
    {
      id: "day_tour",
      label: "Day Tour",
      icon: FaCalendarDay,
      description: "Full day tour (6-10 hours)",
      color: "bg-blue-500",
    },
    {
      id: "hourly_tour",
      label: "Hourly Tour",
      icon: FaClock,
      description: "Flexible hourly booking",
      color: "bg-green-500",
    },
    {
      id: "multi_day_tour",
      label: "Multi-Day Tour",
      icon: FaCalendarCheck,
      description: "Multiple days tour package",
      color: "bg-purple-500",
    },
  ];

  // Handle schedule updates
  const updateSchedule = (index, field, value) => {
    const updated = [...tourSchedules];
    const keys = field.split(".");

    if (keys.length === 1) {
      updated[index][field] = value;
    } else if (keys.length === 2) {
      updated[index][keys[0]] = {
        ...updated[index][keys[0]],
        [keys[1]]: value,
      };
    }

    setTourSchedules(updated);
  };

  // Add itinerary item
  const addItineraryItem = (index) => {
    const updated = [...tourSchedules];
    updated[index].itinerary.push({
      time: "",
      activity: "",
      description: "",
    });
    setTourSchedules(updated);
  };

  // Remove itinerary item
  const removeItineraryItem = (tourIndex, itemIndex) => {
    const updated = [...tourSchedules];
    updated[tourIndex].itinerary.splice(itemIndex, 1);
    setTourSchedules(updated);
  };

  // Remove a day from multi-day itinerary
  const handleRemoveDay = (tourIndex, dayIndex) => {
    // Don't allow removing the first day
    if (dayIndex === 0) return;

    const updated = [...tourSchedules];
    const tourSchedule = updated[tourIndex];

    // Remove the day from dayItinerary
    tourSchedule.dayItinerary.splice(dayIndex, 1);

    // Update day numbers for remaining days
    tourSchedule.dayItinerary.forEach((day, index) => {
      day.day = index + 1;
    });

    // Update duration days
    tourSchedule.durationDays = tourSchedule.dayItinerary.length;

    // If the active day was removed, set active day to previous day
    if (activeDayIndex >= dayIndex) {
      setActiveDayIndex(Math.max(0, activeDayIndex - 1));
    }

    setTourSchedules(updated);
  };

  // Update itinerary item
  const updateItineraryItem = (tourIndex, itemIndex, field, value) => {
    const updated = [...tourSchedules];
    updated[tourIndex].itinerary[itemIndex][field] = value;
    setTourSchedules(updated);
  };

  // Add equipment item
  const addEquipmentItem = (index) => {
    const updated = [...tourSchedules];
    updated[index].equipment.push({
      item: "",
      quantity: 1,
      notes: "",
    });
    setTourSchedules(updated);
  };

  // Remove equipment item
  const removeEquipmentItem = (tourIndex, itemIndex) => {
    const updated = [...tourSchedules];
    updated[tourIndex].equipment.splice(itemIndex, 1);
    setTourSchedules(updated);
  };

  // Toggle guide/driver assignment
  const toggleAssignment = (index, role) => {
    const updated = [...tourSchedules];
    updated[index][role].assigned = !updated[index][role].assigned;
    setTourSchedules(updated);
  };

  // Calculate duration based on tour type
  const calculateDuration = (index) => {
    const schedule = tourSchedules[index];

    if (schedule.tourType === "hourly_tour") {
      const start = parseInt(schedule.startTime.replace(":", ""));
      const end = parseInt(schedule.endTime.replace(":", ""));
      const duration = Math.floor((end - start) / 100);
      updateSchedule(index, "durationHours", duration);
    } else if (schedule.tourType === "multi_day_tour") {
      // For multi-day tours, duration is already set
    }
  };

  // Handle tour type change
  const handleTourTypeChange = (index, type) => {
    updateSchedule(index, "tourType", type);

    if (type === "multi_day_tour") {
      const days = tourSchedules[index].durationDays || 2;

      // Initialize day-based itinerary
      const dayItinerary = [];
      let currentDate = new Date(tourSchedules[index].date);

      for (let day = 1; day <= days; day++) {
        dayItinerary.push({
          day: day,
          date: new Date(currentDate),
          itinerary: [],
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      updateSchedule(index, "dayItinerary", dayItinerary);
      updateSchedule(index, "itinerary", []); // Clear single itinerary
    } else {
      // For day/hourly tours, use regular itinerary
      updateSchedule(index, "dayItinerary", []);
    }
  };

  const validateSchedule = (schedule) => {
    const errors = [];

    // Required fields
    if (!schedule.date) {
      errors.push("Tour date is required");
    }

    if (!schedule.startTime && schedule.tourType === "hourly_tour") {
      errors.push("Start time is required for hourly tours");
    }

    if (!schedule.endTime && schedule.tourType === "hourly_tour") {
      errors.push("End time is required for hourly tours");
    }

    if (!schedule.meetingPoint?.location) {
      errors.push("Meeting location is required");
    }

    if (!schedule.meetingPoint?.time) {
      errors.push("Meeting time is required");
    }

    if (!schedule.dropoffPoint?.location) {
      errors.push("Drop-off location is required");
    }

    // Validate guide if assigned
    if (schedule.guide?.assigned) {
      if (!schedule.guide.name) {
        errors.push("Guide name is required when guide is assigned");
      }
      if (!schedule.guide.phone) {
        errors.push("Guide phone number is required when guide is assigned");
      }
    }

    // Validate driver if assigned
    if (schedule.driver?.assigned) {
      if (!schedule.driver.name) {
        errors.push("Driver name is required when driver is assigned");
      }
      if (!schedule.driver.phone) {
        errors.push("Driver phone number is required when driver is assigned");
      }
    }

    // Validate itinerary
    if (schedule.tourType === "multi_day_tour") {
      if (!schedule.dayItinerary || schedule.dayItinerary.length === 0) {
        errors.push("Multi-day tours require at least one day of itinerary");
      } else {
        schedule.dayItinerary.forEach((day, index) => {
          if (!day.itinerary || day.itinerary.length === 0) {
            errors.push(`Day ${day.day} has no activities`);
          }
        });
      }
    } else if (!schedule.itinerary || schedule.itinerary.length === 0) {
      errors.push("At least one itinerary item is required");
    }

    return errors;
  };

  const handleSubmitSchedule = async () => {
    // Validate all schedules
    const allErrors = {};
    let hasErrors = false;

    tourSchedules.forEach((schedule, index) => {
      const errors = validateSchedule(schedule);
      if (errors.length > 0) {
        allErrors[index] = errors;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      // Show errors to user
      toast.error("Please fix the following errors:");
      Object.keys(allErrors).forEach((tourIndex) => {
        allErrors[tourIndex].forEach((error) => {
          toast.error(`Tour ${parseInt(tourIndex) + 1}: ${error}`);
        });
      });
      return;
    }
    setLoading(true);
    try {
      // Prepare schedule data
      const confirmedTourIds = booking.tours
        .filter((t) => t.status === "confirmed" && !t.removedFromBooking)
        .map((t) => t.id);

      const scheduleData = {
        bookingId: booking.id,
        tourSchedules: tourSchedules
          .filter((schedule) => confirmedTourIds.includes(schedule.tourId))
          .map((schedule) => ({
            ...schedule,
            date: schedule.date instanceof Date ? schedule.date.toISOString() : schedule.date,
          })),
        additionalNotes: "",
      };

      // Call schedule API
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch("/api/v1/booking/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          bookingId: booking.id,
          tourSchedules: scheduleData.tourSchedules,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to schedule tour");
      }

      toast.success("Tour scheduled successfully!");

      onClose();
    } catch (error) {
      console.error("Error scheduling tour:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleSubmitEdit = async () => {
    setLoading(true);
    try {
      // 2. Prepare updated schedule data
      const updatedScheduleData = {
        bookingId: booking.id,
        tourSchedules: tourSchedules.map((schedule) => ({
          ...schedule,
          date: schedule.date instanceof Date ? schedule.date.toISOString() : schedule.date,
          updatedAt: new Date().toISOString(),
          // Ensure proper data types
          durationHours: parseInt(schedule.durationHours) || 0,
          durationDays: parseInt(schedule.durationDays) || 1,
        })),
        updatedAt: new Date().toISOString(),
        updatedBy: auth.currentUser?.email || "Unknown",
      };

      // 3. Get the current booking data to merge updates
      const bookingRef = doc(db, "bookings", booking.id);

      // 4. Merge schedule data with existing tours
      const processedSchedules = updatedScheduleData.tourSchedules.map((schedule) => ({
        tourId: schedule.tourId,
        title: schedule.title,
        date: schedule.date,
        tourType: schedule.tourType,
        startTime: schedule.startTime || null,
        endTime: schedule.endTime || null,
        durationHours: schedule.durationHours,
        durationDays: schedule.durationDays,
        guide: schedule.guide?.assigned
          ? {
              name: schedule.guide.name || "",
              phone: schedule.guide.phone || "",
              email: schedule.guide.email || "",
              assigned: true,
              assignedAt: new Date().toISOString(),
            }
          : null,
        driver: schedule.driver?.assigned
          ? {
              name: schedule.driver.name || "",
              phone: schedule.driver.phone || "",
              vehicle: schedule.driver.vehicle || "",
              assigned: true,
              assignedAt: new Date().toISOString(),
            }
          : null,
        meetingPoint: {
          location: schedule.meetingPoint?.location || "",
          time: schedule.meetingPoint?.time || "",
          notes: schedule.meetingPoint?.notes || "",
        },
        dropoffPoint: {
          location: schedule.dropoffPoint?.location || "",
          time: schedule.dropoffPoint?.time || "",
          notes: schedule.dropoffPoint?.notes || "",
        },
        itinerary:
          schedule.tourType === "multi_day_tour"
            ? schedule.dayItinerary?.map((day) => ({
                day: day.day,
                date: day.date instanceof Date ? day.date.toISOString() : day.date,
                activities:
                  day.itinerary?.map((item) => ({
                    time: item.time,
                    activity: item.activity,
                    description: item.description || "",
                  })) || [],
              })) || []
            : schedule.itinerary?.map((item) => ({
                time: item.time,
                activity: item.activity,
                description: item.description || "",
              })) || [],
        equipment:
          schedule.equipment?.map((item) => ({
            item: item.item,
            quantity: parseInt(item.quantity) || 1,
            notes: item.notes || "",
          })) || [],
        itineraryType: schedule.tourType === "multi_day_tour" ? "multi_day" : "single_day",
        scheduleNotes: schedule.notes || "",
        scheduledAt: booking.scheduledAt || new Date().toISOString(), // Keep original scheduled date
        scheduledBy: booking.scheduledBy || auth.currentUser?.email || "Unknown",
        lastUpdated: new Date().toISOString(),
        updatedBy: auth.currentUser?.email || "Unknown",
      }));

      // 5. Prepare tour updates
      const updatedTours = booking.tours.map((existingTour) => {
        const scheduleData = processedSchedules.find(
          (schedule) => schedule.tourId === existingTour.id
        );

        if (scheduleData) {
          return {
            ...existingTour,
            schedule: scheduleData,
            confirmedDate: scheduleData.date,
            lastUpdated: new Date().toISOString(),
          };
        }
        return existingTour;
      });

      // 6. Prepare log entry
      const editLog = {
        timestamp: new Date().toISOString(),
        event: "schedule_updated",
        changes: {
          toursUpdated: processedSchedules.length,
          updatedFields: processedSchedules.map((s) => ({
            tourId: s.tourId,
            guideUpdated: !!s.guide,
            driverUpdated: !!s.driver,
            itineraryUpdated: (s.itinerary?.length || 0) > 0,
            equipmentUpdated: (s.equipment?.length || 0) > 0,
          })),
        },
        processedBy: auth.currentUser?.email || "Unknown",
      };

      // 7. Prepare update object for Firestore
      const updateData = {
        tours: updatedTours,
        updatedAt: new Date().toISOString(),
        lastUpdatedBy: auth.currentUser?.email || "Unknown",
        log: arrayUnion(editLog), // Add to log array
      };

      // 8. Update Firestore document
      await updateDoc(bookingRef, updateData);

      // 9. Success handling
      toast.success("Schedule updated successfully!");

      // 11. Close modal
      onClose();
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast.error(`Error updating schedule: ${error.message}`);
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
        className="relative bg-stone-800 rounded-xl border border-stone-700 w-full max-w-6xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="border-b border-stone-700 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FaCalendarAlt className="text-emerald-400 text-xl" />
                <h2 className="text-2xl font-bold text-white">
                  {isEditMode ? "Edit Tour Schedule" : "Schedule Tour"}
                </h2>
                {isEditMode && (
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                    Editing Mode
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-stone-400">
                <div className="flex items-center gap-2">
                  <FaInfoCircle className="text-amber-400" />
                  <span>Booking #{booking.requestId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUserFriends className="text-amber-400" />
                  <span>
                    {booking.customer?.name} • {totalTours} confirmed tour
                    {totalTours !== 1 ? "s" : ""}
                    {/* Show removed tours count if any */}
                    {booking.tours.some((t) => t.removedFromBooking) && (
                      <span className="text-red-400 ml-1">
                        ({booking.tours.filter((t) => t.removedFromBooking).length} removed)
                      </span>
                    )}
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
              className="px-3 py-1.5 bg-stone-700 hover:bg-stone-600 disabled:opacity-50 rounded flex items-center gap-2 cursor-pointer"
            >
              ← Previous
            </button>

            <div className="flex-1 overflow-x-auto">
              <div className="flex gap-2">
                {tourSchedules.map((schedule, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTourIndex(index)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                      activeTourIndex === index
                        ? "bg-emerald-600 text-white"
                        : "bg-stone-700 hover:bg-stone-600 text-stone-300"
                    }`}
                  >
                    <span className="font-medium">Tour {index + 1}</span>
                    <span className="text-sm opacity-80">{schedule.title.substring(0, 20)}...</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveTourIndex((i) => Math.min(totalTours - 1, i + 1))}
              disabled={activeTourIndex === totalTours - 1}
              className="px-3 py-1.5 bg-stone-700 hover:bg-stone-600 disabled:opacity-50 rounded flex items-center gap-2 cursor-pointer"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {currentSchedule && (
            <div className="space-y-6">
              {/* Tour Type Selection */}
              <div className="bg-gradient-to-br from-stone-800/40 to-stone-900/40 rounded-xl p-5 border border-stone-600">
                <h3 className="font-bold text-white mb-4 flex items-center">
                  <FaRoute className="text-blue-400 mr-2" />
                  Tour Type & Timing
                </h3>

                <div className="space-y-4">
                  {/* Tour Type Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {tourTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => handleTourTypeChange(activeTourIndex, type.id)}
                          className={`p-4 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer ${
                            currentSchedule.tourType === type.id
                              ? `${type.color} border-${type.color.replace("bg-", "")} text-white`
                              : "bg-stone-700 border-stone-600 hover:bg-stone-600 text-stone-300"
                          }`}
                        >
                          <Icon className="text-2xl mb-2" />
                          <span className="font-bold">{type.label}</span>
                          <span className="text-xs mt-1 text-center">{type.description}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Timing Details */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Date */}
                    <div>
                      <label className="block text-sm font-medium text-stone-400 mb-2">
                        Tour Date
                      </label>
                      {currentSchedule.date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-medium text-stone-400 mb-2">
                        Duration
                      </label>
                      <div className="flex gap-2">
                        {currentSchedule.tourType === "multi_day_tour" && (
                          <div className="flex-1">
                            <div className="flex items-center">
                              <input
                                type="number"
                                min="1"
                                max="30"
                                value={currentSchedule.durationDays}
                                onChange={(e) =>
                                  updateSchedule(activeTourIndex, "durationDays", e.target.value)
                                }
                                className="w-full bg-stone-600 border border-stone-500 rounded-lg px-4 py-3 text-white"
                              />
                              <span className="ml-2 text-stone-300">Days</span>
                            </div>
                          </div>
                        )}

                        {currentSchedule.tourType === "hourly_tour" && (
                          <>
                            <div className="flex-1">
                              <input
                                type="time"
                                value={currentSchedule.startTime}
                                onChange={(e) => {
                                  updateSchedule(activeTourIndex, "startTime", e.target.value);
                                  calculateDuration(activeTourIndex);
                                }}
                                className="w-full bg-stone-600 border border-stone-500 rounded-lg px-4 py-3 text-white"
                              />
                            </div>
                            <div className="flex items-center text-stone-400">to</div>
                            <div className="flex-1">
                              <input
                                type="time"
                                value={currentSchedule.endTime}
                                onChange={(e) => {
                                  updateSchedule(activeTourIndex, "endTime", e.target.value);
                                  calculateDuration(activeTourIndex);
                                }}
                                className="w-full bg-stone-600 border border-stone-500 rounded-lg px-4 py-3 text-white"
                              />
                            </div>
                          </>
                        )}

                        {(currentSchedule.tourType === "day_tour" ||
                          currentSchedule.tourType === "multi_day_tour") && (
                          <div className="flex-1">
                            <div className="flex items-center">
                              <input
                                type="number"
                                min="1"
                                max="24"
                                value={currentSchedule.durationHours}
                                onChange={(e) =>
                                  updateSchedule(activeTourIndex, "durationHours", e.target.value)
                                }
                                className="w-full bg-stone-600 border border-stone-500 rounded-lg px-4 py-3 text-white"
                              />
                              <span className="ml-2 text-stone-300 whitespace-nowrap">
                                Hours/day
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guide & Driver Assignment */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Guide */}
                <div className="bg-gradient-to-br from-stone-800/40 to-stone-900/40 rounded-xl p-5 border border-stone-600">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white flex items-center">
                      <FaUser className="text-amber-400 mr-2" />
                      Tour Guide
                    </h3>
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={currentSchedule.guide.assigned}
                          onChange={() => toggleAssignment(activeTourIndex, "guide")}
                          className="sr-only"
                        />
                        <div
                          className={`block w-10 h-6 rounded-full transition-colors ${
                            currentSchedule.guide.assigned ? "bg-emerald-600" : "bg-stone-600"
                          }`}
                        ></div>
                        <div
                          className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                            currentSchedule.guide.assigned ? "transform translate-x-4" : ""
                          }`}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm text-stone-400">
                        {currentSchedule.guide.assigned ? "Assigned" : "Assign Guide"}
                      </span>
                    </label>
                  </div>

                  {currentSchedule.guide.assigned && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-stone-400 mb-1">Guide Name</label>
                        <input
                          type="text"
                          value={currentSchedule.guide.name}
                          onChange={(e) =>
                            updateSchedule(activeTourIndex, "guide.name", e.target.value)
                          }
                          placeholder="Enter guide's name"
                          className="w-full bg-stone-600 border border-stone-500 rounded-lg px-4 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-stone-400 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={currentSchedule.guide.phone}
                          onChange={(e) =>
                            updateSchedule(activeTourIndex, "guide.phone", e.target.value)
                          }
                          placeholder="+20 123 456 7890"
                          className="w-full bg-stone-600 border border-stone-500 rounded-lg px-4 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-stone-400 mb-1">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          value={currentSchedule.guide.email}
                          onChange={(e) =>
                            updateSchedule(activeTourIndex, "guide.email", e.target.value)
                          }
                          placeholder="guide@example.com"
                          className="w-full bg-stone-600 border border-stone-500 rounded-lg px-4 py-2 text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Driver */}
                <div className="bg-gradient-to-br from-stone-800/40 to-stone-900/40 rounded-xl p-5 border border-stone-600">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white flex items-center">
                      <FaCar className="text-blue-400 mr-2" />
                      Driver & Vehicle
                    </h3>
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={currentSchedule.driver.assigned}
                          onChange={() => toggleAssignment(activeTourIndex, "driver")}
                          className="sr-only"
                        />
                        <div
                          className={`block w-10 h-6 rounded-full transition-colors ${
                            currentSchedule.driver.assigned ? "bg-blue-600" : "bg-stone-600"
                          }`}
                        ></div>
                        <div
                          className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                            currentSchedule.driver.assigned ? "transform translate-x-4" : ""
                          }`}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm text-stone-400">
                        {currentSchedule.driver.assigned ? "Assigned" : "Assign Driver"}
                      </span>
                    </label>
                  </div>

                  {currentSchedule.driver.assigned && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-stone-400 mb-1">Driver Name</label>
                        <input
                          type="text"
                          value={currentSchedule.driver.name}
                          onChange={(e) =>
                            updateSchedule(activeTourIndex, "driver.name", e.target.value)
                          }
                          placeholder="Enter driver's name"
                          className="w-full bg-stone-600 border border-stone-500 rounded-lg px-4 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-stone-400 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={currentSchedule.driver.phone}
                          onChange={(e) =>
                            updateSchedule(activeTourIndex, "driver.phone", e.target.value)
                          }
                          placeholder="+20 123 456 7890"
                          className="w-full bg-stone-600 border border-stone-500 rounded-lg px-4 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-stone-400 mb-1">
                          Vehicle Details (Optional)
                        </label>
                        <input
                          type="text"
                          value={currentSchedule.driver.vehicle}
                          onChange={(e) =>
                            updateSchedule(activeTourIndex, "driver.vehicle", e.target.value)
                          }
                          placeholder="e.g., Toyota Hiace - White - ABC-123"
                          className="w-full bg-stone-600 border border-stone-500 rounded-lg px-4 py-2 text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Meeting & Drop-off Points */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Meeting Point */}
                <div className="bg-gradient-to-br from-stone-800/40 to-stone-900/40 rounded-xl p-5 border border-stone-600">
                  <h3 className="font-bold text-white mb-4 flex items-center">
                    <FaMapMarkerAlt className="text-green-400 mr-2" />
                    Meeting Point
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-stone-400 mb-1">Location</label>
                      <input
                        type="text"
                        value={currentSchedule.meetingPoint.location}
                        onChange={(e) =>
                          updateSchedule(activeTourIndex, "meetingPoint.location", e.target.value)
                        }
                        placeholder="e.g., Hotel Lobby, Airport Terminal, etc."
                        className="w-full bg-stone-600 border border-stone-500 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-stone-400 mb-1">Meeting Time</label>
                      <input
                        type="time"
                        value={currentSchedule.meetingPoint.time}
                        onChange={(e) =>
                          updateSchedule(activeTourIndex, "meetingPoint.time", e.target.value)
                        }
                        className="w-full bg-stone-600 border border-stone-500 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-stone-400 mb-1">Notes (Optional)</label>
                      <textarea
                        value={currentSchedule.meetingPoint.notes}
                        onChange={(e) =>
                          updateSchedule(activeTourIndex, "meetingPoint.notes", e.target.value)
                        }
                        placeholder="Any special instructions for meeting..."
                        rows="2"
                        className="w-full bg-stone-600 border border-stone-500 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Drop-off Point */}
                <div className="bg-gradient-to-br from-stone-800/40 to-stone-900/40 rounded-xl p-5 border border-stone-600">
                  <h3 className="font-bold text-white mb-4 flex items-center">
                    <FaMapMarkerAlt className="text-red-400 mr-2" />
                    Drop-off Point
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-stone-400 mb-1">Location</label>
                      <input
                        type="text"
                        value={currentSchedule.dropoffPoint.location}
                        onChange={(e) =>
                          updateSchedule(activeTourIndex, "dropoffPoint.location", e.target.value)
                        }
                        placeholder="e.g., Hotel, Airport, City Center, etc."
                        className="w-full bg-stone-600 border border-stone-500 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-stone-400 mb-1">
                        Estimated Drop-off Time
                      </label>
                      <input
                        type="time"
                        value={currentSchedule.dropoffPoint.time}
                        onChange={(e) =>
                          updateSchedule(activeTourIndex, "dropoffPoint.time", e.target.value)
                        }
                        className="w-full bg-stone-600 border border-stone-500 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-stone-400 mb-1">Notes (Optional)</label>
                      <textarea
                        value={currentSchedule.dropoffPoint.notes}
                        onChange={(e) =>
                          updateSchedule(activeTourIndex, "dropoffPoint.notes", e.target.value)
                        }
                        placeholder="Any special instructions for drop-off..."
                        rows="2"
                        className="w-full bg-stone-600 border border-stone-500 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Itinerary */}
              {currentSchedule.tourType === "multi_day_tour" ? (
                <div className="bg-gradient-to-br from-stone-800/40 to-stone-900/40 rounded-xl p-5 border border-stone-600">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white flex items-center">
                      <FaCalendarDay className="text-purple-400 mr-2" />
                      Multi-Day Itinerary
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          // Add new day
                          const days = currentSchedule.durationDays;
                          const newDayItinerary = [...currentSchedule.dayItinerary];
                          const lastDate = new Date(
                            newDayItinerary[newDayItinerary.length - 1].date
                          );
                          lastDate.setDate(lastDate.getDate() + 1);

                          newDayItinerary.push({
                            day: days + 1,
                            date: lastDate,
                            itinerary: [],
                          });
                          updateSchedule(activeTourIndex, "dayItinerary", newDayItinerary);
                          updateSchedule(activeTourIndex, "durationDays", days + 1);
                        }}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 cursor-pointer"
                      >
                        <FaPlus /> Add Day
                      </button>
                    </div>
                  </div>

                  {/* Day Tabs */}
                  <div className="flex gap-2 mb-4 overflow-x-auto">
                    {currentSchedule.dayItinerary.map((daySchedule, dayIndex) => (
                      <div key={dayIndex} className="flex items-center gap-1">
                        <button
                          onClick={() => setActiveDayIndex(dayIndex)}
                          className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center cursor-pointer ${
                            activeDayIndex === dayIndex
                              ? "bg-purple-600 text-white"
                              : "bg-stone-700 hover:bg-stone-600 text-stone-300"
                          }`}
                        >
                          Day {daySchedule.day}: {format(daySchedule.date, "MMM d")}
                        </button>

                        {/* Remove Day Button - Only show if not the first day */}
                        {dayIndex > 0 && (
                          <button
                            onClick={() => handleRemoveDay(activeTourIndex, dayIndex)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg cursor-pointer"
                            title="Remove this day"
                          >
                            <FaTimes size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Activities for selected day */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-white font-medium">
                        Activities for Day {currentSchedule.dayItinerary[activeDayIndex]?.day}
                      </h4>
                      <button
                        onClick={() => {
                          // Add activity to current day
                          const updated = [...tourSchedules];
                          updated[activeTourIndex].dayItinerary[activeDayIndex].itinerary.push({
                            time: "",
                            activity: "",
                            description: "",
                          });
                          setTourSchedules(updated);
                        }}
                        className="px-3 py-1 bg-stone-600 hover:bg-stone-500 text-white rounded flex items-center gap-2 cursor-pointer"
                      >
                        <FaPlus size={12} /> Add Activity
                      </button>
                    </div>

                    {currentSchedule.dayItinerary[activeDayIndex]?.itinerary.map(
                      (item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex items-start gap-3 bg-stone-700/50 rounded-lg p-3"
                        >
                          {/* Activity form fields - similar to single itinerary */}
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs text-stone-400 mb-1">Time</label>
                              <input
                                type="time"
                                value={item.time}
                                onChange={(e) => {
                                  const updated = [...tourSchedules];
                                  updated[activeTourIndex].dayItinerary[activeDayIndex].itinerary[
                                    itemIndex
                                  ].time = e.target.value;
                                  setTourSchedules(updated);
                                }}
                                className="w-full bg-stone-600 border border-stone-500 rounded px-3 py-2 text-white text-sm"
                              />
                            </div>

                            <div>
                              <label className="block text-xs text-stone-400 mb-1">Activity</label>
                              <input
                                type="text"
                                value={item.activity}
                                onChange={(e) => {
                                  const updated = [...tourSchedules];
                                  updated[activeTourIndex].dayItinerary[activeDayIndex].itinerary[
                                    itemIndex
                                  ].activity = e.target.value;
                                  setTourSchedules(updated);
                                }}
                                placeholder="e.g., Breakfast, Museum Visit, Transfer, etc."
                                className="w-full bg-stone-600 border border-stone-500 rounded px-3 py-2 text-white text-sm"
                              />
                            </div>

                            <div>
                              <label className="block text-xs text-stone-400 mb-1">
                                Description
                              </label>
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) => {
                                  const updated = [...tourSchedules];
                                  updated[activeTourIndex].dayItinerary[activeDayIndex].itinerary[
                                    itemIndex
                                  ].description = e.target.value;
                                  setTourSchedules(updated);
                                }}
                                placeholder="Brief description, meeting point, notes..."
                                className="w-full bg-stone-600 border border-stone-500 rounded px-3 py-2 text-white text-sm"
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              const updated = [...tourSchedules];
                              updated[activeTourIndex].dayItinerary[
                                activeDayIndex
                              ].itinerary.splice(itemIndex, 1);
                              setTourSchedules(updated);
                            }}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-stone-800/40 to-stone-900/40 rounded-xl p-5 border border-stone-600">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white flex items-center">
                      <FaClock className="text-purple-400 mr-2" />
                      Daily Itinerary
                    </h3>
                    <button
                      onClick={() => addItineraryItem(activeTourIndex)}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 cursor-pointer"
                    >
                      <FaPlus /> Add Activity
                    </button>
                  </div>

                  <div className="space-y-3">
                    {currentSchedule.itinerary.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 bg-stone-700/50 rounded-lg p-3"
                      >
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs text-stone-400 mb-1">Time</label>
                            <input
                              type="time"
                              value={item.time}
                              onChange={(e) =>
                                updateItineraryItem(activeTourIndex, index, "time", e.target.value)
                              }
                              className="w-full bg-stone-600 border border-stone-500 rounded px-3 py-2 text-white text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-stone-400 mb-1">Activity</label>
                            <input
                              type="text"
                              value={item.activity}
                              onChange={(e) =>
                                updateItineraryItem(
                                  activeTourIndex,
                                  index,
                                  "activity",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., Lunch, Museum Visit, Transfer, etc."
                              className="w-full bg-stone-600 border border-stone-500 rounded px-3 py-2 text-white text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-stone-400 mb-1">Description</label>
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) =>
                                updateItineraryItem(
                                  activeTourIndex,
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Brief description, meeting point, notes..."
                              className="w-full bg-stone-600 border border-stone-500 rounded px-3 py-2 text-white text-sm"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => removeItineraryItem(activeTourIndex, index)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Equipment & Notes */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Equipment */}
                <div className="bg-gradient-to-br from-stone-800/40 to-stone-900/40 rounded-xl p-5 border border-stone-600">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white">Equipment & Requirements</h3>
                    <button
                      onClick={() => addEquipmentItem(activeTourIndex)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center gap-2 cursor-pointer"
                    >
                      <FaPlus /> Add Item
                    </button>
                  </div>

                  <div className="space-y-3">
                    {currentSchedule.equipment.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 bg-stone-700/50 rounded-lg p-3"
                      >
                        <div className="flex-1 grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-stone-400 mb-1">Item</label>
                            <input
                              type="text"
                              value={item.item}
                              onChange={(e) => {
                                const updated = [...tourSchedules];
                                updated[activeTourIndex].equipment[index].item = e.target.value;
                                setTourSchedules(updated);
                              }}
                              placeholder="e.g., Water Bottles, Snacks, etc."
                              className="w-full bg-stone-600 border border-stone-500 rounded px-3 py-2 text-white text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-stone-400 mb-1">Quantity</label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => {
                                const updated = [...tourSchedules];
                                updated[activeTourIndex].equipment[index].quantity = e.target.value;
                                setTourSchedules(updated);
                              }}
                              className="w-full bg-stone-600 border border-stone-500 rounded px-3 py-2 text-white text-sm"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => removeEquipmentItem(activeTourIndex, index)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded cursor-pointer"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="bg-gradient-to-br from-stone-800/40 to-stone-900/40 rounded-xl p-5 border border-stone-600">
                  <h3 className="font-bold text-white mb-4">Additional Notes</h3>
                  <textarea
                    value={currentSchedule.notes}
                    onChange={(e) => updateSchedule(activeTourIndex, "notes", e.target.value)}
                    placeholder="Any additional instructions, special requests, or notes for this tour..."
                    rows="8"
                    className="w-full bg-stone-600 border border-stone-500 rounded-lg px-4 py-3 text-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-stone-700 p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-stone-400">
              Tour {activeTourIndex + 1} of {totalTours} • {currentSchedule?.title}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-stone-700 hover:bg-stone-600 text-white rounded-lg font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={isEditMode ? handleSubmitEdit : handleSubmitSchedule}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex items-center cursor-pointer"
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
                    {isEditMode ? "Applying Edits..." : "Scheduling..."}
                  </>
                ) : (
                  <>
                    <FaCheck className="mr-2" />
                    {isEditMode ? "Apply Edits" : "Confirm Schedule"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ScheduleTourModal;
