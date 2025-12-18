// app/api/v1/booking/create-payment-link/route.js
import { admin } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { generatePaymentSuccessLink } from "@/lib/feedbackLinks";

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

    // Parse request body
    const { bookingId, customerName, customerEmail, tours, amount } = await request.json();

    // Validate required fields
    if (!bookingId) {
      return NextResponse.json({ error: "Missing required field: bookingId" }, { status: 400 });
    }

    const db = admin.firestore();
    const bookingRef = db.collection("bookings").doc(bookingId);
    const bookingDoc = await bookingRef.get();

    if (!bookingDoc.exists) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const bookingData = bookingDoc.data();

    // Check if payment is already completed
    if (bookingData.paidAmount >= bookingData.total) {
      return NextResponse.json({ error: "Booking is already fully paid" }, { status: 400 });
    }

    // Check if there's an existing valid payment link
    if (bookingData.stripePaymentLinkId) {
      try {
        const existingLink = await stripe.paymentLinks.retrieve(bookingData.stripePaymentLinkId);

        // Check if link is still active and not expired
        if (existingLink.active && !existingLink.expired) {
          return NextResponse.json({
            success: true,
            message: "Existing payment link retrieved",
            paymentLink: existingLink.url,
            paymentLinkId: existingLink.id,
            expiresAt: existingLink.expires_at
              ? new Date(existingLink.expires_at * 1000).toISOString()
              : null,
          });
        }
      } catch (error) {
        // If link retrieval fails, we'll create a new one
        console.log("Existing payment link not found or invalid, creating new one");
      }
    }

    // Calculate amount to pay (full amount minus any partial payments)
    const amountDue = amount - (bookingData.paidAmount || 0);
    const confirmedTours = tours.filter((tour) => tour.status === "confirmed");

    // Validation check
    if (confirmedTours.length === 0) {
      return NextResponse.json({ error: "No confirmed tours to pay for" }, { status: 400 });
    }

    if (amount <= 0) {
      return NextResponse.json({ error: "Booking total must be greater than 0" }, { status: 400 });
    }

    // Create metadata for Stripe
    const metadata = {
      bookingId: bookingId,
      requestId: bookingData.requestId || bookingId,
      customerEmail: customerEmail || bookingData.customer.email,
      customerName: customerName || bookingData.customer.name,
      tourCount: confirmedTours.length, // ONLY confirmed tours
      confirmedToursNames: confirmedTours.map((t) => t.title).join(", "),
    };

    // Create Stripe Payment Link with 24-hour expiry
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `EY Travel Egypt - Booking #${bookingData.requestId || bookingId}`,
              description: `${bookingData.tours?.length || 0} tour(s) booking`,
              metadata: metadata,
            },
            unit_amount: Math.round(amountDue * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      after_completion: {
        type: "redirect",
        redirect: {
          url: generatePaymentSuccessLink(bookingData.requestId),
        },
      },
      customer_creation: "if_required",
      metadata: metadata,
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      // custom_fields: [
      //   {
      //     key: "passport_number",
      //     label: {
      //       type: "custom",
      //       custom: "Passport Number",
      //     },
      //     type: "text",
      //     optional: true,
      //   },
      //   {
      //     key: "special_requests",
      //     label: {
      //       type: "custom",
      //       custom: "Special Requests",
      //     },
      //     type: "text",
      //     optional: true,
      //   },
      // ],
    });

    // Update booking with payment link information
    const updateData = {
      stripePaymentLinkId: paymentLink.id,
      stripePaymentLinkUrl: paymentLink.url,
      paymentLinkExpiresAt: new Date().toISOString() + 24 * 60 * 60 * 1000,
      paymentLinkGeneratedAt: new Date().toISOString(),
      currentStep: "awaiting_payment",
      pendingPayment: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Add to log
    const paymentLinkLog = {
      timestamp: new Date().toISOString(),
      event: "payment_link_generated",
      changes: {
        amountDue: amountDue,
        paymentLinkId: paymentLink.id,
        expiresAt: new Date().toISOString() + 24 * 60 * 60 * 1000,
      },
      generatedBy: decodedToken.email || "system",
    };

    //updateData.log = admin.firestore.FieldValue.arrayUnion(paymentLinkLog);

    //await bookingRef.update(updateData);

    return NextResponse.json({
      success: true,
      message: "Payment link created successfully",
      paymentLink: paymentLink.url,
      paymentLinkId: paymentLink.id,
      expiresAt: new Date().toISOString() + 24 * 60 * 60 * 1000, // 24 hours from now
      amountDue: amountDue,
      bookingId: bookingId,
      requestId: bookingData.requestId,
      log: paymentLinkLog,
    });
  } catch (error) {
    console.error("Error creating payment link:", error);
    return NextResponse.json(
      {
        error: "Failed to create payment link",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
