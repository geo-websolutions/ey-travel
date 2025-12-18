import Handlebars from "handlebars";

/**
 * Replaces Client Check Availability email template syntax with actual data.
 * @param {string} template - The email template to replace syntax with actual data.
 * @param {object} data - The object containing data to replace the syntax with.
 * @return {string} The resulting HTML after all template syntax has been replaced with actual data.
 */
export function clientCheckAvailability(template, data) {
  try {
    // Compile the template
    const compiledTemplate = Handlebars.compile(template);

    // Execute with data
    const result = compiledTemplate(data);

    return result;
  } catch (error) {
    console.error("Error compiling check availability template:", error);
    throw error;
  }
}

/**
 * Replaces Client Booking Notification email template syntax with actual data.
 * @param {string} template - The email template to replace syntax with actual data.
 * @param {object} data - The object containing data to replace the syntax with.
 * @return {string} The resulting HTML after all template syntax has been replaced with actual data.
 */
export function clientBookingNotification(template, data) {
  try {
    // Compile the template
    const compiledTemplate = Handlebars.compile(template);

    // Execute with data
    const result = compiledTemplate(data);

    return result;
  } catch (error) {
    console.error("Error compiling booking notification template:", error);
    throw error;
  }
}

/**
 * Replaces All Tours Available email template syntax with actual data.
 * Includes payment link, tour availability notes, and tour details.
 * @param {string} template - The email template to replace syntax with actual data.
 * @param {object} data - The object containing data to replace the syntax with.
 * @return {string} The resulting HTML after all template syntax has been replaced with actual data.
 */
export function clientAllToursAvailable(template, data) {
  try {
    // Compile the template
    const compiledTemplate = Handlebars.compile(template);

    // Execute with data
    const result = compiledTemplate(data);

    return result;
  } catch (error) {
    console.error("Error compiling all tours available template:", error);
    throw error;
  }
}

/**
 * Replaces Partial Availability email template syntax with actual data.
 * Handles multiple statuses: available, limited, alternative, unavailable.
 * @param {string} template - The email template to replace syntax with actual data.
 * @param {object} data - The object containing data to replace the syntax with.
 * @return {string} The resulting HTML after all template syntax has been replaced with actual data.
 */
export function clientPartialAvailabilityNotification(template, data) {
  try {
    // Compile the template
    const compiledTemplate = Handlebars.compile(template);

    // Execute with data
    const result = compiledTemplate(data);

    return result;
  } catch (error) {
    console.error("Error compiling partial availability template:", error);
    throw error;
  }
}

/**
 * Replaces All Tours Unavailable email template syntax with actual data.
 * Friendly email encouraging exploration of alternatives.
 * @param {string} template - The email template to replace syntax with actual data.
 * @param {object} data - The object containing data to replace the syntax with.
 * @return {string} The resulting HTML after all template syntax has been replaced with actual data.
 */
export function allToursUnavailable(template, data) {
  try {
    // Compile the template
    const compiledTemplate = Handlebars.compile(template);

    // Execute with data
    const result = compiledTemplate(data);

    return result;
  } catch (error) {
    console.error("Error compiling all tours unavailable template:", error);
    throw error;
  }
}

/**
 * Replaces Client Feedback Received email template syntax with actual data.
 * Shows before/after comparison for each tour based on client feedback.
 * @param {string} template - The email template to replace syntax with actual data.
 * @param {object} data - The object containing data to replace the syntax with.
 * @return {string} The resulting HTML after all template syntax has been replaced with actual data.
 */
export function clientFeedbackReceived(template, data) {
  try {
    // Compile the template
    const compiledTemplate = Handlebars.compile(template);

    // Execute with data
    const result = compiledTemplate(data);

    return result;
  } catch (error) {
    console.error("Error compiling feedback received template:", error);
    throw error;
  }
}

/**
 * Replaces Payment Confirmation email template syntax with actual data.
 * Handles both full and partial payments, with optional transaction IDs.
 * Supports both full availability and partial availability cases.
 * @param {string} template - The email template to replace syntax with actual data.
 * @param {object} data - The object containing data to replace the syntax with.
 * @return {string} The resulting HTML after all template syntax has been replaced.
 */
export function clientPaymentConfirmation(template, data) {
  try {
    // Add payment_status to data for template
    data.payment_status = data.isFullPayment ? "Fully Paid" : "Partially Paid";

    // Compile the template
    const compiledTemplate = Handlebars.compile(template);

    // Execute with data
    const result = compiledTemplate(data);

    return result;
  } catch (error) {
    console.error("Error compiling payment confirmation template:", error);
    throw error;
  }
}

/**
 * Replaces Tour Scheduled email template syntax with actual data.
 * Handles all schedule details including guides, drivers, itinerary, and equipment.
 * Supports both single-day and multi-day itineraries.
 * @param {string} template - The email template to replace syntax with actual data.
 * @param {object} data - The object containing data to replace the syntax with.
 * @return {string} The resulting HTML after all template syntax has been replaced.
 */
export function clientTourScheduled(template, data) {
  try {
    // Compile the template
    const compiledTemplate = Handlebars.compile(template);

    // Execute with data
    const result = compiledTemplate(data);

    return result;
  } catch (error) {
    console.error("Error compiling tour schedule template:", error);
    throw error;
  }
}

/**
 * Replaces Tour Completed email template syntax with actual data.
 * Handles all completion details including tours summary and review requests.
 * @param {string} template - The email template to replace syntax with actual data.
 * @param {object} data - The object containing data to replace the syntax with.
 * @return {string} The resulting HTML after all template syntax has been replaced.
 */
export function clientTourCompleted(template, data) {
  try {
    // Compile the template
    const compiledTemplate = Handlebars.compile(template);

    // Execute with data
    const result = compiledTemplate(data);

    return result;
  } catch (error) {
    console.error("Error compiling tour completion template:", error);
    throw error;
  }
}

/**
 * Replaces Partial Availability Confirmed email template syntax with actual data.
 * @param {string} template - The email template to replace syntax with actual data.
 * @param {object} data - The object containing data to replace the syntax with.
 * @return {string} The resulting HTML after all template syntax has been replaced with actual data.
 */
export function clientPartialAvailabilityConfirmed(template, data) {
  try {
    // Compile the template
    const compiledTemplate = Handlebars.compile(template);

    // Execute with data
    const result = compiledTemplate(data);

    return result;
  } catch (error) {
    console.error("Error compiling email template:", error);
    throw error;
  }
}

/**
 * Replaces All Tours Cancelled email template syntax with actual data.
 * @param {string} template - The email template to replace syntax with actual data.
 * @param {object} data - The object containing data to replace the syntax with.
 * @return {string} The resulting HTML after all template syntax has been replaced with actual data.
 */
export function clientAllToursCancelled(template, data) {
  try {
    // Compile the template
    const compiledTemplate = Handlebars.compile(template);

    // Execute with data
    const result = compiledTemplate(data);

    return result;
  } catch (error) {
    console.error("Error compiling all tours cancelled template:", error);
    throw error;
  }
}

/**
 * Replaces Payment Failed email template syntax with actual data.
 * @param {string} template - The email template HTML.
 * @param {object} data - The object containing data to replace the syntax with.
 * @return {string} The resulting HTML after all template syntax has been replaced.
 */
export function clientPaymentFailed(template, data) {
  let result = template;

  // First, replace all simple variables
  const replacements = {
    customer_name: data.customer_name || "",
    booking_reference: data.booking_reference || "",
    payment_date: data.payment_date || "",
    payment_method: data.payment_method || "",
    transaction_id: data.transaction_id || "",
    failure_reason: data.failure_reason || "Payment declined",
    total_amount: data.total_amount || "$0",
    tours_count: data.tours_count || 0,
    reservation_expiry: data.reservation_expiry || "",
    timeframe_hours: data.timeframe_hours || "24",
    retry_payment_link: data.retry_payment_link || "#",
    current_year: data.current_year || new Date().getFullYear(),
  };

  Object.keys(replacements).forEach((key) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    result = result.replace(regex, replacements[key]);
  });

  // Handle conditional transaction_id
  const transactionIdRegex = /\{\{#if transaction_id\}\}([\s\S]*?)\{\{\/if\}\}/;
  const transactionIdMatch = result.match(transactionIdRegex);
  if (transactionIdMatch) {
    if (data.transaction_id && data.transaction_id.trim()) {
      result = result.replace(transactionIdMatch[0], transactionIdMatch[1]);
    } else {
      result = result.replace(transactionIdMatch[0], "");
    }
  }

  // Handle tours loop if tours exist
  if (data.tours && Array.isArray(data.tours) && data.tours.length > 0) {
    const toursLoopRegex = /\{\{#each tours\}\}([\s\S]*?)\{\{\/each\}\}/;
    const toursMatch = result.match(toursLoopRegex);

    if (toursMatch) {
      const loopTemplate = toursMatch[1];
      let generatedToursContent = "";

      data.tours.forEach((tour) => {
        let tourItem = loopTemplate;

        // Replace tour-specific variables
        const tourReplacements = {
          tour_title: tour.tour_title || "",
          tour_date: tour.tour_date || "",
          guests: tour.guests || 1,
          guests_label: tour.guests_label || (tour.guests === 1 ? "Traveler" : "Travelers"),
          tour_price: tour.tour_price || "$0",
        };

        Object.keys(tourReplacements).forEach((key) => {
          const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
          tourItem = tourItem.replace(regex, tourReplacements[key]);
        });

        generatedToursContent += tourItem;
      });

      result = result.replace(toursLoopRegex, generatedToursContent);
    }
  }

  // Handle conditional tours section
  const toursConditionRegex = /\{\{#if tours\}\}([\s\S]*?)\{\{\/if\}\}/;
  const toursConditionMatch = result.match(toursConditionRegex);
  if (toursConditionMatch) {
    if (data.tours && data.tours.length > 0) {
      result = result.replace(toursConditionMatch[0], toursConditionMatch[1]);
    } else {
      result = result.replace(toursConditionMatch[0], "");
    }
  }

  // Clean up any leftover template syntax
  result = result.replace(/\{\{.*?\}\}/g, "");

  return result;
}

/**
 * ************************************************************************************
 * ************************************************************************************
 * Data Preparation
 * ************************************************************************************
 * ************************************************************************************
 **/

/**
 * Prepares the booking data for the Client Check Availability email template.
 * @param {object} bookingData - The booking data object.
 * @return {object} The prepared data for the email template.
 */
export function prepareClientBookingData(bookingData) {
  // Use 'tours' instead of 'cart' to match your bookingData structure
  const toursData = bookingData.tours || bookingData.cart || [];

  // Calculate subtotal from tours
  const subtotal = toursData.reduce((sum, item) => {
    return sum + (item.calculatedPrice || item.price || 0);
  }, 0);

  // Prepare tours array for template
  const tours = toursData.map((item) => ({
    tour_title: item.title || "Untitled Tour",
    tour_date: formatDate(item.date),
    guests: item.guests || 1,
    guests_label: (item.guests || 1) === 1 ? "Traveler" : "Travelers",
    tour_price: formatCurrency(item.calculatedPrice || item.price || 0),
  }));

  // Calculate if customer has phone (for conditional)
  const hasCustomerPhone = !!(bookingData.customer?.phone && bookingData.customer.phone.trim());

  return {
    // Customer Information
    customer_name: bookingData.customer?.name || "",
    customer_email: bookingData.customer?.email || "",
    customer_phone: bookingData.customer?.phone || "",

    // Conditional flags (booleans for Handlebars)
    customer_phone: hasCustomerPhone, // This is both the value and the conditional

    // Booking Information
    request_date: formatDate(bookingData.submittedAt || new Date().toISOString()),
    subtotal: formatCurrency(subtotal),

    // Tours Data
    tours: tours,

    // Metadata
    current_year: new Date().getFullYear(),
  };
}

/**
 * Prepares the internal email data for the Client Check Availability email template.
 * @param {object} bookingData - The booking data object.
 * @return {object} The prepared data for the email template.
 */
export function prepareNotificationBookingData(bookingData) {
  // Generate unique request ID
  const requestId =
    "EYT-" +
    Date.now() +
    "-" +
    Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");

  // Use correct data structure (tours instead of cart)
  const toursData = bookingData.tours || bookingData.cart || [];

  // Prepare tours
  const tours = toursData.map((item) => ({
    tour_title: item.title || "Unknown Tour",
    tour_id: item.tourId || item.slug || item.id || "N/A",
    tour_date: formatDate(item.date),
    guests: item.guests || 1,
    guests_label: (item.guests || 1) === 1 ? "person" : "people",
    tour_price: formatCurrency(item.calculatedPrice || item.price || 0),
    tour_link: `https://www.eytravelegypt.com/admin/availability/${
      item.tourId || item.slug || item.id || "unknown"
    }?date=${encodeURIComponent(item.date || "")}`,
  }));

  // Calculate total (formatted)
  const total = toursData.reduce((sum, item) => sum + (item.calculatedPrice || item.price || 0), 0);

  // Prepare WhatsApp number (more robust)
  let whatsappNumber = "";
  const customerPhone = bookingData.customer?.phone || "";

  if (customerPhone && customerPhone.trim()) {
    // Clean and format phone number for WhatsApp
    const cleaned = customerPhone.replace(/[^\d+]/g, "");
    if (cleaned.startsWith("+")) {
      whatsappNumber = cleaned.substring(1); // Remove leading +
    } else if (cleaned.startsWith("00")) {
      whatsappNumber = cleaned.substring(2); // Remove 00
    } else if (cleaned.startsWith("1") && cleaned.length === 11) {
      whatsappNumber = cleaned; // US/Canada numbers
    } else if (cleaned.startsWith("20") && cleaned.length === 11) {
      whatsappNumber = cleaned; // Egypt numbers
    } else {
      whatsappNumber = cleaned; // Fallback
    }
  }

  return {
    request_id: requestId,
    submitted_at: formatDate(bookingData.submittedAt || new Date().toISOString()),
    total_amount: formatCurrency(total),
    status: "Pending Availability Check",
    customer_name: bookingData.customer?.name || "Unknown",
    customer_email: bookingData.customer?.email || "No email provided",
    customer_phone: customerPhone,
    customer_notes: bookingData.customer?.notes || "",
    tour_count: tours.length,
    tours: tours,
    whatsapp_number: whatsappNumber,
    received_at: new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  };
}

/**
 * Prepares the internal email data for the Client All Tours Available email template.
 * @param {object} booking - The booking data object.
 * @param {string} paymentLink - The payment link.
 * @return {object} The prepared data for the email template.
 */
export function prepareAllToursAvailableData(booking, paymentLink) {
  const tours = booking.tours || [];

  // Calculate totals
  const subtotal = tours.reduce((sum, tour) => {
    return sum + (tour.calculatedPrice || tour.price || 0);
  }, 0);

  const total = booking.total || subtotal;

  // Format tours data
  const formattedTours = tours.map((tour) => ({
    tour_title: tour.title || "Tour",
    tour_date: formatDate(tour.date || ""),
    guests: tour.guests || 1,
    guests_label: (tour.guests || 1) === 1 ? "Traveler" : "Travelers",
    tour_price: formatCurrency(tour.calculatedPrice || tour.price || 0),
    availabilityNotes: tour.availabilityNotes || "",
  }));

  return {
    customer_name: booking.customer?.name || "",
    customer_email: booking.customer?.email || "",
    payment_link: paymentLink || "#",
    total_amount: formatCurrency(total),
    subtotal: formatCurrency(subtotal),
    request_id: booking.requestId || "",
    current_year: new Date().getFullYear(),
    tours: formattedTours,
  };
}

/**
 * Prepares the internal email data for the Client Partial Availability email template.
 * @param {object} booking - The booking data object.
 * @param {string} feedbackLink - The feedback link.
 * @returns {object} The prepared data for the email template.
 */
export function preparePartialAvailabilityData(booking, feedbackLink) {
  const tours = booking.tours || [];

  // Count available tours
  const availableTours = tours.filter((t) => t.availabilityStatus === "available").length;

  // Process each tour for the template
  const processedTours = tours.map((tour) => {
    // Get status configuration - MAKE SURE THIS FUNCTION EXISTS!
    const statusConfig = getStatusConfig(tour.availabilityStatus);

    return {
      // Template expects these exact property names:
      tour_title: tour.title || "Tour",
      tour_price: formatCurrency(tour.calculatedPrice || tour.price || 0), // Changed to formatCurrency for consistency
      original_date: formatDate(tour.date || ""),
      original_guests: tour.guests || 1,

      // Availability info
      availabilityNotes: tour.availabilityNotes || "",
      alternative_date: tour.alternativeDate ? formatDate(tour.alternativeDate) : "",
      limited_places: tour.limitedPlaces || 0,

      // Status info for styling
      status: tour.availabilityStatus || "unknown",
      status_color: statusConfig.color,
      status_icon: statusConfig.icon,
      status_text: statusConfig.text,

      // Helper flags (these are used in template conditionals)
      isAlternative: tour.availabilityStatus === "alternative",
      isLimited: tour.availabilityStatus === "limited",
      isUnavailable: tour.availabilityStatus === "unavailable",
    };
  });

  return {
    customer_name: booking.customer?.name || "Guest",
    feedback_link: feedbackLink,
    request_id: booking.requestId || "unknown",
    current_year: new Date().getFullYear(),
    available_tours: availableTours.toString(),
    total_tours: tours.length.toString(),
    tours: processedTours,
  };
}

/**
 * Prepares the internal email data for the Client All Tours Unavailable email template.
 * @param {object} booking - The booking data object.
 * @returns {object} The prepared data for the email template.
 */
export function prepareAllToursUnavailableData(booking) {
  const tours = booking.tours || [];

  // Format tours data for the template
  const formattedTours = tours.map((tour) => ({
    title: tour.title || "Tour",
    image: tour.image || "https://www.eytravelegypt.com/assets/images/default-tour.jpg",
    date: formatDate(tour.date || ""),
    guests: tour.guests || 1,
    availabilityNotes: tour.availabilityNotes || "",
  }));

  return {
    customer_name: booking.customer?.name || "",
    request_id: booking.requestId || "",
    current_year: new Date().getFullYear(),
    tours: formattedTours,
  };
}

/**
 * Prepares the internal email data for the Client Feedback Received email template.
 * @param {object} booking - The booking data object.
 * @param {array} feedbackDecisions - The array of feedback decisions.
 * @returns {object} The prepared data for the email template.
 */
export function prepareFeedbackReceivedData(booking, feedbackDecisions) {
  const tours = booking.tours || [];
  const totalTours = tours.length;

  // Calculate counts
  const toursKept = feedbackDecisions.filter((f) => f.decision === "keep").length;
  const toursModified = feedbackDecisions.filter((f) => f.decision === "modify").length;
  const toursRemoved = feedbackDecisions.filter((f) => f.decision === "remove").length;

  // Calculate response time
  const feedbackRequestedAt = booking.availabilityEmailSentAt
    ? new Date(booking.availabilityEmailSentAt.seconds * 1000)
    : booking.availabilityConfirmedAt
    ? new Date(booking.availabilityConfirmedAt.seconds * 1000)
    : new Date(booking.submittedAt);

  const now = new Date();
  const hoursDiff = Math.floor((now - feedbackRequestedAt) / (1000 * 60 * 60));
  const responseTime = hoursDiff < 24 ? "Within 24 hours" : `${hoursDiff} hours`;

  // Calculate ORIGINAL total (sum of originalPrice)
  const originalTotal = tours.reduce((sum, tour) => {
    return sum + (tour.originalPrice || 0);
  }, 0);

  // Use CURRENT total from booking (already updated)
  const newTotal = booking.total || 0;

  // Prepare WhatsApp number
  let whatsappNumber = "";
  const customerPhone = booking.customer?.phone || "";

  if (customerPhone && customerPhone.trim()) {
    // Clean and format phone number for WhatsApp
    const cleaned = customerPhone.replace(/[^\d+]/g, "");
    if (cleaned.startsWith("+")) {
      whatsappNumber = cleaned.substring(1); // Remove leading +
    } else if (cleaned.startsWith("00")) {
      whatsappNumber = cleaned.substring(2); // Remove 00
    } else if (cleaned.startsWith("1") && cleaned.length === 11) {
      whatsappNumber = cleaned; // US/Canada numbers
    } else if (cleaned.startsWith("20") && cleaned.length === 11) {
      whatsappNumber = cleaned; // Egypt numbers
    } else {
      whatsappNumber = cleaned; // Fallback
    }
  }

  return {
    request_id: booking.requestId,
    customer_name: booking.customer?.name || "",
    customer_email: booking.customer?.email || "",
    customer_phone: customerPhone,
    whatsapp_number: whatsappNumber, // Added WhatsApp number
    response_time: responseTime,
    status: "Feedback Received",
    original_total: formatCurrency(originalTotal), // Use formatCurrency instead of formatPriceForDisplay
    new_total: formatCurrency(newTotal), // Use formatCurrency instead of formatPriceForDisplay
    total_tours: totalTours.toString(),
    tours_kept: toursKept.toString(),
    tours_modified: toursModified.toString(),
    tours_removed: toursRemoved.toString(),
    feedback_time: now.toLocaleString(),
    received_at: now.toLocaleString(),
    tours: tours.map((tour) => {
      const feedback = feedbackDecisions.find((f) => f.tourId === tour.id) || {};
      const statusConfig = getStatusConfig(tour.availabilityStatus);
      const decisionConfig = getDecisionConfig(feedback.decision || "keep");

      // Get original price (before any modifications)
      const originalPrice = tour.originalPrice || 0;

      // Get current/updated price
      const currentPrice = tour.calculatedPrice || 0;

      // Get original guests
      const originalGuests = tour.originalGuests || 0;

      // Get current guests
      const currentGuests = tour.guests || 0;

      // Get original date
      const originalDate = tour.originalDate || "";

      // Get current date
      const currentDate = tour.date || "";

      return {
        // Tour info
        tour_title: tour.title || "Tour",
        tour_id: tour.id,

        // Status info
        original_status: tour.availabilityStatus || "unknown",
        status_color: statusConfig.color,
        status_icon: statusConfig.icon,

        // Decision info
        decision: feedback.decision || "keep",
        decision_text: decisionConfig.text,
        decision_icon: decisionConfig.icon,

        // Before (original)
        original_date: formatDate(originalDate),
        original_guests: originalGuests.toString(),
        original_price: formatCurrency(originalPrice), // Use formatCurrency

        // After (modified) - ALWAYS show current values
        modified_date: formatDate(currentDate),
        modified_guests: currentGuests.toString(), // ALWAYS show
        modified_price: formatCurrency(currentPrice), // Use formatCurrency

        // Notes
        client_notes: feedback.modificationDetails?.notes || tour.clientNotes || "",

        // Display flags
        show_after: feedback.decision !== "remove",
        after_font_weight: feedback.decision === "modify" ? "bold" : "normal",
      };
    }),
  };
}

/**
 * Prepares the email data for the Client Payment Confirmation email template.
 * Handles both manual and automated payments with optional transaction IDs.
 * Supports both full availability and partial availability cases.
 * @param {object} booking - The booking data object.
 * @param {object} paymentDetails - The payment details object.
 * @return {object} The prepared data for the email template.
 */
export function preparePaymentConfirmationData(booking, paymentDetails) {
  const total = parseFloat(booking.total || 0);
  const paidAmount = parseFloat(booking.paidAmount || 0);
  const isFullPayment = booking.paymentStatus === "fully_paid" || paidAmount >= total;

  // Calculate remaining balance
  const remainingBalance = Math.max(0, total - paidAmount);

  // Filter out cancelled tours and prepare tours data
  const confirmedTours = Array.isArray(booking.tours)
    ? booking.tours.filter((tour) => tour.status !== "cancelled" && tour.status !== "unavailable")
    : [];

  const cancelledTours = Array.isArray(booking.tours)
    ? booking.tours.filter((tour) => tour.status === "cancelled" || tour.status === "unavailable")
    : [];

  const tours = confirmedTours.map((tour) => {
    // Check if this tour was modified (partial availability case)
    const hasOriginalPrice = tour.originalPrice !== undefined;
    const hasOriginalGuests = tour.originalGuests !== undefined;
    const hasOriginalDate = tour.originalDate !== undefined;
    const hasModifications = tour.modifications !== undefined;

    const modificationsMade =
      hasModifications &&
      (tour.modifications.dateChanged ||
        tour.modifications.guestsChanged ||
        tour.modifications.priceChanged);

    const originalPrice = hasOriginalPrice
      ? parseFloat(tour.originalPrice || 0)
      : parseFloat(tour.calculatedPrice || 0);
    const currentPrice = parseFloat(tour.calculatedPrice || 0);
    const priceChanged = modificationsMade && originalPrice !== currentPrice;

    const originalGuests = hasOriginalGuests ? tour.originalGuests : tour.guests;
    const guestsChanged = modificationsMade && originalGuests !== tour.guests;

    const originalDate = hasOriginalDate ? tour.originalDate : tour.date;
    const currentDate = tour.date || tour.confirmedDate;
    const dateChanged = modificationsMade && originalDate !== currentDate;

    return {
      // Basic tour information
      tour_title: tour.title || "",
      tour_date: formatDate(currentDate),
      guests: tour.guests || 1,
      guests_label: tour.guests === 1 ? "Traveler" : "Travelers",
      tour_price: formatCurrency(currentPrice, booking.currency || "USD"),

      // Modification information for partial availability
      modifications_made: modificationsMade,
      guests_changed: guestsChanged,
      date_changed: dateChanged,
      price_changed: priceChanged,
      original_guests: originalGuests,
      original_date: formatDate(originalDate),
      original_price: formatCurrency(originalPrice, booking.currency || "USD"),
    };
  });

  return {
    // Customer Information
    customer_name: booking.customer?.name || "",
    customer_email: booking.customer?.email || "",

    // Booking Information
    booking_reference: booking.requestId || booking.id || "",

    // Payment Information
    payment_date: formatDate(paymentDetails.paymentDate || new Date()),
    payment_method: getPaymentMethodDisplay(paymentDetails.paymentMethod || "manual"),
    transaction_id: paymentDetails.transactionId || paymentDetails.stripeInvoiceId || "",
    receipt_number: paymentDetails.receiptNumber || "",
    payment_notes: paymentDetails.notes || "",

    // Amount Information
    total_amount: formatCurrency(total, booking.currency || "USD"),
    amount_paid: formatCurrency(
      parseFloat(paymentDetails.receivedAmount || 0),
      booking.currency || "USD"
    ),
    remaining_balance: formatCurrency(remainingBalance, booking.currency || "USD"),
    remaining_due_date: calculateDueDate(),
    currency: booking.currency || "USD",

    // Payment Status
    isFullPayment: isFullPayment,

    // Payment Link (for partial payments)
    payment_link: booking.paymentLink || "#",

    // Tours Information
    tours: tours,

    // Partial Availability Information
    booking_was_modified:
      booking.feedbackProcessedAt !== undefined ||
      booking.tours?.some((t) => t.modifications !== undefined),
    has_cancelled_tours: cancelledTours.length > 0,
    cancelled_tours_count: cancelledTours.length,

    // Metadata
    current_year: new Date().getFullYear(),
  };
}

/**
 * Prepares the email data for the Client Tour Scheduled email template
 * using [[ ]] syntax.
 * @param {object} booking - The booking data object.
 * @param {Array} processedSchedules - The processed schedule data from the API (optional).
 * @return {object} The prepared data for the email template.
 */
export function prepareTourScheduleData(booking, tourSchedules) {
  // Calculate total travelers across SCHEDULED tours only
  let totalTravelers = 0;

  // Prepare tours data - only include tours that have schedules
  const tours = [];

  if (Array.isArray(booking.tours)) {
    // Track tour index for display
    let tourDisplayIndex = 0;

    booking.tours.forEach((tour, index) => {
      // Only include tours that are confirmed and have schedules
      const isConfirmed = tour.status === "confirmed" && !tour.removedFromBooking;
      const schedule = tour.schedule;

      if (!isConfirmed || !schedule) {
        return;
      }

      tourDisplayIndex++;
      totalTravelers += tour.guests || 1;

      // Get guide and driver info from schedule
      const guide = schedule.guide || {};
      const driver = schedule.driver || {};

      // Determine if multi-day itinerary
      const isMultiDay =
        schedule.itineraryType === "multi_day" ||
        schedule.tourType === "multi_day_tour" ||
        schedule.durationDays > 1;

      // Prepare itinerary based on type
      let singleDayItinerary = [];
      let dayItinerary = [];
      let hasItinerary = false;

      if (isMultiDay) {
        if (Array.isArray(schedule.itinerary)) {
          // Process multi-day itinerary from schedule.itinerary
          dayItinerary = schedule.itinerary.map((day, dayIndex) => {
            // Get activities - they should be in day.activities
            const activities = Array.isArray(day.activities) ? day.activities : [];

            return {
              day: day.day || dayIndex + 1,
              day_date: formatDayDate(day.date || schedule.date),
              activities: activities.map((activity, actIndex) => ({
                time: formatTime(activity.time) || "09:00",
                activity: activity.activity || `Activity ${actIndex + 1}`,
                description: activity.description || "",
              })),
            };
          });

          hasItinerary =
            dayItinerary.length > 0 && dayItinerary.some((day) => day.activities.length > 0);
        } else {
        }
      } else {
        if (Array.isArray(schedule.itinerary)) {
          // Check if itinerary has day field (shouldn't for single day, but handle gracefully)
          const firstItem = schedule.itinerary[0];
          const hasDayField = firstItem && firstItem.day !== undefined;

          if (hasDayField) {
            // Flatten multi-day format to single day
            schedule.itinerary.forEach((day) => {
              if (Array.isArray(day.activities)) {
                day.activities.forEach((activity) => {
                  singleDayItinerary.push({
                    time: formatTime(activity.time) || "09:00",
                    activity: activity.activity || "Activity",
                    description: activity.description || "",
                  });
                });
              }
            });
          } else {
            // Normal single day itinerary format
            singleDayItinerary = schedule.itinerary.map((item, itemIndex) => ({
              time: formatTime(item.time) || "09:00",
              activity: item.activity || `Activity ${itemIndex + 1}`,
              description: item.description || "",
            }));
          }

          hasItinerary = singleDayItinerary.length > 0;
        } else {
        }
      }

      // Prepare equipment items
      const equipmentItems = Array.isArray(schedule.equipment)
        ? schedule.equipment
            .filter((item) => item && item.item)
            .map((item) => {
              const quantity = parseInt(item.quantity) || 1;
              return {
                item: item.item || "",
                quantity: quantity > 1 ? `(x${quantity})` : "", // Formatted for display
              };
            })
        : [];

      // Get date safely
      let tourDate = schedule.date || tour.date;
      if (tourDate instanceof Date) {
        tourDate = tourDate.toISOString();
      }

      // Format times safely
      const meetingTime = schedule.meetingPoint?.time;
      const dropoffTime = schedule.dropoffPoint?.time;

      // Combine notes
      let notes = schedule.scheduleNotes || "";

      // Calculate conditionals
      const hasGuide = !!guide.name && guide.assigned !== false;
      const hasDriver = !!driver.name && driver.assigned !== false;
      const hasGuideOrDriver = hasGuide || hasDriver;
      const hasEquipment = equipmentItems.length > 0;
      const hasNotes = !!notes && notes.trim() !== "";
      const hasEquipmentOrNotes = hasEquipment || hasNotes;
      const hasMeetingNotes =
        !!schedule.meetingPoint?.notes && schedule.meetingPoint.notes.trim() !== "";
      const hasDropoffNotes =
        !!schedule.dropoffPoint?.notes && schedule.dropoffPoint.notes.trim() !== "";
      const hasGuideEmail = !!guide.email && guide.email.trim() !== "";
      const hasDriverVehicle = !!driver.vehicle && driver.vehicle.toString().trim() !== "";

      // Create formatted duration
      let tourDuration = "";
      if (schedule.durationDays > 1) {
        tourDuration = `${schedule.durationDays} days`;
      } else if (schedule.durationHours) {
        tourDuration = `${schedule.durationHours} hours`;
      } else {
        tourDuration = "Full day";
      }

      tours.push({
        // Tour basic info
        tour_title: tour.title || schedule.title || "Tour",
        tour_number: tourDisplayIndex.toString(),
        tour_type: getTourTypeDisplay(schedule.tourType) || "Day Tour",
        tour_date: formatDate(tourDate),
        tour_duration: tourDuration,

        // Meeting/dropoff points
        meeting_location: schedule.meetingPoint?.location || "To be confirmed",
        meeting_time: meetingTime ? formatTime(meetingTime) : "08:30",
        meeting_notes: schedule.meetingPoint?.notes || "",
        dropoff_location: schedule.dropoffPoint?.location || "To be confirmed",
        dropoff_time: dropoffTime ? formatTime(dropoffTime) : "17:30",
        dropoff_notes: schedule.dropoffPoint?.notes || "",

        // Staff info
        guide_name: guide.name || "",
        guide_phone: guide.phone || "",
        guide_email: guide.email || "",
        driver_name: driver.name || "",
        driver_phone: driver.phone || "",
        driver_vehicle: driver.vehicle || "",

        // Tour details
        notes: notes,

        // Itinerary
        is_multi_day: isMultiDay,
        itinerary: singleDayItinerary,
        day_itinerary: dayItinerary,

        // Equipment
        equipment: equipmentItems,

        // Conditionals for Handlebars (as booleans)
        has_guide_or_driver: hasGuideOrDriver,
        has_guide: hasGuide,
        has_driver: hasDriver,
        has_itinerary: hasItinerary,
        has_equipment: hasEquipment,
        has_notes: hasNotes,
        has_equipment_or_notes: hasEquipmentOrNotes,
      });
    });
  }

  // Set total_tours for each tour
  tours.forEach((tour) => {
    tour.total_tours = tours.length.toString();
  });

  // Calculate plural conditionals (top-level)
  const multipleTours = tours.length > 1;
  const multipleTravelers = totalTravelers > 1;

  const result = {
    // Customer Information
    customer_name: booking.customer?.name || "",

    // Booking Information
    booking_reference: booking.requestId || "",

    // Schedule Information
    total_tours: tours.length.toString(),
    total_travelers: totalTravelers.toString(),
    schedule_date: formatDate(new Date(), false),

    // Plural conditionals (top-level for booking summary)
    multiple_tours: multipleTours,
    multiple_travelers: multipleTravelers,

    // Tours Data
    tours: tours,

    // Metadata
    current_year: new Date().getFullYear(),
  };

  return result;
}

/**
 * Prepares the email data for the Client Tour Completed email template.
 * @param {object} booking - The booking data object.
 * @return {object} The prepared data for the email template.
 */
export function prepareTourCompletionData(booking) {
  // Separate tours by status
  const completedTours = booking.tours?.filter((tour) => tour.completed) || [];
  const cancelledTours =
    booking.tours?.filter((tour) => tour.status === "cancelled" || tour.removedFromBooking) || [];
  const scheduledTours =
    booking.tours?.filter((tour) => tour.schedule && !tour.completed && !tour.removedFromBooking) ||
    [];
  const totalTours = booking.tours?.length || 0;

  // Calculate completion statistics
  const completedCount = completedTours.length;
  const cancelledCount = cancelledTours.length;
  const scheduledCount = scheduledTours.length;
  const notCompletedCount = scheduledCount + cancelledCount;

  // Get main guide and driver from completed tours first, then scheduled tours
  let mainGuide = "";
  let mainDriver = "";

  // Check completed tours first
  for (const tour of completedTours) {
    if (tour.schedule?.guide?.name && !mainGuide) {
      mainGuide = tour.schedule.guide.name;
    }
    if (tour.schedule?.driver?.name && !mainDriver) {
      mainDriver = tour.schedule.driver.name;
    }
  }

  // If not found in completed, check scheduled tours
  if (!mainGuide || !mainDriver) {
    for (const tour of scheduledTours) {
      if (tour.schedule?.guide?.name && !mainGuide) {
        mainGuide = tour.schedule.guide.name;
      }
      if (tour.schedule?.driver?.name && !mainDriver) {
        mainDriver = tour.schedule.driver.name;
      }
    }
  }

  // Prepare tours data for email display
  const tours = [];

  // Add completed tours
  completedTours.forEach((tour, index) => {
    const schedule = tour.schedule || {};
    tours.push({
      tour_title: tour.title || "",
      tour_date: formatDate(tour.completedAt || tour.date || schedule.date),
      tour_duration: formatDuration(schedule),
      guests: tour.guests || 1,
      guests_label: tour.guests === 1 ? "Traveler" : "Travelers",
      status: "completed",
      status_color: "#22c55e",
      status_text: "✅ Completed",
      status_emoji: "✅",
    });
  });

  // Add scheduled (not completed) tours if any
  scheduledTours.forEach((tour, index) => {
    const schedule = tour.schedule || {};
    tours.push({
      tour_title: tour.title || "",
      tour_date: formatDate(tour.date || schedule.date),
      tour_duration: formatDuration(schedule),
      guests: tour.guests || 1,
      guests_label: tour.guests === 1 ? "Traveler" : "Travelers",
      status: "scheduled",
      status_color: "#f59e0b",
      status_text: "🕐 Scheduled",
      status_emoji: "🕐",
    });
  });

  // Prepare cancellation summary if there are cancelled tours
  let cancellationSummary = null;
  if (cancelledCount > 0) {
    const cancellationReasons = [];

    cancelledTours.forEach((tour) => {
      const reason = tour.cancelledReason || tour.cancellationNotes || "No longer available";
      const date = formatDate(tour.date || tour.originalDate);

      cancellationReasons.push({
        tour_title: tour.title,
        cancellation_date: date,
        cancellation_reason: reason,
      });
    });

    cancellationSummary = {
      count: cancelledCount,
      tours: cancellationReasons,
    };
  }

  return {
    // Customer Information
    customer_name: booking.customer?.name || "",

    // Booking Information
    booking_reference: booking.requestId || "",

    // Completion Statistics
    completion_date: formatDate(booking.completedAt || booking.updatedAt || new Date()),
    completed_tours: completedCount.toString(),
    cancelled_tours: cancelledCount.toString(),
    scheduled_tours: scheduledCount.toString(),
    total_tours: totalTours.toString(),
    not_completed_tours: notCompletedCount.toString(),

    // Status tracking (booleans for Handlebars conditionals)
    all_tours_completed: notCompletedCount === 0,
    has_cancelled_tours: cancelledCount > 0,
    has_scheduled_tours: scheduledCount > 0,

    // Staff Information
    guide_name: mainGuide,
    driver_name: mainDriver,

    // Tours Data (array for Handlebars #each)
    tours: tours,

    // Cancellation summary (object for Handlebars conditionals and loops)
    cancellation_summary: cancellationSummary,

    // Metadata
    current_year: new Date().getFullYear(),
  };
}

/**
 * Prepares the internal email data for the Partial Availability Confirmed email template.
 * @param {object} booking - The booking data object.
 * @param {string} paymentLink - The payment link.
 * @return {object} The prepared data for the email template.
 */
export function preparePartialAvailabilityConfirmedData(booking, paymentLink) {
  // Get all tours
  const allTours = booking.tours || [];

  // Separate confirmed and cancelled tours
  const confirmedTours = [];
  const cancelledTours = [];
  let originalTotal = 0;

  allTours.forEach((tour) => {
    // Get the original price
    const originalPrice = tour.originalPrice || 0;
    originalTotal += originalPrice;

    // Check if tour was removed in client feedback
    const feedback = booking.feedbackDecisions?.find((f) => f.tourId === tour.id);

    // Check if tour is cancelled or removed
    const isRemoved =
      tour.removedFromBooking || tour.status === "cancelled" || feedback?.decision === "remove";

    if (isRemoved) {
      cancelledTours.push({
        tour_title: tour.title,
        original_date: formatDate(tour.originalDate || tour.date),
        original_guests: tour.originalGuests || tour.guests,
        cancellation_reason: feedback?.modificationDetails?.notes || "Removed per your request",
      });
    } else if (tour.status === "confirmed") {
      // Tour is confirmed
      const isModified = feedback?.decision === "modify";

      // Get current values from tour object
      const currentGuests = tour.guests || 0;
      const currentDate = tour.date;
      const currentPrice = tour.calculatedPrice || originalPrice;

      // Get original values from tour object
      const originalGuests = tour.originalGuests || currentGuests;
      const originalDate = tour.originalDate || currentDate;

      // Compare dates properly
      const formatDateForComparison = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toISOString().split("T")[0];
      };

      // Determine what actually changed
      const guestsChanged = isModified && originalGuests !== currentGuests;
      const dateChanged =
        isModified &&
        formatDateForComparison(originalDate) !== formatDateForComparison(currentDate);

      confirmedTours.push({
        tour_title: tour.title,
        tour_date: formatDate(currentDate),
        guests: currentGuests,
        guests_label: currentGuests === 1 ? "Traveler" : "Travelers",
        tour_price: currentPrice.toString(),
        modifications_made: isModified,
        guests_changed: guestsChanged,
        date_changed: dateChanged,
        original_guests: originalGuests,
        client_notes: feedback?.modificationDetails?.notes || tour.clientNotes || "",
      });
    }
  });

  // Calculate price difference
  const currentTotal = booking.total || 0;
  const priceDifference = currentTotal - originalTotal;

  return {
    customer_name: booking.customer.name,
    customer_email: booking.customer.email,
    payment_link: paymentLink,
    total_amount: currentTotal.toString(),
    original_total: originalTotal.toString(),
    request_id: booking.requestId,
    current_year: new Date().getFullYear(),
    original_tours_count: allTours.length,
    confirmed_tours_count: confirmedTours.length,
    cancelled_tours_count: cancelledTours.length,
    price_difference: priceDifference,
    price_difference_absolute: Math.abs(priceDifference),
    price_difference_prefix: priceDifference > 0 ? "+" : priceDifference < 0 ? "-" : "",
    price_difference_color:
      priceDifference > 0 ? "#22c55e" : priceDifference < 0 ? "#ef4444" : "#a8a29e",
    confirmed_tours: confirmedTours,
    cancelled_tours: cancelledTours,
    has_cancelled_tours: cancelledTours.length > 0,
  };
}

/**
 * Prepares the internal email data for the All Tours Cancelled email template.
 * @param {object} booking - The booking data object.
 * @param {string} cancellationNotes - The cancellation notes from admin.
 * @return {object} The prepared data for the email template.
 */
export function prepareAllToursCancelledData(booking, cancellationNotes) {
  // Get all tours
  const allTours = booking.tours || [];
  let originalTotal = 0;

  const cancelledTours = allTours.map((tour) => {
    // IMPORTANT: Get the ORIGINAL price correctly
    let displayPrice = 0;

    // Priority 1: Use originalPrice if it exists
    if (tour.originalPrice !== undefined && tour.originalPrice !== null) {
      displayPrice = tour.originalPrice;
    }
    // Priority 2: Use calculatedPrice (might be modified)
    else if (tour.calculatedPrice !== undefined && tour.calculatedPrice !== null) {
      displayPrice = tour.calculatedPrice;
    }
    // Priority 3: Calculate from groupPrices and original guests
    else if (tour.groupPrices && Array.isArray(tour.groupPrices) && tour.groupPrices.length > 0) {
      const guests = tour.originalGuests || tour.guests || 0;
      displayPrice = calculateTourPrice(tour, guests);
    }
    // Priority 4: Fallback to 0
    else {
      displayPrice = 0;
    }

    originalTotal += displayPrice;

    // Get feedback for this tour if any
    const feedback = booking.feedbackDecisions?.find((f) => f.tourId === tour.id);

    // Get display values
    const displayGuests = tour.originalGuests !== undefined ? tour.originalGuests : tour.guests;
    const displayDate = tour.originalDate !== undefined ? tour.originalDate : tour.date;

    // Build tour notes
    let tourNotes = feedback?.modificationDetails?.notes || tour.clientNotes || "";

    // If the tour was modified, add that info
    if (
      feedback?.decision === "modify" &&
      tour.originalGuests !== undefined &&
      tour.originalGuests !== tour.guests
    ) {
      const modNote = `Originally requested: ${tour.originalGuests} guests`;
      if (tourNotes) {
        tourNotes = `${modNote} | ${tourNotes}`;
      } else {
        tourNotes = modNote;
      }
    }

    return {
      tour_title: tour.title,
      original_date: formatDate(displayDate),
      original_guests: displayGuests,
      guests_label: displayGuests === 1 ? "Traveler" : "Travelers",
      tour_price: formatCurrency(displayPrice),
      tour_notes: tourNotes,
    };
  });

  // Format the date nicely for display
  const cancellationDate = new Date();
  const formattedDate = formatDate(cancellationDate.toISOString());

  return {
    customer_name: booking.customer?.name || "",
    customer_email: booking.customer?.email || "",
    request_id: booking.requestId || "",
    current_year: new Date().getFullYear(),
    original_total: formatCurrency(originalTotal),
    cancellation_date: formattedDate,
    cancellation_notes: cancellationNotes,
    cancelled_tours: cancelledTours,
  };
}

/**
 * Prepares the email data for the Payment Failed email template.
 * @param {object} booking - The booking data object from Firestore.
 * @param {object} paymentFailureDetails - The payment failure details.
 * @return {object} The prepared data for the email template.
 */
export function preparePaymentFailedData(booking, paymentFailureDetails) {
  const confirmedTours = Array.isArray(booking.tours)
    ? booking.tours.filter((tour) => tour.status === "confirmed")
    : [];

  // Calculate reservation expiry (24 hours from now)
  let reservation_expiry;
  let timeframe_hours = "24";

  if (booking.paymentLinkExpiresAt) {
    try {
      // Parse the expiry date from booking
      const expiryDate = new Date(booking.paymentLinkExpiresAt);
      reservation_expiry = formatDate(expiryDate);

      // Calculate hours remaining from now to expiry
      const now = new Date();
      const hoursRemaining = Math.max(0, Math.ceil((expiryDate - now) / (1000 * 60 * 60)));
      timeframe_hours = hoursRemaining.toString();
    } catch (error) {
      console.error("Error parsing paymentLinkExpiresAt:", error);
      // Fallback to default calculation
      const now = new Date();
      const expiryDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      reservation_expiry = formatDate(expiryDate);
    }
  } else {
    // Fallback if no expiry date in booking
    const now = new Date();
    const expiryDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    reservation_expiry = formatDate(expiryDate);
  }

  const tours = confirmedTours.map((tour) => ({
    tour_title: tour.title || "",
    tour_date: formatDate(tour.date || tour.confirmedDate),
    guests: tour.guests || 1,
    guests_label: tour.guests === 1 ? "Traveler" : "Travelers",
    tour_price: formatCurrency(tour.calculatedPrice || 0, booking.currency || "USD"),
  }));

  return {
    // Customer Information
    customer_name: booking.customer?.name || "",

    // Booking Information
    booking_reference: booking.requestId || booking.id || "",

    // Payment Failure Details
    payment_date: formatDate(now),
    payment_method: paymentFailureDetails.paymentMethod || "Credit Card",
    transaction_id: paymentFailureDetails.transactionId || "",
    failure_reason: paymentFailureDetails.failureReason || "Payment declined by bank",

    // Amount Information
    total_amount: formatCurrency(booking.total || 0, booking.currency || "USD"),
    tours_count: confirmedTours.length,

    // Reservation Information
    reservation_expiry: reservation_expiry,
    timeframe_hours: timeframe_hours, // Fixed to 24 hours

    // Retry Payment Link
    retry_payment_link: booking.stripePaymentLinkUrl || booking.paymentLink || "#",

    // Tours Information
    tours: tours,

    // Metadata
    current_year: now.getFullYear(),
  };
}

/**
 * ************************************************************************************
 * ************************************************************************************
 * Helper functions
 * ************************************************************************************
 * ************************************************************************************
 **/

function getStatusConfig(status) {
  const configs = {
    available: {
      color: "#16a34a",
      icon: "✅",
      text: "Available",
    },
    limited: {
      color: "#f59e0b",
      icon: "⚠️",
      text: "Limited Availability",
    },
    alternative: {
      color: "#3b82f6",
      icon: "📅",
      text: "Alternative Date",
    },
    unavailable: {
      color: "#dc2626",
      icon: "🚫",
      text: "Not Available",
    },
  };

  return configs[status] || { color: "#a8a29e", icon: "❓", text: "Unknown" };
}

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {boolean} includeWeekday - Whether to include weekday
 * @return {string} Formatted date
 */
function formatDate(date, includeWeekday = true) {
  if (!date) return "";

  const d = new Date(date);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  if (includeWeekday) {
    options.weekday = "long";
  }

  return d.toLocaleDateString("en-US", options);
}

function getDecisionConfig(decision) {
  const configs = {
    keep: {
      text: "Keep as is",
      icon: "✅",
    },
    modify: {
      text: "Modified",
      icon: "✏️",
    },
    remove: {
      text: "Remove from booking",
      icon: "🗑️",
    },
  };
  return configs[decision] || configs.keep;
}

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @return {string} Formatted currency
 */
function formatCurrency(amount, currency = "USD") {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(amount || 0);
}

/**
 * Calculate remaining due date (14 days from now)
 * @return {string} Formatted due date
 */
function calculateDueDate() {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  return dueDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
/**
 * Get payment method display name
 * @param {string} method - Payment method code
 * @return {string} Display name
 */
function getPaymentMethodDisplay(method) {
  const methods = {
    stripe: "Credit/Debit Card (Stripe)",
    bank_transfer: "Bank Transfer",
    paypal: "PayPal",
    cash: "Cash Payment",
    manual: "Manual Payment",
    invoice: "Invoice Payment",
  };

  return methods[method] || method || "Manual Payment";
}

/**
 * Format time for display
 * @param {string} time - Time string (HH:mm)
 * @return {string} Formatted time
 */
function formatTime(timeString) {
  if (!timeString) return "09:00";

  // If it's in "8:30 AM" format, convert to "08:30"
  if (typeof timeString === "string" && (timeString.includes("AM") || timeString.includes("PM"))) {
    try {
      const date = new Date(`2000-01-01 ${timeString}`);
      return date.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "09:00";
    }
  }

  // If it's already in HH:mm format
  if (typeof timeString === "string" && timeString.includes(":")) {
    return timeString.length === 5 ? timeString : timeString.substring(0, 5);
  }

  // If it's a Date object
  if (timeString instanceof Date) {
    return timeString.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return "09:00";
}

/**
 * Get tour type display name
 * @param {string} tourType - Tour type code
 * @return {string} Display name
 */
function getTourTypeDisplay(tourType) {
  const types = {
    day_tour: "Day Tour",
    hourly_tour: "Hourly Tour",
    multi_day_tour: "Multi-Day Tour",
  };

  return types[tourType] || tourType || "Day Tour";
}

/**
 * Format duration display
 * @param {object} schedule - Schedule object
 * @return {string} Formatted duration
 */
function formatDuration(schedule) {
  if (!schedule) return "8 hours";

  if (schedule.tourType === "multi_day_tour") {
    const days = schedule.durationDays || 1;
    const hoursPerDay = schedule.durationHours || 8;
    return `${days} day${days > 1 ? "s" : ""} (${hoursPerDay} hours/day)`;
  } else if (schedule.tourType === "hourly_tour") {
    const hours = schedule.durationHours || 4;
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  } else {
    const hours = schedule.durationHours || 8;
    return `${hours} hours`;
  }
}

/**
 * Format day date (short format)
 * @param {string|Date} date - Date to format
 * @return {string} Formatted date
 */
function formatDayDate(date) {
  if (!date) return "";

  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format price for display
 */
function formatPriceForDisplay(price) {
  if (typeof price === "number") {
    return `$${price.toFixed(2)}`;
  }
  if (typeof price === "string") {
    return price.startsWith("$") ? price : `$${price}`;
  }
  return "$0.00";
}
