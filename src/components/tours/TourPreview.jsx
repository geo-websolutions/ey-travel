'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function TourPreview({ tourData }) {
  return (
    <motion.div 
      className="bg-stone-800 bg-opacity-70 rounded-lg overflow-hidden border border-stone-700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Cover Image */}
      <div className="h-64 relative">
        {tourData.media.coverImage ? (
          <Image 
            src={tourData.media.coverImage} 
            alt={tourData.basicInfo.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-stone-700 flex items-center justify-center">
            <span className="text-stone-500">No cover image set</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-stone-900 to-transparent h-32" />
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl font-bold text-white">
            {tourData.basicInfo.title || 'New Tour'}
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              {tourData.basicInfo.category || 'Uncategorized'}
            </span>
            <span className="text-stone-300 text-sm">
              {tourData.basicInfo.duration || '0'} {tourData.basicInfo.durationType || 'days'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Price Section */}
        <div className="flex justify-between items-center mb-6 pb-6 border-b border-stone-700">
          <div>
            <div className="text-3xl font-bold text-amber-400">
              ${tourData.pricing.basePrice?.toLocaleString() || '0'}
              <span className="text-sm ml-1">{tourData.pricing.currency}</span>
            </div>
            {tourData.pricing.discount?.amount > 0 && (
              <div className="text-sm text-stone-400">
                <span className="line-through mr-2">
                  ${(tourData.pricing.basePrice + tourData.pricing.discount.amount).toLocaleString()}
                </span>
                <span className="text-green-400">
                  Save ${tourData.pricing.discount.amount}
                </span>
              </div>
            )}
          </div>
          <button className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-md font-medium">
            Book Now
          </button>
        </div>

        {/* Short Description */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 text-amber-400">Overview</h2>
          <p className="text-stone-300">
            {tourData.basicInfo.shortDescription || 'No short description provided'}
          </p>
        </div>

        {/* Full Description */}
        {tourData.basicInfo.fullDescription && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3 text-amber-400">Description</h2>
            <p className="text-stone-300 whitespace-pre-line">
              {tourData.basicInfo.fullDescription}
            </p>
          </div>
        )}

        {/* Tour Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-xl font-bold mb-3 text-amber-400">Tour Details</h2>
            <ul className="space-y-2 text-stone-300">
              <li className="flex">
                <span className="w-32 text-stone-400">Difficulty:</span>
                <span>{tourData.basicInfo.difficulty ? tourData.basicInfo.difficulty.charAt(0).toUpperCase() + tourData.basicInfo.difficulty.slice(1) : 'Easy'}</span>
              </li>
              <li className="flex">
                <span className="w-32 text-stone-400">Group Size:</span>
                <span>Up to {tourData.basicInfo.maxGroupSize || '15'} people</span>
              </li>
              <li className="flex">
                <span className="w-32 text-stone-400">Minimum Age:</span>
                <span>{tourData.basicInfo.minAge || '12'} years</span>
              </li>
              {tourData.availability.startDates?.length > 0 && (
                <li className="flex">
                  <span className="w-32 text-stone-400">Next Departure:</span>
                  <span>{new Date(tourData.availability.startDates[0]).toLocaleDateString()}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Included/Excluded */}
          <div>
            <h2 className="text-xl font-bold mb-3 text-amber-400">What's Included</h2>
            <ul className="space-y-2 text-stone-300">
              {tourData.pricing.included?.map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
              {(!tourData.pricing.included || tourData.pricing.included.length === 0) && (
                <li className="text-stone-400">No inclusions specified</li>
              )}
            </ul>

            <h2 className="text-xl font-bold mb-3 mt-4 text-amber-400">Not Included</h2>
            <ul className="space-y-2 text-stone-300">
              {tourData.pricing.notIncluded?.map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {item}
                </li>
              ))}
              {(!tourData.pricing.notIncluded || tourData.pricing.notIncluded.length === 0) && (
                <li className="text-stone-400">No exclusions specified</li>
              )}
            </ul>
          </div>
        </div>

        {/* Itinerary */}
        {tourData.itinerary?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4 text-amber-400">Itinerary</h2>
            <div className="space-y-4">
              {tourData.itinerary.map((day, index) => (
                <div key={index} className="bg-stone-700 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">
                    Day {day.day}: {day.title}
                  </h3>
                  <p className="text-stone-300 mb-3">{day.description}</p>
                  {day.activities?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-stone-400 mb-2">Activities:</h4>
                      <ul className="space-y-1 text-stone-300">
                        {day.activities.map((activity, idx) => (
                          <li key={idx} className="flex">
                            <span className="mr-2">•</span>
                            {activity}
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
        {tourData.media.gallery?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-amber-400">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {tourData.media.gallery.map((image, index) => (
                <div key={index} className="aspect-square relative rounded-md overflow-hidden">
                  <Image
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}