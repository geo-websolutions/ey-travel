// app/api/v1/booking/schedule/route.js
import { admin } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/sendEmail";
import { clientTourCompleted, prepareTourCompletionData } from "@/utils/handleEmailTemplates";

export async function POST(request) {
  try {
    // Authentication
    const authHeader = request.headers.get("authorization");
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

    const body = await request.json();
    const { booking } = body;

    // Validate required fields
    if (!booking) {
      return NextResponse.json({ error: "Missing booking object" }, { status: 400 });
    }

    const db = admin.firestore();

    // Prepare update data
    const updateData = {
      status: "completed",
      currentStep: "booking_completed",
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to log
    const completedLog = {
      timestamp: new Date().toISOString(),
      event: "booking_completed",
      changes: {
        tourCompleted: true,
      },
    };

    updateData.log = admin.firestore.FieldValue.arrayUnion(completedLog);

    // Send schedule confirmation email if requested
    let emailResult = null;

    try {
      // Fetch email template
      const templatesSnapshot = await db
        .collection("emailTemplates")
        .where("name", "==", "booking_completed")
        .limit(1)
        .get();

      if (templatesSnapshot.empty) {
        console.warn("Email template 'booking_completed' not found");
      } else {
        const template = templatesSnapshot.docs[0].data().html;

        // Prepare email data
        const emailData = prepareTourCompletionData({ ...booking, ...updateData });

        // Generate email HTML
        const emailHtml = clientTourCompleted(template, emailData);

        // Send email to client
        emailResult = await sendEmail({
          to: booking.customer.email,
          subject: `Booking Completed - Booking ${booking.requestId}`,
          title: "EY Travel Egypt",
          htmlBody: emailHtml,
        });

        if (emailResult.error) {
          console.error("Error sending schedule confirmation email:", emailResult.error);
          updateData.completedEmailError = emailResult.error;
        } else {
          updateData.completedEmailSent = true;
          updateData.completedEmailSentAt = new Date().toISOString();
        }
      }
    } catch (emailError) {
      console.error("Error preparing schedule email:", emailError);
      updateData.completedEmailError = emailError.message;
    }

    // Update booking in Firestore
    const bookingRef = db.collection("bookings").doc(booking.id);
    await bookingRef.update(updateData);

    return NextResponse.json({
      success: true,
      message: "Tour Marked as Completed",
      bookingId: booking.id,
      requestId: booking.requestId,
      emailSent: emailResult && !emailResult.error,
    });
  } catch (error) {
    console.error("Error scheduling tour:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
