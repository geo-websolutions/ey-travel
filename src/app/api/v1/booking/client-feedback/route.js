import { admin } from "@/lib/firebaseAdmin";
import { verifyFeedbackToken } from "@/lib/feedbackLinks";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/sendEmail";
import { clientFeedbackReceived, prepareFeedbackReceivedData } from "@/utils/handleEmailTemplates";
import { calculateTourPrice } from "@/utils/priceCalculations";

export async function POST(request) {
  try {
    const body = await request.json();
    const { token, feedback } = body;

    if (!token) {
      return NextResponse.json({ error: "Feedback token is required" }, { status: 400 });
    }

    if (!feedback || !Array.isArray(feedback)) {
      return NextResponse.json({ error: "Feedback data is required" }, { status: 400 });
    }

    // Verify the token and get requestId
    const requestId = verifyFeedbackToken(token);

    // Fetch booking from Firestore
    const db = admin.firestore();
    const bookingsRef = db.collection("bookings");

    // Find booking by requestId
    const snapshot = await bookingsRef.where("requestId", "==", requestId).limit(1).get();

    if (snapshot.empty) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const bookingDoc = snapshot.docs[0];
    const bookingRef = bookingDoc.ref;
    const bookingData = bookingDoc.data();

    // Check if booking is in the correct state for feedback
    if (!bookingData.availabilityConfirmed || !bookingData.pendingClientFeedback) {
      return NextResponse.json(
        {
          error: "This booking is not awaiting feedback",
          currentStatus: bookingData.status,
          currentStep: bookingData.currentStep,
        },
        { status: 400 }
      );
    }

    // Validate feedback matches booking tours
    const bookingTourIds = bookingData.tours.map((tour) => tour.id);
    const feedbackTourIds = feedback.map((f) => f.tourId);

    const allToursHaveFeedback = bookingTourIds.every((id) => feedbackTourIds.includes(id));
    if (!allToursHaveFeedback) {
      return NextResponse.json({ error: "Feedback missing for some tours" }, { status: 400 });
    }

    // Process feedback and update tours
    const updatedTours = bookingData.tours.map((tour) => {
      const tourFeedback = feedback.find((f) => f.tourId === tour.id);

      if (!tourFeedback) {
        return tour; // Keep original if no feedback (shouldn't happen due to validation)
      }

      let updatedTour = {
        ...tour,
        originalPrice: tour.calculatedPrice,
        originalGuests: tour.guests,
        originalDate: tour.date,
      };

      // Apply modifications based on decision
      if (tourFeedback.decision === "modify") {
        if (tour.availabilityStatus === "limited" && tourFeedback.modificationDetails?.guests) {
          // Update guests for limited availability
          updatedTour.guests = tourFeedback.modificationDetails.guests;
          updatedTour.calculatedPrice = calculateTourPrice(
            tour,
            tourFeedback.modificationDetails.guests
          );
        } else if (
          tour.availabilityStatus === "alternative" &&
          tourFeedback.modificationDetails?.date
        ) {
          // Update date for alternative availability
          updatedTour.date = tourFeedback.modificationDetails.date;
          updatedTour.confirmedDate = tourFeedback.modificationDetails.date;
        }

        // Store client notes
        if (tourFeedback.modificationDetails?.notes) {
          updatedTour.clientNotes = tourFeedback.modificationDetails.notes;
        }
      }

      return updatedTour;
    });

    // Calculate new total
    const newTotal = updatedTours.reduce((sum, tour) => {
      // Only include tours that aren't marked for removal
      const tourFeedback = feedback.find((f) => f.tourId === (tour.id || tour.tourId));
      if (tourFeedback?.decision === "remove") {
        return sum; // Don't add to total
      }
      return sum + (tour.calculatedPrice || 0);
    }, 0);

    // Get email template
    const templatesSnapshot = await db
      .collection("emailTemplates")
      .where("name", "==", "client_partial_availability_feedback")
      .limit(1)
      .get();

    if (templatesSnapshot.empty) {
      console.error("Email template 'client_partial_availability_feedback' not found");
    }

    const emailTemplate = templatesSnapshot.empty ? null : templatesSnapshot.docs[0].data().html;

    // Prepare update data
    const updateData = {
      feedbackReceivedAt: new Date().toISOString(),
      feedbackDecisions: feedback,
      tours: updatedTours,
      total: newTotal,
      status: "feedback_received",
      currentStep: "reviewing_feedback",
      pendingClientFeedback: false,
      updatedAt: new Date().toISOString(),
    };

    // Add to log
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: "feedback_received",
      changes: {
        toursModified: feedback.filter((f) => f.decision === "modify").length,
        toursRemoved: feedback.filter((f) => f.decision === "remove").length,
        toursKept: feedback.filter((f) => f.decision === "keep").length,
        newTotal,
      },
      feedbackDetails: feedback.map((f) => ({
        tourId: f.tourId,
        decision: f.decision,
        hasNotes: !!f.modificationDetails?.notes,
      })),
    };

    updateData.log = admin.firestore.FieldValue.arrayUnion(logEntry);

    // Send email notification to your team if template exists
    let emailResult = null;
    if (emailTemplate) {
      try {
        // Prepare email data
        const emailData = prepareFeedbackReceivedData({ ...bookingData, ...updateData }, feedback);

        // Generate email HTML
        const emailHtml = clientFeedbackReceived(emailTemplate, emailData);

        // Send to your team
        emailResult = await sendEmail({
          to: "info@eytravelegypt.com",
          subject: `📝 Client Feedback Received - Booking ${requestId}`,
          title: "EY Travel Egypt - Client Feedback",
          htmlBody: emailHtml,
        });

        if (emailResult.error) {
          console.error("Error sending feedback notification email:", emailResult.error);
          updateData.emailSendError = emailResult.error;
        } else {
          updateData.feedbackNotificationSent = true;
          updateData.feedbackNotificationSentAt = new Date().toISOString();
        }
      } catch (emailError) {
        console.error("Error preparing feedback email:", emailError);
        updateData.emailError = emailError.message;
      }
    }

    // Update booking in Firestore
    await bookingRef.update(updateData);

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Feedback received successfully",
      bookingId: bookingDoc.id,
      requestId,
      feedbackSummary: {
        totalTours: feedback.length,
        toursKept: feedback.filter((f) => f.decision === "keep").length,
        toursModified: feedback.filter((f) => f.decision === "modify").length,
        toursRemoved: feedback.filter((f) => f.decision === "remove").length,
        newTotal,
        notificationSent: !!emailResult && !emailResult.error,
      },
    });
  } catch (error) {
    console.error("Error processing feedback:", error);

    if (error.message.includes("expired")) {
      return NextResponse.json({ error: "This feedback link has expired" }, { status: 410 });
    }

    if (error.message.includes("Invalid")) {
      return NextResponse.json({ error: "Invalid feedback link" }, { status: 400 });
    }

    if (error.message.includes("Booking not found")) {
      return NextResponse.json(
        { error: "Booking not found or no longer available" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to process feedback",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// Helper function to calculate price for limited tours with modified guests
function calculateLimitedTourPrice(tour, newGuests) {
  if (!tour.groupPrices || !Array.isArray(tour.groupPrices)) {
    return tour.calculatedPrice || 0;
  }

  // Find appropriate price tier for new guest count
  let selectedPrice = tour.groupPrices[0]?.price || 0;
  let perPerson = tour.groupPrices[0]?.perPerson !== false;

  for (const tier of tour.groupPrices) {
    if (typeof tier.groupSize === "string") {
      const [min, max] = tier.groupSize.split("-").map(Number);
      if (newGuests >= min && newGuests <= max) {
        selectedPrice = tier.price;
        perPerson = tier.perPerson !== false;
        break;
      }
    } else if (tier.groupSize === newGuests) {
      selectedPrice = tier.price;
      perPerson = tier.perPerson !== false;
      break;
    }
  }

  return perPerson ? selectedPrice * newGuests : selectedPrice;
}
