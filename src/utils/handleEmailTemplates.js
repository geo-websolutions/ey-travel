/**
 * Replaces Client Check Availability email template syntax with actual data.
 * @param {string} template - The email template to replace syntax with actual data.
 * @param {object} data - The object containing data to replace the syntax with.
 * @return {string} The resulting HTML after all template syntax has been replaced with actual data.
 */
export function clientCheckAvailability(template, data) {
  let result = template;

  // First, replace all simple variables to avoid interference with conditionals
  const replacements = {
    customer_name: data.customer_name || "",
    customer_email: data.customer_email || "",
    customer_phone: data.customer_phone || "",
    request_date: data.request_date || new Date().toLocaleDateString(),
    current_year: data.current_year || new Date().getFullYear(),
    subtotal: data.subtotal || "$0",
  };

  Object.keys(replacements).forEach((key) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    result = result.replace(regex, replacements[key]);
  });

  // Handle tours loop
  const tourLoopRegex = /\{\{#each tours\}\}([\s\S]*?)\{\{\/each\}\}/;
  const tourMatch = result.match(tourLoopRegex);

  if (tourMatch && data.tours && Array.isArray(data.tours)) {
    const loopTemplate = tourMatch[1];
    let toursContent = "";

    data.tours.forEach((tour, index) => {
      let tourItem = loopTemplate;

      // Replace tour-specific variables
      tourItem = tourItem.replace(/\{\{tour_title\}\}/g, tour.tour_title || "");
      tourItem = tourItem.replace(/\{\{tour_date\}\}/g, tour.tour_date || "");
      tourItem = tourItem.replace(/\{\{guests\}\}/g, tour.guests || 1);
      tourItem = tourItem.replace(
        /\{\{guests_label\}\}/g,
        tour.guests_label || ((tour.guests || 1) === 1 ? "person" : "people")
      );
      tourItem = tourItem.replace(/\{\{tour_price\}\}/g, tour.tour_price || "$0");

      // Handle unless condition for border styling
      const unlessRegex = /\{\{#unless @last\}\}([\s\S]*?)\{\{\/unless\}\}/;
      const unlessMatch = tourItem.match(unlessRegex);

      if (unlessMatch) {
        if (index < data.tours.length - 1) {
          // Not the last item, keep the border style
          tourItem = tourItem.replace(unlessRegex, unlessMatch[1]);
        } else {
          // Last item, remove the border style
          tourItem = tourItem.replace(unlessRegex, "");
        }
      }

      toursContent += tourItem;
    });

    // Replace the loop with generated content
    result = result.replace(tourLoopRegex, toursContent);
  } else {
    // If no tours, remove the entire loop section
    result = result.replace(tourLoopRegex, "");
  }

  // Handle phone conditional (now after variable replacement)
  const phoneConditionalRegex = /\{\{#if customer_phone\}\}([\s\S]*?)\{\{\/if\}\}/;
  const phoneMatch = result.match(phoneConditionalRegex);

  if (phoneMatch) {
    if (data.customer_phone && data.customer_phone.trim()) {
      // Phone exists, keep the content and replace phone variable again
      let phoneContent = phoneMatch[1];
      phoneContent = phoneContent.replace(/\{\{customer_phone\}\}/g, data.customer_phone);
      result = result.replace(phoneConditionalRegex, phoneContent);
    } else {
      // No phone, remove the entire conditional block
      result = result.replace(phoneConditionalRegex, "");
    }
  }

  // Clean up any leftover template syntax that might have been missed
  result = result.replace(/\{\{.*?\}\}/g, "");

  return result;
}

/**
 * Replaces Client Booking Notification email template syntax with actual data.
 * @param {string} template - The email template to replace syntax with actual data.
 * @param {object} data - The object containing data to replace the syntax with.
 * @return {string} The resulting HTML after all template syntax has been replaced with actual data.
 */
export function clientBookingNotification(template, data) {
  let result = template;

  // Helper function for safe replacement
  const replaceAll = (str, find, replace) => {
    return str.split(find).join(replace);
  };

  // 1. First, handle conditional blocks that contain other variables
  // Handle customer_phone conditional first since it contains phone variable
  const phoneConditionalRegex = /\{\{#if customer_phone\}\}([\s\S]*?)\{\{\/if\}\}/g;
  const phoneMatches = [];

  let phoneMatch;
  while ((phoneMatch = phoneConditionalRegex.exec(result)) !== null) {
    phoneMatches.push({
      start: phoneMatch.index,
      end: phoneMatch.index + phoneMatch[0].length,
      content: phoneMatch[1],
      full: phoneMatch[0],
    });
  }

  // Process phone conditionals from last to first (to preserve indices)
  phoneMatches.reverse().forEach((match) => {
    if (data.customer_phone && data.customer_phone.trim()) {
      // Replace conditional with its content
      result = result.substring(0, match.start) + match.content + result.substring(match.end);
    } else {
      // Remove conditional entirely
      result = result.substring(0, match.start) + result.substring(match.end);
    }
  });

  // Handle customer_notes conditional
  const notesConditionalRegex = /\{\{#if customer_notes\}\}([\s\S]*?)\{\{\/if\}\}/g;
  const notesMatches = [];

  let notesMatch;
  while ((notesMatch = notesConditionalRegex.exec(result)) !== null) {
    notesMatches.push({
      start: notesMatch.index,
      end: notesMatch.index + notesMatch[0].length,
      content: notesMatch[1],
      full: notesMatch[0],
    });
  }

  notesMatches.reverse().forEach((match) => {
    if (data.customer_notes && data.customer_notes.trim()) {
      result = result.substring(0, match.start) + match.content + result.substring(match.end);
    } else {
      result = result.substring(0, match.start) + result.substring(match.end);
    }
  });

  // 2. Replace simple variables
  const simpleVars = {
    request_id: data.request_id || "N/A",
    submitted_at: data.submitted_at || formatDate(new Date()),
    total_amount: data.total_amount || "0",
    status: data.status || "Pending",
    customer_name: data.customer_name || "",
    customer_email: data.customer_email || "",
    customer_phone: data.customer_phone || "",
    customer_notes: data.customer_notes || "",
    tour_count: data.tour_count || 0,
    whatsapp_number: data.whatsapp_number || "",
    received_at: data.received_at || new Date().toLocaleString(),
  };

  Object.keys(simpleVars).forEach((key) => {
    result = replaceAll(result, `{{${key}}}`, simpleVars[key]);
  });

  // 3. Handle tours loop
  const toursStart = "{{#each tours}}";
  const toursEnd = "{{/each}}";
  let startIndex = result.indexOf(toursStart);

  while (startIndex !== -1) {
    const endIndex = result.indexOf(toursEnd, startIndex);

    if (endIndex !== -1) {
      const beforeTours = result.substring(0, startIndex);
      const afterTours = result.substring(endIndex + toursEnd.length);
      const tourTemplate = result.substring(startIndex + toursStart.length, endIndex);

      let toursContent = "";

      if (data.tours && Array.isArray(data.tours) && data.tours.length > 0) {
        data.tours.forEach((tour) => {
          let tourItem = tourTemplate;

          // Replace tour-specific variables
          const tourVars = {
            tour_title: tour.tour_title || "",
            tour_id: tour.tour_id || "",
            tour_date: tour.tour_date || "",
            guests: tour.guests || 1,
            guests_label: tour.guests_label || ((tour.guests || 1) === 1 ? "person" : "people"),
            tour_price: tour.tour_price || "0",
            tour_link: tour.tour_link || "#",
          };

          Object.keys(tourVars).forEach((key) => {
            tourItem = replaceAll(tourItem, `{{${key}}}`, tourVars[key]);
          });

          toursContent += tourItem;
        });
      }

      result = beforeTours + toursContent + afterTours;
    }

    // Look for next loop
    startIndex = result.indexOf(toursStart);
  }

  // 4. Handle WhatsApp conditional (might be inside or outside the tours loop)
  const whatsappConditionalRegex = /\{\{#if whatsapp_number\}\}([\s\S]*?)\{\{\/if\}\}/g;
  let whatsappMatch;
  const whatsappMatches = [];

  while ((whatsappMatch = whatsappConditionalRegex.exec(result)) !== null) {
    whatsappMatches.push({
      start: whatsappMatch.index,
      end: whatsappMatch.index + whatsappMatch[0].length,
      content: whatsappMatch[1],
      full: whatsappMatch[0],
    });
  }

  whatsappMatches.reverse().forEach((match) => {
    if (data.whatsapp_number && data.whatsapp_number.trim()) {
      result = result.substring(0, match.start) + match.content + result.substring(match.end);
    } else {
      result = result.substring(0, match.start) + result.substring(match.end);
    }
  });

  // 5. Final cleanup of any remaining template syntax
  const remainingRegex = /\{\{[^{}]*\}\}/g;
  result = result.replace(remainingRegex, "");

  return result;
}

/**
 * Replaces All Tours Available email template syntax with actual data.
 * Includes payment link, tour availability notes, and tour details.
 * @param {string} template - The email template to replace syntax with actual data.
 * @param {object} data - The object containing data to replace the syntax with.
 * @return {string} The resulting HTML after all template syntax has been replaced with actual data.
 */
export function clientAllToursAvailable(template, data) {
  let result = template;

  // First, replace all simple variables to avoid interference with conditionals
  const replacements = {
    customer_name: data.customer_name || "",
    customer_email: data.customer_email || "",
    payment_link: data.payment_link || "#",
    total_amount: data.total_amount || "$0",
    subtotal: data.subtotal || "$0",
    request_id: data.request_id || "",
    current_year: data.current_year || new Date().getFullYear(),
  };

  Object.keys(replacements).forEach((key) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    result = result.replace(regex, replacements[key]);
  });

  // Handle tours loop
  const tourLoopRegex = /\{\{#each tours\}\}([\s\S]*?)\{\{\/each\}\}/;
  const tourMatch = result.match(tourLoopRegex);

  if (tourMatch && data.tours && Array.isArray(data.tours)) {
    const loopTemplate = tourMatch[1];
    let toursContent = "";

    data.tours.forEach((tour, index) => {
      let tourItem = loopTemplate;

      // Replace tour-specific variables
      tourItem = tourItem.replace(/\{\{tour_title\}\}/g, tour.tour_title || "");
      tourItem = tourItem.replace(/\{\{tour_date\}\}/g, tour.tour_date || "");
      tourItem = tourItem.replace(/\{\{guests\}\}/g, tour.guests || 1);
      tourItem = tourItem.replace(
        /\{\{guests_label\}\}/g,
        tour.guests_label || ((tour.guests || 1) === 1 ? "Traveler" : "Travelers")
      );
      tourItem = tourItem.replace(/\{\{tour_price\}\}/g, tour.tour_price || "$0");

      // Handle availability notes conditional
      const notesConditionalRegex = /\{\{#if availabilityNotes\}\}([\s\S]*?)\{\{\/if\}\}/;
      const notesMatch = tourItem.match(notesConditionalRegex);

      if (notesMatch) {
        if (tour.availabilityNotes && tour.availabilityNotes.trim()) {
          // Notes exist, keep the content and replace notes variable
          let notesContent = notesMatch[1];
          notesContent = notesContent.replace(/\{\{availabilityNotes\}\}/g, tour.availabilityNotes);
          tourItem = tourItem.replace(notesConditionalRegex, notesContent);
        } else {
          // No notes, remove the entire conditional block
          tourItem = tourItem.replace(notesConditionalRegex, "");
        }
      }

      toursContent += tourItem;
    });

    // Replace the loop with generated content
    result = result.replace(tourLoopRegex, toursContent);
  } else {
    // If no tours, remove the entire loop section
    result = result.replace(tourLoopRegex, "");
  }

  // Clean up any leftover template syntax that might have been missed
  result = result.replace(/\{\{.*?\}\}/g, "");

  return result;
}

/**
 * Replaces Partial Availability email template syntax with actual data.
 * Handles multiple statuses: available, limited, alternative, unavailable.
 * @param {string} template - The email template to replace syntax with actual data.
 * @param {object} data - The object containing data to replace the syntax with.
 * @return {string} The resulting HTML after all template syntax has been replaced with actual data.
 */
export function clientPartialAvailablilityNotification(template, data) {
  let result = template;

  // First, replace all simple variables
  const replacements = {
    customer_name: data.customer_name || "",
    feedback_link: data.feedback_link || "#",
    request_id: data.request_id || "",
    current_year: data.current_year || new Date().getFullYear(),
    available_tours: data.available_tours || "0",
    total_tours: data.total_tours || "0",
  };

  Object.keys(replacements).forEach((key) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    result = result.replace(regex, replacements[key]);
  });

  // Handle tours loop
  const tourLoopRegex = /\{\{#each tours\}\}([\s\S]*?)\{\{\/each\}\}/;
  const tourMatch = result.match(tourLoopRegex);

  if (tourMatch && data.tours && Array.isArray(data.tours)) {
    const loopTemplate = tourMatch[1];
    let toursContent = "";

    data.tours.forEach((tour, index) => {
      let tourItem = loopTemplate;

      // Replace tour-specific variables
      tourItem = tourItem.replace(/\{\{tour_title\}\}/g, tour.tour_title || "");
      tourItem = tourItem.replace(/\{\{tour_price\}\}/g, tour.tour_price || "$0");
      tourItem = tourItem.replace(/\{\{original_date\}\}/g, tour.original_date || "");
      tourItem = tourItem.replace(/\{\{original_guests\}\}/g, tour.original_guests || 1);
      tourItem = tourItem.replace(/\{\{status_color\}\}/g, tour.status_color || "#a8a29e");
      tourItem = tourItem.replace(/\{\{status_icon\}\}/g, tour.status_icon || "❓");
      tourItem = tourItem.replace(/\{\{status_text\}\}/g, tour.status_text || "Unknown");

      // Handle conditionals
      const conditionals = {
        availabilityNotes: tour.availabilityNotes || "",
        isAlternative: tour.status === "alternative",
        isLimited: tour.status === "limited",
        isUnavailable: tour.status === "unavailable",
        alternative_date: tour.alternative_date || "",
        limited_places: tour.limited_places || 0,
      };

      // Handle availability notes
      const notesConditionalRegex = /\{\{#if availabilityNotes\}\}([\s\S]*?)\{\{\/if\}\}/;
      const notesMatch = tourItem.match(notesConditionalRegex);
      if (notesMatch) {
        if (conditionals.availabilityNotes.trim()) {
          let notesContent = notesMatch[1];
          notesContent = notesContent.replace(
            /\{\{availabilityNotes\}\}/g,
            conditionals.availabilityNotes
          );
          tourItem = tourItem.replace(notesConditionalRegex, notesContent);
        } else {
          tourItem = tourItem.replace(notesConditionalRegex, "");
        }
      }

      // Handle alternative date
      const alternativeConditionalRegex = /\{\{#if isAlternative\}\}([\s\S]*?)\{\{\/if\}\}/;
      if (conditionals.isAlternative) {
        let altContent = tourItem.match(alternativeConditionalRegex)[1];
        altContent = altContent.replace(/\{\{alternative_date\}\}/g, conditionals.alternative_date);
        tourItem = tourItem.replace(alternativeConditionalRegex, altContent);
      } else {
        tourItem = tourItem.replace(alternativeConditionalRegex, "");
      }

      // Handle limited places
      const limitedConditionalRegex = /\{\{#if isLimited\}\}([\s\S]*?)\{\{\/if\}\}/;
      if (conditionals.isLimited) {
        let limitedContent = tourItem.match(limitedConditionalRegex)[1];
        limitedContent = limitedContent.replace(
          /\{\{limited_places\}\}/g,
          conditionals.limited_places
        );
        tourItem = tourItem.replace(limitedConditionalRegex, limitedContent);
      } else {
        tourItem = tourItem.replace(limitedConditionalRegex, "");
      }

      // Handle unavailable
      const unavailableConditionalRegex = /\{\{#if isUnavailable\}\}([\s\S]*?)\{\{\/if\}\}/;
      if (conditionals.isUnavailable) {
        tourItem = tourItem.replace(
          unavailableConditionalRegex,
          tourItem.match(unavailableConditionalRegex)[1]
        );
      } else {
        tourItem = tourItem.replace(unavailableConditionalRegex, "");
      }

      // Handle unless condition for border
      const unlessRegex = /\{\{#unless @last\}\}([\s\S]*?)\{\{\/unless\}\}/;
      const unlessMatch = tourItem.match(unlessRegex);
      if (unlessMatch) {
        if (index < data.tours.length - 1) {
          tourItem = tourItem.replace(unlessRegex, unlessMatch[1]);
        } else {
          tourItem = tourItem.replace(unlessRegex, "");
        }
      }

      toursContent += tourItem;
    });

    // Replace the loop with generated content
    result = result.replace(tourLoopRegex, toursContent);
  } else {
    result = result.replace(tourLoopRegex, "");
  }

  // Clean up any leftover template syntax
  result = result.replace(/\{\{.*?\}\}/g, "");

  return result;
}

/**
 * Replaces All Tours Unavailable email template syntax with actual data.
 * Friendly email encouraging exploration of alternatives.
 * @param {string} template - The email template to replace syntax with actual data.
 * @param {object} data - The object containing data to replace the syntax with.
 * @return {string} The resulting HTML after all template syntax has been replaced with actual data.
 */
export function allToursUnavailable(template, data) {
  let result = template;

  // First, replace all simple variables
  const replacements = {
    customer_name: data.customer_name || "",
    request_id: data.request_id || "",
    current_year: data.current_year || new Date().getFullYear(),
  };

  Object.keys(replacements).forEach((key) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    result = result.replace(regex, replacements[key]);
  });

  // Handle tours loop
  const tourLoopRegex = /\{\{#each tours\}\}([\s\S]*?)\{\{\/each\}\}/;
  const tourMatch = result.match(tourLoopRegex);

  if (tourMatch && data.tours && Array.isArray(data.tours)) {
    const loopTemplate = tourMatch[1];
    let toursContent = "";

    data.tours.forEach((tour, index) => {
      let tourItem = loopTemplate;

      // Replace tour-specific variables
      tourItem = tourItem.replace(/\{\{title\}\}/g, tour.title || "");
      tourItem = tourItem.replace(
        /\{\{image\}\}/g,
        tour.image || "https://www.eytravelegypt.com/assets/images/default-tour.jpg"
      );
      tourItem = tourItem.replace(/\{\{date\}\}/g, tour.date || "");
      tourItem = tourItem.replace(/\{\{guests\}\}/g, tour.guests || 1);

      // Handle unless condition for border
      const unlessRegex = /\{\{#unless @last\}\}([\s\S]*?)\{\{\/unless\}\}/;
      const unlessMatch = tourItem.match(unlessRegex);
      if (unlessMatch) {
        if (index < data.tours.length - 1) {
          tourItem = tourItem.replace(unlessRegex, unlessMatch[1]);
        } else {
          tourItem = tourItem.replace(unlessRegex, "");
        }
      }

      // Handle availability notes
      const notesConditionalRegex = /\{\{#if availabilityNotes\}\}([\s\S]*?)\{\{\/if\}\}/;
      const notesMatch = tourItem.match(notesConditionalRegex);
      if (notesMatch) {
        if (tour.availabilityNotes && tour.availabilityNotes.trim()) {
          let notesContent = notesMatch[1];
          notesContent = notesContent.replace(/\{\{availabilityNotes\}\}/g, tour.availabilityNotes);
          tourItem = tourItem.replace(notesConditionalRegex, notesContent);
        } else {
          tourItem = tourItem.replace(notesConditionalRegex, "");
        }
      }

      toursContent += tourItem;
    });

    // Replace the loop with generated content
    result = result.replace(tourLoopRegex, toursContent);
  } else {
    result = result.replace(tourLoopRegex, "");
  }

  // Clean up any leftover template syntax
  result = result.replace(/\{\{.*?\}\}/g, "");

  return result;
}

/**
 * Replaces Client Feedback Received email template syntax with actual data.
 * Shows before/after comparison for each tour based on client feedback.
 * @param {string} template - The email template to replace syntax with actual data.
 * @param {object} data - The object containing data to replace the syntax with.
 * @return {string} The resulting HTML after all template syntax has been replaced with actual data.
 */
export function clientFeedbackReceived(template, data) {
  let result = template;

  // First, replace all simple variables
  const replacements = {
    request_id: data.request_id || "",
    customer_name: data.customer_name || "",
    customer_email: data.customer_email || "",
    customer_phone: data.customer_phone || "",
    whatsapp_number: data.whatsapp_number || "201278926104",
    response_time: data.response_time || "Within 24 hours",
    status: data.status || "Feedback Received",
    original_total: data.original_total || "$0",
    new_total: data.new_total || "$0",
    total_tours: data.total_tours || "0",
    tours_kept: data.tours_kept || "0",
    tours_modified: data.tours_modified || "0",
    tours_removed: data.tours_removed || "0",
    feedback_time: data.feedback_time || new Date().toLocaleString(),
    received_at: data.received_at || new Date().toLocaleString(),
  };

  Object.keys(replacements).forEach((key) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    result = result.replace(regex, replacements[key]);
  });

  // Handle tours loop
  const tourLoopRegex = /\{\{#each tours\}\}([\s\S]*?)\{\{\/each\}\}/;
  const tourMatch = result.match(tourLoopRegex);

  if (tourMatch && data.tours && Array.isArray(data.tours)) {
    const loopTemplate = tourMatch[1];
    let toursContent = "";

    data.tours.forEach((tour, index) => {
      let tourItem = loopTemplate;

      // Replace tour-specific variables
      tourItem = tourItem.replace(/\{\{tour_title\}\}/g, tour.tour_title || "");
      tourItem = tourItem.replace(/\{\{tour_id\}\}/g, tour.tour_id || "");
      tourItem = tourItem.replace(/\{\{original_status\}\}/g, tour.original_status || "");
      tourItem = tourItem.replace(/\{\{status_color\}\}/g, tour.status_color || "#6b7280");
      tourItem = tourItem.replace(/\{\{status_icon\}\}/g, tour.status_icon || "❓");
      tourItem = tourItem.replace(/\{\{decision\}\}/g, tour.decision || "");
      tourItem = tourItem.replace(/\{\{decision_text\}\}/g, tour.decision_text || "");
      tourItem = tourItem.replace(/\{\{decision_icon\}\}/g, tour.decision_icon || "❓");
      tourItem = tourItem.replace(/\{\{original_date\}\}/g, tour.original_date || "");
      tourItem = tourItem.replace(/\{\{original_guests\}\}/g, tour.original_guests || "");
      tourItem = tourItem.replace(/\{\{original_price\}\}/g, tour.original_price || "$0");
      tourItem = tourItem.replace(/\{\{modified_date\}\}/g, tour.modified_date || "");
      tourItem = tourItem.replace(/\{\{modified_guests\}\}/g, tour.modified_guests || "");
      tourItem = tourItem.replace(/\{\{modified_price\}\}/g, tour.modified_price || "");
      tourItem = tourItem.replace(/\{\{client_notes\}\}/g, tour.client_notes || "");
      tourItem = tourItem.replace(/\{\{show_after\}\}/g, tour.show_after ? "true" : "");
      tourItem = tourItem.replace(/\{\{after_font_weight\}\}/g, tour.after_font_weight || "normal");

      // Handle client notes conditional
      const notesConditionalRegex = /\{\{#if client_notes\}\}([\s\S]*?)\{\{\/if\}\}/;
      const notesMatch = tourItem.match(notesConditionalRegex);
      if (notesMatch) {
        if (tour.client_notes && tour.client_notes.trim()) {
          tourItem = tourItem.replace(notesConditionalRegex, notesMatch[1]);
        } else {
          tourItem = tourItem.replace(notesConditionalRegex, "");
        }
      }

      // Handle show_after conditional
      const afterConditionalRegex = /\{\{#if show_after\}\}([\s\S]*?)\{\{\/if\}\}/;
      const afterMatch = tourItem.match(afterConditionalRegex);
      if (afterMatch) {
        if (tour.show_after) {
          tourItem = tourItem.replace(afterConditionalRegex, afterMatch[1]);
        } else {
          // Find and replace the else block
          const elseMatch = tourItem.match(/\{\{else\}\}([\s\S]*?)\{\{\/if\}\}/);
          if (elseMatch) {
            tourItem = tourItem.replace(afterConditionalRegex, elseMatch[1]);
          } else {
            tourItem = tourItem.replace(afterConditionalRegex, "");
          }
        }
      }

      // Handle modified date conditional
      const dateConditionalRegex = /\{\{#if modified_date\}\}([\s\S]*?)\{\{\/if\}\}/;
      const dateMatch = tourItem.match(dateConditionalRegex);
      if (dateMatch) {
        if (tour.modified_date && tour.modified_date.trim()) {
          tourItem = tourItem.replace(dateConditionalRegex, dateMatch[1]);
        } else {
          tourItem = tourItem.replace(dateConditionalRegex, "");
        }
      }

      // Handle modified guests conditional
      const guestsConditionalRegex = /\{\{#if modified_guests\}\}([\s\S]*?)\{\{\/if\}\}/;
      const guestsMatch = tourItem.match(guestsConditionalRegex);
      if (guestsMatch) {
        if (tour.modified_guests && tour.modified_guests !== tour.original_guests) {
          tourItem = tourItem.replace(guestsConditionalRegex, guestsMatch[1]);
        } else {
          tourItem = tourItem.replace(guestsConditionalRegex, "");
        }
      }

      // Handle modified price conditional
      const priceConditionalRegex = /\{\{#if modified_price\}\}([\s\S]*?)\{\{\/if\}\}/;
      const priceMatch = tourItem.match(priceConditionalRegex);
      if (priceMatch) {
        if (tour.modified_price && tour.modified_price !== tour.original_price) {
          tourItem = tourItem.replace(priceConditionalRegex, priceMatch[1]);
        } else {
          tourItem = tourItem.replace(priceConditionalRegex, "");
        }
      }

      toursContent += tourItem;
    });

    // Replace the loop with generated content
    result = result.replace(tourLoopRegex, toursContent);
  } else {
    result = result.replace(tourLoopRegex, "");
  }

  // Handle customer phone conditional
  const phoneConditionalRegex = /\{\{#if customer_phone\}\}([\s\S]*?)\{\{\/if\}\}/;
  const phoneMatch = result.match(phoneConditionalRegex);
  if (phoneMatch) {
    if (data.customer_phone && data.customer_phone.trim()) {
      result = result.replace(phoneConditionalRegex, phoneMatch[1]);
    } else {
      result = result.replace(phoneConditionalRegex, "");
    }
  }

  // Clean up any leftover template syntax
  result = result.replace(/\{\{.*?\}\}/g, "");

  return result;
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
  let result = template;

  // Add payment_status to data for footer
  const paymentStatus = data.isFullPayment ? "Fully Paid" : "Partially Paid";
  data.payment_status = paymentStatus;

  // First, replace all simple variables to avoid interference with conditionals
  const replacements = {
    customer_name: data.customer_name || "",
    customer_email: data.customer_email || "",
    payment_link: data.payment_link || "#",
    booking_reference: data.booking_reference || "",
    payment_date: data.payment_date || "",
    payment_method: data.payment_method || "",
    transaction_id: data.transaction_id || "",
    receipt_number: data.receipt_number || "",
    payment_notes: data.payment_notes || "",
    total_amount: data.total_amount || "$0",
    amount_paid: data.amount_paid || "$0",
    remaining_balance: data.remaining_balance || "$0",
    remaining_due_date: data.remaining_due_date || "",
    currency: data.currency || "USD",
    current_year: data.current_year || new Date().getFullYear(),
    payment_status: paymentStatus,
    isFullPayment: data.isFullPayment ? "true" : "",
    booking_was_modified: data.booking_was_modified ? "true" : "",
    has_cancelled_tours: data.has_cancelled_tours ? "true" : "",
    cancelled_tours_count: data.cancelled_tours_count || 0,
  };

  Object.keys(replacements).forEach((key) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    result = result.replace(regex, replacements[key]);
  });

  // Handle greeting section - dynamically replace the payment status message
  if (data.isFullPayment) {
    const fullPaymentMessage = `
      <div style="background-color: rgba(34, 197, 94, 0.1); border-left: 4px solid #16a34a; padding: 15px; border-radius: 4px; margin: 20px 0;">
        <p style="color: #bbf7d0; font-size: 16px; line-height: 1.6; margin: 0;">
          ✅ <strong>Your booking is now fully paid!</strong> All your tours are confirmed and ready for your arrival.
        </p>
      </div>
    `;
    result = result.replace('<div id="payment-status-message"></div>', fullPaymentMessage);

    // Remove any partial payment messages that might be in the template
    result = result.replace(/📝 Partial Payment Received[\s\S]*?<\/div>/g, "");
  } else {
    const partialPaymentMessage = `
      <div style="background-color: rgba(245, 158, 11, 0.1); border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 20px 0;">
        <p style="color: #fef3c7; font-size: 16px; line-height: 1.6; margin: 0;">
          📝 <strong>Partial Payment Received:</strong> Your booking is confirmed. Please complete the remaining balance by <strong>${data.remaining_due_date}</strong> to secure all your tours.
        </p>
      </div>
    `;
    result = result.replace('<div id="payment-status-message"></div>', partialPaymentMessage);

    // Remove any full payment messages that might be in the template
    result = result.replace(/✅ Your booking is now fully paid![\s\S]*?<\/div>/g, "");
  }

  // Handle payment status row in the payment details table
  if (data.isFullPayment) {
    const fullPaymentStatusRow = `
      <tr>
        <td style="color: #22c55e; font-size: 16px; font-weight: bold; padding-top: 10px;">
          Status:
        </td>
        <td align="right" style="color: #22c55e; font-size: 16px; font-weight: bold; padding-top: 10px;">
          ✅ Fully Paid
        </td>
      </tr>
    `;
    result = result.replace('<tr id="payment-status-row">', fullPaymentStatusRow);
  } else {
    const partialPaymentStatusRow = `
      <tr>
        <td style="color: #f59e0b; font-size: 16px; font-weight: bold; padding-top: 10px;">
          Status:
        </td>
        <td align="right" style="color: #f59e0b; font-size: 16px; font-weight: bold; padding-top: 10px;">
          ⚡ Partially Paid
        </td>
      </tr>
    `;
    result = result.replace('<tr id="payment-status-row">', partialPaymentStatusRow);
  }

  // Handle conditional sections
  const conditionalSections = {
    transaction_id: data.transaction_id && data.transaction_id.trim(),
    receipt_number: data.receipt_number && data.receipt_number.trim(),
    payment_notes: data.payment_notes && data.payment_notes.trim(),
    tours: data.tours && Array.isArray(data.tours) && data.tours.length > 0,
    booking_was_modified: data.booking_was_modified,
    has_cancelled_tours: data.has_cancelled_tours,
  };

  // Handle all conditionals
  Object.keys(conditionalSections).forEach((key) => {
    const regex = new RegExp(`\\{\\{#if ${key}\\}\\}([\\s\\S]*?)\\{\\{/if\\}\\}`, "g");
    let match;
    while ((match = regex.exec(result)) !== null) {
      if (conditionalSections[key]) {
        // Replace with content
        result = result.replace(match[0], match[1]);
      } else {
        // Remove content
        result = result.replace(match[0], "");
      }
    }
  });

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
          guests_label: tour.guests_label || ((tour.guests || 1) === 1 ? "Traveler" : "Travelers"),
          tour_price: tour.tour_price || "$0",
          modifications_made: tour.modifications_made ? "true" : "",
          guests_changed: tour.guests_changed ? "true" : "",
          date_changed: tour.date_changed ? "true" : "",
          price_changed: tour.price_changed ? "true" : "",
          original_guests: tour.original_guests || tour.guests,
          original_date: tour.original_date || "",
          original_price: tour.original_price || "$0",
        };

        Object.keys(tourReplacements).forEach((key) => {
          const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
          tourItem = tourItem.replace(regex, tourReplacements[key]);
        });

        // Handle modification details conditionals within each tour
        if (tour.modifications_made) {
          // Handle guests_changed conditional
          const guestsChangedRegex = /\{\{#if guests_changed\}\}([\s\S]*?)\{\{\/if\}\}/;
          const guestsChangedMatch = tourItem.match(guestsChangedRegex);
          if (guestsChangedMatch) {
            tourItem = tourItem.replace(
              guestsChangedMatch[0],
              tour.guests_changed ? guestsChangedMatch[1] : ""
            );
          }

          // Handle date_changed conditional
          const dateChangedRegex = /\{\{#if date_changed\}\}([\s\S]*?)\{\{\/if\}\}/;
          const dateChangedMatch = tourItem.match(dateChangedRegex);
          if (dateChangedMatch) {
            tourItem = tourItem.replace(
              dateChangedMatch[0],
              tour.date_changed ? dateChangedMatch[1] : ""
            );
          }

          // Handle price_changed conditional
          const priceChangedRegex = /\{\{#if price_changed\}\}([\s\S]*?)\{\{\/if\}\}/;
          const priceChangedMatch = tourItem.match(priceChangedRegex);
          if (priceChangedMatch) {
            tourItem = tourItem.replace(
              priceChangedMatch[0],
              tour.price_changed ? priceChangedMatch[1] : ""
            );
          }
        } else {
          // Remove the entire modifications section if no modifications
          const modificationsSectionRegex = /\{\{#if modifications_made\}\}([\s\S]*?)\{\{\/if\}\}/;
          tourItem = tourItem.replace(modificationsSectionRegex, "");
        }

        generatedToursContent += tourItem;
      });

      result = result.replace(toursLoopRegex, generatedToursContent);
    }
  }

  // Handle conditional isFullPayment sections (for Next Steps)
  const isFullPaymentRegex = /\{\{#if isFullPayment\}\}([\s\S]*?)\{\{\/if\}\}/g;
  let fullPaymentMatch;
  while ((fullPaymentMatch = isFullPaymentRegex.exec(result)) !== null) {
    if (data.isFullPayment) {
      result = result.replace(fullPaymentMatch[0], fullPaymentMatch[1]);
    } else {
      result = result.replace(fullPaymentMatch[0], "");
    }
  }

  // Handle conditional unless isFullPayment (for Action Buttons section)
  const unlessFullPaymentRegex = /\{\{#unless isFullPayment\}\}([\s\S]*?)\{\{\/unless\}\}/g;
  let unlessMatch;
  while ((unlessMatch = unlessFullPaymentRegex.exec(result)) !== null) {
    if (!data.isFullPayment) {
      result = result.replace(unlessMatch[0], unlessMatch[1]);
    } else {
      result = result.replace(unlessMatch[0], "");
    }
  }

  // Clean up any leftover template syntax
  result = result.replace(/\{\{.*?\}\}/g, "");

  return result;
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
  console.log("=== DEBUG: clientTourScheduled (bracket syntax) ===");
  console.log("Data structure:", {
    toursCount: data.tours?.length || 0,
    firstTour: data.tours?.[0]
      ? {
          title: data.tours[0].tour_title,
          driver_vehicle: data.tours[0].driver_vehicle,
          itineraryCount: data.tours[0].itinerary?.length || 0,
          equipmentCount: data.tours[0].equipment?.length || 0,
          conditionals: data.tours[0].conditionals,
        }
      : null,
  });

  let result = template;

  // First, replace all simple variables {{xxx}}
  const simpleReplacements = {
    customer_name: data.customer_name || "",
    booking_reference: data.booking_reference || "",
    total_tours: data.total_tours || "0",
    total_travelers: data.total_travelers || "1",
    schedule_date: data.schedule_date || "",
    current_year: data.current_year || new Date().getFullYear(),
  };

  Object.keys(simpleReplacements).forEach((key) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    result = result.replace(regex, simpleReplacements[key]);
  });

  // Handle plural conditionals for booking summary
  if (data.plural) {
    // Handle multiple tours
    const toursIfRegex =
      /\[\[IF_MULTIPLE_TOURS\]\]([\s\S]*?)\[\[ELSE_MULTIPLE_TOURS\]\]([\s\S]*?)\[\[END_MULTIPLE_TOURS\]\]/g;
    result = result.replace(toursIfRegex, (match, ifContent, elseContent) => {
      return data.plural.multiple_tours ? ifContent : elseContent;
    });

    // Handle multiple travelers
    const travelersIfRegex =
      /\[\[IF_MULTIPLE_TRAVELERS\]\]([\s\S]*?)\[\[ELSE_MULTIPLE_TRAVELERS\]\]([\s\S]*?)\[\[END_MULTIPLE_TRAVELERS\]\]/g;
    result = result.replace(travelersIfRegex, (match, ifContent, elseContent) => {
      return data.plural.multiple_travelers ? ifContent : elseContent;
    });
  }

  // Handle tours loop [[EACH_TOURS]]
  const toursLoopRegex = /\[\[EACH_TOURS\]\]([\s\S]*?)\[\[END_EACH_TOURS\]\]/;
  const toursMatch = result.match(toursLoopRegex);

  if (toursMatch && data.tours && Array.isArray(data.tours)) {
    const loopTemplate = toursMatch[1];
    let toursContent = "";

    data.tours.forEach((tour, index) => {
      console.log(`Processing tour ${index + 1}: ${tour.tour_title}`);
      console.log("Tour driver vehicle:", tour.driver_vehicle);
      console.log("Tour conditionals:", tour.conditionals);

      let tourItem = loopTemplate;

      // Replace tour-specific simple variables
      const tourReplacements = {
        tour_title: tour.tour_title || "",
        tour_number: tour.tour_number || (index + 1).toString(),
        total_tours: tour.total_tours || data.total_tours || "1",
        tour_type: tour.tour_type || "Day Tour",
        tour_date: tour.tour_date || "",
        tour_duration: tour.tour_duration || "8 hours",
        meeting_location: tour.meeting_location || "",
        meeting_time: tour.meeting_time || "",
        meeting_notes: tour.meeting_notes || "",
        dropoff_location: tour.dropoff_location || "",
        dropoff_time: tour.dropoff_time || "",
        dropoff_notes: tour.dropoff_notes || "",
        guide_name: tour.guide_name || "",
        guide_phone: tour.guide_phone || "",
        guide_email: tour.guide_email || "",
        driver_name: tour.driver_name || "",
        driver_phone: tour.driver_phone || "",
        driver_vehicle: tour.driver_vehicle || "",
        notes: tour.notes || "",
      };

      Object.keys(tourReplacements).forEach((key) => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
        tourItem = tourItem.replace(regex, tourReplacements[key]);
      });

      // Handle conditionals - FIRST PASS: Process all IF/ENDIF blocks
      if (tour.conditionals) {
        // Process all [[IF_XXX]]...[[ENDIF_XXX]] blocks
        const conditionalPatterns = [
          { name: "has_guide_or_driver", key: "has_guide_or_driver" },
          { name: "has_guide", key: "has_guide" },
          { name: "has_driver", key: "has_driver" },
          { name: "has_itinerary", key: "has_itinerary" },
          { name: "has_equipment", key: "has_equipment" },
          { name: "has_notes", key: "has_notes" },
          { name: "has_equipment_or_notes", key: "has_equipment_or_notes" },
          { name: "is_multi_day", key: "is_multi_day" },
          { name: "meeting_notes", key: "has_meeting_notes" },
          { name: "dropoff_notes", key: "has_dropoff_notes" },
          { name: "guide_email", key: "has_guide_email" },
          { name: "driver_vehicle", key: "has_driver_vehicle" },
        ];

        conditionalPatterns.forEach(({ name, key }) => {
          const regex = new RegExp(
            `\\[\\[IF_${name.toUpperCase()}\\]\\]([\\s\\S]*?)\\[\\[ENDIF_${name.toUpperCase()}\\]\\]`,
            "g"
          );
          tourItem = tourItem.replace(regex, (match, content) => {
            return tour.conditionals[key] ? content : "";
          });
        });
      }

      // Handle ELSE blocks - SECOND PASS: Process IF/ELSE/END blocks
      tourItem = handleElseConditionals(tourItem, tour.conditionals);

      // Fix the width conditionals - THIRD PASS
      tourItem = fixWidthConditionals(tourItem, tour.conditionals);

      // Handle itinerary - FOURTH PASS
      tourItem = handleItinerary(tourItem, tour);

      // Handle equipment - FIFTH PASS
      tourItem = handleEquipment(tourItem, tour);

      // Clean up any leftover syntax
      tourItem = tourItem.replace(/\[\[.*?\]\]/g, "");

      toursContent += tourItem;
    });

    result = result.replace(toursLoopRegex, toursContent);
  } else {
    result = result.replace(toursLoopRegex, "");
  }

  // Clean up any leftover syntax
  result = result.replace(/\[\[.*?\]\]/g, "");
  result = result.replace(/\{\{.*?\}\}/g, "");

  return result;
}

/**
 * Replaces Tour Completed email template syntax with actual data.
 * Handles all completion details including tours summary and review requests.
 * @param {string} template - The email template to replace syntax with actual data.
 * @param {object} data - The object containing data to replace the syntax with.
 * @return {string} The resulting HTML after all template syntax has been replaced.
 */
export function clientTourCompleted(template, data) {
  let result = template;

  // First, replace all simple variables
  const simpleReplacements = {
    customer_name: data.customer_name || "",
    booking_reference: data.booking_reference || "",
    completion_date: data.completion_date || "",
    completed_tours: data.completed_tours || "0",
    cancelled_tours: data.cancelled_tours || "0",
    scheduled_tours: data.scheduled_tours || "0",
    total_tours: data.total_tours || "0",
    not_completed_tours: data.not_completed_tours || "0",
    customer_id: data.customer_id || "",
    guide_name: data.guide_name || "",
    driver_name: data.driver_name || "",
    current_year: data.current_year || new Date().getFullYear(),
  };

  Object.keys(simpleReplacements).forEach((key) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    result = result.replace(regex, simpleReplacements[key]);
  });

  // Handle tours loop - update to use status-specific styling
  const toursLoopRegex = /\{\{#each tours\}\}([\s\S]*?)\{\{\/each\}\}/;
  const toursMatch = result.match(toursLoopRegex);

  if (toursMatch && data.tours && Array.isArray(data.tours)) {
    const loopTemplate = toursMatch[1];
    let toursContent = "";

    data.tours.forEach((tour, index) => {
      let tourItem = loopTemplate;

      // Replace tour-specific variables
      const tourReplacements = {
        tour_number: (index + 1).toString(),
        tour_title: tour.tour_title || "",
        tour_date: tour.tour_date || "",
        tour_duration: tour.tour_duration || "",
        guests: tour.guests || "1",
        guests_label: tour.guests_label || ((tour.guests || 1) === 1 ? "Traveler" : "Travelers"),
        tour_status: tour.status_text || "✅ Completed",
        status_color: tour.status_color || "#22c55e",
      };

      Object.keys(tourReplacements).forEach((key) => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
        tourItem = tourItem.replace(regex, tourReplacements[key]);
      });

      // Update the status display in the template
      tourItem = tourItem.replace(
        /<span style="color: #22c55e; font-weight: bold;">✅ Completed<\/span>/g,
        `<span style="color: ${tour.status_color}; font-weight: bold;">${tour.status_text}</span>`
      );

      // Update the status badge in the stats table
      tourItem = tourItem.replace(
        /<div style="color: #22c55e; font-size: 15px; font-weight: bold;">\s*Completed\s*<\/div>/g,
        `<div style="color: ${
          tour.status_color
        }; font-size: 15px; font-weight: bold;">${tour.status_text
          .replace("✅ ", "")
          .replace("🕐 ", "")}</div>`
      );

      toursContent += tourItem;
    });

    result = result.replace(toursLoopRegex, toursContent);
  } else {
    // If no tours, remove the entire tours section
    result = result.replace(toursLoopRegex, "");
  }

  // Handle cancellation summary if present
  const cancellationSectionRegex = /\{\{#if has_cancelled_tours\}\}([\s\S]*?)\{\{\/if\}\}/;
  const cancellationMatch = result.match(cancellationSectionRegex);

  if (cancellationMatch && data.has_cancelled_tours && data.cancellation_summary) {
    let cancellationContent = cancellationMatch[1];

    // Replace cancellation count
    cancellationContent = cancellationContent.replace(
      /\{\{cancelled_tours\}\}/g,
      data.cancelled_tours.toString()
    );

    // Handle cancellation reasons loop if template has it
    const cancellationLoopRegex =
      /\{\{#each cancellation_summary\.tours\}\}([\s\S]*?)\{\{\/each\}\}/;
    const cancellationLoopMatch = cancellationContent.match(cancellationLoopRegex);

    if (cancellationLoopMatch && data.cancellation_summary.tours) {
      const cancellationLoopTemplate = cancellationLoopMatch[1];
      let cancellationReasons = "";

      data.cancellation_summary.tours.forEach((cancelledTour, index) => {
        let reasonItem = cancellationLoopTemplate;

        reasonItem = reasonItem.replace(
          /\{\{tour_title\}\}/g,
          cancelledTour.tour_title || "Unnamed Tour"
        );
        reasonItem = reasonItem.replace(
          /\{\{cancellation_date\}\}/g,
          cancelledTour.date || "Date not specified"
        );
        reasonItem = reasonItem.replace(
          /\{\{cancellation_reason\}\}/g,
          cancelledTour.reason || "Tour was cancelled"
        );

        cancellationReasons += reasonItem;
      });

      cancellationContent = cancellationContent.replace(cancellationLoopRegex, cancellationReasons);
    }

    result = result.replace(cancellationSectionRegex, cancellationContent);
  } else {
    // Remove cancellation section if no cancelled tours
    result = result.replace(cancellationSectionRegex, "");
  }

  // Update summary section to show accurate statistics
  result = result.replace(
    /{{completed_tours}} of {{total_tours}}/g,
    `${data.completed_tours} of ${data.total_tours} tours`
  );

  // Add note about cancelled tours in summary if applicable
  if (data.has_cancelled_tours) {
    result = result.replace(
      /<td colspan="2" style="border-top: 1px solid #44403c; padding-top: 15px; padding-bottom: 5px;"><\/td>/,
      `<td colspan="2" style="border-top: 1px solid #44403c; padding-top: 15px; padding-bottom: 5px;"></td>
            <tr>
              <td style="color: #a8a29e; font-size: 15px; padding-top: 10px;">
                Cancelled Tours:
              </td>
              <td align="right" style="color: #ef4444; font-size: 15px; font-weight: bold; padding-top: 10px;">
                ${data.cancelled_tours} tour${data.cancelled_tours !== "1" ? "s" : ""} cancelled
              </td>
            </tr>`
    );
  }

  // Handle conditional all_tours_completed
  const allCompleteRegex = /\{\{#if all_tours_completed\}\}([\s\S]*?)\{\{\/if\}\}/;
  const allCompleteMatch = result.match(allCompleteRegex);
  if (allCompleteMatch) {
    if (data.all_tours_completed) {
      result = result.replace(allCompleteRegex, allCompleteMatch[1]);
    } else {
      result = result.replace(allCompleteRegex, "");
    }
  }

  // Handle conditional guide_name
  const guideNameRegex = /\{\{#if guide_name\}\}([\s\S]*?)\{\{\/if\}\}/;
  const guideNameMatch = result.match(guideNameRegex);
  if (guideNameMatch) {
    if (data.guide_name && data.guide_name.trim()) {
      result = result.replace(guideNameRegex, guideNameMatch[1]);
    } else {
      result = result.replace(guideNameRegex, "");
    }
  }

  // Handle conditional driver_name
  const driverNameRegex = /\{\{#if driver_name\}\}([\s\S]*?)\{\{\/if\}\}/;
  const driverNameMatch = result.match(driverNameRegex);
  if (driverNameMatch) {
    if (data.driver_name && data.driver_name.trim()) {
      result = result.replace(driverNameRegex, driverNameMatch[1]);
    } else {
      result = result.replace(driverNameRegex, "");
    }
  }

  // Handle conditional tours
  const toursConditionalRegex = /\{\{#if tours\}\}([\s\S]*?)\{\{\/if\}\}/;
  const toursConditionalMatch = result.match(toursConditionalRegex);
  if (toursConditionalMatch) {
    if (data.tours && Array.isArray(data.tours) && data.tours.length > 0) {
      result = result.replace(toursConditionalRegex, toursConditionalMatch[1]);
    } else {
      result = result.replace(toursConditionalRegex, "");
    }
  }

  // Clean up any leftover template syntax
  result = result.replace(/\{\{.*?\}\}/g, "");

  return result;
}

/**
 * Replaces Partial Availability Confirmed email template syntax with actual data.
 * @param {string} template - The email template to replace syntax with actual data.
 * @param {object} data - The object containing data to replace the syntax with.
 * @return {string} The resulting HTML after all template syntax has been replaced with actual data.
 */
export function clientPartialAvailabilityConfirmed(template, data) {
  let result = template;

  // First, replace all simple variables
  const replacements = {
    customer_name: data.customer_name || "",
    customer_email: data.customer_email || "",
    payment_link: data.payment_link || "#",
    total_amount: data.total_amount || "$0",
    original_total: data.original_total || "$0",
    request_id: data.request_id || "",
    current_year: data.current_year || new Date().getFullYear(),
    original_tours_count: data.original_tours_count || 0,
    confirmed_tours_count: data.confirmed_tours_count || 0,
    cancelled_tours_count: data.cancelled_tours_count || 0,
    price_difference: data.price_difference || 0,
    price_difference_absolute: Math.abs(data.price_difference || 0),
    price_difference_prefix:
      (data.price_difference || 0) > 0 ? "+" : (data.price_difference || 0) < 0 ? "-" : "",
    price_difference_color:
      (data.price_difference || 0) > 0
        ? "#22c55e"
        : (data.price_difference || 0) < 0
        ? "#ef4444"
        : "#a8a29e",
  };

  Object.keys(replacements).forEach((key) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    result = result.replace(regex, replacements[key]);
  });

  // Handle confirmed tours loop
  const confirmedToursLoopRegex =
    /\[\[EACH_CONFIRMED_TOURS\]\]([\s\S]*?)\[\[END_EACH_CONFIRMED_TOURS\]\]/;
  const confirmedMatch = result.match(confirmedToursLoopRegex);

  if (confirmedMatch && data.confirmed_tours && Array.isArray(data.confirmed_tours)) {
    const loopTemplate = confirmedMatch[1];
    let toursContent = "";

    data.confirmed_tours.forEach((tour) => {
      let tourItem = loopTemplate;

      // Handle custom conditionals for each tour
      // Handle modifications_made conditional
      if (tour.modifications_made) {
        // Remove IF_MODIFICATIONS_MADE and ENDIF_MODIFICATIONS_MADE tags
        tourItem = tourItem.replace(/\[\[IF_MODIFICATIONS_MADE\]\]/g, "");
        tourItem = tourItem.replace(/\[\[ENDIF_MODIFICATIONS_MADE\]\]/g, "");

        // Handle guests_changed conditional inside modifications
        if (tour.guests_changed) {
          tourItem = tourItem.replace(/\[\[IF_GUESTS_CHANGED\]\]/g, "");
          tourItem = tourItem.replace(/\[\[ENDIF_GUESTS_CHANGED\]\]/g, "");
        } else {
          // Remove the entire IF_GUESTS_CHANGED block
          tourItem = tourItem.replace(
            /\[\[IF_GUESTS_CHANGED\]\][\s\S]*?\[\[ENDIF_GUESTS_CHANGED\]\]/g,
            ""
          );
        }

        // Handle date_changed conditional inside modifications
        if (tour.date_changed) {
          tourItem = tourItem.replace(/\[\[IF_DATE_CHANGED\]\]/g, "");
          tourItem = tourItem.replace(/\[\[ENDIF_DATE_CHANGED\]\]/g, "");
        } else {
          // Remove the entire IF_DATE_CHANGED block
          tourItem = tourItem.replace(
            /\[\[IF_DATE_CHANGED\]\][\s\S]*?\[\[ENDIF_DATE_CHANGED\]\]/g,
            ""
          );
        }
      } else {
        // Remove the entire modifications section if no modifications were made
        tourItem = tourItem.replace(
          /\[\[IF_MODIFICATIONS_MADE\]\][\s\S]*?\[\[ENDIF_MODIFICATIONS_MADE\]\]/g,
          ""
        );
      }

      // Replace tour variables
      tourItem = tourItem.replace(/\{\{tour_title\}\}/g, tour.tour_title || "");
      tourItem = tourItem.replace(/\{\{tour_date\}\}/g, tour.tour_date || "");
      tourItem = tourItem.replace(/\{\{guests\}\}/g, tour.guests || 1);
      tourItem = tourItem.replace(
        /\{\{guests_label\}\}/g,
        tour.guests_label || ((tour.guests || 1) === 1 ? "Traveler" : "Travelers")
      );
      tourItem = tourItem.replace(/\{\{tour_price\}\}/g, tour.tour_price || "$0");
      tourItem = tourItem.replace(/\{\{original_guests\}\}/g, tour.original_guests || tour.guests);
      tourItem = tourItem.replace(/\{\{client_notes\}\}/g, tour.client_notes || "");

      toursContent += tourItem;
    });

    result = result.replace(confirmedToursLoopRegex, toursContent);
  } else {
    result = result.replace(confirmedToursLoopRegex, "");
  }

  // Handle cancelled tours conditional and loop
  const hasCancelledConditionalRegex =
    /\[\[IF_HAS_CANCELLED_TOURS\]\]([\s\S]*?)\[\[ENDIF_HAS_CANCELLED_TOURS\]\]/;
  const hasCancelledMatch = result.match(hasCancelledConditionalRegex);

  if (hasCancelledMatch) {
    if (data.has_cancelled_tours && data.cancelled_tours && data.cancelled_tours.length > 0) {
      let cancelledContent = hasCancelledMatch[1];

      // Remove IF_HAS_CANCELLED_TOURS and ENDIF_HAS_CANCELLED_TOURS tags
      cancelledContent = cancelledContent.replace(/\[\[IF_HAS_CANCELLED_TOURS\]\]/g, "");
      cancelledContent = cancelledContent.replace(/\[\[ENDIF_HAS_CANCELLED_TOURS\]\]/g, "");

      // Handle cancelled tours loop inside the conditional
      const cancelledLoopRegex =
        /\[\[EACH_CANCELLED_TOURS\]\]([\s\S]*?)\[\[END_EACH_CANCELLED_TOURS\]\]/;
      const cancelledLoopMatch = cancelledContent.match(cancelledLoopRegex);

      if (cancelledLoopMatch) {
        const loopTemplate = cancelledLoopMatch[1];
        let cancelledToursContent = "";

        data.cancelled_tours.forEach((tour) => {
          let tourItem = loopTemplate;

          tourItem = tourItem.replace(/\{\{tour_title\}\}/g, tour.tour_title || "");
          tourItem = tourItem.replace(/\{\{original_date\}\}/g, tour.original_date || "");
          tourItem = tourItem.replace(/\{\{original_guests\}\}/g, tour.original_guests || 0);
          tourItem = tourItem.replace(
            /\{\{cancellation_reason\}\}/g,
            tour.cancellation_reason || ""
          );

          cancelledToursContent += tourItem;
        });

        cancelledContent = cancelledContent.replace(cancelledLoopRegex, cancelledToursContent);
      }

      result = result.replace(hasCancelledConditionalRegex, cancelledContent);
    } else {
      result = result.replace(hasCancelledConditionalRegex, "");
    }
  }

  // Clean up any leftover template syntax
  result = result.replace(/\[\[.*?\]\]/g, "");
  result = result.replace(/\{\{.*?\}\}/g, "");

  return result;
}

/**
 * Replaces All Tours Cancelled email template syntax with actual data.
 * @param {string} template - The email template to replace syntax with actual data.
 * @param {object} data - The object containing data to replace the syntax with.
 * @return {string} The resulting HTML after all template syntax has been replaced with actual data.
 */
export function clientAllToursCancelled(template, data) {
  // Split template into lines
  const lines = template.split("\n");
  let inLoop = false;
  let loopContent = "";
  let resultLines = [];
  let toursContent = [];

  // First pass: collect loop content
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes("{{#each cancelled_tours}}")) {
      inLoop = true;
      continue;
    }

    if (line.includes("{{/each}}")) {
      inLoop = false;

      // Process the collected loop content for each tour
      if (data.cancelled_tours && Array.isArray(data.cancelled_tours)) {
        data.cancelled_tours.forEach((tour) => {
          let tourItem = loopContent;

          // Replace variables
          tourItem = tourItem.replace(/\{\{tour_title\}\}/g, tour.tour_title || "");
          tourItem = tourItem.replace(/\{\{original_date\}\}/g, tour.original_date || "");
          tourItem = tourItem.replace(/\{\{original_guests\}\}/g, tour.original_guests || 0);
          tourItem = tourItem.replace(
            /\{\{guests_label\}\}/g,
            tour.guests_label || ((tour.original_guests || 0) === 1 ? "Traveler" : "Travelers")
          );
          tourItem = tourItem.replace(/\{\{tour_price\}\}/g, tour.tour_price || "0");
          tourItem = tourItem.replace(/\{\{tour_notes\}\}/g, tour.tour_notes || "");

          // Handle conditionals
          if (tourItem.includes("[[IF_TOUR_NOTES]]")) {
            if (tour.tour_notes && tour.tour_notes.trim()) {
              tourItem = tourItem.replace(/\[\[IF_TOUR_NOTES\]\]/g, "");
              tourItem = tourItem.replace(/\[\[ENDIF_TOUR_NOTES\]\]/g, "");
            } else {
              tourItem = tourItem.replace(
                /\[\[IF_TOUR_NOTES\]\][\s\S]*?\[\[ENDIF_TOUR_NOTES\]\]/g,
                ""
              );
            }
          }

          toursContent.push(tourItem);
        });
      }

      // Add all tours to result
      resultLines.push(...toursContent);
      loopContent = "";
      continue;
    }

    if (inLoop) {
      loopContent += line + "\n";
    } else {
      resultLines.push(line);
    }
  }

  let result = resultLines.join("\n");

  // Replace simple variables
  const replacements = {
    customer_name: data.customer_name || "",
    customer_email: data.customer_email || "",
    request_id: data.request_id || "",
    current_year: data.current_year || new Date().getFullYear(),
    original_total: data.original_total || "$0",
    cancellation_date: data.cancellation_date || "",
    cancellation_notes: data.cancellation_notes || "",
  };

  Object.keys(replacements).forEach((key) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    result = result.replace(regex, replacements[key]);
  });

  // Clean up
  result = result.replace(/\[\[.*?\]\]/g, "");
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
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

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
    guests_label: (item.guests || 1) === 1 ? "person" : "people",
    tour_price: formatCurrency(item.calculatedPrice || item.price || 0),
  }));

  return {
    customer_name: bookingData.customer?.name || "",
    customer_email: bookingData.customer?.email || "",
    customer_phone: bookingData.customer?.phone || "",
    request_date: formatDate(bookingData.submittedAt || new Date().toISOString()),
    current_year: new Date().getFullYear(),
    subtotal: formatCurrency(subtotal),
    tours: tours,
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

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
      .format(amount || 0)
      .replace("$", "");
  };

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
  return {
    customer_name: booking.customer.name,
    customer_email: booking.customer.email,
    payment_link: paymentLink,
    total_amount: booking.total.toString(),
    subtotal: booking.total.toString(),
    request_id: booking.requestId,
    current_year: new Date().getFullYear(),
    tours: booking.tours.map((tour) => ({
      tour_title: tour.title,
      tour_date: formatDate(tour.date), // You need to create this function
      guests: tour.guests,
      guests_label: tour.guests === 1 ? "Traveler" : "Travelers",
      tour_price: tour.calculatedPrice.toString(),
      availabilityNotes: tour.availabilityNotes || "",
    })),
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
      tour_title: tour.title || "Tour", // Map from tour.title
      tour_price: formatPrice(tour.calculatedPrice || 0), // Map from tour.calculatedPrice
      original_date: formatDate(tour.date || ""), // Map from tour.date
      original_guests: tour.guests || 1, // Map from tour.guests

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
  return {
    customer_name: booking.customer.name,
    request_id: booking.requestId,
    current_year: new Date().getFullYear(),
    tours: booking.tours.map((tour) => ({
      title: tour.title,
      image: tour.image,
      date: formatDate(tour.date),
      guests: tour.guests,
      availabilityNotes: tour.availabilityNotes || "",
    })),
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

  return {
    request_id: booking.requestId,
    customer_name: booking.customer?.name || "",
    customer_email: booking.customer?.email || "",
    customer_phone: booking.customer?.phone || "",
    response_time: responseTime,
    status: "Feedback Received",
    original_total: formatPriceForDisplay(originalTotal), // CALCULATED original
    new_total: formatPriceForDisplay(newTotal), // CURRENT booking total
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
        original_price: formatPriceForDisplay(originalPrice),

        // After (modified) - ALWAYS show current values
        modified_date: formatDate(currentDate),
        modified_guests: currentGuests.toString(), // ALWAYS show
        modified_price: formatPriceForDisplay(currentPrice),

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
  console.log("=== DEBUG: prepareTourScheduleData for bracket syntax ===");
  console.log(
    "Booking tours:",
    booking.tours?.map((t) => ({
      id: t.id,
      title: t.title,
      status: t.status,
      schedule: t.schedule
        ? {
            driver: t.schedule.driver,
            equipment: t.schedule.equipment,
          }
        : null,
    }))
  );

  // Calculate total travelers across SCHEDULED tours only
  let totalTravelers = 0;

  // Prepare tours data - only include tours that have schedules
  const tours = [];

  if (Array.isArray(booking.tours)) {
    // Track tour index for display
    let tourDisplayIndex = 0;

    booking.tours.forEach((tour) => {
      // Only include tours that are confirmed and have schedules
      const isConfirmed = tour.status === "confirmed" && !tour.removedFromBooking;
      const schedule = tour.schedule;

      if (!isConfirmed || !schedule) {
        console.log(
          `Skipping tour: ${tour.title} - confirmed: ${isConfirmed}, has schedule: ${!!schedule}`
        );
        return;
      }

      tourDisplayIndex++;

      // Add to total travelers
      totalTravelers += tour.guests || 1;

      // Get guide and driver info from schedule
      const guide = schedule.guide || {};
      const driver = schedule.driver || {};

      // Determine if multi-day itinerary
      const isMultiDay =
        schedule.itineraryType === "multi_day" || schedule.tourType === "multi_day_tour";

      // Prepare itinerary based on type
      let singleDayItinerary = [];
      let dayItinerary = [];
      let hasItinerary = false;

      if (isMultiDay) {
        if (Array.isArray(schedule.itinerary)) {
          dayItinerary = schedule.itinerary.map((day, dayIndex) => {
            const activities = Array.isArray(day.activities)
              ? day.activities
              : Array.isArray(day.itinerary)
              ? day.itinerary
              : [];

            return {
              day: day.day || dayIndex + 1,
              day_date: formatDayDate(day.date || schedule.date),
              activities: activities.map((activity) => ({
                time: formatTime(activity.time) || "09:00",
                activity: activity.activity || "Activity",
                description: activity.description || "",
              })),
            };
          });
          hasItinerary = dayItinerary.length > 0;
        }
      } else {
        if (Array.isArray(schedule.itinerary)) {
          console.log(`Found itinerary for ${tour.title}:`, schedule.itinerary);
          singleDayItinerary = schedule.itinerary.map((item) => ({
            time: formatTime(item.time) || "09:00",
            activity: item.activity || "Activity",
            description: item.description || "",
          }));
          hasItinerary = singleDayItinerary.length > 0;
        }
      }

      // Prepare equipment items with formatted quantity
      const equipmentItems = Array.isArray(schedule.equipment)
        ? schedule.equipment
            .filter((item) => item && item.item)
            .map((item) => {
              const quantity = parseInt(item.quantity) || 1;
              return {
                item: item.item || "",
                quantity: quantity, // Keep original for conditionals
                quantity_display: quantity > 1 ? `(x${quantity})` : "", // Formatted for display
              };
            })
        : [];

      console.log(`Equipment items for ${tour.title}:`, equipmentItems);

      // Check if tour has modification info
      const modifications_made = schedule.modifications_made || false;
      const guests_changed = schedule.guests_changed || false;
      const date_changed = schedule.date_changed || false;

      // Get date safely
      let tourDate = schedule.date;
      if (!tourDate) {
        tourDate = tour.date;
      }
      if (tourDate instanceof Date) {
        tourDate = tourDate.toISOString();
      }

      // Format times safely using formatTime function
      const meetingTime = schedule.meetingPoint?.time;
      const dropoffTime = schedule.dropoffPoint?.time;
      const startTime = schedule.startTime;
      const endTime = schedule.endTime;

      // Add modification section if tour was modified
      let notes = schedule.scheduleNotes || "";
      if (modifications_made) {
        const modificationNotes = [];
        if (guests_changed && schedule.original_guests && schedule.guests) {
          modificationNotes.push(
            `Guests modified from ${schedule.original_guests} to ${schedule.guests}`
          );
        }
        if (date_changed && schedule.date) {
          modificationNotes.push(`Date modified to ${formatDate(schedule.date)}`);
        }

        if (modificationNotes.length > 0) {
          const modificationText = `Tour modifications: ${modificationNotes.join(", ")}`;
          notes = notes ? `${modificationText}\n\n${notes}` : modificationText;
        }
      }

      // Prepare conditionals for bracket syntax
      const hasGuide = !!guide.name;
      const hasDriver = !!driver.name;
      const hasGuideOrDriver = hasGuide || hasDriver;
      const hasEquipment = equipmentItems.length > 0;
      const hasNotes = !!notes;
      const hasEquipmentOrNotes = hasEquipment || hasNotes;
      const hasMeetingNotes = !!schedule.meetingPoint?.notes;
      const hasDropoffNotes = !!schedule.dropoffPoint?.notes;
      const hasGuideEmail = !!guide.email;
      const hasDriverVehicle =
        driver.vehicle !== undefined &&
        driver.vehicle !== null &&
        driver.vehicle.toString().trim() !== "";

      // Get driver vehicle or default
      const driverVehicle = driver.vehicle || "";

      tours.push({
        // Tour basic info
        tour_title: tour.title || schedule.title || "Tour",
        tour_number: tourDisplayIndex.toString(),
        total_tours: "", // Will be set later
        tour_type: getTourTypeDisplay(schedule.tourType) || "Day Tour",
        tour_date: formatDate(tourDate),
        tour_duration: formatDuration(schedule) || "8 hours",

        // Modification info
        modifications_made: modifications_made,
        guests_changed: guests_changed,
        date_changed: date_changed,
        original_guests: schedule.original_guests || tour.originalGuests || tour.guests || 0,
        guests: schedule.guests || tour.guests || 0,

        // Meeting/dropoff points with formatted times
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
        driver_vehicle: driverVehicle, // Use the variable

        // Tour details
        notes: notes,
        is_multi_day: isMultiDay,
        itinerary: singleDayItinerary,
        day_itinerary: dayItinerary,

        // For bracket syntax conditionals
        conditionals: {
          // Main conditionals
          has_guide_or_driver: hasGuideOrDriver,
          has_guide: hasGuide,
          has_driver: hasDriver,
          has_itinerary: hasItinerary,
          has_equipment: hasEquipment,
          has_notes: hasNotes,
          has_equipment_or_notes: hasEquipmentOrNotes,
          is_multi_day: isMultiDay,

          // Optional fields
          has_meeting_notes: hasMeetingNotes,
          has_dropoff_notes: hasDropoffNotes,
          has_guide_email: hasGuideEmail,
          has_driver_vehicle: hasDriverVehicle,
        },

        // Equipment with formatted quantity
        equipment: equipmentItems.map((item) => ({
          item: item.item,
          quantity: item.quantity_display, // Use formatted quantity
          original_quantity: item.quantity, // Keep original for conditionals
        })),
      });
    });
  }

  // Set total_tours for each tour
  tours.forEach((tour) => {
    tour.total_tours = tours.length.toString();
  });

  console.log("=== DEBUG: Final prepared tours ===", JSON.stringify(tours, null, 2));

  // Calculate plural conditionals
  const multipleTours = tours.length > 1;
  const multipleTravelers = totalTravelers > 1;

  return {
    // Customer Information
    customer_name: booking.customer?.name || "",

    // Booking Information
    booking_reference: booking.requestId || "",

    // Schedule Information
    total_tours: tours.length.toString(),
    total_travelers: totalTravelers.toString(),
    schedule_date: formatDate(new Date(), false),

    // Plural conditionals for bracket syntax
    plural: {
      multiple_tours: multipleTours,
      multiple_travelers: multipleTravelers,
    },

    // Tours Data
    tours: tours,

    // Metadata
    current_year: new Date().getFullYear(),
  };
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

  // Prepare completed tours data for email display
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
        reason: reason,
        date: date,
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
    customer_id: booking.customer?.id || "",

    // Booking Information
    booking_reference: booking.requestId || "",

    // Completion Statistics
    completion_date: formatDate(booking.completedAt || booking.updatedAt || new Date()),
    completed_tours: completedCount.toString(),
    cancelled_tours: cancelledCount.toString(),
    scheduled_tours: scheduledCount.toString(),
    total_tours: totalTours.toString(),
    not_completed_tours: notCompletedCount.toString(),

    // Status tracking
    all_tours_completed: notCompletedCount === 0,
    has_cancelled_tours: cancelledCount > 0,
    has_scheduled_tours: scheduledCount > 0,

    // Staff Information
    guide_name: mainGuide,
    driver_name: mainDriver,

    // Tours Data
    tours: tours,
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
    // Get the original price (use originalPrice if it exists, otherwise use calculatedPrice)
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

      // CRITICAL FIX: Compare dates properly
      const formatDateForComparison = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toISOString().split("T")[0]; // Compare only YYYY-MM-DD
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
        guests_changed: guestsChanged, // Will be true only if guests actually changed
        date_changed: dateChanged, // Will be true only if date actually changed
        original_guests: originalGuests,
        client_notes: feedback?.modificationDetails?.notes || tour.clientNotes || "",

        // For debugging/verification
        original_date_formatted: formatDate(originalDate),
        original_guests_value: originalGuests,
        new_guests_value: currentGuests,
        original_date_iso: originalDate,
        new_date_iso: currentDate,
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

  console.log("=== DEBUG: prepareAllToursCancelledData ===");
  console.log(
    "All tours:",
    allTours.map((t) => ({
      title: t.title,
      originalGuests: t.originalGuests,
      guests: t.guests,
      originalPrice: t.originalPrice,
      calculatedPrice: t.calculatedPrice,
      groupPrices: t.groupPrices ? "exists" : "none",
    }))
  );

  const cancelledTours = allTours.map((tour) => {
    // IMPORTANT: Get the ORIGINAL price correctly
    let displayPrice = 0;

    // Priority 1: Use originalPrice if it exists
    if (tour.originalPrice !== undefined && tour.originalPrice !== null) {
      displayPrice = tour.originalPrice;
      console.log(`Tour "${tour.title}": Using originalPrice: ${displayPrice}`);
    }
    // Priority 2: Use calculatedPrice (might be modified)
    else if (tour.calculatedPrice !== undefined && tour.calculatedPrice !== null) {
      displayPrice = tour.calculatedPrice;
      console.log(`Tour "${tour.title}": Using calculatedPrice: ${displayPrice}`);
    }
    // Priority 3: Calculate from groupPrices and original guests
    else if (tour.groupPrices && Array.isArray(tour.groupPrices) && tour.groupPrices.length > 0) {
      const guests = tour.originalGuests || tour.guests || 0;
      displayPrice = calculateTourPrice(tour, guests);
      console.log(
        `Tour "${tour.title}": Calculated from groupPrices for ${guests} guests: ${displayPrice}`
      );
    }
    // Priority 4: Fallback to 0
    else {
      console.log(`Tour "${tour.title}": No price data found, using 0`);
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

    const tourData = {
      tour_title: tour.title,
      original_date: formatDate(displayDate),
      original_guests: displayGuests,
      guests_label: displayGuests === 1 ? "Traveler" : "Travelers",
      tour_price: displayPrice.toString(),
      tour_notes: tourNotes,
    };

    console.log(`Tour "${tour.title}" final data:`, tourData);
    return tourData;
  });

  console.log("=== DEBUG: Final cancelled tours array ===", cancelledTours);
  return {
    customer_name: booking.customer.name,
    customer_email: booking.customer.email,
    request_id: booking.requestId,
    current_year: new Date().getFullYear(),
    original_total: originalTotal.toString(),
    cancellation_date: new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    cancellation_notes: cancellationNotes,
    cancelled_tours: cancelledTours,
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

function formatPrice(price) {
  if (typeof price === "number") {
    return `$${price.toFixed(2)}`;
  }
  if (typeof price === "string") {
    // Remove any existing $ signs and format
    const numericPrice = price.replace(/[^0-9.-]/g, "");
    const parsed = parseFloat(numericPrice);
    if (!isNaN(parsed)) {
      return `$${parsed.toFixed(2)}`;
    }
  }
  return "$0.00";
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
 * Calculate new total based on feedback decisions
 */
function calculateNewTotal(booking, feedbackDecisions) {
  let newTotal = 0;

  booking.tours.forEach((tour) => {
    const feedback = feedbackDecisions.find((f) => f.tourId === tour.id);

    if (!feedback || feedback.decision !== "remove") {
      // Add either original or modified price
      if (feedback?.decision === "modify" && tour.calculatedPrice !== tour.originalPrice) {
        newTotal += tour.calculatedPrice || 0;
      } else {
        newTotal += tour.originalPrice || tour.calculatedPrice || 0;
      }
    }
    // Tours marked as "remove" are not added to total
  });

  return newTotal;
}

/**
 * Calculate the modified price based on feedback
 */
function calculateModifiedPrice(tour, feedback) {
  if (feedback.decision !== "modify") {
    return tour.calculatedPrice?.toString() || "0";
  }

  // If price is already updated in tour object, use it
  if (tour.calculatedPrice !== tour.originalPrice) {
    return tour.calculatedPrice?.toString() || "0";
  }

  // Otherwise calculate based on modification details
  if (feedback.modificationDetails?.guests) {
    // Recalculate price for limited availability with modified guests
    return calculatePriceForGuests(tour, feedback.modificationDetails.guests).toString();
  }

  return tour.calculatedPrice?.toString() || "0";
}

/**
 * Calculate price for specific number of guests
 */
function calculatePriceForGuests(tour, guests) {
  if (!tour.groupPrices || !Array.isArray(tour.groupPrices)) {
    return tour.calculatedPrice || 0;
  }

  // Find appropriate pricing tier
  let selectedTier = tour.groupPrices[0];

  for (const tier of tour.groupPrices) {
    if (typeof tier.groupSize === "string") {
      const [min, max] = tier.groupSize.split("-").map(Number);
      if (guests >= min && guests <= max) {
        selectedTier = tier;
        break;
      }
    } else if (tier.groupSize === guests) {
      selectedTier = tier;
      break;
    }
  }

  // Calculate price
  return selectedTier.perPerson !== false ? selectedTier.price * guests : selectedTier.price;
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

function handleElseConditionals(template, conditionals) {
  if (!conditionals) return template;

  let result = template;

  // Handle has_guide/has_driver layout
  const guideDriverRegex =
    /\[\[IF_HAS_GUIDE\]\]([\s\S]*?)\[\[ELSE_HAS_GUIDE\]\]([\s\S]*?)\[\[END_HAS_GUIDE\]\]/g;
  result = result.replace(guideDriverRegex, (match, ifContent, elseContent) => {
    return conditionals.has_guide ? ifContent : elseContent;
  });

  const driverGuideRegex =
    /\[\[IF_HAS_DRIVER\]\]([\s\S]*?)\[\[ELSE_HAS_DRIVER\]\]([\s\S]*?)\[\[END_HAS_DRIVER\]\]/g;
  result = result.replace(driverGuideRegex, (match, ifContent, elseContent) => {
    return conditionals.has_driver ? ifContent : elseContent;
  });

  // Handle equipment/notes layout
  const equipmentRegex =
    /\[\[IF_HAS_EQUIPMENT\]\]([\s\S]*?)\[\[ELSE_HAS_EQUIPMENT\]\]([\s\S]*?)\[\[END_HAS_EQUIPMENT\]\]/g;
  result = result.replace(equipmentRegex, (match, ifContent, elseContent) => {
    return conditionals.has_equipment ? ifContent : elseContent;
  });

  const notesRegex =
    /\[\[IF_HAS_NOTES\]\]([\s\S]*?)\[\[ELSE_HAS_NOTES\]\]([\s\S]*?)\[\[END_HAS_NOTES\]\]/g;
  result = result.replace(notesRegex, (match, ifContent, elseContent) => {
    return conditionals.has_notes ? ifContent : elseContent;
  });

  // Handle multi-day/single-day
  const multiDayRegex =
    /\[\[IF_IS_MULTI_DAY\]\]([\s\S]*?)\[\[ELSE_IS_MULTI_DAY\]\]([\s\S]*?)\[\[END_IS_MULTI_DAY\]\]/g;
  result = result.replace(multiDayRegex, (match, ifContent, elseContent) => {
    return conditionals.is_multi_day ? ifContent : elseContent;
  });

  return result;
}

// Helper function to fix width conditionals
function fixWidthConditionals(template, conditionals) {
  if (!conditionals) return template;

  let result = template;

  // Fix width conditionals for guide/driver
  const hasGuideWidthRegex =
    /\[\[IF_HAS_GUIDE\]\]50%\[\[ELSE_HAS_GUIDE\]\]100%\[\[END_HAS_GUIDE\]\]/g;
  result = result.replace(hasGuideWidthRegex, conditionals.has_guide ? "50%" : "100%");

  const hasDriverWidthRegex =
    /\[\[IF_HAS_DRIVER\]\]50%\[\[ELSE_HAS_DRIVER\]\]100%\[\[END_HAS_DRIVER\]\]/g;
  result = result.replace(hasDriverWidthRegex, conditionals.has_driver ? "50%" : "100%");

  // Fix width conditionals for equipment/notes
  const hasEquipmentWidthRegex =
    /\[\[IF_HAS_EQUIPMENT\]\]50%\[\[ELSE_HAS_EQUIPMENT\]\]100%\[\[END_HAS_EQUIPMENT\]\]/g;
  result = result.replace(hasEquipmentWidthRegex, conditionals.has_equipment ? "50%" : "100%");

  const hasNotesWidthRegex =
    /\[\[IF_HAS_NOTES\]\]50%\[\[ELSE_HAS_NOTES\]\]100%\[\[END_HAS_NOTES\]\]/g;
  result = result.replace(hasNotesWidthRegex, conditionals.has_notes ? "50%" : "100%");

  return result;
}

// Helper function to handle itinerary
function handleItinerary(template, tour) {
  let result = template;

  if (tour.conditionals?.has_itinerary) {
    if (tour.conditionals.is_multi_day && tour.day_itinerary && Array.isArray(tour.day_itinerary)) {
      // Handle multi-day itinerary
      const dayLoopRegex = /\[\[EACH_DAY_ITINERARY\]\]([\s\S]*?)\[\[END_EACH_DAY_ITINERARY\]\]/;
      const dayMatch = result.match(dayLoopRegex);

      if (dayMatch) {
        const dayTemplate = dayMatch[1];
        let dayContent = "";

        tour.day_itinerary.forEach((day, dayIndex) => {
          let dayItem = dayTemplate;

          // Replace day variables
          dayItem = dayItem.replace(/\{\{day\}\}/g, day.day || (dayIndex + 1).toString());
          dayItem = dayItem.replace(/\{\{day_date\}\}/g, day.day_date || "");

          // Handle activities
          if (day.activities && Array.isArray(day.activities)) {
            const activityLoopRegex =
              /\[\[EACH_ACTIVITIES\]\]([\s\S]*?)\[\[END_EACH_ACTIVITIES\]\]/;
            const activityMatch = dayItem.match(activityLoopRegex);

            if (activityMatch) {
              const activityTemplate = activityMatch[1];
              let activityContent = "";

              day.activities.forEach((activity, activityIndex) => {
                let activityItem = activityTemplate;

                activityItem = activityItem.replace(/\{\{time\}\}/g, activity.time || "");
                activityItem = activityItem.replace(/\{\{activity\}\}/g, activity.activity || "");
                activityItem = activityItem.replace(
                  /\{\{description\}\}/g,
                  activity.description || ""
                );

                // Handle [[UNLESS_LAST_ACTIVITY]]
                const unlessRegex =
                  /\[\[UNLESS_LAST_ACTIVITY\]\]([\s\S]*?)\[\[END_UNLESS_LAST_ACTIVITY\]\]/g;
                activityItem = activityItem.replace(unlessRegex, (match, content) => {
                  return activityIndex < day.activities.length - 1 ? content : "";
                });

                activityContent += activityItem;
              });

              dayItem = dayItem.replace(activityLoopRegex, activityContent);
            }
          }

          dayContent += dayItem;
        });

        result = result.replace(dayLoopRegex, dayContent);
      }
    } else if (tour.itinerary && Array.isArray(tour.itinerary)) {
      // Handle single day itinerary
      const itineraryLoopRegex = /\[\[EACH_ITINERary\]\]([\s\S]*?)\[\[END_EACH_ITINERARY\]\]/i; // Case insensitive
      const itineraryMatch = result.match(itineraryLoopRegex);

      if (itineraryMatch) {
        const itineraryTemplate = itineraryMatch[1];
        let itineraryContent = "";

        console.log(`Processing ${tour.itinerary.length} itinerary items`);

        tour.itinerary.forEach((item, itemIndex) => {
          let itineraryItem = itineraryTemplate;

          itineraryItem = itineraryItem.replace(/\{\{time\}\}/g, item.time || "");
          itineraryItem = itineraryItem.replace(/\{\{activity\}\}/g, item.activity || "");
          itineraryItem = itineraryItem.replace(/\{\{description\}\}/g, item.description || "");

          // Handle [[UNLESS_LAST_ITINERARY]]
          const unlessRegex =
            /\[\[UNLESS_LAST_ITINERARY\]\]([\s\S]*?)\[\[END_UNLESS_LAST_ITINERARY\]\]/g;
          itineraryItem = itineraryItem.replace(unlessRegex, (match, content) => {
            return itemIndex < tour.itinerary.length - 1 ? content : "";
          });

          itineraryContent += itineraryItem;
        });

        result = result.replace(itineraryLoopRegex, itineraryContent);
      } else {
        console.log("No itinerary loop found in template");
      }
    }
  } else {
    // Remove itinerary section if no itinerary
    const itinerarySectionRegex = /\[\[IF_HAS_ITINERARY\]\][\s\S]*?\[\[ENDIF_HAS_ITINERARY\]\]/g;
    result = result.replace(itinerarySectionRegex, "");
  }

  return result;
}

// Helper function to handle equipment
function handleEquipment(template, tour) {
  let result = template;

  if (tour.conditionals?.has_equipment && tour.equipment && Array.isArray(tour.equipment)) {
    console.log(`Processing ${tour.equipment.length} equipment items`);

    const equipmentLoopRegex = /\[\[EACH_EQUIPMENT\]\]([\s\S]*?)\[\[END_EACH_EQUIPMENT\]\]/;
    const equipmentMatch = result.match(equipmentLoopRegex);

    if (equipmentMatch) {
      const equipmentTemplate = equipmentMatch[1];
      let equipmentContent = "";

      tour.equipment.forEach((item) => {
        let equipmentItem = equipmentTemplate;

        // Replace item name
        equipmentItem = equipmentItem.replace(/\{\{item\}\}/g, item.item || "");

        // Replace quantity - use pre-formatted quantity_display
        const quantityDisplay = item.quantity || "";
        equipmentItem = equipmentItem.replace(/\{\{quantity\}\}/g, quantityDisplay);

        // Handle [[IF_QUANTITY]] blocks
        const quantityRegex = /\[\[IF_QUANTITY\]\]([\s\S]*?)\[\[ENDIF_QUANTITY\]\]/g;
        equipmentItem = equipmentItem.replace(quantityRegex, (match, content) => {
          const hasQuantity = item.original_quantity > 1;
          return hasQuantity ? content : "";
        });

        equipmentContent += equipmentItem;
      });

      result = result.replace(equipmentLoopRegex, equipmentContent);
    } else {
      console.log("No equipment loop found in template");
    }
  } else {
    // Remove equipment section if no equipment
    const equipmentSectionRegex = /\[\[IF_HAS_EQUIPMENT\]\][\s\S]*?\[\[ENDIF_HAS_EQUIPMENT\]\]/g;
    result = result.replace(equipmentSectionRegex, "");
  }

  return result;
}
