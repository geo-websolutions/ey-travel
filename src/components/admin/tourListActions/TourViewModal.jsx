'use client'
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaTimes, FaStar, FaClock, FaUsers, FaMapMarkerAlt, FaCalendarAlt, FaCheck, FaTimes as FaClose, FaListAlt, FaDotCircle } from 'react-icons/fa';

export const TourViewModal = ({ tour, onClose }) => {

  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!tour) return null;

  const hasItinerary = tour.itinerary && tour.itinerary.length > 0 && tour.itinerary[0].title !== '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-stone-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-stone-700 shadow-2xl"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-stone-700/50 hover:bg-stone-600 rounded-full transition-colors"
        >
          <FaTimes className="text-stone-300" />
        </button>

        {/* Modal Content - Reusing TourPreview layout */}
        <div className="space-y-6">
          {/* Hero Section */}
          <div className="relative h-64 w-full group overflow-hidden">
            {tour.media.coverImage && (
              <Image
                src={tour.media.coverImage}
                alt={tour.basicInfo.title}
                className="w-full h-full object-cover"
                width={1200}  
                height={800} 
                priority    // Optional: for above-the-fold images
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent" />

            {/* Title and Pricing */}
            <div className="absolute bottom-0 left-0 w-full p-6">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">{tour.basicInfo.title}</h2>
                  <p className="text-amber-300 mt-1 text-sm md:text-base drop-shadow-md">{tour.basicInfo.shortDescription}</p>
                </div>

                <div className="text-right">
                  <div className="relative inline-block bg-gradient-to-br from-amber-500 to-amber-600 px-3 py-1 md:px-4 md:py-2 rounded-lg shadow-lg">
                    <span className="text-lg md:text-xl font-extrabold text-white">${tour.pricing.basePrice}</span>
                    {tour.pricing.discount.amount > 0 && (
                      <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full shadow">
                        -${tour.pricing.discount.amount}
                      </div>
                    )}
                    {tour.pricing.discount.amount > 0 && (
                      <div className="text-xs text-white/70 line-through">
                        ${(tour.pricing.basePrice + tour.pricing.discount.amount).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Badge */}
            {tour.basicInfo.featured && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-lg">
                <FaStar className="mr-1.5" size={10} /> FEATURED
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Meta Info */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center space-x-2 bg-stone-700/50 px-3 py-1.5 rounded-full text-xs">
                <FaClock size={10} />
                <span>{`${tour.basicInfo.duration} ${tour.basicInfo.durationType}`}</span>
              </div>
              <div className="flex items-center space-x-2 bg-stone-700/50 px-3 py-1.5 rounded-full text-xs">
                <FaUsers size={10} />
                <span>{`Max ${tour.basicInfo.maxGroupSize}`}</span>
              </div>
              <div className="bg-stone-700/50 px-3 py-1.5 rounded-full text-xs">
                {tour.basicInfo.category}
              </div>
            </div>

            {/* About */}
            <div>
              <h3 className="text-lg font-semibold text-amber-400 mb-2">About This Tour</h3>
              <p className="text-stone-300">{tour.basicInfo.fullDescription}</p>
            </div>

            {/* Route & Availability */}
            <div className="grid md:grid-cols-2 gap-4">
              {tour.basicInfo.destinations.length > 1 && (
                <div className="flex items-start space-x-3 bg-stone-800/40 p-3 rounded-lg border border-stone-700">
                  <div className="bg-amber-500/20 p-2 rounded-lg">
                    <FaMapMarkerAlt className="text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-1">Route</h4>
                    <p className="text-stone-300 text-sm">
                      {tour.basicInfo.startLocation} → {tour.basicInfo.endLocation}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start space-x-3 bg-stone-800/40 p-3 rounded-lg border border-stone-700">
                <div className="bg-amber-500/20 p-2 rounded-lg">
                  <FaCalendarAlt className="text-amber-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Availability</h4>
                  <p className="text-stone-300 text-sm">
                    {tour.availability.startDates.length > 0 ? (
                      <>
                        Next: {new Date(tour.availability.startDates[0]).toLocaleDateString()}
                        {tour.availability.startDates.length > 1 && (
                          <span> (+{tour.availability.startDates.length - 1} dates)</span>
                        )}
                      </>
                    ) : 'Contact for availability'}
                  </p>
                </div>
              </div>
            </div>

            {/* Included */}
            {tour.pricing.included.length > 0 && (
              <div className="bg-stone-800/40 p-4 rounded-lg border border-stone-700 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-2">What's Included</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {tour.pricing.included.map((item, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <FaCheck className="text-amber-400 mt-1" />
                        <span className="text-stone-300 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {tour.pricing.notIncluded.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-rose-400 mb-2">What's Not Included</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {tour.pricing.notIncluded.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <FaClose className="text-rose-400 mt-1" />
                          <span className="text-stone-300 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Itinerary */}
            {hasItinerary && (
              <div>
                <h3 className="text-lg font-semibold text-amber-400 mb-2">Itinerary</h3>
                <ul className="space-y-4">
                  {tour.itinerary.map((day, index) => (
                    <li key={index} className="bg-stone-700/40 p-4 rounded-lg border border-stone-600">
                      <div className="mb-3">
                        <p className="text-white font-semibold text-lg">Day {day.day}: {day.title}</p>
                        {day.description && (
                          <pre className="text-stone-400 text-wrap text-sm font-sans mt-1">{day.description}</pre>
                        )}
                      </div>
                      
                      {/* Activities Section */}
                      {day.activities && day.activities.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-amber-300 font-medium text-sm flex items-center">
                            <FaListAlt className="mr-2" /> Activities:
                          </h4>
                          <ul className="space-y-2 pl-4">
                            {day.activities.map((activity, activityIndex) => (
                              <li key={activityIndex} className="flex items-start">
                                <span className="flex items-center justify-center w-5 h-5 bg-amber-500/20 rounded-full mr-2 mt-0.5 shrink-0">
                                  <FaDotCircle className="text-amber-400" size={8} />
                                </span>
                                <div>
                                  <p className="text-white text-sm">{activity}</p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Gallery */}
            {tour.media.gallery.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-amber-400 mb-2">Gallery</h3>
                <div className="grid grid-cols-3 gap-2">
                  {tour.media.gallery.slice(0, 3).map((img, index) => (
                    <div
                      key={index}
                      className="relative aspect-auto overflow-hidden rounded-lg border border-stone-700 group"
                    >
                      <Image
                        src={img}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover"
                        width={900}
                        height={600}
                      />
                      {index === 2 && tour.media.gallery.length > 3 && (
                        <div className="absolute inset-0 bg-stone-900/70 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
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

          {/* Footer Tags */}
          {tour.basicInfo.tags.length > 0 && (
            <div className="bg-stone-900/80 px-6 py-4 border-t border-stone-700 flex flex-wrap gap-2">
              {tour.basicInfo.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 text-xs font-medium bg-stone-700 text-amber-300 rounded-full border border-stone-600">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};