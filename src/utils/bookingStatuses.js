// utils/bookingStatuses.js
import {
  FaClock,
  FaCheck,
  FaCalendarCheck,
  FaDollarSign,
  FaTimes,
  FaHourglassHalf,
  FaComments,
  FaCogs,
  FaCalendarAlt,
  FaCheckCircle,
  FaCalendarDay,
  FaStar,
} from "react-icons/fa";

export const BOOKING_STATUSES = {
  // Initial Status
  pending: {
    label: "Pending Review",
    color: "bg-yellow-500",
    textColor: "text-yellow-100",
    icon: FaClock,
  },

  // Availability Check Results
  pending_feedback: {
    label: "Awaiting Feedback",
    color: "bg-amber-500",
    textColor: "text-amber-100",
    icon: FaHourglassHalf,
  },

  feedback_received: {
    label: "Feedback Received",
    color: "bg-blue-500",
    textColor: "text-blue-100",
    icon: FaComments,
  },

  // Confirmation & Payment
  confirmed: {
    label: "Confirmed",
    color: "bg-green-500",
    textColor: "text-green-100",
    icon: FaCheckCircle,
  },

  // Post-Payment Statuses (NEW)
  paid: {
    label: "Paid",
    color: "bg-emerald-500",
    textColor: "text-emerald-100",
    icon: FaDollarSign,
  },

  scheduled: {
    label: "Scheduled",
    color: "bg-indigo-500",
    textColor: "text-indigo-100",
    icon: FaCalendarDay,
  },

  // Completion
  completed: {
    label: "Completed",
    color: "bg-purple-500",
    textColor: "text-purple-100",
    icon: FaCalendarCheck,
  },

  // Cancellation
  cancelled: {
    label: "Cancelled",
    color: "bg-red-500",
    textColor: "text-red-100",
    icon: FaTimes,
  },
};
