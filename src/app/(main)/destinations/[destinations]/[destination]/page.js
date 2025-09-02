'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { doc, getDocs, query, collection, where } from 'firebase/firestore'
import { db } from '@/lib/firebase' // Adjust import path as needed
import Image from 'next/image'
import { 
  FaStar, FaClock, FaUsers, FaMapMarkerAlt, 
  FaCalendarAlt, FaCheck, FaTimes, FaArrowLeft,
  FaChevronLeft, FaChevronRight, FaExpand
} from 'react-icons/fa'
import Link from 'next/link'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Loading skeleton component
const TourLoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-stone-900">
      <div className="h-80 bg-stone-800 animate-pulse"></div>
      <div className="max-w-6xl mx-auto px-4 py-8 -mt-24 relative z-10">
        <div className="bg-stone-800 rounded-xl shadow-xl p-6 animate-pulse">
          <div className="h-8 bg-stone-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-stone-700 rounded w-1/2 mb-6"></div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-6 bg-stone-700 rounded-full w-20"></div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="h-40 bg-stone-700 rounded-xl"></div>
            <div className="h-40 bg-stone-700 rounded-xl"></div>
            <div className="h-40 bg-stone-700 rounded-xl"></div>
          </div>
          
          <div className="h-4 bg-stone-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-stone-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-stone-700 rounded w-3/4 mb-6"></div>
        </div>
      </div>
    </div>
  )
}

// Gallery Modal Component
const GalleryModal = ({ images, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  
  const goNext = () => {
    setCurrentIndex(prev => (prev + 1) % images.length)
  }
  
  const goPrev = () => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length)
  }
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [])
  
  if (!images || images.length === 0) return null
  
  return (
    <div className="fixed mt-20 inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-3 bg-stone-800/80 hover:bg-stone-700 rounded-full transition-colors"
      >
        <FaTimes className="text-white text-xl" />
      </button>
      
      <button 
        onClick={goPrev}
        className="absolute left-4 z-10 p-3 bg-stone-800/80 hover:bg-stone-700 rounded-full transition-colors"
      >
        <FaChevronLeft className="text-white text-xl" />
      </button>
      
      <button 
        onClick={goNext}
        className="absolute right-4 z-10 p-3 bg-stone-800/80 hover:bg-stone-700 rounded-full transition-colors"
      >
        <FaChevronRight className="text-white text-xl" />
      </button>
      
      <div className="relative max-w-5xl w-full max-h-full p-4">
        <div className="relative aspect-video w-full h-full">
          <Image
            src={images[currentIndex]}
            alt={`Gallery image ${currentIndex + 1}`}
            fill
            className="object-contain"
            priority
          />
        </div>
        
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="bg-stone-800/70 px-4 py-2 rounded-full backdrop-blur-sm">
            <span className="text-white text-sm">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Tour Detail Page Component
export default function TourDetailPage() {
  const params = useParams()
  const slug = params.destination
  const [tour, setTour] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        const ref = collection(db, 'tours');
        const q = query(ref, where('basicInfo.slug', '==', slug));
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot)
        if (!querySnapshot.empty) {
          // Get the first document that matches (assuming slugs are unique)
          const doc = querySnapshot.docs[0];
          setTour({ id: doc.id, ...doc.data() });
        } else {
          setError('Tour not found');
          toast.error('Tour not found');
        }
      } catch (err) {
        console.error('Error fetching tour:', err);
        setError('Failed to load tour');
        toast.error('Failed to load tour');
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchTour();
    }
  }, [slug]);
  
  const openGallery = (index) => {
    setGalleryIndex(index)
    setGalleryOpen(true)
  }

  if (loading) return <TourLoadingSkeleton />
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
    )
  }

  const hasItinerary = tour.itinerary && tour.itinerary.length > 0 && tour.itinerary[0].title !== ''
  const hasGallery = tour.media.gallery && tour.media.gallery.length > 0

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100">
      <ToastContainer position="bottom-right" theme="dark" />
      
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
                <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">{tour.basicInfo.title}</h1>
                <p className="text-amber-300 mt-2 text-lg drop-shadow-md">{tour.basicInfo.shortDescription}</p>
              </div>
              
              <div className="flex flex-col items-end">
                <div className="relative inline-block bg-gradient-to-br from-amber-500 to-amber-600 px-6 py-3 rounded-xl shadow-lg">
                  <span className="text-3xl font-extrabold text-white">${tour.pricing.basePrice}</span>
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
                <span className="text-stone-400 text-sm mt-1">per person</span>
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
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <FaUsers className="text-amber-400 text-lg" />
              </div>
              <div>
                <p className="text-sm text-stone-400">Group Size</p>
                <p className="font-medium">Max {tour.basicInfo.maxGroupSize}</p>
              </div>
            </div>
            
            {tour.basicInfo.destinations.length > 1 && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <FaMapMarkerAlt className="text-amber-400 text-lg" />
                </div>
                <div>
                  <p className="text-sm text-stone-400">Route</p>
                  <p className="font-medium">{tour.basicInfo.startLocation} → {tour.basicInfo.endLocation}</p>
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
                    : 'Contact us'
                  }
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
                      <div key={index} className="bg-stone-700/40 p-5 rounded-xl border border-stone-600">
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-white">Day {day.day}: {day.title}</h3>
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
                        className="text-sm text-amber-400 hover:text-amber-300 flex items-center"
                      >
                        View all ({tour.media.gallery.length}) <FaExpand className="ml-1" size={12} />
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
              <div className="bg-stone-700/50 p-5 rounded-xl border border-stone-600">
                <h3 className="text-xl font-bold text-white mb-4">Book This Tour</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-stone-400 text-sm">Price per person</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-amber-400">${tour.pricing.basePrice}</span>
                      {tour.pricing.discount.amount > 0 && (
                        <span className="text-stone-400 text-sm line-through">
                          ${(tour.pricing.basePrice + tour.pricing.discount.amount).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition-colors">
                    Check Availability
                  </button>
                  
                  <div className="text-center text-stone-400 text-sm">
                    Have questions?{' '}
                    <a href="#" className="text-amber-400 hover:underline">
                      Contact us
                    </a>
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
      
      {/* Gallery Modal */}
      {galleryOpen && (
        <GalleryModal 
          images={tour.media.gallery} 
          initialIndex={galleryIndex} 
          onClose={() => setGalleryOpen(false)} 
        />
      )}
    </div>
  )
}