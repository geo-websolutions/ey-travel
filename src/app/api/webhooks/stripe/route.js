// app/api/webhooks/stripe/route.js
import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { admin } from "@/lib/firebaseAdmin";
import { sendEmail } from "@/lib/sendEmail";
import {
  clientPaymentConfirmation,
  clientPaymentFailed,
  preparePaymentConfirmationData,
  preparePaymentFailedData,
} from "@/utils/handleEmailTemplates";

export async function POST(request) {
  const sig = request.headers.get("stripe-signature");
  let event;

  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const db = admin.firestore();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        // Handle synchronous payments (card payments that are immediately paid)
        if (session.payment_status === "paid") {
          const result = await fulfillOrder(db, session);
          if (result.success && !result.alreadyProcessed) {
            // 1. Send confirmation email
            await sendPaymentConfirmationEmailSafe(db, session, result.customerEmail);

            // 2. DEACTIVATE PAYMENT LINK (only if fully paid)
            if (result.isFullyPaid && result.paymentLinkId) {
              await deactivatePaymentLink(result.paymentLinkId);

              // Also update Firestore to mark link as deactivated
              const bookingRef = db.collection("bookings").doc(result.bookingId);
              await bookingRef.update({
                paymentLinkDeactivated: true,
                paymentLinkDeactivatedAt: new Date().toISOString(),
                paymentLinkActive: false,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
              });
            }
          }
        } else {
          // Async payment - just log it for now
          console.log(
            `Async payment initiated for session ${session.id}, status: ${session.payment_status}`
          );
          await logAsyncPaymentInitiated(db, session);
        }
        break;
      }

      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;
        const result = await fulfillOrder(db, session);
        if (result.success && !result.alreadyProcessed) {
          // 1. Send confirmation email
          await sendPaymentConfirmationEmailSafe(db, session, result.customerEmail);

          // 2. DEACTIVATE PAYMENT LINK (only if fully paid)
          if (result.isFullyPaid && result.paymentLinkId) {
            await deactivatePaymentLink(result.paymentLinkId);

            // Also update Firestore
            const bookingRef = db.collection("bookings").doc(result.bookingId);
            await bookingRef.update({
              paymentLinkDeactivated: true,
              paymentLinkDeactivatedAt: new Date().toISOString(),
              paymentLinkActive: false,
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
          }
        }
        break;
      }

      case "checkout.session.async_payment_failed": {
        const session = event.data.object;
        await handleAsyncPaymentFailed(db, session);
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;
        await handleExpiredSession(db, session);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        await handlePaymentIntentFailed(db, paymentIntent);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object;
        await handleChargeRefunded(db, charge);
        break;
      }

      case "charge.dispute.created": {
        const dispute = event.data.object;
        await handleDisputeCreated(db, dispute);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);

    // Return appropriate status based on error type
    if (
      error.message.includes("not_found") ||
      error.message.includes("already processed") ||
      error.message.includes("Already paid")
    ) {
      // Logical errors - retrying won't help
      return NextResponse.json({ error: error.message }, { status: 200 });
    } else {
      // System errors - Stripe should retry
      return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }
  }
}

// =================== CORE FULFILLMENT LOGIC ===================

async function fulfillOrder(db, session) {
  const bookingId = session.metadata?.bookingId;

  if (!bookingId) {
    throw new Error("Booking ID not found in session metadata");
  }

  return await db
    .runTransaction(async (transaction) => {
      const bookingRef = db.collection("bookings").doc(bookingId);
      const bookingDoc = await transaction.get(bookingRef);

      if (!bookingDoc.exists) {
        throw new Error("not_found");
      }

      const bookingData = bookingDoc.data();

      // IDEMPOTENCY CHECK 1: Check if this specific Stripe Session was already processed
      const processedSessions = bookingData.processedSessions || [];
      if (processedSessions.includes(session.id)) {
        return {
          success: true,
          alreadyProcessed: true,
          message: "Session already processed",
          customerEmail: bookingData.customer.email,
        };
      }

      // IDEMPOTENCY CHECK 2: Check if this payment intent was already processed
      const existingPayments = bookingData.payments || [];
      const isAlreadyProcessed = existingPayments.some(
        (p) => p.transactionId === session.payment_intent && p.status === "succeeded"
      );

      if (isAlreadyProcessed) {
        return {
          success: true,
          alreadyProcessed: true,
          message: "Payment already processed",
          customerEmail: bookingData.customer.email,
        };
      }

      // Validate booking is in correct state for payment
      if (!["confirmed", "awaiting_payment"].includes(bookingData.status)) {
        throw new Error(`Booking is not in payable state: ${bookingData.status}`);
      }

      // Check if payment is already completed
      if (bookingData.paidAmount >= bookingData.total) {
        console.log(`Booking ${bookingId} is already fully paid`);
        throw new Error("Already paid");
      }

      const amountPaid = Number((session.amount_total / 100).toFixed(2)); // Fixed floating point
      const currentPaidAmount = bookingData.paidAmount || 0;
      const newPaidAmount = currentPaidAmount + amountPaid;
      const total = bookingData.total || 0;
      const isFullyPaid = newPaidAmount >= total;

      // ========== STRIPE FEES CALCULATION ==========
      let stripeFees = 0;
      let stripeFeesCurrency = session.currency || "USD";

      // Option 1: Try to get fees from payment intent (most accurate)
      if (session.payment_intent) {
        try {
          const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent, {
            expand: ["charges.data.balance_transaction"],
          });

          if (paymentIntent.charges?.data?.[0]?.balance_transaction?.fee) {
            // Fee is in cents, convert to dollars
            stripeFees = Number(
              (paymentIntent.charges.data[0].balance_transaction.fee / 100).toFixed(2)
            );
          }
        } catch (feeError) {
          console.warn(
            `Could not retrieve fees for payment intent ${session.payment_intent}:`,
            feeError.message
          );
        }
      }

      // Option 2: If we can't get actual fees, estimate (typically 2.9% + $0.30 for cards)
      if (stripeFees === 0 && session.payment_method_types?.[0] === "card") {
        // Simple estimate: 2.9% + $0.30
        stripeFees = Number((amountPaid * 0.029 + 0.3).toFixed(2));
        console.log(
          `Using estimated Stripe fees for ${amountPaid} ${stripeFeesCurrency}: ${stripeFees}`
        );
      }
      // ========== END FEES CALCULATION ==========

      // Safely extract custom fields
      const customFields = session.custom_fields || [];
      const passportField = customFields.find((f) => f.key === "passport_number");
      const specialRequestsField = customFields.find((f) => f.key === "special_requests");

      // Get customer details
      const customerEmail =
        session.customer_details?.email || session.customer_email || bookingData.customer.email;
      const customerName = session.customer_details?.name || bookingData.customer.name;

      // Create payment record
      const paymentRecord = {
        amount: amountPaid,
        currency: session.currency?.toUpperCase() || "USD",
        paymentMethod: session.payment_method_types?.[0] || "card",
        transactionId: session.payment_intent,
        stripeSessionId: session.id,
        stripeCustomerId: session.customer,
        paymentDate: new Date().toISOString().split("T")[0],
        processedBy: "stripe_auto",
        processedAt: new Date().toISOString(),
        status: "succeeded",
        notes:
          session.payment_status === "paid"
            ? "Paid via Stripe payment link"
            : "Async payment succeeded via Stripe",
        billingDetails: {
          name: customerName,
          email: customerEmail,
          phone: session.customer_details?.phone || null,
          address: session.customer_details?.address || null,
        },
        passportNumber: passportField?.text?.value || null,
        specialRequests: specialRequestsField?.text?.value || null,
        stripeFees: stripeFees,
        stripeFeesCurrency: stripeFeesCurrency,
        netAmount: Number((amountPaid - stripeFees).toFixed(2)),
      };

      // Prepare update data
      const updateData = {
        paidAmount: newPaidAmount,
        paymentStatus: isFullyPaid ? "fully_paid" : "partially_paid",
        pendingPayment: !isFullyPaid,
        status: isFullyPaid ? "paid" : "confirmed",
        currentStep: isFullyPaid ? "payment_received" : "awaiting_payment",
        updatedAt: new Date().toISOString(),
        currency: session.currency?.toUpperCase() || "USD",
        receivedPayment: true,
        stripePaymentCompleted: true,
        stripeSessionId: session.id,
        stripeCustomerId: session.customer,
        paymentLinkUsed: true,
        paymentLinkUsedAt: new Date().toISOString(),
        stripeFees: (bookingData.stripeFees || 0) + stripeFees,
        lastStripeFees: stripeFees,
        stripeFeesCurrency: stripeFeesCurrency,
        netReceived: (bookingData.netReceived || 0) + paymentRecord.netAmount,
        lastPaymentAttempt: {
          timestamp: new Date().toISOString(),
          status: "succeeded",
          amount: amountPaid,
          sessionId: session.id,
          paymentMethod: paymentRecord.paymentMethod,
        },
      };

      // Store customer billing information
      if (session.customer_details) {
        updateData.billingInfo = {
          name: customerName,
          email: customerEmail,
          phone: session.customer_details.phone || null,
          address: session.customer_details.address || null,
        };
      }

      // Add payment received date if first payment
      if (currentPaidAmount === 0 && newPaidAmount > 0) {
        updateData.paymentReceivedAt = new Date().toISOString();
      }

      // Create log entry
      const paymentLog = {
        timestamp: new Date().toISOString(),
        event:
          session.payment_status === "paid"
            ? "stripe_payment_succeeded"
            : "async_payment_succeeded",
        changes: {
          amount: amountPaid,
          previousPaid: currentPaidAmount,
          newPaid: newPaidAmount,
          isFullyPaid,
          paymentMethod: paymentRecord.paymentMethod,
          transactionId: paymentRecord.transactionId,
          stripeSessionId: session.id,
          newStatus: updateData.status,
          currentStep: updateData.currentStep,
        },
        processedBy: "stripe_webhook",
      };

      // Update using FieldValue.arrayUnion for efficiency
      transaction.update(bookingRef, {
        ...updateData,
        processedSessions: admin.firestore.FieldValue.arrayUnion(session.id),
        payments: admin.firestore.FieldValue.arrayUnion(paymentRecord),
        log: admin.firestore.FieldValue.arrayUnion(paymentLog),
      });

      return {
        success: true,
        alreadyProcessed: false,
        customerEmail,
        bookingId,
        amountPaid,
        isFullyPaid,
        paymentLinkId: bookingData.stripePaymentLinkId, // Add this
        paymentLinkUrl: bookingData.stripePaymentLinkUrl,
      };
    })
    .catch((error) => {
      console.error(`Transaction failed for session ${session.id}:`, error.message);
      throw error;
    });
}

// =================== EMAIL HANDLING (SPAM PROTECTION) ===================

async function sendPaymentConfirmationEmailSafe(db, session, customerEmail) {
  try {
    const bookingId = session.metadata?.bookingId;
    if (!bookingId) return;

    const bookingRef = db.collection("bookings").doc(bookingId);

    // Check if email was already sent for this session
    const bookingDoc = await bookingRef.get();
    if (!bookingDoc.exists) return;

    const bookingData = bookingDoc.data();
    const emailsSent = bookingData.emailsSent || [];

    // IDEMPOTENCY: Check if payment confirmation email was already sent for this session
    if (emailsSent.includes(`payment_confirmation_${session.id}`)) {
      console.log(`Payment confirmation email already sent for session ${session.id}`);
      return;
    }

    const templatesSnapshot = await db
      .collection("emailTemplates")
      .where("name", "==", "client_payment_confirmation")
      .limit(1)
      .get();

    if (!templatesSnapshot.empty) {
      const template = templatesSnapshot.docs[0].data().html;

      const paymentDetails = {
        receivedAmount: Number((session.amount_total / 100).toFixed(2)),
        currency: session.currency?.toUpperCase() || "USD",
        paymentMethod: session.payment_method_types?.[0] || "card",
        transactionId: session.payment_intent,
        paymentDate: new Date().toISOString().split("T")[0],
        receiptNumber: session.payment_intent,
      };

      const emailData = preparePaymentConfirmationData(bookingData, paymentDetails);
      const emailHtml = clientPaymentConfirmation(template, emailData);

      await sendEmail({
        to: customerEmail,
        subject: `Payment Received - Booking ${bookingData.requestId}`,
        title: "EY Travel Egypt",
        htmlBody: emailHtml,
      });

      // Mark email as sent for this session
      await bookingRef.update({
        paymentConfirmationEmailSent: true,
        paymentConfirmationEmailSentAt: new Date().toISOString(),
        emailsSent: admin.firestore.FieldValue.arrayUnion(`payment_confirmation_${session.id}`),
      });

      console.log(
        `Payment confirmation email sent for booking ${bookingId}, session ${session.id}`
      );
    }
  } catch (emailError) {
    console.error("Error sending payment confirmation email:", emailError);
    // Don't throw - email failure shouldn't fail the webhook
  }
}

// =================== HELPER FUNCTIONS ===================

async function logAsyncPaymentInitiated(db, session) {
  const bookingId = session.metadata?.bookingId;
  if (!bookingId) return;

  const bookingRef = db.collection("bookings").doc(bookingId);

  const logEntry = {
    timestamp: new Date().toISOString(),
    event: "async_payment_initiated",
    changes: {
      stripeSessionId: session.id,
      paymentStatus: session.payment_status,
      paymentMethod: session.payment_method_types?.[0],
    },
    processedBy: "stripe_webhook",
  };

  await bookingRef.update({
    lastPaymentAttempt: {
      timestamp: new Date().toISOString(),
      status: "pending",
      sessionId: session.id,
      paymentMethod: session.payment_method_types?.[0],
    },
    log: admin.firestore.FieldValue.arrayUnion(logEntry),
  });
}

async function handleAsyncPaymentFailed(db, session) {
  const bookingId = session.metadata?.bookingId;

  if (bookingId) {
    await db
      .runTransaction(async (transaction) => {
        const bookingRef = db.collection("bookings").doc(bookingId);
        const bookingDoc = await transaction.get(bookingRef);

        if (!bookingDoc.exists) {
          throw new Error("Booking not found");
        }

        const bookingData = bookingDoc.data();
        const existingLog = bookingData.log || [];

        const logEntry = {
          timestamp: new Date().toISOString(),
          event: "async_payment_failed",
          changes: {
            stripeSessionId: session.id,
            paymentStatus: session.payment_status,
            failureReason: session.payment_intent?.last_payment_error?.message,
          },
          processedBy: "stripe_webhook",
        };

        transaction.update(bookingRef, {
          updatedAt: new Date().toISOString(),
          lastPaymentAttempt: {
            timestamp: new Date().toISOString(),
            status: "failed",
            sessionId: session.id,
            failureReason:
              session.payment_intent?.last_payment_error?.message || "Payment declined",
          },
          log: admin.firestore.FieldValue.arrayUnion(logEntry),
        });
      })
      .catch((error) => {
        console.error(`Transaction failed for async payment failed ${session.id}:`, error.message);
      });

    // Send payment failed email outside transaction
    try {
      const bookingRef = db.collection("bookings").doc(bookingId);
      const bookingDoc = await bookingRef.get();

      if (bookingDoc.exists) {
        const bookingData = bookingDoc.data();
        const emailsSent = bookingData.emailsSent || [];

        // Check if email was already sent for this session
        if (emailsSent.includes(`payment_failed_${session.id}`)) {
          console.log(`Payment failed email already sent for session ${session.id}`);
          return;
        }

        const templatesSnapshot = await db
          .collection("emailTemplates")
          .where("name", "==", "client_payment_failed")
          .limit(1)
          .get();

        if (!templatesSnapshot.empty) {
          const template = templatesSnapshot.docs[0].data().html;

          // Prepare payment failure data
          const paymentFailureDetails = {
            paymentMethod: session.payment_method_types?.[0] || "Credit Card",
            transactionId: session.payment_intent,
            failureReason:
              session.payment_intent?.last_payment_error?.message ||
              session.payment_intent?.last_payment_error?.code ||
              "Payment declined by bank",
          };

          const emailData = preparePaymentFailedData(bookingData, paymentFailureDetails);
          const emailHtml = clientPaymentFailed(template, emailData);

          await sendEmail({
            to: bookingData.customer.email,
            subject: `Payment Failed - Action Required for Booking ${bookingData.requestId}`,
            title: "EY Travel Egypt",
            htmlBody: emailHtml,
          });

          // Mark email as sent
          await bookingRef.update({
            emailsSent: admin.firestore.FieldValue.arrayUnion(`payment_failed_${session.id}`),
          });

          console.log(`Payment failed email sent for booking ${bookingId}`);
        }
      }
    } catch (emailError) {
      console.error("Error sending payment failed email:", emailError);
    }

    console.log(`Async payment failed for booking ${bookingId}`);
  }
}

async function handleExpiredSession(db, session) {
  const bookingId = session.metadata?.bookingId;
  if (!bookingId) return;

  const bookingRef = db.collection("bookings").doc(bookingId);

  const logEntry = {
    timestamp: new Date().toISOString(),
    event: "payment_session_expired",
    changes: {
      stripeSessionId: session.id,
      paymentStatus: session.payment_status,
    },
    processedBy: "stripe_webhook",
  };

  await bookingRef.update({
    paymentLinkExpired: true,
    updatedAt: new Date().toISOString(),
    lastPaymentAttempt: {
      timestamp: new Date().toISOString(),
      status: "expired",
      sessionId: session.id,
    },
    log: admin.firestore.FieldValue.arrayUnion(logEntry),
  });

  console.log(`Payment session expired for booking ${bookingId}`);
}

async function handlePaymentIntentFailed(db, paymentIntent) {
  const bookingsSnapshot = await db
    .collection("bookings")
    .where("payments.transactionId", "==", paymentIntent.id)
    .limit(1)
    .get();

  if (!bookingsSnapshot.empty) {
    const bookingDoc = bookingsSnapshot.docs[0];
    const bookingRef = bookingDoc.ref;

    const logEntry = {
      timestamp: new Date().toISOString(),
      event: "payment_intent_failed",
      changes: {
        paymentIntentId: paymentIntent.id,
        failureReason: paymentIntent.last_payment_error?.message,
        status: paymentIntent.status,
      },
      processedBy: "stripe_webhook",
    };

    await bookingRef.update({
      lastPaymentAttempt: {
        timestamp: new Date().toISOString(),
        status: "payment_intent_failed",
        paymentIntentId: paymentIntent.id,
        failureReason: paymentIntent.last_payment_error?.message,
      },
      log: admin.firestore.FieldValue.arrayUnion(logEntry),
    });

    console.log(`Payment intent failed for booking ${bookingDoc.id}`);
  }
}

async function handleChargeRefunded(db, charge) {
  const bookingsSnapshot = await db
    .collection("bookings")
    .where("payments.transactionId", "==", charge.payment_intent)
    .limit(1)
    .get();

  if (!bookingsSnapshot.empty) {
    const bookingDoc = bookingsSnapshot.docs[0];
    const bookingRef = bookingDoc.ref;

    const refundAmount = Number((charge.amount_refunded / 100).toFixed(2));

    const logEntry = {
      timestamp: new Date().toISOString(),
      event: "charge_refunded",
      changes: {
        chargeId: charge.id,
        refundAmount: refundAmount,
        refundReason: charge.refunds?.data?.[0]?.reason,
      },
      processedBy: "stripe_webhook",
    };

    await bookingRef.update({
      lastRefund: {
        timestamp: new Date().toISOString(),
        chargeId: charge.id,
        amount: refundAmount,
        reason: charge.refunds?.data?.[0]?.reason || "Unknown",
      },
      log: admin.firestore.FieldValue.arrayUnion(logEntry),
    });

    console.log(`Charge refunded for booking ${bookingDoc.id}: ${refundAmount}`);
  }
}

async function handleDisputeCreated(db, dispute) {
  const bookingsSnapshot = await db
    .collection("bookings")
    .where("payments.transactionId", "==", dispute.payment_intent)
    .limit(1)
    .get();

  if (!bookingsSnapshot.empty) {
    const bookingDoc = bookingsSnapshot.docs[0];
    const bookingRef = bookingDoc.ref;

    const logEntry = {
      timestamp: new Date().toISOString(),
      event: "dispute_created",
      changes: {
        disputeId: dispute.id,
        amount: Number((dispute.amount / 100).toFixed(2)),
        reason: dispute.reason,
        status: dispute.status,
      },
      processedBy: "stripe_webhook",
    };

    await bookingRef.update({
      dispute: {
        disputeId: dispute.id,
        created: new Date().toISOString(),
        amount: Number((dispute.amount / 100).toFixed(2)),
        reason: dispute.reason,
        status: dispute.status,
      },
      log: admin.firestore.FieldValue.arrayUnion(logEntry),
    });

    console.log(`Dispute created for booking ${bookingDoc.id}`);
  }
}

async function deactivatePaymentLink(paymentLinkId) {
  try {
    if (!paymentLinkId) {
      console.log("No payment link ID to deactivate");
      return { success: false, error: "No payment link ID" };
    }

    console.log(`Deactivating payment link: ${paymentLinkId}`);

    // Deactivate the payment link in Stripe
    const deactivatedLink = await stripe.paymentLinks.update(paymentLinkId, {
      active: false,
    });

    console.log(`Payment link ${paymentLinkId} deactivated successfully`);

    return {
      success: true,
      paymentLinkId: deactivatedLink.id,
      active: deactivatedLink.active,
      url: deactivatedLink.url,
    };
  } catch (error) {
    console.error(`Failed to deactivate payment link ${paymentLinkId}:`, error.message);

    // If the error is "payment link not found", it might already be expired/deleted
    if (error.code === "resource_missing") {
      console.log(`Payment link ${paymentLinkId} not found, might already be expired`);
      return { success: true, warning: "Payment link already expired" };
    }

    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }
}
