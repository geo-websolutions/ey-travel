import { sendEmail } from "@/lib/sendEmail";
import { admin } from "@/lib/firebaseAdmin";
import { checkRateLimit } from "@/utils/rateLimit";
import { NextResponse } from "next/server";
import {
  clientCheckAvailability,
  prepareClientBookingData,
  clientBookingNotification,
  prepareNotificationBookingData,
} from "@/utils/handleEmailTemplates";

export async function POST(request) {
  try {
    // Rate limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown-ip";

    const { allowed } = await checkRateLimit(ip, "TOUR_BOOKING");
    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many requests. Please try again later.",
        },
        { status: 429 }
      );
    }

    // Get requester location data
    const requesterData = {
      continent: request.headers.get("x-vercel-ip-continent") || "Unknown",
      country: request.headers.get("x-vercel-ip-country") || "Unknown",
      region: request.headers.get("x-vercel-ip-country-region") || "Unknown",
      city: request.headers.get("x-vercel-ip-city") || "Unknown",
      ip: ip,
    };

    const db = admin.firestore();

    // Extract payload
    const { bookingData } = await request.json();

    // Validate required fields
    if (!bookingData) {
      return NextResponse.json(
        { success: false, message: "Bad Request: No booking data provided" },
        { status: 400 }
      );
    }

    const { tours, customer, total, submittedAt } = bookingData;

    if (!tours || !Array.isArray(tours) || tours.length === 0) {
      return NextResponse.json({ success: false, message: "No tours selected" }, { status: 400 });
    }

    if (!customer || !customer.name || !customer.email) {
      return NextResponse.json(
        { success: false, message: "Missing required customer information" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email address" },
        { status: 400 }
      );
    }

    // Fetch email templates with await
    const checkAvailabilityQuery = await db
      .collection("emailTemplates")
      .where("name", "==", "client_check_availability")
      .limit(1)
      .get();

    const bookedNotificationQuery = await db
      .collection("emailTemplates")
      .where("name", "==", "client_booked_notification")
      .limit(1)
      .get();

    if (checkAvailabilityQuery.empty || bookedNotificationQuery.empty) {
      console.error("Email templates not found");
      return NextResponse.json(
        {
          success: false,
          message: "Email templates not configured",
        },
        { status: 500 }
      );
    }

    const checkAvailabilityDoc = checkAvailabilityQuery.docs[0];
    const bookedNotificationDoc = bookedNotificationQuery.docs[0];

    const checkAvailabilityTemplate = checkAvailabilityDoc.data().html;
    const bookedNotificationTemplate = bookedNotificationDoc.data().html;

    // Prepare email content
    const clientTemplate = clientCheckAvailability(
      checkAvailabilityTemplate,
      prepareClientBookingData(bookingData)
    );

    const bookedNotificationData = prepareNotificationBookingData(bookingData);

    const bookedNotification = clientBookingNotification(
      bookedNotificationTemplate,
      bookedNotificationData
    );

    // Send email to client - CRITICAL: Fail if this fails
    const clientEmailResult = await sendEmail({
      to: customer.email,
      subject: "Availability Check in Progress - EY Travel Egypt",
      title: "EY Travel Egypt",
      htmlBody: clientTemplate,
    });

    if (clientEmailResult.error) {
      console.error("Error sending email to client:", clientEmailResult.error);
      return NextResponse.json(
        {
          success: false,
          message:
            "Failed to send confirmation email. Please check your email address and try again.",
        },
        { status: 500 }
      );
    }

    // Send notification email - also critical to fail
    const bookedNotificationResult = await sendEmail({
      to: "info@eytravelegypt.com",
      subject: "Check Availability Request - EY Travel Egypt",
      title: "EY Travel Egypt",
      htmlBody: bookedNotification,
    });

    if (bookedNotificationResult.error) {
      console.error("Error sending notification:", bookedNotificationResult.error);
    }

    // Save booking to Firestore
    const bookingRef = db.collection("bookings").doc();
    await bookingRef.set({
      ...bookingData,
      ...requesterData,
      requestId: bookedNotificationData.request_id,
      clientEmailSent: true,
      notificationEmailSent: true,
      pendingClientFeedback: true,
      availabilityConfirmed: false,
      pendingPayment: true,
      receivedPayment: false,
      paidAmount: 0,
      paymentLinkSent: false,
      currentStep: "awaiting_availability_confirmation",
      emailsSentAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      log: [{ timestamp: new Date().toISOString(), event: "booking_submitted", changes: [] }],
    });

    return NextResponse.json(
      {
        success: true,
        message: "Booking submitted successfully! We'll contact you soon.",
        bookingId: bookingRef.id,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Booking API Error:", err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
