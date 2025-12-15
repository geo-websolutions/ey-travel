"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  FaStar,
  FaClock,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCheck,
  FaTimes,
  FaArrowLeft,
  FaExpand,
} from "react-icons/fa";
import GalleryModal from "@/components/tours/TourGalleryModal";
import Link from "next/link";
import { useTours } from "@/context/TourContext";
import { useCart } from "@/context/CartContext";
import { BookingModal } from "@/components/tours/BookingModal";
import { useRouter } from "next/navigation";

// Main Tour Detail Page Component
export default function TourDetailPage({}) {
  const params = useParams();
  const slug = params.destination;
  const { tours } = useTours();
  const { addToCart, updateUserInfo, userInfo } = useCart();
  const [error, setError] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const router = useRouter();

  if (!slug || tours.find((tour) => tour.basicInfo.slug === slug) === undefined) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Tour Not Found</h1>
          <p>{error}</p>
          <Link
            href="/destinations"
            className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Tours
          </Link>
        </div>
      </div>
    );
  }

  const tour = tours.find((tour) => tour.basicInfo.slug === slug);

  const getStartingPrice = () => {
    // Add safety checks
    if (
      !tour.pricing?.groupPrices ||
      !Array.isArray(tour.pricing.groupPrices) ||
      tour.pricing.groupPrices.length === 0
    ) {
      return { price: 0, perPerson: false };
    }

    // Filter out groups with price > 0 to find actual minimum
    const validGroups = tour.pricing.groupPrices.filter(
      (group) => typeof group.price === "number" && group.price > 0
    );

    if (validGroups.length === 0) {
      return { price: 0, perPerson: false };
    }

    // Find minimum price
    const minPriceGroup = validGroups.reduce((min, group) =>
      group.price < min.price ? group : min
    );

    return {
      price: minPriceGroup.price,
      perPerson: minPriceGroup.perPerson,
    };
  };

  const startingPrice = getStartingPrice();

  const handleAddToCart = async (bookingData) => {
    // Destructure bookingData to match CartContext.addToCart signature
    const { tour, userSelections, contactInfo, priceInfo } = bookingData;

    // Pass only tour and userSelections to addToCart
    addToCart(tour, userSelections);
    updateUserInfo(contactInfo);

    // Optionally update user info in cart context if you want to store contact info
    // updateUserInfo(contactInfo);
  };

  const handleDirectBook = async (bookingData) => {
    // Redirect to reservation page or handle direct booking
    const { tour, userSelections, contactInfo, priceInfo } = bookingData;

    // Pass only tour and userSelections to addToCart
    addToCart(tour, userSelections);
    updateUserInfo(contactInfo);

    router.push("/booking");
  };

  const openGallery = (index) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Tour Not Found</h1>
          <p>{error}</p>
          <Link
            href="/destinations"
            className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Tours
          </Link>
        </div>
      </div>
    );
  }

  const hasItinerary =
    tour.itinerary && tour.itinerary.length > 0 && tour.itinerary[0].title !== "";
  const hasGallery = tour.media.gallery && tour.media.gallery.length > 0;

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100">
      {/* Hero Section - Fixed positioning */}
      <div className="relative h-96 w-full overflow-hidden">
        {tour.media.coverImage ? (
          <Image
            src={tour.media.coverImage}
            alt={tour.basicInfo.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-stone-800 to-stone-700"></div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-6 z-20">
          <div className="max-w-6xl mx-auto">
            <Link
              href="/destinations"
              className="inline-flex items-center text-sm text-stone-300 hover:text-white mb-4 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Tours
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                  {tour.basicInfo.title}
                </h1>
                <p className="text-amber-300 mt-2 text-lg drop-shadow-md">
                  {tour.basicInfo.shortDescription}
                </p>
              </div>

              <div className="hidden flex-col items-end">
                <div className="relative inline-block bg-gradient-to-br from-amber-500 to-amber-600 px-6 py-3 rounded-xl shadow-lg">
                  <span className="text-3xl font-bold text-white">
                    {tour.pricing.basePrice !== undefined ? (
                      `$${tour.pricing.basePrice}`
                    ) : (
                      <>
                        <div className="text-sm text-amber-200 mb-1">Starting from</div>
                        <span className="text-2xl font-bold text-white">
                          ${startingPrice.price.toLocaleString()}
                        </span>
                        <div className="text-xs text-amber-200 mt-1">
                          {startingPrice.perPerson ? "per person" : "total for group"}
                        </div>
                      </>
                    )}
                  </span>
                  {tour.pricing.discount.amount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full shadow">
                      -${tour.pricing.discount.amount}
                    </div>
                  )}
                </div>
                {tour.pricing.discount.amount > 0 && (
                  <div className="text-stone-400 text-sm line-through mt-1">
                    ${(tour.pricing.basePrice + tour.pricing.discount.amount).toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {tour.basicInfo.featured && (
          <div className="absolute top-6 left-6 bg-gradient-to-r from-amber-600 to-amber-500 text-white text-sm font-bold px-4 py-2 rounded-full flex items-center shadow-lg z-20">
            <FaStar className="mr-2" size={14} /> FEATURED
          </div>
        )}
      </div>

      {/* Main Content - Removed negative margin */}
      <div className="max-w-6xl mx-auto px-4 py-8 relative">
        <div className="bg-stone-800 rounded-xl shadow-xl overflow-hidden">
          {/* Meta Info Bar */}
          <div className="p-6 border-b border-stone-700 flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <FaClock className="text-amber-400 text-lg" />
              </div>
              <div>
                <p className="text-sm text-stone-400">Duration</p>
                <p className="font-medium">{`${tour.basicInfo.duration} ${tour.basicInfo.durationType}`}</p>
              </div>
            </div>

            {tour.basicInfo.destinations.length > 1 && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <FaMapMarkerAlt className="text-amber-400 text-lg" />
                </div>
                <div>
                  <p className="text-sm text-stone-400">Route</p>
                  <p className="font-medium">
                    {tour.basicInfo.startLocation} → {tour.basicInfo.endLocation}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <FaCalendarAlt className="text-amber-400 text-lg" />
              </div>
              <div>
                <p className="text-sm text-stone-400">Next Available</p>
                <p className="font-medium">
                  {tour.availability.startDates.length > 0
                    ? new Date(tour.availability.startDates[0]).toLocaleDateString()
                    : "Contact us"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-amber-400 mb-4">Tour Overview</h2>
                <p className="text-stone-300 leading-relaxed">{tour.basicInfo.fullDescription}</p>
              </div>

              {/* Itinerary */}
              {hasItinerary && (
                <div>
                  <h2 className="text-2xl font-bold text-amber-400 mb-4">Itinerary</h2>
                  <div className="space-y-4">
                    {tour.itinerary.map((day, index) => (
                      <div
                        key={index}
                        className="bg-stone-700/40 p-5 rounded-xl border border-stone-600"
                      >
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-white">
                            Day {day.day}: {day.title}
                          </h3>
                          {day.description && (
                            <p className="text-stone-300 mt-2">{day.description}</p>
                          )}
                        </div>

                        {day.activities && day.activities.length > 0 && (
                          <div>
                            <h4 className="text-amber-300 font-medium mb-2">Activities:</h4>
                            <ul className="space-y-2">
                              {day.activities.map((activity, activityIndex) => (
                                <li key={activityIndex} className="flex items-start">
                                  <span className="flex items-center justify-center w-5 h-5 bg-amber-500/20 rounded-full mr-3 mt-0.5 shrink-0">
                                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                                  </span>
                                  <span className="text-stone-300">{activity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {hasGallery && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-amber-400">Gallery</h2>
                    {tour.media.gallery.length > 3 && (
                      <button
                        onClick={() => openGallery(0)}
                        className="text-sm text-amber-400 hover:text-amber-300 flex items-center cursor-pointer"
                      >
                        View all ({tour.media.gallery.length}){" "}
                        <FaExpand className="ml-1" size={12} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {tour.media.gallery.slice(0, 3).map((img, index) => (
                      <div
                        key={index}
                        className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
                        onClick={() => openGallery(index)}
                      >
                        <Image
                          src={img}
                          alt={`Gallery image ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <FaExpand className="text-white text-xl" />
                          </div>
                        </div>

                        {index === 2 && tour.media.gallery.length > 3 && (
                          <div className="absolute inset-0 bg-stone-900/70 flex items-center justify-center">
                            <span className="text-white font-medium">
                              +{tour.media.gallery.length - 3} more
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Booking Card */}
              <div className="bg-gradient-to-br from-stone-800/80 to-stone-900/80 backdrop-blur-sm rounded-2xl border border-amber-500/20 p-6 shadow-2xl shadow-amber-900/10">
                <div className="flex items-center mb-6">
                  <div className="w-1.5 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full mr-3"></div>
                  <h3 className="text-xl font-bold text-white">Book This Tour</h3>
                  {tour.basicInfo.featured && (
                    <span className="ml-3 px-3 py-1 bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 text-xs font-semibold rounded-full border border-amber-500/30">
                      Featured
                    </span>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Pricing Section */}
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-stone-900/60 to-stone-800/60 p-5 border border-stone-700">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/5 to-transparent rounded-full -translate-y-6 translate-x-6"></div>

                    {tour.pricing.basePrice !== undefined ? (
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-stone-400 text-sm">Price per person</p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-3xl font-bold text-amber-400">
                                ${tour.pricing.basePrice}
                              </span>
                              {tour.pricing.discount.amount > 0 && (
                                <span className="text-lg text-stone-400 line-through">
                                  $
                                  {(tour.pricing.basePrice + tour.pricing.discount.amount).toFixed(
                                    2
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                          {tour.pricing.discount.amount > 0 && (
                            <div className="bg-gradient-to-r from-red-600 to-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                              Save ${tour.pricing.discount.amount}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="relative z-10">
                        <div className="text-center mb-4">
                          <div className="inline-flex items-center justify-center px-4 py-1.5 bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-full mb-3">
                            <span className="text-amber-300 text-sm font-medium">
                              Starting from
                            </span>
                          </div>

                          <div className="flex items-baseline justify-center gap-2 mb-2">
                            <span className="text-4xl font-bold text-white">
                              ${startingPrice.price.toLocaleString()}
                            </span>
                            <div className="text-right">
                              <div className="text-xs text-amber-300">
                                {startingPrice.perPerson ? "per person" : "total for group"}
                              </div>
                              {tour.pricing.discount.amount > 0 && (
                                <div className="text-lg text-stone-400 line-through">
                                  ${(startingPrice.price + tour.pricing.discount.amount).toFixed(2)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {tour.pricing.discount.amount > 0 && (
                          <div className="flex justify-center">
                            <div className="flex items-center bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 rounded-full px-4 py-1.5">
                              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse mr-2"></div>
                              <span className="text-red-300 text-sm font-medium">
                                Save ${tour.pricing.discount.amount}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="group relative w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:via-amber-500 hover:to-amber-400 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-amber-500/30 overflow-hidden cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <span className="relative flex items-center justify-center text-lg">
                      Check Availability & Book
                      <svg
                        className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </span>
                  </button>

                  {/* Additional Info */}
                  <div className="space-y-3">
                    {tour.basicInfo.freeCancellation && (
                      <div className="flex items-center p-3 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg border border-green-500/20">
                        <div className="w-8 h-8 flex items-center justify-center bg-green-500/20 rounded-lg mr-3">
                          <svg
                            className="w-4 h-4 text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-green-300 font-medium text-sm">Free Cancellation</p>
                          {tour.basicInfo.freeCancellationInfo && (
                            <p className="text-stone-400 text-xs">
                              {tour.basicInfo.freeCancellationInfo}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {tour.basicInfo.liveTourGuide && (
                      <div className="flex items-center p-3 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg border border-blue-500/20">
                        <div className="w-8 h-8 flex items-center justify-center bg-blue-500/20 rounded-lg mr-3">
                          <svg
                            className="w-4 h-4 text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10H11z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-blue-300 font-medium text-sm">Live Tour Guide</p>
                          {tour.basicInfo.liveTourGuideLanguages?.length > 0 && (
                            <p className="text-stone-400 text-xs">
                              Available in: {tour.basicInfo.liveTourGuideLanguages.join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="text-center pt-2">
                      <a
                        href="#"
                        className="inline-flex items-center text-sm text-amber-400 hover:text-amber-300 transition-colors group"
                      >
                        <span>Have questions? Contact us</span>
                        <svg
                          className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Included/Excluded */}
              <div className="bg-stone-700/50 p-5 rounded-xl border border-stone-600">
                <h3 className="text-xl font-bold text-white mb-4">What&apos;s Included</h3>

                <ul className="space-y-3">
                  {tour.pricing.included.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <FaCheck className="text-amber-400 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-stone-300">{item}</span>
                    </li>
                  ))}
                </ul>

                {tour.pricing.notIncluded.length > 0 && (
                  <>
                    <h3 className="text-xl font-bold text-white mt-6 mb-4">Not Included</h3>
                    <ul className="space-y-3">
                      {tour.pricing.notIncluded.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <FaTimes className="text-red-400 mt-1 mr-3 flex-shrink-0" />
                          <span className="text-stone-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {/* Tags */}
              {tour.basicInfo.tags.length > 0 && (
                <div className="bg-stone-700/50 p-5 rounded-xl border border-stone-600">
                  <h3 className="text-xl font-bold text-white mb-4">Tour Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tour.basicInfo.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm font-medium bg-stone-600 text-amber-300 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          tour={tour}
          onClose={() => setShowBookingModal(false)}
          onAddToCart={handleAddToCart}
          onDirectBook={handleDirectBook}
          existingUserInfo={userInfo}
        />
      )}

      {/* Gallery Modal */}
      {galleryOpen && (
        <GalleryModal
          images={tour.media.gallery}
          initialIndex={galleryIndex}
          onClose={() => setGalleryOpen(false)}
        />
      )}
    </div>
  );
}
