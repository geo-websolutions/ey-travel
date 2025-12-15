import {
  FaCalendarAlt,
  FaUsers,
  FaEye,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaExchangeAlt,
  FaCalendarDay,
  FaUserMinus,
  FaClock,
  FaComment,
  FaInfoCircle,
  FaBan,
  FaCheckCircle,
  FaCalendarCheck,
} from "react-icons/fa";

const TourCard = ({ tour, onCheckAvailability, compact = true, booking, bookingStatus }) => {
  // Safely format date
  const formattedDate = tour.date
    ? new Date(tour.date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date not set";

  // Get availability status config
  const getAvailabilityConfig = (status) => {
    const configs = {
      available: {
        label: "Available",
        color: "bg-green-500",
        textColor: "text-white",
        icon: FaCheck,
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/30",
      },
      limited: {
        label: "Limited",
        color: "bg-yellow-500",
        textColor: "text-white",
        icon: FaExclamationTriangle,
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/30",
      },
      alternative: {
        label: "Alternative Date",
        color: "bg-blue-500",
        textColor: "text-white",
        icon: FaCalendarDay,
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/30",
      },
      unavailable: {
        label: "Unavailable",
        color: "bg-red-500",
        textColor: "text-white",
        icon: FaBan,
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/30",
      },
      pending: {
        label: "Pending",
        color: "bg-gray-500",
        textColor: "text-white",
        icon: FaClock,
        bgColor: "bg-gray-500/10",
        borderColor: "border-gray-500/30",
      },
    };
    return configs[tour.availabilityStatus || "pending"] || configs.pending;
  };

  // Find feedback decision for this tour
  const getFeedbackForTour = () => {
    if (!booking?.feedbackDecisions || !Array.isArray(booking.feedbackDecisions)) {
      return null;
    }

    return booking.feedbackDecisions.find(
      (decision) => decision.tourId === tour.id || decision.tourId === tour.tourId
    );
  };

  const feedbackDecision = getFeedbackForTour();

  // Get feedback decision config
  const getFeedbackConfig = (decision) => {
    if (!decision) return null;

    const configs = {
      keep: {
        label: "Client wants to keep",
        color: "text-green-400",
        icon: FaCheckCircle,
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/30",
        description: "Tour confirmed as requested",
      },
      modify: {
        label: "Client requested modification",
        color: "text-blue-400",
        icon: FaExchangeAlt,
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/30",
        description: "Modified based on availability",
      },
      remove: {
        label: "Client wants to remove",
        color: "text-red-400",
        icon: FaTimes,
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/30",
        description: "Tour will be removed from booking",
      },
    };
    return configs[decision.decision] || null;
  };

  const availabilityConfig = getAvailabilityConfig();
  const feedbackConfig = getFeedbackConfig(feedbackDecision);
  const AvailabilityIcon = availabilityConfig.icon;
  const FeedbackIcon = feedbackConfig?.icon;

  // Check if we should show feedback details
  const showFeedback = bookingStatus === "feedback_received" && feedbackConfig;

  // Check if tour is marked for removal
  const isTourRemoved = feedbackDecision?.decision === "remove";

  // Check if we should show availability details
  const showAvailabilityDetails =
    tour.availabilityStatus &&
    (tour.availabilityStatus === "limited" ||
      tour.availabilityStatus === "alternative" ||
      tour.availabilityStatus === "unavailable");

  // Format alternative date if exists
  const getAlternativeDate = () => {
    if (tour.alternativeDate) {
      return new Date(tour.alternativeDate).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
    return null;
  };

  // Get modified details from feedback decision
  const getModifiedDetails = () => {
    if (!feedbackDecision?.modificationDetails) return [];

    const details = [];
    const mod = feedbackDecision.modificationDetails;

    if (mod.guests && mod.guests !== tour.guests) {
      details.push(`${mod.guests} guests (was ${tour.guests})`);
    }

    if (mod.date && mod.date !== tour.date) {
      const modifiedDate = new Date(mod.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      details.push(`New date: ${modifiedDate}`);
    }

    return details;
  };

  const modifiedDetails = getModifiedDetails();
  const alternativeDate = getAlternativeDate();

  // Check if this tour has client notes
  const clientNotes = feedbackDecision?.modificationDetails?.notes || tour.clientNotes;

  // Compact version (for BookingCard)
  if (compact) {
    return (
      <div
        className={`bg-stone-800/30 rounded-lg p-4 border ${availabilityConfig.borderColor} ${
          isTourRemoved
            ? "relative bg-gradient-to-r from-red-500/5 to-red-600/5 border-red-500/50"
            : ""
        }`}
      >
        <div className="flex items-start mb-3">
          {tour.image && (
            <img
              src={tour.image}
              alt={tour.title}
              className={`w-16 h-16 rounded-lg object-cover mr-3 flex-shrink-0 ${
                isTourRemoved ? "opacity-50" : ""
              }`}
            />
          )}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-1">
              <a
                href={`/destinations/tours/${tour.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <h5
                  className={`font-bold text-sm ${
                    isTourRemoved ? "text-red-300 line-through" : "text-white"
                  }`}
                >
                  {tour.title}
                </h5>
              </a>

              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${availabilityConfig.color} ${availabilityConfig.textColor} font-medium`}
                >
                  <AvailabilityIcon className="inline mr-1" size={10} />
                  {availabilityConfig.label}
                </span>
                {showFeedback && (
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${feedbackConfig.bgColor} ${feedbackConfig.color} font-medium`}
                  >
                    <FeedbackIcon className="inline mr-1" size={10} />
                    {feedbackDecision.decision}
                  </span>
                )}
              </div>
            </div>

            <div className="text-xs mb-1">
              <div className="flex items-center">
                <FaCalendarAlt
                  className={`mr-2 flex-shrink-0 ${
                    isTourRemoved ? "text-red-400" : "text-stone-400"
                  }`}
                  size={10}
                />
                <span className={isTourRemoved ? "text-red-300 line-through" : "text-stone-400"}>
                  {formattedDate}
                </span>
              </div>
            </div>

            <div className="text-xs">
              <div className="flex items-center">
                <FaUsers
                  className={`mr-2 flex-shrink-0 ${
                    isTourRemoved ? "text-red-400" : "text-stone-400"
                  }`}
                  size={10}
                />
                <span className={isTourRemoved ? "text-red-300 line-through" : "text-stone-400"}>
                  {tour.originalGuests} {tour.originalGuests === 1 ? "guest" : "guests"}
                </span>
                {feedbackDecision?.decision === "modify" &&
                  feedbackDecision.modificationDetails?.guests && (
                    <span className="ml-2 text-blue-400 font-medium">
                      → {feedbackDecision.modificationDetails.guests} guests
                    </span>
                  )}
              </div>
            </div>

            {/* Availability Details */}
            {showAvailabilityDetails && !isTourRemoved && (
              <div className="mt-2 text-xs">
                {tour.availabilityStatus === "limited" && tour.limitedPlaces && (
                  <div className="flex items-center text-yellow-400">
                    <FaExclamationTriangle className="mr-1" size={10} />
                    <span>Only {tour.limitedPlaces} places available</span>
                  </div>
                )}

                {tour.availabilityStatus === "alternative" && alternativeDate && (
                  <div className="flex items-center text-blue-400">
                    <FaCalendarDay className="mr-1" size={10} />
                    <span>Alternative: {alternativeDate}</span>
                  </div>
                )}

                {tour.availabilityStatus === "unavailable" && (
                  <div className="flex items-center text-red-400">
                    <FaBan className="mr-1" size={10} />
                    <span>Not available on requested date</span>
                  </div>
                )}
              </div>
            )}

            {/* Client Notes */}
            {clientNotes && (
              <div className="mt-2 pt-2 border-t border-stone-700">
                <div className="flex items-start text-xs">
                  <FaComment className="text-stone-500 mr-1 mt-0.5 flex-shrink-0" size={10} />
                  <p className="text-stone-400 italic">"{clientNotes}"</p>
                </div>
              </div>
            )}
          </div>

          <div className="text-right ml-3">
            <div
              className={`text-lg font-bold ${
                isTourRemoved ? "line-through text-red-400" : "text-amber-400"
              }`}
            >
              ${tour.calculatedPrice?.toLocaleString() || "0"}
            </div>
            <div className={`text-xs ${isTourRemoved ? "text-red-400" : "text-stone-400"}`}>
              {isTourRemoved ? "Removed from total" : "Tour price"}
            </div>
            {isTourRemoved && (
              <div className="text-xs text-green-400 font-medium mt-1">
                -${tour.calculatedPrice?.toLocaleString() || "0"}
              </div>
            )}
            {feedbackDecision?.decision === "modify" &&
              tour.availabilityStatus === "limited" &&
              feedbackDecision.modificationDetails?.guests && (
                <div className="text-xs text-blue-400">
                  Modified guests: {feedbackDecision.modificationDetails.guests}
                </div>
              )}
          </div>
        </div>

        {/* Feedback Decision Details */}
        {showFeedback && (
          <div
            className={`mt-3 p-2 rounded ${feedbackConfig.bgColor} border ${feedbackConfig.borderColor}`}
          >
            <div className="flex items-start">
              <FeedbackIcon className={`mt-0.5 mr-2 ${feedbackConfig.color}`} size={12} />
              <div className="text-xs">
                <div className={`font-medium ${feedbackConfig.color}`}>{feedbackConfig.label}</div>

                {isTourRemoved ? (
                  <div className="mt-1 text-red-300">
                    <div className="flex items-center">
                      <FaTimes className="mr-1" size={10} />
                      <span>Tour will be removed from final booking</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {feedbackDecision?.decision === "modify" && modifiedDetails.length > 0 && (
                      <div className="mt-1 text-stone-300">
                        {modifiedDetails.map((detail, index) => (
                          <div key={index} className="text-blue-400">
                            • {detail}
                          </div>
                        ))}
                      </div>
                    )}
                    {tour.availabilityNotes && (
                      <div className="text-stone-400 mt-1">
                        Admin notes: {tour.availabilityNotes}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Expanded version (for standalone use) - I'll just show the key changes needed
  return (
    <div
      className={`bg-gradient-to-br from-stone-800/40 to-stone-900/40 rounded-xl border ${
        availabilityConfig.borderColor
      } p-5 mb-4 ${
        isTourRemoved
          ? "relative bg-gradient-to-r from-red-500/5 to-red-600/5 border-red-500/50"
          : ""
      }`}
    >
      {/* Removed Tour Indicators */}

      {/* Tour Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          {tour.image && (
            <img
              src={tour.image}
              alt={tour.title}
              className={`w-20 h-20 rounded-lg object-cover flex-shrink-0 ${
                isTourRemoved ? "opacity-50" : ""
              }`}
            />
          )}
          <div>
            <a href={`/destinations/tours/${tour.slug}`} target="_blank" rel="noopener noreferrer">
              <h3
                className={`text-xl font-bold mb-2 ${
                  isTourRemoved ? "text-red-300 line-through" : "text-white"
                }`}
              >
                {tour.title}
              </h3>
            </a>

            <div className="flex items-center gap-3">
              <div
                className={`px-3 py-1 rounded-full ${availabilityConfig.color} ${availabilityConfig.textColor} font-medium`}
              >
                <AvailabilityIcon className="inline mr-2" size={14} />
                {availabilityConfig.label}
              </div>
              {showFeedback && (
                <div
                  className={`px-3 py-1 rounded-full ${feedbackConfig.bgColor} ${feedbackConfig.color} font-medium`}
                >
                  <FeedbackIcon className="inline mr-2" size={14} />
                  Client: {feedbackDecision.decision}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div
            className={`text-2xl font-bold ${
              isTourRemoved ? "line-through text-red-400" : "text-amber-400"
            }`}
          >
            ${tour.calculatedPrice?.toLocaleString() || "0"}
          </div>
          <div className={`text-sm ${isTourRemoved ? "text-red-400" : "text-stone-400"}`}>
            {isTourRemoved ? "Removed from total" : "Tour price"}
          </div>
          {isTourRemoved && (
            <div className="text-sm text-green-400 font-medium mt-1">
              -${tour.calculatedPrice?.toLocaleString() || "0"} deduction
            </div>
          )}
        </div>
      </div>

      {/* Feedback Decision Banner - Always show for feedback_received status */}
      {showFeedback && (
        <div
          className={`mb-4 p-4 rounded-lg ${feedbackConfig.bgColor} border ${feedbackConfig.borderColor}`}
        >
          <div className="flex items-start">
            <FeedbackIcon className={`mt-1 mr-3 ${feedbackConfig.color}`} size={18} />
            <div className="flex-1">
              <h4 className={`font-bold text-lg ${feedbackConfig.color} mb-2`}>
                Client Feedback: {feedbackDecision.decision.toUpperCase()}
              </h4>
              <p className="text-stone-300 mb-3">{feedbackConfig.description}</p>

              {isTourRemoved ? (
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <div className="flex items-center text-red-300 mb-2">
                    <FaTimes className="mr-2" />
                    <span className="font-bold">Tour Removal Confirmed</span>
                  </div>
                  <div className="text-sm text-red-200 space-y-1">
                    <div>• This tour will not be included in the final booking</div>
                    <div>
                      • ${tour.calculatedPrice?.toLocaleString() || "0"} will be deducted from the
                      total
                    </div>
                    {clientNotes && (
                      <div className="mt-2">
                        <div className="text-xs text-red-300 mb-1">Client's reason:</div>
                        <p className="text-red-200 italic">"{clientNotes}"</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  {modifiedDetails.length > 0 && (
                    <div className="mb-3">
                      <div className="text-sm text-stone-400 mb-2">Client Requested Changes:</div>
                      <ul className="list-disc list-inside text-sm text-stone-300 space-y-1">
                        {modifiedDetails.map((detail, index) => (
                          <li key={index} className="text-blue-300">
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {clientNotes && (
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <div className="text-sm text-blue-300 mb-1">Client Notes:</div>
                      <p className="text-blue-200 italic">"{clientNotes}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tour Details Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-3">
          {/* Date Information */}
          <div className="bg-stone-800/50 rounded-lg p-3">
            <div className="flex items-center text-stone-400 mb-2">
              <FaCalendarAlt className="mr-2" />
              <span className="text-sm">Date Information</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-stone-400">Requested:</span>
                <span className={isTourRemoved ? "line-through text-red-300" : "text-white"}>
                  {formattedDate}
                </span>
              </div>
              {tour.availabilityStatus === "alternative" && alternativeDate && !isTourRemoved && (
                <div className="flex justify-between">
                  <span className="text-stone-400">Available:</span>
                  <span className="text-blue-300 font-medium">{alternativeDate}</span>
                </div>
              )}
              {feedbackDecision?.decision === "modify" &&
                feedbackDecision.modificationDetails?.date &&
                !isTourRemoved && (
                  <div className="flex justify-between">
                    <span className="text-stone-400">Modified to:</span>
                    <span className="text-green-300 font-medium">
                      {new Date(feedbackDecision.modificationDetails.date).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                )}
            </div>
          </div>

          {/* Guest Information */}
          <div className="bg-stone-800/50 rounded-lg p-3">
            <div className="flex items-center text-stone-400 mb-2">
              <FaUsers className="mr-2" />
              <span className="text-sm">Guest Information</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-stone-400">Requested:</span>
                <span className={isTourRemoved ? "line-through text-red-300" : "text-white"}>
                  {tour.guests} {tour.guests === 1 ? "guest" : "guests"}
                </span>
              </div>
              {tour.availabilityStatus === "limited" && tour.limitedPlaces && !isTourRemoved && (
                <div className="flex justify-between">
                  <span className="text-stone-400">Available Places:</span>
                  <span className="text-yellow-300 font-medium">{tour.limitedPlaces}</span>
                </div>
              )}
              {feedbackDecision?.decision === "modify" &&
                feedbackDecision.modificationDetails?.guests &&
                !isTourRemoved && (
                  <div className="flex justify-between">
                    <span className="text-stone-400">Modified to:</span>
                    <span className="text-green-300 font-medium">
                      {feedbackDecision.modificationDetails.guests}{" "}
                      {feedbackDecision.modificationDetails.guests === 1 ? "guest" : "guests"}
                    </span>
                  </div>
                )}
              {isTourRemoved && (
                <div className="mt-2 pt-2 border-t border-stone-700">
                  <div className="flex items-center text-red-300">
                    <FaUserMinus className="mr-2" />
                    <span className="font-medium">Tour marked for removal</span>
                  </div>
                  <div className="text-xs text-stone-400 mt-1">
                    Will be excluded from final booking
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          {/* Status Details */}
          <div className="bg-stone-800/50 rounded-lg p-3">
            <div className="flex items-center text-stone-400 mb-2">
              <FaInfoCircle className="mr-2" />
              <span className="text-sm">Status Details</span>
            </div>
            <div className="space-y-2">
              {tour.availabilityStatus === "limited" && tour.limitedPlaces && !isTourRemoved && (
                <div className="text-yellow-400 text-sm">
                  Limited capacity - only {tour.limitedPlaces} of {tour.guests} requested places
                  available
                </div>
              )}

              {tour.availabilityStatus === "alternative" && alternativeDate && !isTourRemoved && (
                <div className="text-blue-400 text-sm">
                  Available on alternative date: {alternativeDate}
                </div>
              )}

              {tour.availabilityStatus === "unavailable" && !isTourRemoved && (
                <div className="text-red-400 text-sm">Tour not available on the requested date</div>
              )}

              {tour.availabilityStatus === "available" && !isTourRemoved && (
                <div className="text-green-400 text-sm">Tour available as requested</div>
              )}

              {isTourRemoved && (
                <div className="text-red-400 text-sm">
                  Client has chosen to remove this tour from the booking
                </div>
              )}
            </div>
          </div>

          {/* Notes Section */}
          {(tour.availabilityNotes || clientNotes) && !isTourRemoved && (
            <div className="bg-stone-800/50 rounded-lg p-3">
              <div className="flex items-center text-stone-400 mb-2">
                <FaComment className="mr-2" />
                <span className="text-sm">Notes</span>
              </div>
              <div className="space-y-2">
                {tour.availabilityNotes && (
                  <div>
                    <div className="text-xs text-stone-500 mb-1">Admin Notes:</div>
                    <p className="text-stone-300 text-sm">{tour.availabilityNotes}</p>
                  </div>
                )}
                {clientNotes && (
                  <div>
                    <div className="text-xs text-stone-500 mb-1">Client Notes:</div>
                    <p className="text-stone-300 text-sm italic">"{clientNotes}"</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourCard;
