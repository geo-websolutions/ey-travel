'use client';

import { useState, useEffect } from 'react';
import { convertImageToWebP } from '@/utils/imageResizer';
import { supabase } from '@/lib/supabase';
import { TourForm } from '@/components/admin/TourForm';
import { collection, addDoc, setDoc, getCountFromServer, doc } from "firebase/firestore"; 
import { db } from "@/lib/firebase";
import { FaDotCircle, FaListAlt, FaClock, FaStar, FaTimes, FaUsers, FaEye, FaEdit, FaLanguage, FaUndo, FaHandPointRight, FaCalendarAlt, FaCheck, FaMap, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';
import { LogoutButton } from '@/components/auth/LogoutButton';

export default function TourCreationPage() {
  const [viewMode, setViewMode] = useState('form'); // 'form' or 'preview'
  const [isLoading, setIsLoading] = useState(false);
  const [tourData, setTourData] = useState({
    // Basic Information
    basicInfo: {
      title: '',
      slug: '',
      shortDescription: '',
      fullDescription: '',
      duration: 1,
      durationType: 'days',
      durationInfo: '',
      type: [],
      category: 'Economic',
      destinations: [],
      startLocation: '',
      endLocation: '',
      status: 'active',
      minAge: 12,
      maxGroupSize: 12,
      featured: false,
      tags: [],
      liveTourGuide: false,
      liveTourGuideLanguages: [],
      freeCancellation: false,
      freeCancellationInfo: '',
      highlights: [],


    },
    // Pricing Information
    pricing: {
      basePrice: 0,
      currency: 'USD',
      discount: {
        amount: 0,
        expires: ''
      },
      included: [],
      notIncluded: []
    },
    // Itinerary
    itinerary: [
      {
        id: crypto.randomUUID(),
        day: 1,
        title: '',
        description: '',
        activities: ['']
      }
    ],
    // Media
    media: {
      coverImage: '',
      gallery: [],
      videoUrl: ''
    },
    // Availability
    availability: {
      startDates: [],
      isAvailable: true
    }
  });

  // Generate slug from title
  useEffect(() => {
    if (tourData.basicInfo.title) {
      const slug = tourData.basicInfo.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setTourData(prev => ({
        ...prev,
        basicInfo: {
          ...prev.basicInfo,
          slug
        }
      }));
    }
  }, [tourData.basicInfo.title]);

  // // Handle image upload
  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    try {
      // Convert to WebP
      const webpBlob = await convertImageToWebP(file, 80, 1200, 800);
      
      // Generate unique filename
      const fileName = `${crypto.randomUUID()}.webp`;
      const filePath = `tours/${fileName}`;

      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from('tour-images')
        .upload(filePath, webpBlob, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('tour-images')
        .getPublicUrl(filePath);

      // Update state
      if (type === 'cover') {
        setTourData(prev => ({
          ...prev,
          media: {
            ...prev.media,
            coverImage: publicUrl
          }
        }));
      } else {
        setTourData(prev => ({
          ...prev,
          media: {
            ...prev.media,
            gallery: [...prev.media.gallery, publicUrl]
          }
        }));
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare the tour data for Firestore
      const tourDataForFirestore = {
        // Basic Information
        basicInfo: {
          title: tourData.basicInfo.title,
          slug: tourData.basicInfo.slug,
          shortDescription: tourData.basicInfo.shortDescription,
          fullDescription: tourData.basicInfo.fullDescription,
          duration: Number(tourData.basicInfo.duration),
          durationType: tourData.basicInfo.durationType,
          durationInfo: tourData.basicInfo.durationInfo,
          type: tourData.basicInfo.type,
          category: tourData.basicInfo.category,
          destinations: tourData.basicInfo.destinations,
          startLocation: tourData.basicInfo.startLocation,
          endLocation: tourData.basicInfo.endLocation,
          status: tourData.basicInfo.status,
          minAge: Number(tourData.basicInfo.minAge),
          maxGroupSize: Number(tourData.basicInfo.maxGroupSize),
          featured: Boolean(tourData.basicInfo.featured),
          tags: tourData.basicInfo.tags,
          liveTourGuide: Boolean(tourData.basicInfo.liveTourGuide),
          liveTourGuideLanguages: tourData.basicInfo.liveTourGuideLanguages,
          freeCancellation: Boolean(tourData.basicInfo.freeCancellation),
          freeCancellationInfo: tourData.basicInfo.freeCancellationInfo,
          highlights: tourData.basicInfo.highlights,
          createdAt: new Date(), // Add timestamp
          updatedAt: new Date() // Add timestamp
        },
        // Pricing Information
        pricing: {
          basePrice: Number(tourData.pricing.basePrice),
          currency: tourData.pricing.currency,
          discount: {
            amount: Number(tourData.pricing.discount.amount),
            expires: tourData.pricing.discount.expires || ""
          },
          included: tourData.pricing.included,
          notIncluded: tourData.pricing.notIncluded
        },
        // Itinerary
        itinerary: tourData.itinerary.map(item => ({
          ...item,
          day: Number(item.day),
          activities: item.activities.filter(activity => activity.trim() !== "")
        })),
        // Media
        media: {
          coverImage: tourData.media.coverImage || "",
          gallery: tourData.media.gallery.filter(img => img.trim() !== ""),
          videoUrl: tourData.media.videoUrl || ""
        },
        // Availability
        availability: {
          startDates: tourData.availability.startDates.filter(date => date.trim() !== ""),
          isAvailable: Boolean(tourData.availability.isAvailable)
        }
      };

      // Add the document to Firestore
      const docRef = await addDoc(collection(db, "tours"), tourDataForFirestore);

      // Update Metadata monthly counts
      const snapshot = await getCountFromServer(collection(db, 'tours'));
      const currentCount = snapshot.data().count;
  
      const currentDate = new Date();
      const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      const statsRef = doc(db, 'metadata', 'tourStats');
      await setDoc(statsRef, {
        monthlyCounts: {
          [currentMonth]: currentCount
        },
        lastUpdated: currentDate.toISOString()
      }, { merge: true });

      // Success handling
      alert('Tour created successfully!');
      console.log("Tour document written with ID: ", docRef.id);
      
      // Reset form
      setTourData({
        basicInfo: {
          title: '',
          slug: '',
          shortDescription: '',
          fullDescription: '',
          duration: 1,
          durationType: 'days',
          type: [],
          category: 'historical',
          destinations: [],
          startLocation: '',
          endLocation: '',
          status: 'active',
          minAge: 12,
          maxGroupSize: 12,
          featured: false,
          tags: [],
          liveTourGuide: false,
          liveTourGuideLanguages: [],
          freeCancellation: false,
          freeCancellationInfo: '',
          highlights: [],
        },
        pricing: {
          basePrice: 0,
          currency: 'USD',
          discount: {
            amount: 0,
            expires: ''
          },
          included: [],
          notIncluded: []
        },
        itinerary: [
          {
            id: crypto.randomUUID(),
            day: 1,
            title: '',
            description: '',
            activities: ['']
          }
        ],
        media: {
          coverImage: '',
          gallery: [],
          videoUrl: ''
        },
        availability: {
          startDates: [],
          isAvailable: true
        }
      })
      // setTourData(initialTourState);
      // router.push('/tours');
      
    } catch (error) {
      console.error("Error adding tour document: ", error);
      alert('Error creating tour: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'form' ? 'preview' : 'form');
  };

  return (
    <div className="min-h-screen bg-soft-black">
      {/* Header */}
      <header className="bg-stone-800/50 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">
            {viewMode === 'form' ? 'Create New Tour' : 'Tour Preview'}
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={toggleViewMode}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {viewMode === 'form' ? (
                <>
                  <FaEye className="mr-2" /> Preview
                </>
              ) : (
                <>
                  <FaEdit className="mr-2" /> Edit
                </>
              )}
            </button>
            {viewMode === 'form' && (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Tour'}
              </button>
            )}
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {viewMode === 'form' ? (
          <TourForm 
            tourData={tourData} 
            setTourData={setTourData} 
            handleImageUpload={handleImageUpload}
            isLoading={isLoading}
          />
        ) : (
          <TourPreview tourData={tourData} />
        )}
      </main>
    </div>
  );
}

// Preview Component
function TourPreview({ tourData }) {
  const hasItinerary = tourData.itinerary && tourData.itinerary.length > 0 && tourData.itinerary[0].title !== '';

  return (
    <div className="bg-stone-900 rounded-xl overflow-hidden border border-stone-700 shadow-2xl hover:shadow-amber-500/10 transition-all duration-300">
      
      {/* Hero Section */}
      <div className="relative h-80 w-full group overflow-hidden">
        {tourData.media.coverImage && (
          <img
            src={tourData.media.coverImage}
            alt={tourData.basicInfo.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/95 via-stone-900/50 to-transparent" />

        {/* Title and Pricing */}
        <div className="absolute bottom-0 left-0 w-full p-6">
          <div className="flex justify-between items-end">
            <div className="max-w-[70%]">
              <h2 className="text-3xl font-bold text-white drop-shadow-lg mb-2">{tourData.basicInfo.title}</h2>
              <p className="text-amber-300 drop-shadow-md text-sm">{tourData.basicInfo.shortDescription}</p>
            </div>

            <div className="text-right">
              <div className="relative inline-block bg-gradient-to-br from-amber-600 to-amber-700 px-5 py-3 rounded-xl shadow-2xl border border-amber-500/30">
                <span className="text-2xl font-extrabold text-white">${tourData.pricing.basePrice}</span>
                {tourData.pricing.discount.amount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full shadow-lg font-bold">
                    -${tourData.pricing.discount.amount}
                  </div>
                )}
                {tourData.pricing.discount.amount > 0 && (
                  <div className="text-sm text-white/70 line-through mt-1">
                    ${(tourData.pricing.basePrice + tourData.pricing.discount.amount).toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Badge */}
        {tourData.basicInfo.featured && (
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
          
          <div className="grid md:grid-cols-1 lg:grid-cols-1  gap-4 mb-6">
            {/* Duration */}
            <div className="flex items-center space-x-3 p-3 bg-stone-700/20 rounded-lg">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <FaClock className="text-amber-400" size={18} />
              </div>
              <div>
                <p className="text-stone-400 text-sm">Duration</p>
                <p className="text-white font-medium">{tourData.basicInfo.duration} {tourData.basicInfo.durationType}</p>
                {tourData.basicInfo.durationInfo && (
                  <p className="text-stone-500 text-xs mt-1">{tourData.basicInfo.durationInfo}</p>
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
                  {tourData.basicInfo.liveTourGuide ? 'Available' : 'Not Available'}
                </p>
                {tourData.basicInfo.liveTourGuideLanguages && tourData.basicInfo.liveTourGuideLanguages.length > 0 && (
                  <p className="text-stone-500 text-xs mt-1">
                    {tourData.basicInfo.liveTourGuideLanguages.join(', ')}
                  </p>
                )}
              </div>
            </div>

            {/* Free Cancellation */}
            {tourData.basicInfo.freeCancellation && (
              <div className="flex items-center space-x-3 p-3 bg-stone-700/20 rounded-lg">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <FaUndo className="text-amber-400" size={18} />
                </div>
                <div>
                  <p className="text-white font-medium">
                    {tourData.basicInfo.freeCancellation ? 'Free Cancellation' : 'Non-refundable'}
                  </p>
                  {tourData.basicInfo.freeCancellationInfo && (
                    <p className="text-stone-500 text-xs mt-1">{tourData.basicInfo.freeCancellationInfo}</p>
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
                <p className="text-white font-medium">Max {tourData.basicInfo.maxGroupSize}</p>
                {tourData.basicInfo.minAge > 0 && (
                  <p className="text-stone-500 text-xs mt-1">Min age: {tourData.basicInfo.minAge}</p>
                )}
              </div>
            </div>
          </div>

          {/* Highlights */}
          {tourData.basicInfo.highlights && tourData.basicInfo.highlights.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-amber-400 mb-3">Highlights</h4>
              <div className="grid md:grid-cols-2 gap-2">
                {tourData.basicInfo.highlights.map((highlight, index) => (
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
            <p className="text-stone-300 leading-relaxed">{tourData.basicInfo.fullDescription}</p>
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
              {tourData.pricing.included.map((item, index) => (
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
              {tourData.pricing.notIncluded.map((item, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="p-1 bg-red-500/20 rounded-full mt-0.5">
                    <FaTimes className="text-red-400" size={12} />
                  </div>
                  <span className="text-stone-300 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Route & Availability */}
        <div className="grid md:grid-cols-2 gap-6">
          {tourData.basicInfo.destinations.length > 1 && (
            <div className="bg-stone-800/50 rounded-xl p-6 border border-stone-700">
              <div className="flex items-center mb-4">
                <div className="w-1 h-8 bg-blue-500 rounded-full mr-3"></div>
                <h3 className="text-xl font-bold text-white">Route</h3>
              </div>
              <div className="flex items-center space-x-3 text-stone-300">
                <FaMapMarkerAlt className="text-blue-400" />
                <span>{tourData.basicInfo.startLocation} → {tourData.basicInfo.endLocation}</span>
              </div>
              {tourData.basicInfo.destinations.length > 0 && (
                <div className="mt-3">
                  <p className="text-stone-400 text-sm mb-2">Destinations:</p>
                  <div className="flex flex-wrap gap-2">
                    {tourData.basicInfo.destinations.map((destination, index) => (
                      <span key={index} className="px-3 py-1 text-xs bg-stone-700 text-stone-300 rounded-full border border-stone-600">
                        {destination}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className={`bg-stone-800/50 rounded-xl p-6 border border-stone-700 ${tourData.basicInfo.destinations.length > 1 ? '' : 'md:col-span-2 lg:col-span-2'}`}>
            <div className="flex items-center mb-4">
              <div className="w-1 h-8 bg-purple-500 rounded-full mr-3"></div>
              <h3 className="text-xl font-bold text-white">Availability</h3>
            </div>
            <div className="flex items-center space-x-3 text-stone-300">
              <FaCalendarAlt className="text-purple-400" />
              <span>
                {tourData.availability.startDates.length > 0 ? (
                  <>
                    Next: {new Date(tourData.availability.startDates[0]).toLocaleDateString()}
                    {tourData.availability.startDates.length > 1 && (
                      <span className="text-stone-400 text-sm ml-2">
                        (+{tourData.availability.startDates.length - 1} dates)
                      </span>
                    )}
                  </>
                ) : 'Contact for availability'}
              </span>
            </div>
            <div className="mt-3">
              <p className="text-stone-400 text-sm">Status: 
                <span className={`ml-2 font-medium ${
                  tourData.availability.isAvailable ? 'text-green-400' : 'text-red-400'
                }`}>
                  {tourData.availability.isAvailable ? 'Available' : 'Not Available'}
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
              {tourData.itinerary.map((day, index) => (
                <li key={index} className="bg-stone-700/40 p-4 rounded-lg border border-stone-600">
                  <div className="mb-3">
                    <p className="text-white font-semibold text-lg">Day {day.day}: {day.title}</p>
                    {day.description && (
                      <pre className="text-stone-400 text-sm font-sans mt-1">{day.description}</pre>
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
        {tourData.media.gallery.length > 0 && (
          <div className="bg-stone-800/50 rounded-xl p-6 border border-stone-700">
            <div className="flex items-center mb-4">
              <div className="w-1 h-8 bg-amber-500 rounded-full mr-3"></div>
              <h3 className="text-xl font-bold text-white">Gallery</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {tourData.media.gallery.slice(0, 3).map((img, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-lg border border-stone-700 group"
                >
                  <img
                    src={img}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {index === 2 && tourData.media.gallery.length > 3 && (
                    <div className="absolute inset-0 bg-stone-900/80 flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        +{tourData.media.gallery.length - 3} more
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
          Book Now - ${tourData.pricing.basePrice}
        </button>
      </div>

      {/* Footer Tags */}
      {tourData.basicInfo.tags.length > 0 && (
        <div className="bg-stone-900/80 px-6 py-4 border-t border-stone-700">
          <div className="flex flex-wrap gap-2">
            {tourData.basicInfo.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 text-xs font-medium bg-stone-700 text-amber-300 rounded-full border border-stone-600">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
// Reusable UI Parts
function MetaTag({ icon, label }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-stone-700/80 text-amber-400 border border-stone-600 backdrop-blur-sm">
      {icon && <span className="mr-1.5">{icon}</span>}
      {label}
    </span>
  );
}

function InfoBlock({ icon, title, children }) {
  return (
    <div className="flex items-start space-x-3">
      <div className="text-amber-400 mt-0.5">{icon}</div>
      <div>
        <h4 className="font-medium text-white">{title}</h4>
        <p className="text-stone-400 text-sm">{children}</p>
      </div>
    </div>
  );
}



