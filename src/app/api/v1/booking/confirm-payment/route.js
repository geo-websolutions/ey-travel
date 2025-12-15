// app/api/v1/booking/confirm-payment/route.js
import { admin } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/sendEmail";
import {
  clientPaymentConfirmation,
  preparePaymentConfirmationData,
} from "@/utils/handleEmailTemplates";

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
    const {
      bookingId,
      requestId,
      customerEmail,
      paymentDetails,
      sendConfirmationEmail,
      markAsFullyPaid,
    } = body;

    // Validate required fields
    if (!bookingId || !paymentDetails || !paymentDetails.receivedAmount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = admin.firestore();
    const bookingRef = db.collection("bookings").doc(bookingId);
    const bookingDoc = await bookingRef.get();

    if (!bookingDoc.exists) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const bookingData = bookingDoc.data();

    if (bookingData.status !== "confirmed") {
      return NextResponse.json(
        {
          error: "Booking is not in confirmed state",
          currentStatus: bookingData.status,
          validStatuses: ["confirmed"],
        },
        { status: 400 }
      );
    }

    // Calculate new paid amount
    const currentPaidAmount = bookingData.paidAmount || 0;
    const newPaidAmount = currentPaidAmount + parseFloat(paymentDetails.receivedAmount);
    const total = bookingData.total || 0;
    const isFullyPaid = markAsFullyPaid || newPaidAmount >= total;

    // Determine new status based on payment amount
    let newStatus = bookingData.status;
    let currentStep = bookingData.currentStep;

    if (isFullyPaid) {
      // Fully paid - move to "paid" status
      newStatus = "paid";
      currentStep = "payment_received";
    } else if (newPaidAmount > 0) {
      // Partial payment - keep as "confirmed" but update payment status
      newStatus = "confirmed";
      currentStep = "awaiting_payment"; // Still waiting for full payment
    }

    // Create payment record object
    const paymentRecord = {
      amount: parseFloat(paymentDetails.receivedAmount),
      currency: paymentDetails.currency || "USD",
      paymentMethod: paymentDetails.paymentMethod,
      transactionId: paymentDetails.transactionId || null,
      receiptNumber: paymentDetails.receiptNumber || null,
      paymentDate: paymentDetails.paymentDate || new Date().toISOString().split("T")[0],
      processedBy: userRecord.email || decodedToken.email,
      processedAt: new Date().toISOString(),
      notes: paymentDetails.notes || "",
    };

    // Prepare update data
    const updateData = {
      paidAmount: newPaidAmount,
      paymentStatus: isFullyPaid ? "fully_paid" : "partially_paid",
      pendingPayment: !isFullyPaid,
      status: newStatus,
      currentStep: currentStep,
      updatedAt: new Date().toISOString(),
      paymentMethod: paymentDetails.paymentMethod,
      currency: paymentDetails.currency || "USD",
      receivedPayment: true,
    };

    // Store payment history as array
    if (!bookingData.payments || !Array.isArray(bookingData.payments)) {
      updateData.payments = [paymentRecord];
    } else {
      updateData.payments = admin.firestore.FieldValue.arrayUnion(paymentRecord);
    }

    // Add payment received date if first payment
    if (currentPaidAmount === 0 && newPaidAmount > 0) {
      updateData.paymentReceivedAt = new Date().toISOString();
    }

    // Add payment to log
    const paymentLog = {
      timestamp: new Date().toISOString(),
      event: "payment_received",
      changes: {
        amount: paymentDetails.receivedAmount,
        previousPaid: currentPaidAmount,
        newPaid: newPaidAmount,
        isFullyPaid,
        paymentMethod: paymentDetails.paymentMethod,
        transactionId: paymentDetails.transactionId,
        receiptNumber: paymentDetails.receiptNumber,
        newStatus,
        currentStep,
      },
      processedBy: userRecord.email || decodedToken.email,
    };

    updateData.log = admin.firestore.FieldValue.arrayUnion(paymentLog);

    // Send confirmation email if requested
    let emailResult = null;
    if (sendConfirmationEmail) {
      try {
        // Fetch email template
        const templatesSnapshot = await db
          .collection("emailTemplates")
          .where("name", "==", "client_payment_confirmation")
          .limit(1)
          .get();

        if (templatesSnapshot.empty) {
          console.warn("Email template 'client_payment_confirmation' not found");
        } else {
          const template = templatesSnapshot.docs[0].data().html;

          // Prepare email data
          const emailData = preparePaymentConfirmationData(
            {
              ...bookingData,
              ...updateData,
            },
            paymentDetails
          );

          // Generate email HTML
          const emailHtml = clientPaymentConfirmation(template, emailData);

          // Send email
          emailResult = await sendEmail({
            to: customerEmail,
            subject: `Payment Received - Booking ${requestId}`,
            title: "EY Travel Egypt",
            htmlBody: emailHtml,
          });

          if (emailResult.error) {
            console.error("Error sending payment confirmation email:", emailResult.error);
            updateData.paymentConfirmationEmailError = emailResult.error;
          } else {
            updateData.paymentConfirmationEmailSent = true;
            updateData.paymentConfirmationEmailSentAt = new Date().toISOString();
          }
        }
      } catch (emailError) {
        console.error("Error preparing payment email:", emailError);
        updateData.emailError = emailError.message;
      }
    }

    // Update booking in Firestore
    await bookingRef.update(updateData);

    // Return success response
    return NextResponse.json({
      success: true,
      message: isFullyPaid
        ? "Payment confirmed successfully - Booking is now fully paid"
        : "Partial payment recorded successfully",
      bookingId,
      requestId,
      paymentDetails: {
        newPaidAmount,
        previousPaidAmount: currentPaidAmount,
        totalAmount: total,
        isFullyPaid,
        remainingBalance: Math.max(0, total - newPaidAmount),
        newStatus,
        currentStep,
      },
      emailSent: emailResult && !emailResult.error,
      updatedBooking: {
        ...bookingData,
        ...updateData,
        id: bookingId,
      },
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
