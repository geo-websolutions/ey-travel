// app/api/v1/booking/schedule/route.js
import { admin } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/sendEmail";
import { clientTourScheduled, prepareTourScheduleData } from "@/utils/handleEmailTemplates";

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
    const { bookingId, tourSchedules } = body;

    // Validate required fields
    if (!bookingId || !tourSchedules || !Array.isArray(tourSchedules)) {
      return NextResponse.json(
        { error: "Missing required fields: bookingId and tourSchedules array" },
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

    // Validate booking is in correct state for scheduling
    if (bookingData.status !== "paid") {
      return NextResponse.json(
        {
          error: "Booking cannot be scheduled",
          currentStatus: bookingData.status,
          requiredStatus: "paid or confirmed",
        },
        { status: 400 }
      );
    }

    // Get valid tour IDs (confirmed and not removed)
    const validTourIds = bookingData.tours
      .filter((tour) => tour.status === "confirmed" && !tour.removedFromBooking)
      .map((tour) => tour.id || tour.tourId);

    // Validate all scheduled tours are actually confirmed
    const invalidSchedules = tourSchedules.filter(
      (schedule) => !validTourIds.includes(schedule.tourId)
    );

    if (invalidSchedules.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot schedule cancelled or removed tours",
          invalidTours: invalidSchedules.map((s) => ({
            tourId: s.tourId,
            title: s.title,
          })),
          validTourIds,
        },
        { status: 400 }
      );
    }

    // Process schedule data - only include tours that are confirmed
    const processedSchedules = tourSchedules
      .filter((schedule) => validTourIds.includes(schedule.tourId))
      .map((schedule) => {
        // Get the original tour data to preserve modifications info
        const originalTour = bookingData.tours.find((t) => (t.id || t.tourId) === schedule.tourId);

        // Determine if tour was modified
        const modifications = originalTour?.modifications || {};
        const modifications_made =
          originalTour?.modifications_made ||
          modifications.dateChanged ||
          modifications.guestsChanged;
        const guests_changed = modifications.guestsChanged || false;
        const date_changed = modifications.dateChanged || false;

        const isMultiDay = schedule.tourType === "multi_day_tour";

        let itineraryData = [];
        if (isMultiDay) {
          // Use dayItinerary for multi-day tours
          itineraryData =
            schedule.dayItinerary?.map((day) => ({
              day: day.day,
              date: day.date instanceof Date ? day.date.toISOString() : day.date,
              activities:
                day.itinerary?.map((item) => ({
                  time: item.time,
                  activity: item.activity,
                  description: item.description || "",
                })) || [],
            })) || [];
        } else {
          // Use regular itinerary for single day tours
          itineraryData =
            schedule.itinerary?.map((item) => ({
              time: item.time,
              activity: item.activity,
              description: item.description || "",
            })) || [];
        }

        return {
          tourId: schedule.tourId,
          title: schedule.title,
          date: schedule.date instanceof Date ? schedule.date.toISOString() : schedule.date,
          tourType: schedule.tourType,
          startTime: schedule.startTime || null,
          endTime: schedule.endTime || null,
          durationHours: parseInt(schedule.durationHours) || 0,
          durationDays: parseInt(schedule.durationDays) || 1,

          // Modification tracking
          modifications_made: modifications_made,
          guests_changed: guests_changed,
          date_changed: date_changed,
          original_guests: originalTour?.originalGuests || originalTour?.guests,
          guests: originalTour?.guests || schedule.guests,

          // Staff assignments
          guide: schedule.guide?.assigned
            ? {
                name: schedule.guide.name || "",
                phone: schedule.guide.phone || "",
                email: schedule.guide.email || "",
                assigned: true,
                assignedAt: new Date().toISOString(),
              }
            : null,
          driver: schedule.driver?.assigned
            ? {
                name: schedule.driver.name || "",
                phone: schedule.driver.phone || "",
                vehicle: schedule.driver.vehicle || "",
                assigned: true,
                assignedAt: new Date().toISOString(),
              }
            : null,

          // Meeting and dropoff points
          meetingPoint: {
            location: schedule.meetingPoint?.location || "",
            time: schedule.meetingPoint?.time || "",
            notes: schedule.meetingPoint?.notes || "",
          },
          dropoffPoint: {
            location: schedule.dropoffPoint?.location || "",
            time: schedule.dropoffPoint?.time || "",
            notes: schedule.dropoffPoint?.notes || "",
          },

          // Itinerary
          itinerary: itineraryData,

          // Equipment
          equipment:
            schedule.equipment?.map((item) => ({
              item: item.item,
              quantity: parseInt(item.quantity) || 1,
              notes: item.notes || "",
            })) || [],

          itineraryType: schedule.tourType === "multi_day_tour" ? "multi_day" : "single_day",
          scheduleNotes: schedule.notes || "",
          scheduledAt: new Date().toISOString(),
          scheduledBy: userRecord.email || decodedToken.email,
        };
      });

    // If no valid schedules after filtering
    if (processedSchedules.length === 0) {
      return NextResponse.json(
        {
          error: "No confirmed tours to schedule",
          message: "All tours in this booking are either cancelled or removed",
          totalTours: bookingData.tours.length,
          confirmedTours: validTourIds.length,
        },
        { status: 400 }
      );
    }

    // Merge schedule data with existing tours
    const updatedTours = bookingData.tours.map((existingTour) => {
      const isConfirmed = existingTour.status === "confirmed" && !existingTour.removedFromBooking;
      const scheduleData = processedSchedules.find(
        (schedule) => schedule.tourId === (existingTour.id || existingTour.tourId)
      );

      if (scheduleData && isConfirmed) {
        return {
          ...existingTour,
          schedule: scheduleData,
          confirmedDate: scheduleData.date,
          scheduleStatus: "scheduled",
          lastScheduledAt: new Date().toISOString(),
        };
      } else if (!isConfirmed) {
        // For cancelled/removed tours, ensure they're not scheduled
        return {
          ...existingTour,
          schedule: null, // Clear any schedule data
          scheduleStatus: "not_scheduled",
        };
      }
      return existingTour;
    });

    // Check if all confirmed tours are now scheduled
    const confirmedTours = bookingData.tours.filter(
      (t) => t.status === "confirmed" && !t.removedFromBooking
    );
    const scheduledTours = updatedTours.filter(
      (t) => t.schedule && t.status === "confirmed" && !t.removedFromBooking
    );

    const allConfirmedToursScheduled = confirmedTours.length === scheduledTours.length;
    const finalStatus = allConfirmedToursScheduled ? "scheduled" : "partially_scheduled";
    const finalStep = allConfirmedToursScheduled ? "tour_scheduled" : "tour_partially_scheduled";

    // Prepare update data
    const updateData = {
      status: finalStatus,
      currentStep: finalStep,
      tours: updatedTours,
      scheduledAt: new Date().toISOString(),
      scheduledBy: userRecord.email || decodedToken.email,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),

      // Track scheduling status
      schedulingSummary: {
        totalTours: bookingData.tours.length,
        confirmedTours: confirmedTours.length,
        scheduledTours: scheduledTours.length,
        cancelledTours: bookingData.tours.filter((t) => t.status === "cancelled").length,
        removedTours: bookingData.tours.filter((t) => t.removedFromBooking).length,
        allConfirmedScheduled: allConfirmedToursScheduled,
      },
    };

    // If partially scheduled, add warning
    if (!allConfirmedToursScheduled) {
      updateData.schedulingWarning = "Some confirmed tours were not included in schedule";
    }

    // Add to log
    const scheduleLog = {
      timestamp: new Date().toISOString(),
      event: "tour_scheduled",
      changes: {
        toursScheduled: processedSchedules.length,
        toursConfirmed: validTourIds.length,
        toursCancelled: bookingData.tours.filter((t) => t.status === "cancelled").length,
        toursRemoved: bookingData.tours.filter((t) => t.removedFromBooking).length,
        hasModifiedTours: processedSchedules.some((s) => s.modifications_made),
        hasGuide: processedSchedules.some((s) => s.guide?.assigned),
        hasDriver: processedSchedules.some((s) => s.driver?.assigned),
        tourTypes: [...new Set(processedSchedules.map((s) => s.tourType))],
        allConfirmedScheduled: allConfirmedToursScheduled,
      },
      processedBy: userRecord.email || decodedToken.email,
    };

    updateData.log = admin.firestore.FieldValue.arrayUnion(scheduleLog);

    // Send schedule confirmation email
    let emailResult = null;

    try {
      // Fetch email template
      const templatesSnapshot = await db
        .collection("emailTemplates")
        .where("name", "==", "client_tour_scheduled")
        .limit(1)
        .get();

      if (templatesSnapshot.empty) {
        console.warn("Email template 'client_tour_scheduled' not found");
      } else {
        const template = templatesSnapshot.docs[0].data().html;

        // Prepare email data - only include scheduled tours
        const scheduledBookingData = {
          ...bookingData,
          ...updateData,
          customer: bookingData.customer,
          tours: updatedTours.filter((t) => t.schedule), // Only include scheduled tours
        };

        // Prepare email data
        const emailData = prepareTourScheduleData(scheduledBookingData, processedSchedules);

        // Generate email HTML
        const emailHtml = clientTourScheduled(template, emailData);

        // Send email to client
        emailResult = await sendEmail({
          to: bookingData.customer.email,
          subject: `Tour Schedule Confirmed - Booking ${bookingData.requestId}`,
          title: "EY Travel Egypt",
          htmlBody: emailHtml,
        });

        if (emailResult.error) {
          console.error("Error sending schedule confirmation email:", emailResult.error);
          updateData.scheduleEmailError = emailResult.error;
        } else {
          updateData.scheduleEmailSent = true;
          updateData.scheduleEmailSentAt = admin.firestore.FieldValue.serverTimestamp();
        }
      }
    } catch (emailError) {
      console.error("Error preparing schedule email:", emailError);
      updateData.scheduleEmailError = emailError.message;
    }

    // Update booking in Firestore
    await bookingRef.update(updateData);

    return NextResponse.json({
      success: true,
      message: allConfirmedToursScheduled
        ? "Tour schedule confirmed successfully"
        : "Partial tour schedule confirmed - some confirmed tours were not scheduled",
      bookingId,
      requestId: bookingData.requestId,
      schedulingSummary: {
        totalTours: bookingData.tours.length,
        confirmedTours: confirmedTours.length,
        scheduledTours: scheduledTours.length,
        cancelledTours: bookingData.tours.filter((t) => t.status === "cancelled").length,
        removedTours: bookingData.tours.filter((t) => t.removedFromBooking).length,
        allConfirmedScheduled: allConfirmedToursScheduled,
      },
      scheduleDetails: {
        toursScheduled: processedSchedules.length,
        firstTourDate: processedSchedules[0]?.date,
        lastTourDate: processedSchedules[processedSchedules.length - 1]?.date,
        hasModifiedTours: processedSchedules.some((s) => s.modifications_made),
        hasGuide: processedSchedules.some((s) => s.guide?.assigned),
        hasDriver: processedSchedules.some((s) => s.driver?.assigned),
        tourTypes: [...new Set(processedSchedules.map((s) => s.tourType))],
      },
      emailSent: emailResult && !emailResult.error,
      warnings: !allConfirmedToursScheduled
        ? ["Some confirmed tours were not scheduled", "You can schedule remaining tours later"]
        : [],
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
