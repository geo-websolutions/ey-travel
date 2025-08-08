'use client';
import { useState, useEffect } from 'react';
import { FaPlus, FaTag, FaDollarSign, FaUpload, FaListUl, FaCalendarAlt, FaTrash, FaTimes } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';

export function TourForm({ tourData, setTourData, handleImageUpload, isLoading }) {

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
      id: crypto.randomUUID(),
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

  const removeActivity = (dayIndex, activityIndex) => {
    const updatedItinerary = [...tourData.itinerary];
    updatedItinerary[dayIndex].activities.splice(activityIndex, 1);
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
          <MultiSelectField
            label="Tour Type"
            value={tourData.basicInfo.type}
            onChange={(values) => updateBasicInfo('type', values)}
            options={[
              { value: 'nile-cruises', label: 'Nile Cruise' },
              { value: 'historical-tours', label: 'Historical Tour' },
              { value: 'safaris', label: 'Safari' },
              { value: 'diving-trips', label: 'Diving Trip' },
              { value: 'day-tour', label: 'Day Tour' },
              { value: 'tour-package', label: 'Tour Package' },
              { value: 'excursion', label: 'Excursion' },
            ]}
            required
          />
          <SelectField
            label="Category"
            value={tourData.basicInfo.category}
            onChange={(e) => updateBasicInfo('category', e.target.value)}
            options={[
              { value: 'premium', label: 'Premium' },
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
              { value: 'premium', label: 'Premium' },
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
          <h3 className='text-gray-500'>Leave empty if there&apos;s no itinerary</h3>
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
                      <div key={activityIndex} className="flex space-x-2 items-center">
                        <input
                          type="text"
                          value={activity}
                          onChange={(e) => updateItineraryActivity(index, activityIndex, e.target.value)}
                          className="flex-1 block w-full rounded-md text-stone-400 bg-stone-700 border border-stone-600 p-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Hotel transfer"
                        />
                        {/* Show add button only for the last activity */}
                        {activityIndex === day.activities.length - 1 ? (
                          <button
                            type="button"
                            onClick={() => addActivity(index)}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-amber-600 hover:bg-amber-500"
                          >
                            <FaPlus size={12} />
                          </button>
                        ) : null}
                        {/* Show remove button for all activities except when it's the only one */}
                        {day.activities.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeActivity(index, activityIndex)}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-500"
                          >
                            <FaTimes size={12} />
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
                <div key={index} className="flex items-center bg-stone-500 rounded-full px-3 py-1">
                  <span className="mr-2 text-amber-400">{date}</span>
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
                    className="text-red-500 hover:text-red-600"
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
