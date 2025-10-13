'use client';

import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { FaSearch, FaTimes, FaUser, FaDollarSign, FaHeart, FaMapMarkerAlt, FaUsers, FaCalendar } from 'react-icons/fa';
import TourCardsSection from '../tours/TourCardsSection';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1 }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function HeroSection({ setIsSearching, isSearching, tours }) {
  const [searchParams, setSearchParams] = useState({
    age: '',
    budget: '',
    interests: [],
    keywords: '',
    duration: '',
    groupSize: '',
    destination: '',
    category: ''
  });

  const interestsList = ['economic', 'adventure', 'cultural', 'luxury', 'family', , 'desert', 'nile'];
  const types = ['economic', 'luxury', 'VIP'];
  const destinations = ['Luxor', 'Aswan', 'Hurghada', 'Cairo', 'Marsa Alam'];

  // Filter tours based on search parameters
  const filteredTours = useMemo(() => {
    if (!isSearching) return tours;

    return tours.filter(tour => {
      // Age filter
      if (searchParams.age && tour.basicInfo.minAge > parseInt(searchParams.age)) {
        return false;
      }

      // Budget filter
      if (searchParams.budget) {
        const budget = parseInt(searchParams.budget);
        if (tour.pricing.basePrice > budget) return false;
      }

      // Interests filter (tags or type)
      if (searchParams.interests.length > 0) {
        const tourInterests = [
          ...(tour.basicInfo.tags || []),
          ...(Array.isArray(tour.basicInfo.type) ? tour.basicInfo.type : [tour.basicInfo.type]),
          tour.basicInfo.category
        ].map(item => item.toLowerCase());
        
        const hasMatchingInterest = searchParams.interests.some(interest => 
          tourInterests.includes(interest.toLowerCase())
        );
        if (!hasMatchingInterest) return false;
      }

      // Keywords filter (tags, destinations, title, description)
      if (searchParams.keywords) {
        const keywords = searchParams.keywords.toLowerCase();
        const searchableText = [
          tour.basicInfo.title,
          tour.basicInfo.shortDescription,
          tour.basicInfo.fullDescription,
          ...(tour.basicInfo.tags || []),
          ...(tour.basicInfo.destinations || []),
          tour.basicInfo.startLocation,
          tour.basicInfo.endLocation,
          ...(Array.isArray(tour.basicInfo.type) ? tour.basicInfo.type : [tour.basicInfo.type]),
          tour.basicInfo.category
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(keywords)) return false;
      }

      // Duration filter
      if (searchParams.duration && tour.basicInfo.duration < parseInt(searchParams.duration)) {
        return false;
      }

      // Group size filter
      if (searchParams.groupSize && tour.basicInfo.maxGroupSize > parseInt(searchParams.groupSize)) {
        return false;
      }

      // Destination filter
      if (searchParams.destination) {
        const tourDestinations = [
          ...(tour.basicInfo.destinations || []),
          tour.basicInfo.startLocation,
          tour.basicInfo.endLocation
        ].map(dest => dest.toLowerCase());
        
        if (!tourDestinations.includes(searchParams.destination.toLowerCase())) return false;
      }

      // Category filter
      if (searchParams.type && tour.basicInfo.type !== searchParams.type) {
        return false;
      }

      return true;
    });
  }, [tours, isSearching, searchParams]);

  const handleSearch = () => {
    setIsSearching(true);
  };

  const clearSearch = () => {
    setSearchParams({
      age: '',
      budget: '',
      interests: [],
      keywords: '',
      duration: '',
      groupSize: '',
      destination: '',
      category: ''
    });
    setIsSearching(false);
  };

  const toggleInterest = (interest) => {
    setSearchParams(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <motion.div variants={container} className="text-center my-16">
      <motion.h1
        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Premium <span className="text-amber-400">Egypt Tour Packages</span> - Luxor, Aswan, Hurghada & More
      </motion.h1>
      
      <motion.p 
        className="text-lg md:text-xl max-w-3xl mx-auto opacity-90 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ delay: 0.4 }}
      >
        Experience 5,000 years of history with EY Travel Egypt tours. From the pyramids of Giza to the temples of Luxor and Red Sea resorts in Hurghada, we offer all-inclusive packages with expert Egyptologists.
      </motion.p>

      {/* Personalize Your Journey Section */}
      <motion.div 
        className="bg-stone-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-stone-700 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Personalize Your <span className="text-amber-400">Journey</span>
        </h2>
        <p className="text-stone-400 mb-8">Find the perfect tour that matches your preferences</p>

        {/* Search Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Age Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-stone-300 mb-2 text-left">
              <FaUser className="inline mr-2 text-amber-400" />
              Age
            </label>
            <input
              type="number"
              placeholder="Minimum age"
              value={searchParams.age}
              onChange={(e) => setSearchParams(prev => ({ ...prev, age: e.target.value }))}
              className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-3 text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>

          {/* Budget Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-stone-300 mb-2 text-left">
              <FaDollarSign className="inline mr-2 text-amber-400" />
              Max Budget ($)
            </label>
            <input
              type="number"
              placeholder="Your budget"
              value={searchParams.budget}
              onChange={(e) => setSearchParams(prev => ({ ...prev, budget: e.target.value }))}
              className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-3 text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>

          {/* Duration Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-stone-300 mb-2 text-left">
              <FaCalendar className="inline mr-2 text-amber-400" />
              Min Duration (days)
            </label>
            <input
              type="number"
              placeholder="Tour duration"
              value={searchParams.duration}
              onChange={(e) => setSearchParams(prev => ({ ...prev, duration: e.target.value }))}
              className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-3 text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>

          {/* Group Size Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-stone-300 mb-2 text-left">
              <FaUsers className="inline mr-2 text-amber-400" />
              Max Group Size
            </label>
            <input
              type="number"
              placeholder="Group size preference"
              value={searchParams.groupSize}
              onChange={(e) => setSearchParams(prev => ({ ...prev, groupSize: e.target.value }))}
              className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-3 text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>

          {/* Destination Select */}
          <div className="relative">
            <label className="block text-sm font-medium text-stone-300 mb-2 text-left">
              <FaMapMarkerAlt className="inline mr-2 text-amber-400" />
              Destination
            </label>
            <select
              value={searchParams.destination}
              onChange={(e) => setSearchParams(prev => ({ ...prev, destination: e.target.value }))}
              className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            >
              <option value="">Any Destination</option>
              {destinations.map(dest => (
                <option key={dest} value={dest}>{dest}</option>
              ))}
            </select>
          </div>

          {/* Category Select */}
          <div className="relative">
            <label className="block text-sm font-medium text-stone-300 mb-2 text-left">
              <FaHeart className="inline mr-2 text-amber-400" />
              Type
            </label>
            <select
              value={searchParams.category}
              onChange={(e) => setSearchParams(prev => ({ ...prev, category: e.target.value }))}
              className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            >
              <option value="">Any Type</option>
              {types.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Keywords Search */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-stone-300 mb-2 text-left">
            <FaSearch className="inline mr-2 text-amber-400" />
            Search Keywords
          </label>
          <input
            type="text"
            placeholder="Search by tags, destinations, or tour features..."
            value={searchParams.keywords}
            onChange={(e) => setSearchParams(prev => ({ ...prev, keywords: e.target.value }))}
            className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-3 text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
        </div>

        {/* Interests Section */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-stone-300 mb-4 text-left">
            <FaHeart className="inline mr-2 text-amber-400" />
            Interests & Travel Style
          </label>
          <div className="flex flex-wrap gap-2">
            {interestsList.map(interest => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  searchParams.interests.includes(interest)
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25'
                    : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
                }`}
              >
                {interest.charAt(0).toUpperCase() + interest.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleSearch}
            disabled={!isSearching && Object.values(searchParams).every(val => 
              Array.isArray(val) ? val.length === 0 : val === ''
            )}
            className="flex items-center justify-center px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSearch className="mr-2" />
            {isSearching ? 'Update Search' : 'Find My Perfect Tour'}
          </button>
          
          {isSearching && (
            <button
              onClick={clearSearch}
              className="flex items-center justify-center px-8 py-3 bg-stone-700 hover:bg-stone-600 text-white font-semibold rounded-lg transition-colors"
            >
              <FaTimes className="mr-2" />
              Clear Search
            </button>
          )}
        </div>

        {/* Results Count */}
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 bg-stone-700/50 rounded-lg"
          >
            <p className="text-stone-300">
              Found <span className="text-amber-400 font-semibold">{filteredTours.length}</span> tours matching your preferences
              {filteredTours.length === 0 && ' - Try adjusting your search criteria'}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Pass filtered tours to TourCardsSection */}
      {isSearching && 
      <div className='mt-5'>
        <TourCardsSection 
          tours={isSearching ? filteredTours : tours} 
          setIsSearching={setIsSearching}
          isSearching={isSearching}
        />
      </div>
      
      }
    </motion.div>
  );
}