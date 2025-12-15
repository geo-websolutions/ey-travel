import { admin } from "@/lib/firebaseAdmin";
import { verifyFeedbackToken } from "@/lib/feedbackLinks";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Get token from query parameters
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    // Verify the token and get requestId
    const requestId = verifyFeedbackToken(token);
    if (!requestId) {
      return NextResponse.json({ error: "Invalid or expired feedback link" }, { status: 400 });
    }

    // Fetch booking from Firestore
    const db = admin.firestore();
    const bookingsRef = db.collection("bookings");
    const snapshot = await bookingsRef
      .where("requestId", "==", requestId)
      .where("pendingClientFeedback", "==", true)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { error: "Booking not found or feedback already received" },
        { status: 404 }
      );
    }

    const bookingDoc = snapshot.docs[0];
    const bookingData = bookingDoc.data();

    // Check if booking is in the correct state for feedback
    if (!bookingData.availabilityConfirmed || !bookingData.pendingClientFeedback) {
      return NextResponse.json(
        {
          error: "This booking is not awaiting feedback",
          status: bookingData.status,
          currentStep: bookingData.currentStep,
        },
        { status: 400 }
      );
    }

    // Prepare response data (exclude sensitive fields)
    const responseData = {
      id: bookingDoc.id,
      requestId: bookingData.requestId,
      status: bookingData.status,
      currentStep: bookingData.currentStep,
      customer: {
        name: bookingData.customer?.name || "",
        email: bookingData.customer?.email || "",
      },
      tours:
        bookingData.tours?.map((tour) => ({
          id: tour.id || tour.tourId,
          tourId: tour.tourId,
          title: tour.title,
          slug: tour.slug,
          image: tour.image,
          date: tour.date,
          guests: tour.guests,
          calculatedPrice: tour.calculatedPrice,
          availabilityStatus: tour.availabilityStatus || "pending",
          availabilityNotes: tour.availabilityNotes || "",
          limitedPlaces: tour.limitedPlaces || null,
          alternativeDate: tour.alternativeDate || null,
        })) || [],
      total: bookingData.total || 0,
      submittedAt: bookingData.submittedAt,
    };

    return NextResponse.json({
      success: true,
      booking: responseData,
    });
  } catch (error) {
    console.error("Error verifying feedback request:", error);

    if (error.message.includes("expired")) {
      return NextResponse.json({ error: "This feedback link has expired" }, { status: 410 });
    }

    if (error.message.includes("Invalid")) {
      return NextResponse.json({ error: "Invalid feedback link" }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { token, feedback } = body;

    if (!token || !feedback) {
      return NextResponse.json({ error: "Token and feedback are required" }, { status: 400 });
    }

    // Verify the token and get requestId
    const requestId = verifyFeedbackToken(token);
    if (!requestId) {
      return NextResponse.json({ error: "Invalid or expired feedback link" }, { status: 400 });
    }

    // Process feedback (you'll implement this based on your needs)
    // For now, just acknowledge receipt
    return NextResponse.json({
      success: true,
      message: "Feedback received successfully",
      requestId,
    });
  } catch (error) {
    console.error("Error processing feedback:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
