import { admin } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/sendEmail";
import {
  clientAllToursAvailable,
  clientPartialAvailabilityNotification,
  allToursUnavailable,
  prepareAllToursAvailableData,
  preparePartialAvailabilityData,
  prepareAllToursUnavailableData,
} from "@/utils/handleEmailTemplates";
import { generateClientFeedbackLink } from "@/lib/feedbackLinks";

// Helper function to generate dummy payment link (for demo)
const createPaymentLink = async (
  bookingId,
  customerName,
  customerEmail,
  idToken,
  tours,
  amount
) => {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://crm.growthifylabs.com"
      : "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/v1/stripe/create-payment-link`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ bookingId, customerName, customerEmail, tours, amount }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to create payment link");
  }

  return {
    link: data.paymentLink,
    expiresAt: data.expiresAt,
    linkId: data.paymentLinkId,
    log: data.log,
  };
};

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");

    // Validate authentication
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    // Check user permissions
    let userRecord;
    try {
      userRecord = await admin.auth().getUser(decodedToken.uid);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        return NextResponse.json({ error: "Permission denied" }, { status: 403 });
      }
      throw error;
    }

    // Parse request body
    const { bookingId, availabilityResults, adminNotes } = await request.json();

    // Validate required fields
    if (!bookingId || !availabilityResults || !Array.isArray(availabilityResults)) {
      return NextResponse.json(
        { error: "Missing required fields: bookingId and availabilityResults" },
        { status: 400 }
      );
    }

    const db = admin.firestore();
    const bookingRef = db.collection("bookings").doc(bookingId);
    const bookingDoc = await bookingRef.get();

    if (!bookingDoc.exists) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const bookingData = bookingDoc.data();

    // Analyze availability results
    const hasAlternativeDates = availabilityResults.some((tour) => tour.alternativeDate);
    const hasLimitedPlaces = availabilityResults.some((tour) => tour.limitedPlaces);
    const hasUnavailableTours = availabilityResults.some((tour) => tour.status === "unavailable");
    const allToursAvailable = availabilityResults.every((tour) => tour.status === "available");
    const noToursAvailable = availabilityResults.every((tour) => tour.status === "unavailable");

    // Merge availabilityResults with existing tour data
    const updatedTours = bookingData.tours.map((existingTour) => {
      const availabilityInfo = availabilityResults.find(
        (result) =>
          // Match by the unique booking tour ID first
          result.id === existingTour.id
      );

      if (availabilityInfo) {
        // Create a new tour object with ALL properties from the original
        return {
          ...existingTour, // This spreads all existing properties
          availabilityStatus: availabilityInfo.status,
          availabilityNotes: availabilityInfo.notes,
          limitedPlaces: availabilityInfo.limitedPlaces,
          alternativeDate: availabilityInfo.alternativeDate,
          // Keep the original tour date
          date: existingTour.date,
          // Add confirmed date if needed
          confirmedDate:
            availabilityInfo.status === "available"
              ? existingTour.date
              : availabilityInfo.alternativeDate,
        };
      }
      return existingTour;
    });

    // Prepare update data
    const updateData = {
      ...bookingData,
      tours: updatedTours,
      availabilityConfirmed: true,
      availabilityConfirmedAt: admin.firestore.FieldValue.serverTimestamp(),
      adminNotes: adminNotes || "",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Fetch email templates
    const templatesSnapshot = await db
      .collection("emailTemplates")
      .where("name", "in", [
        "client_availability_confirmed",
        "client_partial_availability_notification",
        "client_no_availability_notification",
      ])
      .get();

    const templates = {};
    templatesSnapshot.forEach((doc) => {
      templates[doc.data().name] = doc.data().html;
    });

    let emailToSend = null;
    let emailSubject = "";
    let emailStatus = "";

    // Handle different availability scenarios
    if (noToursAvailable) {
      // Case 3: All tours unavailable
      if (!templates["client_no_availability_notification"]) {
        return NextResponse.json(
          { error: "Email template 'client_no_availability_notification' not found" },
          { status: 500 }
        );
      }

      const emailData = prepareAllToursUnavailableData(updateData);
      emailToSend = allToursUnavailable(
        templates["client_no_availability_notification"],
        emailData
      );
      emailSubject = "Tour Unavailability Notification - EY Travel Egypt";
      emailStatus = "no_availability";

      // Update tour statuses
      updateData.tours.map((tour) => {
        tour.status = "cancelled";
      });

      // Update booking status
      updateData.status = "cancelled";
      updateData.currentStep = "no_availability";
      updateData.pendingClientFeedback = false;
      updateData.pendingPayment = false;
      updateData.paymentLinkSent = false;
    } else if (allToursAvailable) {
      // Case 1: All tours available
      if (!templates["client_availability_confirmed"]) {
        return NextResponse.json(
          { error: "Email template 'client_availability_confirmed' not found" },
          { status: 500 }
        );
      }

      // Update tour statuses
      updateData.tours.map((tour) => {
        tour.status = "confirmed";
      });

      // Update booking status
      updateData.status = "confirmed";
      updateData.currentStep = "awaiting_payment";
      updateData.pendingClientFeedback = false;
      updateData.pendingPayment = true;
      updateData.paymentLinkSent = true;

      const {
        link: paymentLink,
        expiresAt,
        linkId,
        log,
      } = await createPaymentLink(
        bookingId,
        updateData.customerName,
        updateData.customerEmail,
        idToken,
        updateData.tours,
        updateData.total
      );

      const emailData = prepareAllToursAvailableData(updateData, paymentLink);
      emailToSend = clientAllToursAvailable(templates["client_availability_confirmed"], emailData);
      emailSubject = "Tour Availability Confirmed - Ready for Payment";
      emailStatus = "all_available";

      updateData.paymentLink = paymentLink;
      updateData.paymentLinkExpiresAt = expiresAt;
      updateData.paymentLinkId = linkId;
      updateData.paymentLinkGeneratedAt = new Date().toISOString();
      await db
        .collection("bookings")
        .doc(bookingId)
        .update({ log: admin.firestore.FieldValue.arrayUnion(log) });
    } else {
      // Case 2: Partial availability
      if (!templates["client_partial_availability_notification"]) {
        return NextResponse.json(
          { error: "Email template 'client_partial_availability_notification' not found" },
          { status: 500 }
        );
      }

      const formLink = generateClientFeedbackLink(bookingData.requestId);
      const emailData = preparePartialAvailabilityData(updateData, formLink);
      emailToSend = clientPartialAvailabilityNotification(
        templates["client_partial_availability_notification"],
        emailData
      );
      emailSubject = "Partial Tour Availability - Feedback Required";
      emailStatus = "partial_availability";

      // Update tour statuses
      updateData.tours.map((tour) => {
        tour.status = "pending";
      });

      // Update booking status
      updateData.status = "pending_feedback";
      updateData.currentStep = "awaiting_client_feedback";
      updateData.pendingClientFeedback = true;
      updateData.pendingPayment = true;
      const newLogEntry = {
        timestamp: new Date().toISOString(),
        event: "feedback_requested",
        changes: {},
      };

      updateData.log = admin.firestore.FieldValue.arrayUnion(newLogEntry);
    }

    // Add to log
    const newLogEntry = {
      timestamp: new Date().toISOString(),
      event: "availability_checked",
      changes: {
        hasAlternativeDates,
        hasLimitedPlaces,
        hasUnavailableTours,
        allToursAvailable,
        noToursAvailable,
      },
    };

    updateData.log = admin.firestore.FieldValue.arrayUnion(newLogEntry);

    // Send email to client
    const emailResult = await sendEmail({
      to: bookingData.customer.email,
      subject: emailSubject,
      title: "EY Travel Egypt",
      htmlBody: emailToSend,
    });

    if (emailResult.error) {
      console.error("Error sending availability email:", emailResult.error);
      // Don't fail the whole request, just log it
      updateData.emailSendError = emailResult.error;
      updateData.availabilityEmailSent = false;
    } else {
      updateData.availabilityEmailSent = true;
      updateData.availabilityEmailSentAt = admin.firestore.FieldValue.serverTimestamp();
    }

    // Update booking in Firestore
    await bookingRef.update(updateData);

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Availability confirmed and client notified",
      bookingId,
      availabilityStatus: emailStatus,
      emailSent: !emailResult.error,
      hasAlternativeDates,
      hasLimitedPlaces,
      hasUnavailableTours,
      booking: updateData,
    });
  } catch (error) {
    console.error("Error confirming availability:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
