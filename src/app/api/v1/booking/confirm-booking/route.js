import { admin } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/sendEmail";
import {
  clientPartialAvailabilityConfirmed,
  preparePartialAvailabilityConfirmedData,
  clientAllToursCancelled,
  prepareAllToursCancelledData,
} from "@/utils/handleEmailTemplates"; // You'll need to add these imports

// Helper function to generate payment link
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
    const {
      bookingId,
      action, // 'confirm' or 'cancel'
      adminNotes,
      cancellationNotes, // Required for cancellation
      totalPrice,
      modifiedTours, // Array of tours with modifications
    } = await request.json();

    // Validate required fields
    if (!bookingId || !action) {
      return NextResponse.json(
        { error: "Missing required fields: bookingId, action, and adminNotes" },
        { status: 400 }
      );
    }

    // Validate cancellation notes if cancelling
    if (action === "cancel" && (!cancellationNotes || !cancellationNotes.trim())) {
      return NextResponse.json(
        { error: "Cancellation notes are required when cancelling a booking" },
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

    // Check if booking is in the correct state for processing feedback
    if (bookingData.status !== "feedback_received") {
      return NextResponse.json(
        {
          error: "Booking is not in feedback_received state",
          currentStatus: bookingData.status,
          currentStep: bookingData.currentStep,
        },
        { status: 400 }
      );
    }

    // Fetch email templates
    const templatesSnapshot = await db
      .collection("emailTemplates")
      .where("name", "in", ["booking_confirmed_modified", "booking_cancelled"])
      .get();

    const templates = {};
    templatesSnapshot.forEach((doc) => {
      templates[doc.data().name] = doc.data().html;
    });

    let emailToSend = null;
    let emailSubject = "";
    let emailStatus = "";
    let updateData = {};

    // Handle confirmation or cancellation
    if (action === "confirm") {
      // CONFIRM MODIFIED BOOKING
      if (!templates["booking_confirmed_modified"]) {
        return NextResponse.json(
          { error: "Email template 'booking_confirmed_modified' not found" },
          { status: 500 }
        );
      }

      if (!modifiedTours || !Array.isArray(modifiedTours)) {
        return NextResponse.json(
          { error: "Modified tours data is required for confirmation" },
          { status: 400 }
        );
      }

      // Process tours with modifications
      const updatedTours = bookingData.tours.map((tour) => {
        const modifiedTour = modifiedTours.find((mt) => mt.tourId === tour.id);

        if (modifiedTour?.action === "remove") {
          // Mark tour as cancelled but keep it in the array
          return {
            ...tour,
            status: "cancelled",
            cancelledAt: new Date().toISOString(),
            cancelledReason: "Client requested removal after feedback",
            cancellationNotes: modifiedTour.notes || "Removed per client feedback",
            calculatedPrice: 0, // Price becomes 0
            removedFromBooking: true,
            removedAt: new Date().toISOString(),
          };
        } else if (modifiedTour?.action === "modify" || modifiedTour?.action === "keep") {
          // Update tour with modifications
          const newDate = modifiedTour.newDate || tour.originalDate;
          const newGuests = modifiedTour.newGuests || tour.originalGuests;
          const newPrice = modifiedTour.newPrice || tour.originalPrice;

          return {
            ...tour,
            status: "confirmed",
            date: newDate,
            guests: newGuests,
            confirmedDate: newDate,
            calculatedPrice: newPrice,
            modifiedAt: new Date().toISOString(),
            modifications: {
              dateChanged: modifiedTour.newDate !== tour.originalDate,
              guestsChanged: modifiedTour.newGuests !== tour.originalGuests,
              priceChanged: modifiedTour.newPrice !== tour.originalPrice,
              notes: modifiedTour.notes || "",
            },
          };
        }

        return tour; // Fallback
      });

      // Generate payment link
      const {
        link: paymentLink,
        expiresAt,
        linkId,
        log,
      } = await createPaymentLink(
        bookingId,
        bookingData.customer.name,
        bookingData.customer.email,
        idToken,
        updatedTours,
        bookingData.total
      );

      updateData.paymentLink = paymentLink;
      updateData.paymentLinkExpiresAt = expiresAt;
      updateData.paymentLinkId = linkId;
      await db
        .collection("bookings")
        .doc(bookingId)
        .update({ log: admin.firestore.FieldValue.arrayUnion(log) });

      // Prepare update data
      updateData = {
        tours: updatedTours,
        status: "confirmed",
        currentStep: "awaiting_payment",
        total: totalPrice,
        pendingPayment: true,
        pendingClientFeedback: false,
        feedbackProcessedAt: new Date().toISOString(),
        feedbackProcessedBy: userRecord.email,
        feedbackProcessedAction: "confirmed",
        paymentLinkGeneratedAt: new Date().toISOString(),
        adminNotes: adminNotes || "",
        updatedAt: new Date().toISOString(),
        lastUpdatedBy: userRecord.email,
      };

      const updatedBookingForEmail = {
        ...bookingData, // Original booking data
        ...updateData, // New updates
        tours: updatedTours, // Updated tours array (CRITICAL!)
      };

      // Prepare email data
      const emailData = preparePartialAvailabilityConfirmedData(
        updatedBookingForEmail,
        paymentLink
      );
      emailToSend = clientPartialAvailabilityConfirmed(
        templates["booking_confirmed_modified"],
        emailData
      );
      emailSubject = `✅ Booking Confirmed After Modifications - ${bookingData.requestId}`;
      emailStatus = "confirmed_after_feedback";
    } else if (action === "cancel") {
      // CANCEL ENTIRE BOOKING
      if (!templates["booking_cancelled"]) {
        return NextResponse.json(
          { error: "Email template 'booking_cancelled' not found" },
          { status: 500 }
        );
      }

      // Mark all tours as cancelled (similar to noToursAvailable case)
      const updatedTours = bookingData.tours.map((tour) => ({
        ...tour,
        status: "cancelled",
        cancelledAt: new Date().toISOString(),
        cancelledReason: "All tours cancelled after client feedback",
        cancellationNotes: cancellationNotes,
        calculatedPrice: 0,
      }));

      // Prepare email data
      const emailData = prepareAllToursCancelledData(bookingData, cancellationNotes);
      emailToSend = clientAllToursCancelled(templates["booking_cancelled"], emailData);
      emailSubject = `⚠️ Booking Cancelled After Feedback - ${bookingData.requestId}`;
      emailStatus = "cancelled_after_feedback";

      // Prepare update data (similar to noToursAvailable case)
      updateData = {
        tours: updatedTours,
        status: "cancelled",
        currentStep: "cancelled_after_feedback",
        pendingPayment: false,
        pendingClientFeedback: false,
        feedbackProcessedAt: new Date().toISOString(),
        feedbackProcessedBy: userRecord.email,
        feedbackProcessedAction: "cancelled",
        cancellationNotes: cancellationNotes,
        cancelledAt: new Date().toISOString(),
        cancelledBy: userRecord.email,
        adminNotes: adminNotes || "",
        updatedAt: new Date().toISOString(),
        lastUpdatedBy: userRecord.email,
      };
    }

    // Create log entry
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: "feedback_processed",
      processedBy: userRecord.email,
      changes: {
        action: action,
        originalStatus: bookingData.status,
        newStatus: updateData.status,
        originalTotal: bookingData.total,
        newTotal: updateData.total || 0,
        toursConfirmed:
          action === "confirm"
            ? updateData.tours.filter((t) => t.status === "confirmed").length
            : 0,
        toursCancelled:
          action === "confirm"
            ? updateData.tours.filter((t) => t.status === "cancelled").length
            : updateData.tours.length,
        adminNotes: adminNotes,
        cancellationNotes: action === "cancel" ? cancellationNotes : null,
      },
    };

    // Add log to update data
    updateData.log = admin.firestore.FieldValue.arrayUnion(logEntry);

    // Send email to client
    const emailResult = await sendEmail({
      to: bookingData.customer.email,
      subject: emailSubject,
      title: "EY Travel Egypt",
      htmlBody: emailToSend,
    });

    if (emailResult.error) {
      console.error("Error sending feedback processing email:", emailResult.error);
      updateData.emailSendError = emailResult.error;
      updateData.confirmationEmailSent = false;
    } else {
      updateData.confirmationEmailSent = true;
      updateData.confirmationEmailSentAt = new Date().toISOString();
    }

    // Update booking in Firestore
    await bookingRef.update(updateData);

    // Return success response
    return NextResponse.json({
      success: true,
      message: `Booking ${action === "confirm" ? "confirmed" : "cancelled"} successfully`,
      bookingId,
      action: action,
      emailSent: !emailResult.error,
      newStatus: updateData.status,
      total: updateData.total || 0,
      paymentLink: updateData.paymentLink || null,
    });
  } catch (error) {
    console.error("Error processing feedback confirmation:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
