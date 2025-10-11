'use client'
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaTimes, FaStar, FaClock, FaUsers, FaMapMarkerAlt, FaCalendarAlt, FaCheck, FaTimes as FaClose, FaListAlt, FaDotCircle, FaLanguage, FaUndo, FaHandPointRight } from 'react-icons/fa';

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

        {/* Modal Content */}
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
                priority
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/95 via-stone-900/50 to-transparent" />

            {/* Title and Pricing */}
            <div className="absolute bottom-0 left-0 w-full p-6">
              <div className="flex justify-between items-end">
                <div className="max-w-[70%]">
                  <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg mb-2">{tour.basicInfo.title}</h2>
                  <p className="text-amber-300 text-sm drop-shadow-md">{tour.basicInfo.shortDescription}</p>
                </div>

                <div className="text-right">
                  <div className="relative inline-block bg-gradient-to-br from-amber-600 to-amber-700 px-4 py-2 rounded-xl shadow-2xl border border-amber-500/30">
                    <span className="text-xl font-extrabold text-white">${tour.pricing.basePrice}</span>
                    {tour.pricing.discount.amount > 0 && (
                      <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full shadow-lg font-bold">
                        -${tour.pricing.discount.amount}
                      </div>
                    )}
                    {tour.pricing.discount.amount > 0 && (
                      <div className="text-sm text-white/70 line-through mt-1">
                        ${(tour.pricing.basePrice + tour.pricing.discount.amount).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Badge */}
            {tour.basicInfo.featured && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white text-sm font-bold px-4 py-2 rounded-full flex items-center shadow-lg border border-amber-400/30">
                <FaStar className="mr-2" size={14} /> FEATURED
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            
            {/* About This Activity Section */}
            <div className="bg-stone-800/50 rounded-xl p-6 border border-stone-700">
              <div className="flex items-center mb-4">
                <div className="w-1 h-8 bg-amber-500 rounded-full mr-3"></div>
                <h3 className="text-2xl font-bold text-white">About This Activity</h3>
              </div>
              
              <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-4 mb-6">
                {/* Duration */}
                <div className="flex items-center space-x-3 p-3 bg-stone-700/20 rounded-lg">
                  <div className="p-2 bg-amber-500/20 rounded-lg">
                    <FaClock className="text-amber-400" size={18} />
                  </div>
                  <div>
                    <p className="text-stone-400 text-sm">Duration</p>
                    <p className="text-white font-medium">{tour.basicInfo.duration} {tour.basicInfo.durationType}</p>
                    {tour.basicInfo.durationInfo && (
                      <p className="text-stone-500 text-xs mt-1">{tour.basicInfo.durationInfo}</p>
                    )}
                  </div>
                </div>

                {/* Live Tour Guide */}
                <div className="flex items-center space-x-3 p-3 bg-stone-700/20 rounded-lg">
                  <div className="p-2 bg-amber-500/20 rounded-lg">
                    <FaLanguage className="text-amber-400" size={18} />
                  </div>
                  <div>
                    <p className="text-stone-400 text-sm">Live Tour Guide</p>
                    <p className="text-white font-medium">
                      {tour.basicInfo.liveTourGuide ? 'Available' : 'Not Available'}
                    </p>
                    {tour.basicInfo.liveTourGuideLanguages && tour.basicInfo.liveTourGuideLanguages.length > 0 && (
                      <p className="text-stone-500 text-xs mt-1">
                        {tour.basicInfo.liveTourGuideLanguages.join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Free Cancellation */}
                {tour.basicInfo.freeCancellation && (
                  <div className="flex items-center space-x-3 p-3 bg-stone-700/20 rounded-lg">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                      <FaUndo className="text-amber-400" size={18} />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {tour.basicInfo.freeCancellation ? 'Free Cancellation' : 'Non-refundable'}
                      </p>
                      {tour.basicInfo.freeCancellationInfo && (
                        <p className="text-stone-500 text-xs mt-1">{tour.basicInfo.freeCancellationInfo}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Group Size */}
                <div className="flex items-center space-x-3 p-3 bg-stone-700/20 rounded-lg">
                  <div className="p-2 bg-amber-500/20 rounded-lg">
                    <FaUsers className="text-amber-400" size={18} />
                  </div>
                  <div>
                    <p className="text-stone-400 text-sm">Group Size</p>
                    <p className="text-white font-medium">Max {tour.basicInfo.maxGroupSize}</p>
                    {tour.basicInfo.minAge > 0 && (
                      <p className="text-stone-500 text-xs mt-1">Min age: {tour.basicInfo.minAge}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Highlights */}
              {tour.basicInfo.highlights && tour.basicInfo.highlights.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-amber-400 mb-3">Highlights</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {tour.basicInfo.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start space-x-3 p-2">
                        <FaHandPointRight className="text-amber-500 mt-1 flex-shrink-0" size={14} />
                        <span className="text-stone-300 text-sm">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Description */}
              <div>
                <h4 className="text-lg font-semibold text-amber-400 mb-3">Full Description</h4>
                <p className="text-stone-300 leading-relaxed">{tour.basicInfo.fullDescription}</p>
              </div>
            </div>

            {/* Included & Not Included */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Included */}
              <div className="bg-stone-800/50 rounded-xl p-6 border border-stone-700">
                <div className="flex items-center mb-4">
                  <div className="w-1 h-8 bg-green-500 rounded-full mr-3"></div>
                  <h3 className="text-xl font-bold text-white">What&apos;s Included</h3>
                </div>
                <ul className="space-y-3">
                  {tour.pricing.included.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="p-1 bg-green-500/20 rounded-full mt-0.5">
                        <FaCheck className="text-green-400" size={12} />
                      </div>
                      <span className="text-stone-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Not Included */}
              <div className="bg-stone-800/50 rounded-xl p-6 border border-stone-700">
                <div className="flex items-center mb-4">
                  <div className="w-1 h-8 bg-red-500 rounded-full mr-3"></div>
                  <h3 className="text-xl font-bold text-white">What&apos;s Not Included</h3>
                </div>
                <ul className="space-y-3">
                  {tour.pricing.notIncluded.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="p-1 bg-red-500/20 rounded-full mt-0.5">
                        <FaClose className="text-red-400" size={12} />
                      </div>
                      <span className="text-stone-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Route & Availability */}
            <div className="grid md:grid-cols-2 gap-6">
              {tour.basicInfo.destinations.length > 1 && (
                <div className="bg-stone-800/50 rounded-xl p-6 border border-stone-700">
                  <div className="flex items-center mb-4">
                    <div className="w-1 h-8 bg-blue-500 rounded-full mr-3"></div>
                    <h3 className="text-xl font-bold text-white">Route</h3>
                  </div>
                  <div className="flex items-center space-x-3 text-stone-300">
                    <FaMapMarkerAlt className="text-blue-400" />
                    <span>{tour.basicInfo.startLocation} → {tour.basicInfo.endLocation}</span>
                  </div>
                  {tour.basicInfo.destinations.length > 0 && (
                    <div className="mt-3">
                      <p className="text-stone-400 text-sm mb-2">Destinations:</p>
                      <div className="flex flex-wrap gap-2">
                        {tour.basicInfo.destinations.map((destination, index) => (
                          <span key={index} className="px-3 py-1 text-xs bg-stone-700 text-stone-300 rounded-full border border-stone-600">
                            {destination}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className={`bg-stone-800/50 rounded-xl p-6 border border-stone-700 ${tour.basicInfo.destinations.length > 1 ? '' : 'md:col-span-2'}`}>
                <div className="flex items-center mb-4">
                  <div className="w-1 h-8 bg-purple-500 rounded-full mr-3"></div>
                  <h3 className="text-xl font-bold text-white">Availability</h3>
                </div>
                <div className="flex items-center space-x-3 text-stone-300">
                  <FaCalendarAlt className="text-purple-400" />
                  <span>
                    {tour.availability.startDates.length > 0 ? (
                      <>
                        Next: {new Date(tour.availability.startDates[0]).toLocaleDateString()}
                        {tour.availability.startDates.length > 1 && (
                          <span className="text-stone-400 text-sm ml-2">
                            (+{tour.availability.startDates.length - 1} dates)
                          </span>
                        )}
                      </>
                    ) : 'Contact for availability'}
                  </span>
                </div>
                <div className="mt-3">
                  <p className="text-stone-400 text-sm">Status: 
                    <span className={`ml-2 font-medium ${
                      tour.availability.isAvailable ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {tour.availability.isAvailable ? 'Available' : 'Not Available'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Itinerary */}
            {hasItinerary && (
              <div className="bg-stone-800/50 rounded-xl p-6 border border-stone-700">
                <div className="flex items-center mb-4">
                  <div className="w-1 h-8 bg-amber-500 rounded-full mr-3"></div>
                  <h3 className="text-xl font-bold text-white">Itinerary</h3>
                </div>
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
              <div className="bg-stone-800/50 rounded-xl p-6 border border-stone-700">
                <div className="flex items-center mb-4">
                  <div className="w-1 h-8 bg-amber-500 rounded-full mr-3"></div>
                  <h3 className="text-xl font-bold text-white">Gallery</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {tour.media.gallery.slice(0, 3).map((img, index) => (
                    <div
                      key={index}
                      className="relative aspect-square overflow-hidden rounded-lg border border-stone-700 group"
                    >
                      <Image
                        src={img}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover"
                        width={300}
                        height={300}
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

            {/* CTA */}
            <button className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-amber-500/30 text-lg">
              Book Now - ${tour.pricing.basePrice}
            </button>
          </div>

          {/* Footer Tags */}
          {tour.basicInfo.tags.length > 0 && (
            <div className="bg-stone-900/80 px-6 py-4 border-t border-stone-700">
              <div className="flex flex-wrap gap-2">
                {tour.basicInfo.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 text-xs font-medium bg-stone-700 text-amber-300 rounded-full border border-stone-600">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};