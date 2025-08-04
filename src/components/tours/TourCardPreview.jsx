'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function TourCardPreview({ tourData }) {
  return (
    <motion.div 
      className="bg-stone-800 bg-opacity-70 rounded-lg overflow-hidden border border-stone-700 hover:border-amber-400 transition-all flex flex-col h-full group relative"
      whileHover={{ scale: 1.02 }}
    >
      {/* Tour Image */}
      <div className="h-48 overflow-hidden relative">
        {tourData.media.coverImage ? (
          <Image 
            src={tourData.media.coverImage} 
            alt={tourData.basicInfo.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-stone-700 flex items-center justify-center">
            <span className="text-stone-500">No cover image set</span>
          </div>
        )}
        {/* Category Badge */}
        <div className="absolute top-4 left-4 bg-amber-600 text-white text-sm font-bold px-3 py-1 rounded-full">
          {tourData.basicInfo.category || 'Uncategorized'}
        </div>
      </div>
      
      {/* Tour Content */}
      <div className="p-6 flex-grow">
        <h3 className="text-xl font-bold mb-2 group-hover:text-amber-400 transition-colors">
          {tourData.basicInfo.title || 'New Tour'}
        </h3>
        <p className="text-amber-300 mb-3">
          {tourData.basicInfo.shortDescription || 'No description provided'}
        </p>
        
        {/* Duration & Difficulty */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {tourData.basicInfo.duration || '0'} {tourData.basicInfo.durationType || 'days'}
          </div>
          <div className="flex items-center text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {tourData.basicInfo.difficulty ? tourData.basicInfo.difficulty.charAt(0).toUpperCase() + tourData.basicInfo.difficulty.slice(1) : 'Easy'}
          </div>
        </div>
        
        {/* Price */}
        <div className="mb-4">
          <div className="text-2xl font-bold text-amber-400">
            ${tourData.pricing.basePrice?.toLocaleString() || '0'} 
            {tourData.pricing.discount?.amount > 0 && (
              <span className="ml-2 text-sm line-through text-stone-400">
                ${(tourData.pricing.basePrice + tourData.pricing.discount.amount).toLocaleString()}
              </span>
            )}
          </div>
          {tourData.pricing.discount?.amount > 0 && (
            <div className="text-xs text-green-400 mt-1">
              Save ${tourData.pricing.discount.amount} {tourData.pricing.discount.expires && `until ${new Date(tourData.pricing.discount.expires).toLocaleDateString()}`}
            </div>
          )}
        </div>
      </div>
      
      {/* View Button */}
      <Link 
        href="#" 
        className="block w-full bg-amber-600 hover:bg-amber-500 text-center py-3 font-medium transition-colors mt-auto"
        aria-label={`View ${tourData.basicInfo.title || 'tour'} details`}
      >
        View Tour
      </Link>
    </motion.div>
  );
}