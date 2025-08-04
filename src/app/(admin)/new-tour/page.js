'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { convertImageToWebP } from '@/utils/imageResizer';
import { supabase } from '@/lib/supabase';
import { collection, addDoc } from "firebase/firestore"; 
import { db } from "@/lib/firebase";
import { FaClock, FaStar, FaTimes, FaUsers, FaEye, FaEdit, FaUpload, FaPlus, FaTrash, FaCalendarAlt, FaCheck, FaTag, FaMapMarkerAlt, FaDollarSign, FaListUl } from 'react-icons/fa';
import { useAuthGuard } from '@/utils/auth';

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
      type: '',
      category: 'historical',
      destinations: [],
      startLocation: '',
      endLocation: '',
      status: 'active',
      minAge: 12,
      maxGroupSize: 12,
      featured: false,
      tags: []
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
        id: uuidv4(),
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

  // Authentication guard
  useAuthGuard("/login")

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
      const fileName = `${uuidv4()}.webp`;
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
          createdAt: new Date(), // Add timestamp
          updatedAt: new Date() // Add timestamp
        },
        // Pricing Information
        pricing: {
          basePrice: Number(tourData.pricing.basePrice),
          currency: tourData.pricing.currency,
          discount: {
            amount: Number(tourData.pricing.discount.amount),
            expires: tourData.pricing.discount.expires || null
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
          coverImage: tourData.media.coverImage || null,
          gallery: tourData.media.gallery.filter(img => img.trim() !== ""),
          videoUrl: tourData.media.videoUrl || null
        },
        // Availability
        availability: {
          startDates: tourData.availability.startDates.filter(date => date.trim() !== ""),
          isAvailable: Boolean(tourData.availability.isAvailable)
        }
      };

      // Add the document to Firestore
      const docRef = await addDoc(collection(db, "tours"), tourDataForFirestore);

      // Success handling
      alert('Tour created successfully!');
      console.log("Tour document written with ID: ", docRef.id);
      
      // Optional: Reset form or redirect
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

// Form Component
function TourForm({ tourData, setTourData, handleImageUpload, isLoading }) {

  // Delete Image Functions
  const deleteImageFromStorage = async (imageUrl) => {
    try {
      // Extract the file path from the URL (everything after 'tour-images/')
      const filePath = imageUrl.split('tour-images/')[1];
      
      if (!filePath) {
        throw new Error('Invalid image URL format');
      }

      const { error } = await supabase.storage
        .from('tour-images')
        .remove([filePath]);

      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  };

  const handleDeleteCoverImage = async () => {
    if (!tourData.media.coverImage) return;
    
    setDeleteLoading(prev => ({ ...prev, cover: true }));
    
    const success = await deleteImageFromStorage(tourData.media.coverImage);
    
    if (success) {
      setTourData(prev => ({
        ...prev,
        media: {
          ...prev.media,
          coverImage: ''
        }
      }));
    }
    
    setDeleteLoading(prev => ({ ...prev, cover: false }));
  };

  const handleDeleteGalleryImage = async (index) => {
    const imageUrl = tourData.media.gallery[index];
    if (!imageUrl) return;

    // Update loading state for this specific image
    setDeleteLoading(prev => {
      const newGalleryLoading = [...prev.gallery];
      newGalleryLoading[index] = true;
      return { ...prev, gallery: newGalleryLoading };
    });

    const success = await deleteImageFromStorage(imageUrl);
    
    if (success) {
      setTourData(prev => {
        const updatedGallery = [...prev.media.gallery];
        updatedGallery.splice(index, 1);
        return {
          ...prev,
          media: {
            ...prev.media,
            gallery: updatedGallery
          }
        };
      });
    }

    // Reset loading state
    setDeleteLoading(prev => {
      const newGalleryLoading = [...prev.gallery];
      newGalleryLoading[index] = false;
      return { ...prev, gallery: newGalleryLoading };
    });
  };
  
  const [deleteLoading, setDeleteLoading] = useState({
    cover: false,
    gallery: Array(tourData.media.gallery.length).fill(false)
  });

  // Helper functions for nested state updates
  const updateBasicInfo = (field, value) => {
    setTourData(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        [field]: value
      }
    }));
  };

  const updatePricing = (field, value) => {
    setTourData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [field]: value
      }
    }));
  };

  const updateDiscount = (field, value) => {
    setTourData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        discount: {
          ...prev.pricing.discount,
          [field]: value
        }
      }
    }));
  };

  const addItineraryDay = () => {
    const newDay = {
      id: uuidv4(),
      day: tourData.itinerary.length + 1,
      title: '',
      description: '',
      activities: ['']
    };
    setTourData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, newDay]
    }));
  };

  const updateItineraryDay = (index, field, value) => {
    const updatedItinerary = [...tourData.itinerary];
    updatedItinerary[index] = {
      ...updatedItinerary[index],
      [field]: value
    };
    setTourData(prev => ({
      ...prev,
      itinerary: updatedItinerary
    }));
  };

  const updateItineraryActivity = (dayIndex, activityIndex, value) => {
    const updatedItinerary = [...tourData.itinerary];
    updatedItinerary[dayIndex].activities[activityIndex] = value;
    setTourData(prev => ({
      ...prev,
      itinerary: updatedItinerary
    }));
  };

  const addActivity = (dayIndex) => {
    const updatedItinerary = [...tourData.itinerary];
    updatedItinerary[dayIndex].activities.push('');
    setTourData(prev => ({
      ...prev,
      itinerary: updatedItinerary
    }));
  };

  const addStartDate = (date) => {
    setTourData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        startDates: [...prev.availability.startDates, date]
      }
    }));
  };

  return (
    <div className="space-y-8">
      {/* Basic Information Section */}
      <Section title="Basic Information" icon={<FaTag />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Tour Title"
            value={tourData.basicInfo.title}
            onChange={(e) => updateBasicInfo('title', e.target.value)}
            placeholder="Luxury Nile Cruise"
            required
          />
          <InputField
            label="Slug (auto-generated)"
            value={tourData.basicInfo.slug}
            onChange={(e) => updateBasicInfo('slug', e.target.value)}
            placeholder="luxury-nile-cruise"
            disabled
          />
          <InputField
            label="Short Description"
            value={tourData.basicInfo.shortDescription}
            onChange={(e) => updateBasicInfo('shortDescription', e.target.value)}
            placeholder="5-day luxury cruise from Luxor to Aswan"
            textarea
            required
          />
          <div className="md:col-span-2">
            <InputField
              label="Full Description"
              value={tourData.basicInfo.fullDescription}
              onChange={(e) => updateBasicInfo('fullDescription', e.target.value)}
              placeholder="Detailed description of the tour..."
              textarea
              rows={5}
              required
            />
          </div>
          <div className="flex space-x-4">
            <InputField
              label="Duration"
              type="number"
              value={tourData.basicInfo.duration}
              onChange={(e) => updateBasicInfo('duration', parseInt(e.target.value))}
              min={1}
            />
            <SelectField
              label="Duration Type"
              value={tourData.basicInfo.durationType}
              onChange={(e) => updateBasicInfo('durationType', e.target.value)}
              options={[
                { value: 'hours', label: 'Hours' },
                { value: 'days', label: 'Days' }
              ]}
            />
          </div>
          <SelectField
            label="Tour Type"
            value={tourData.basicInfo.type}
            onChange={(e) => updateBasicInfo('type', e.target.value)}
            options={[
              { value: 'nile-cruises', label: 'Nile Cruise' },
              { value: 'historical-tours', label: 'Historical Tour' },
              { value: 'desert-safaris', label: 'Desert Safari' },
              { value: 'diving-trips', label: 'Diving Trip' }
            ]}
            required
          />
          <SelectField
            label="Category"
            value={tourData.basicInfo.category}
            onChange={(e) => updateBasicInfo('category', e.target.value)}
            options={[
              { value: 'historical', label: 'Historical' },
              { value: 'adventure', label: 'Adventure' },
              { value: 'premium', label: 'Premium' },
              { value: 'cultural', label: 'Cultural' },
              { value: 'economic', label: 'Economic' },
              { value: 'luxury', label: 'Luxury' }
            ]}
            required
          />
          <MultiSelectField
            label="Destinations"
            value={tourData.basicInfo.destinations}
            onChange={(values) => updateBasicInfo('destinations', values)}
            options={[
              { value: 'cairo', label: 'Cairo' },
              { value: 'luxor', label: 'Luxor' },
              { value: 'aswan', label: 'Aswan' },
              { value: 'hurghada', label: 'Hurghada' },
              { value: 'marsa-alam', label: 'Marsa Alam' }
            ]}
          />
          {tourData.basicInfo.destinations.length > 1 && (
            <div className=" md:col-span-2">
              <InputField
                label="Start Location"
                value={tourData.basicInfo.startLocation}
                onChange={(e) => updateBasicInfo('startLocation', e.target.value)}
                placeholder="Luxor"
              />
              <InputField
                label="End Location"
                value={tourData.basicInfo.endLocation}
                onChange={(e) => updateBasicInfo('endLocation', e.target.value)}
                placeholder="Aswan"
              />
            </div>
          )}
          <SelectField
            label="Status"
            value={tourData.basicInfo.status}
            onChange={(e) => updateBasicInfo('status', e.target.value)}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'archived', label: 'Archived' }
            ]}
          />
          <div className="flex space-x-4">
            <InputField
              label="Minimum Age"
              type="number"
              value={tourData.basicInfo.minAge}
              onChange={(e) => updateBasicInfo('minAge', parseInt(e.target.value))}
              min={0}
            />
            <InputField
              label="Max Group Size"
              type="number"
              value={tourData.basicInfo.maxGroupSize}
              onChange={(e) => updateBasicInfo('maxGroupSize', parseInt(e.target.value))}
              min={1}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={tourData.basicInfo.featured}
              onChange={(e) => updateBasicInfo('featured', e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-amber-400">
              Featured Tour
            </label>
          </div>
          <MultiSelectField
            label="Tags"
            value={tourData.basicInfo.tags}
            onChange={(values) => updateBasicInfo('tags', values)}
            options={[
              { value: 'family-friendly', label: 'Family Friendly' },
              { value: 'luxury', label: 'Luxury' },
              { value: 'budget', label: 'Budget' },
              { value: 'romantic', label: 'Romantic' },
              { value: 'adventure', label: 'Adventure' },
              { value: 'cultural', label: 'Cultural' },
              { value: 'historical', label: 'Historical' },
              { value: 'beach', label: 'Beach' },
              { value: 'desert', label: 'Desert' },
              { value: 'cruise', label: 'Cruise' },
              { value: 'safari', label: 'Safari' },
              { value: 'diving', label: 'Diving' },
              { value: 'snorkeling', label: 'Snorkeling' },
              { value: 'wellness', label: 'Wellness' },

            ]}
          />
        </div>
      </Section>

      {/* Pricing Information Section */}
      <Section title="Pricing" icon={<FaDollarSign />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Base Price"
            type="number"
            value={tourData.pricing.basePrice}
            onChange={(e) => updatePricing('basePrice', parseFloat(e.target.value))}
            min={0}
            step="0.01"
            required
          />
          <SelectField
            label="Currency"
            value={tourData.pricing.currency}
            onChange={(e) => updatePricing('currency', e.target.value)}
            options={[
              { value: 'USD', label: 'USD' },
              { value: 'EUR', label: 'EUR' },
              { value: 'GBP', label: 'GBP' },
              { value: 'EGP', label: 'EGP' }
            ]}
          />
          <div className="md:col-span-2 border-t pt-4">
            <h3 className="text-lg font-medium mb-4 text-white">Discount</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Discount Amount"
                type="number"
                value={tourData.pricing.discount.amount}
                onChange={(e) => updateDiscount('amount', parseFloat(e.target.value))}
                min={0}
                step="0.01"
              />
              <InputField
                label="Discount Expiry Date"
                type="date"
                value={tourData.pricing.discount.expires}
                onChange={(e) => updateDiscount('expires', e.target.value)}
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium mb-4 text-white">Inclusions & Exclusions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MultiInputField
                label="Included Features"
                values={tourData.pricing.included}
                onChange={(values) => updatePricing('included', values)}
                placeholder="Add included feature"
              />
              <MultiInputField
                label="Not Included Features"
                values={tourData.pricing.notIncluded}
                onChange={(values) => updatePricing('notIncluded', values)}
                placeholder="Add excluded feature"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Media Section */}
      <Section title="Media" icon={<FaUpload />}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-amber-300 mb-2">Cover Image</label>
            <ImageUploader
              imageUrl={tourData.media.coverImage}
              onChange={(e) => handleImageUpload(e, 'cover')}
              isLoading={isLoading}
              onDelete={handleDeleteCoverImage}
              deleteLoading={deleteLoading.cover}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-300 mb-2">Gallery Images</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tourData.media.gallery.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteGalleryImage(index)}
                    disabled={deleteLoading.gallery[index]}
                    className={`absolute top-2 right-2 p-1 rounded-full transition-opacity ${
                      deleteLoading.gallery[index]
                        ? 'bg-gray-500 cursor-not-allowed opacity-100'
                        : 'bg-red-500 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {deleteLoading.gallery[index] ? (
                      <svg className="animate-spin h-3 w-3 text-white" viewBox="0 0 24 24">
                        <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </svg>
                    ) : (
                      <FaTrash size={12} className="text-white" />
                    )}
                  </button>
                </div>
              ))}
              <div className="border-2 border-dashed border-stone-600 rounded flex items-center justify-center h-32">
                <label className="cursor-pointer p-4 text-center">
                  <FaPlus className="mx-auto text-gray-400" />
                  <span className="block text-sm text-amber-300">Add Image</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'gallery')}
                    accept="image/*"
                  />
                </label>
              </div>
            </div>
          </div>
          <InputField
            label="Video URL (YouTube)"
            value={tourData.media.videoUrl}
            onChange={(e) => setTourData(prev => ({
              ...prev,
              media: {
                ...prev.media,
                videoUrl: e.target.value
              }
            }))}
            placeholder="https://youtube.com/embed/..."
          />
        </div>
      </Section>

      {/* Itinerary Section */}
      <Section title="Itinerary" icon={<FaListUl />}>
        <div className="space-y-6">
          <h3 className='text-gray-500'>Leave empty if there's no itinerary</h3>
          {tourData.itinerary.map((day, index) => (
            <div key={day.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">Day {day.day}</h3>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const updatedItinerary = [...tourData.itinerary];
                      updatedItinerary.splice(index, 1);
                      // Re-number days
                      const renumbered = updatedItinerary.map((d, i) => ({
                        ...d,
                        day: i + 1
                      }));
                      setTourData(prev => ({
                        ...prev,
                        itinerary: renumbered
                      }));
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
              <div className="space-y-4">
                <InputField
                  label="Day Title"
                  value={day.title}
                  onChange={(e) => updateItineraryDay(index, 'title', e.target.value)}
                  placeholder="Arrival in Luxor"
                />
                <InputField
                  label="Description"
                  value={day.description}
                  onChange={(e) => updateItineraryDay(index, 'description', e.target.value)}
                  placeholder="Check-in and welcome dinner"
                  textarea
                />
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Activities</label>
                  <div className="space-y-2">
                    {day.activities.map((activity, activityIndex) => (
                      <div key={activityIndex} className="flex space-x-2">
                        <input
                          type="text"
                          value={activity}
                          onChange={(e) => updateItineraryActivity(index, activityIndex, e.target.value)}
                          className="flex-1 block w-full rounded-md text-stone-400 bg-stone-700 border border-stone-600 p-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Hotel transfer"
                        />
                        {activityIndex === day.activities.length - 1 && (
                          <button
                            type="button"
                            onClick={() => addActivity(index)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-amber-600 hover:bg-amber-500"
                          >
                            <FaPlus size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addItineraryDay}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-amber-600 hover:bg-amber-500"
          >
            <FaPlus className="mr-2" /> Add Day
          </button>
        </div>
      </Section>

      {/* Availability Section */}
      <Section title="Availability" icon={<FaCalendarAlt />}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-amber-400 mb-2">Start Dates</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {tourData.availability.startDates.map((date, index) => (
                <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                  <span className="mr-2">{date}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updatedDates = [...tourData.availability.startDates];
                      updatedDates.splice(index, 1);
                      setTourData(prev => ({
                        ...prev,
                        availability: {
                          ...prev.availability,
                          startDates: updatedDates
                        }
                      }));
                    }}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="date"
                id="newDate"
                className="block w-full rounded-md text-stone-400 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  const dateInput = document.getElementById('newDate');
                  if (dateInput.value) {
                    addStartDate(dateInput.value);
                    dateInput.value = '';
                  }
                }}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-amber-600 hover:bg-amber-500"
              >
                Add Date
              </button>
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAvailable"
              checked={tourData.availability.isAvailable}
              onChange={(e) => setTourData(prev => ({
                ...prev,
                availability: {
                  ...prev.availability,
                  isAvailable: e.target.checked
                }
              }))}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-700">
              Currently Available for Booking
            </label>
          </div>
        </div>
      </Section>
    </div>
  );
}

// Preview Component
function TourPreview({ tourData }) {
  const hasItinerary = tourData.itinerary && tourData.itinerary.length > 0 && tourData.itinerary[0].title !== '';

  return (
    <div className="bg-stone-800/50 rounded-xl overflow-hidden border border-stone-700 shadow-lg hover:shadow-amber-500/20 transition-all duration-300 hover:-translate-y-1">
      
      {/* Hero Section */}
      <div className="relative h-80 w-full group overflow-hidden">
        {tourData.media.coverImage && (
          <img
            src={tourData.media.coverImage}
            alt={tourData.basicInfo.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent" />

        {/* Title and Pricing */}
        <div className="absolute bottom-0 left-0 w-full p-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">{tourData.basicInfo.title}</h2>
              <p className="text-amber-300 mt-1 drop-shadow-md">{tourData.basicInfo.shortDescription}</p>
            </div>

            <div className="text-right">
              <div className="relative inline-block bg-gradient-to-br from-amber-500 to-amber-600 px-4 py-2 rounded-lg shadow-lg">
                <span className="text-xl font-extrabold text-white">${tourData.pricing.basePrice}</span>
                {tourData.pricing.discount.amount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full shadow">
                    -${tourData.pricing.discount.amount}
                  </div>
                )}
                {tourData.pricing.discount.amount > 0 && (
                  <div className="text-xs text-white/70 line-through">
                    ${(tourData.pricing.basePrice + tourData.pricing.discount.amount).toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Badge */}
        {tourData.basicInfo.featured && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-lg">
            <FaStar className="mr-1.5" size={10} /> FEATURED
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        
        {/* Meta Info */}
        <div className="flex flex-wrap gap-2">
          <MetaTag icon={<FaClock size={10} />} label={`${tourData.basicInfo.duration} ${tourData.basicInfo.durationType}`} />
          <MetaTag icon={<FaUsers size={10} />} label={`Max ${tourData.basicInfo.maxGroupSize}`} />
          <MetaTag label={tourData.basicInfo.category} />
        </div>

        {/* About */}
        <div>
          <h3 className="text-lg font-semibold text-amber-400 mb-2">About This Tour</h3>
          <p className="text-stone-300 line-clamp-4">{tourData.basicInfo.fullDescription}</p>
        </div>

        {/* Route & Availability */}
        <div className="grid md:grid-cols-2 gap-4">
          {tourData.basicInfo.destinations.length > 1 && (
            <InfoBlock icon={<FaMapMarkerAlt />} title="Route">
            {tourData.basicInfo.startLocation} → {tourData.basicInfo.endLocation}
          </InfoBlock>
          )}
          
          <InfoBlock icon={<FaCalendarAlt />} title="Availability">
            {tourData.availability.startDates.length > 0 ? (
              <>
                Next: {new Date(tourData.availability.startDates[0]).toLocaleDateString()}
                {tourData.availability.startDates.length > 1 && (
                  <span> (+{tourData.availability.startDates.length - 1} dates)</span>
                )}
              </>
            ) : 'Contact for availability'}
          </InfoBlock>
        </div>

        {/* Included */}
        {tourData.pricing.included.length > 0 && (
          <div className="bg-stone-800/40 p-4 rounded-lg border border-stone-700 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-amber-400 mb-2">What's Included</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {tourData.pricing.included.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <FaCheck className="text-amber-400 mt-1" />
                    <span className="text-stone-300 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {tourData.pricing.notIncluded.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-rose-400 mb-2">What's Not Included</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {tourData.pricing.notIncluded.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <FaTimes className="text-rose-400 mt-1" />
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
            <ul className="space-y-2">
              {tourData.itinerary.map((day, index) => (
                <li key={index} className="bg-stone-700/40 p-3 rounded-lg border border-stone-600">
                  <p className="text-white font-semibold">Day {day.day}: {day.title}</p>
                  <p className="text-stone-400 text-sm mt-1">{day.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Gallery */}
        {tourData.media.gallery.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-amber-400 mb-2">Gallery</h3>
            <div className="grid grid-cols-3 gap-2">
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
                    <div className="absolute inset-0 bg-stone-900/70 flex items-center justify-center">
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
        <button className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-amber-500/30">
          Book Now
        </button>
      </div>

      {/* Footer Tags */}
      {tourData.basicInfo.tags.length > 0 && (
        <div className="bg-stone-900/80 px-6 py-4 border-t border-stone-700 flex flex-wrap gap-2">
          {tourData.basicInfo.tags.map((tag, index) => (
            <span key={index} className="px-3 py-1 text-xs font-medium bg-stone-700 text-amber-300 rounded-full border border-stone-600">
              #{tag}
            </span>
          ))}
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


// Reusable Components
function Section({ title, icon, children }) {
  return (
    <div className="bg-stone-800/50 rounded-lg overflow-hidden border border-stone-700">
      <div className="px-6 py-4 border-b border-stone-700 bg-stone-800">
        <h2 className="text-lg font-bold text-white flex items-center">
          <span className="text-amber-400 mr-2">{icon}</span>
          {title}
        </h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function InputField({ label, value, onChange, type = 'text', placeholder, required = false, disabled = false, textarea = false, rows = 3 }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-amber-400 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={onChange}
          rows={rows}
          className="block w-full bg-stone-700 border border-stone-600 rounded-md shadow-sm p-1 focus:border-amber-500 focus:ring-amber-500 text-white sm:text-sm"
          placeholder={placeholder}
          required={required}
          disabled={disabled}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="block w-full bg-stone-700 border border-stone-600 p-1 rounded-md shadow-sm focus:border-amber-500 focus:ring-amber-500 text-white sm:text-sm"
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={type === 'number' ? 0 : undefined}
          step={type === 'number' ? 'any' : undefined}
        />
      )}
    </div>
  );
}

function SelectField({ label, value, onChange, options, required = false }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-amber-400 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="block w-full bg-stone-700 border border-stone-600 p-1 rounded-md shadow-sm focus:border-amber-500 focus:ring-amber-500 text-white sm:text-sm"
        required={required}
      >
        <option value="" className="bg-stone-700">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-stone-700">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function MultiSelectField({ label, value, onChange, options }) {
  const handleChange = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-amber-400 mb-2">{label}</label>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="checkbox"
              id={`checkbox-${option.value}`}
              checked={value.includes(option.value)}
              onChange={() => handleChange(option.value)}
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-stone-600 rounded bg-stone-700"
            />
            <label htmlFor={`checkbox-${option.value}`} className="ml-2 block text-sm text-white">
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function MultiInputField({ label, values, onChange, placeholder }) {
  const [newValue, setNewValue] = useState('');

  const addValue = () => {
    if (newValue.trim()) {
      onChange([...values, newValue.trim()]);
      setNewValue('');
    }
  };

  const removeValue = (index) => {
    const newValues = [...values];
    newValues.splice(index, 1);
    onChange(newValues);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-amber-400 mb-2">{label}</label>
      <div className="flex space-x-2 mb-2">
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addValue()}
          className="flex-1 block w-full bg-stone-700 border border-stone-600 p-1 rounded-md shadow-sm focus:border-amber-500 focus:ring-amber-500 text-white sm:text-sm"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={addValue}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-amber-600 hover:bg-amber-500"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {values.map((value, index) => (
          <div key={index} className="flex items-center bg-stone-700 rounded-full px-3 py-1">
            <span className="mr-2 text-white text-sm">{value}</span>
            <button
              type="button"
              onClick={() => removeValue(index)}
              className="text-stone-400 hover:text-red-500"
            >
              <FaTrash size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageUploader({ imageUrl, onChange, isLoading, onDelete, deleteLoading }) {
  const handleDelete = async () => {
    if (onDelete && imageUrl) {
      await onDelete(imageUrl);
    }
    onChange({ target: { files: [null] } });
  };

  return (
    <div className="flex items-center">
      {imageUrl ? (
        <div className="relative group w-full">
          <img
            src={imageUrl}
            alt="Cover preview"
            className="h-full w-full object-cover rounded border border-stone-600"
          />
          <button
            type="button"
            onClick={onDelete}
            disabled={deleteLoading}
            className={`absolute top-2 right-2 p-1 rounded-full transition-opacity ${
              deleteLoading 
                ? 'bg-gray-500 cursor-not-allowed opacity-100' 
                : 'bg-red-500 opacity-0 group-hover:opacity-100'
            }`}
          >
            {deleteLoading ? (
              <svg className="animate-spin h-3 w-3 text-white" viewBox="0 0 24 24">
                <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </svg>
            ) : (
              <FaTrash size={12} className="text-white" />
            )}
          </button>
        </div>
      ) : (
        <label className="cursor-pointer w-full">
          <div className="border-2 border-dashed border-stone-600 rounded flex flex-col items-center justify-center h-32 w-full bg-stone-700/50 hover:bg-stone-700 transition-colors">
            {isLoading ? (
              <div className="text-stone-400">Uploading...</div>
            ) : (
              <>
                <FaUpload className="text-amber-400 text-2xl mb-2" />
                <div className="text-sm text-amber-300">Click to upload cover image</div>
                <div className="text-xs text-stone-400">Recommended: 1200x800px</div>
              </>
            )}
            <input
              type="file"
              className="hidden"
              onChange={onChange}
              accept="image/*"
            />
          </div>
        </label>
      )}
    </div>
  );
}

