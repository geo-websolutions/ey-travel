"use client";
import { useState, useEffect, useRef } from "react";
import { FaEdit, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { TourForm } from "../TourForm"; // Import your existing form component
import { convertImageToWebP } from "@/utils/imageResizer";
import { supabase } from "@/lib/supabase";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-toastify";

export const TourEditModal = ({ tour, onClose, onUpdate }) => {
  // utils/tourNormalizer.js (or in your component file)
  const normalizeTourData = (data) => {
    const normalized = { ...data };

    // Ensure all top-level objects exist
    normalized.basicInfo = normalized.basicInfo || {};
    normalized.pricing = normalized.pricing || {};
    normalized.itinerary = normalized.itinerary || [];
    normalized.media = normalized.media || {};
    normalized.availability = normalized.availability || {};

    // Normalize basicInfo
    normalized.basicInfo = {
      title: normalized.basicInfo.title || "",
      slug: normalized.basicInfo.slug || "",
      shortDescription: normalized.basicInfo.shortDescription || "",
      fullDescription: normalized.basicInfo.fullDescription || "",
      duration: normalized.basicInfo.duration || 1,
      durationType: normalized.basicInfo.durationType || "days",
      durationInfo: normalized.basicInfo.durationInfo || "",
      type: Array.isArray(normalized.basicInfo.type) ? normalized.basicInfo.type : [],
      category: normalized.basicInfo.category || "Economic",
      destinations: Array.isArray(normalized.basicInfo.destinations)
        ? normalized.basicInfo.destinations
        : [],
      startLocation: normalized.basicInfo.startLocation || "",
      endLocation: normalized.basicInfo.endLocation || "",
      status: normalized.basicInfo.status || "active",
      minAge: normalized.basicInfo.minAge || 12,
      featured: Boolean(normalized.basicInfo.featured),
      tags: Array.isArray(normalized.basicInfo.tags) ? normalized.basicInfo.tags : [],
      liveTourGuide: Boolean(normalized.basicInfo.liveTourGuide),
      liveTourGuideLanguages: Array.isArray(normalized.basicInfo.liveTourGuideLanguages)
        ? normalized.basicInfo.liveTourGuideLanguages
        : [],
      freeCancellation: Boolean(normalized.basicInfo.freeCancellation),
      freeCancellationInfo: normalized.basicInfo.freeCancellationInfo || "",
      highlights: Array.isArray(normalized.basicInfo.highlights)
        ? normalized.basicInfo.highlights
        : [],
      createdAt: normalized.basicInfo.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Handle pricing migration and normalization
    if (normalized.pricing.basePrice !== undefined && !normalized.pricing.groupPrices) {
      // Migrate from old structure
      const basePrice = normalized.pricing.basePrice || 0;

      normalized.pricing.groupPrices = [
        {
          groupSize: 1,
          label: "Single Traveler",
          price: basePrice,
          perPerson: true,
        },
        {
          groupSize: 2,
          label: "Couple / 2 Persons",
          price: basePrice * 2,
          perPerson: false,
        },
        {
          groupSize: "3-7",
          label: "Small Group (3-7)",
          price: basePrice,
          perPerson: true,
        },
        {
          groupSize: "8-12",
          label: "Medium Group (8-12)",
          price: basePrice,
          perPerson: true,
        },
      ];

      delete normalized.pricing.basePrice;
    }

    // Ensure groupPrices exists
    if (!normalized.pricing.groupPrices || !Array.isArray(normalized.pricing.groupPrices)) {
      normalized.pricing.groupPrices = [
        {
          groupSize: 1,
          label: "Single Traveler",
          price: 0,
          perPerson: true,
        },
        {
          groupSize: 2,
          label: "Couple / 2 Persons",
          price: 0,
          perPerson: false,
        },
        {
          groupSize: "3-7",
          label: "Small Group (3-7)",
          price: 0,
          perPerson: true,
        },
        {
          groupSize: "8-12",
          label: "Medium Group (8-12)",
          price: 0,
          perPerson: true,
        },
      ];
    }

    // Ensure groupPrices have proper structure
    normalized.pricing.groupPrices = normalized.pricing.groupPrices.map((group, index) => ({
      groupSize:
        group.groupSize || (index === 0 ? 1 : index === 1 ? 2 : index === 2 ? "3-7" : "8-12"),
      label:
        group.label || index === 0
          ? "Single Traveler"
          : index === 1
          ? "Couple / 2 Persons"
          : index === 2
          ? "Small Group (3-7)"
          : "Medium Group (8-12)",
      price: typeof group.price === "number" ? group.price : 0,
      perPerson:
        typeof group.perPerson === "boolean" ? group.perPerson : index === 1 ? false : true,
    }));

    // Normalize other pricing fields
    normalized.pricing = {
      currency: normalized.pricing.currency || "USD",
      groupPrices: normalized.pricing.groupPrices,
      discount: {
        amount:
          typeof normalized.pricing.discount?.amount === "number"
            ? normalized.pricing.discount.amount
            : 0,
        expires: normalized.pricing.discount?.expires || "",
      },
      included: Array.isArray(normalized.pricing.included) ? normalized.pricing.included : [],
      notIncluded: Array.isArray(normalized.pricing.notIncluded)
        ? normalized.pricing.notIncluded
        : [],
    };

    // Normalize itinerary
    if (!Array.isArray(normalized.itinerary) || normalized.itinerary.length === 0) {
      normalized.itinerary = [
        {
          id: crypto.randomUUID(),
          day: 1,
          title: "",
          description: "",
          activities: [""],
        },
      ];
    } else {
      // Ensure each itinerary day has proper structure
      normalized.itinerary = normalized.itinerary.map((day, index) => ({
        id: day.id || crypto.randomUUID(),
        day: typeof day.day === "number" ? day.day : index + 1,
        title: day.title || "",
        description: day.description || "",
        activities: Array.isArray(day.activities) ? day.activities : [""],
      }));
    }

    // Normalize media
    normalized.media = {
      coverImage: normalized.media.coverImage || "",
      gallery: Array.isArray(normalized.media.gallery) ? normalized.media.gallery : [],
      videoUrl: normalized.media.videoUrl || "",
    };

    // Normalize availability
    normalized.availability = {
      startDates: Array.isArray(normalized.availability.startDates)
        ? normalized.availability.startDates
        : [],
      isAvailable: normalized.availability.isAvailable !== false, // Default to true
    };

    return normalized;
  };

  const [tourData, setTourData] = useState(() => normalizeTourData(tour));
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState({
    cover: false,
    gallery: Array(tour.media.gallery?.length || 0).fill(false),
  });

  const modalRef = useRef(null);

  // Handle image upload
  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const webpBlob = await convertImageToWebP(file, 80, 1200, 800);
      const fileName = `${crypto.randomUUID()}.webp`;
      const filePath = `tours/${fileName}`;

      const { error } = await supabase.storage.from("tour-images").upload(filePath, webpBlob, {
        cacheControl: "3600",
        upsert: false,
      });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("tour-images").getPublicUrl(filePath);

      if (type === "cover") {
        setTourData((prev) => ({
          ...prev,
          media: {
            ...prev.media,
            coverImage: publicUrl,
          },
        }));
        toast.success("Cover image uploaded successfully!");
      } else {
        setTourData((prev) => ({
          ...prev,
          media: {
            ...prev.media,
            gallery: [...prev.media.gallery, publicUrl],
          },
        }));
        toast.success("Gallery image uploaded successfully!");
      }
    } catch (error) {
      toast.error(`Image upload failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete image functions
  const deleteImageFromStorage = async (imageUrl) => {
    try {
      const filePath = imageUrl.split("tour-images/")[1];
      if (!filePath) throw new Error("Invalid image URL format");

      const { error } = await supabase.storage.from("tour-images").remove([filePath]);

      if (error) throw error;
      return true;
    } catch (error) {
      toast.error(`Failed to delete image: ${error.message}`);
      return false;
    }
  };

  const handleDeleteCoverImage = async () => {
    if (!tourData.media.coverImage) return;

    setDeleteLoading((prev) => ({ ...prev, cover: true }));

    const success = await deleteImageFromStorage(tourData.media.coverImage);

    if (success) {
      setTourData((prev) => ({
        ...prev,
        media: {
          ...prev.media,
          coverImage: "",
        },
      }));
      toast.success("Cover image deleted successfully!");
    }

    setDeleteLoading((prev) => ({ ...prev, cover: false }));
  };

  const handleDeleteGalleryImage = async (index) => {
    const imageUrl = tourData.media.gallery[index];
    if (!imageUrl) return;

    setDeleteLoading((prev) => {
      const newGalleryLoading = [...prev.gallery];
      newGalleryLoading[index] = true;
      return { ...prev, gallery: newGalleryLoading };
    });

    const success = await deleteImageFromStorage(imageUrl);

    if (success) {
      setTourData((prev) => {
        const updatedGallery = [...prev.media.gallery];
        updatedGallery.splice(index, 1);
        return {
          ...prev,
          media: {
            ...prev.media,
            gallery: updatedGallery,
          },
        };
      });
      toast.success("Gallery image deleted successfully!");
    }

    setDeleteLoading((prev) => {
      const newGalleryLoading = [...prev.gallery];
      newGalleryLoading[index] = false;
      return { ...prev, gallery: newGalleryLoading };
    });
  };

  // Handle form submission for editing
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare the updated tour data
      const updatedTourData = {
        basicInfo: {
          ...tourData.basicInfo,
        },
        pricing: tourData.pricing,
        itinerary: tourData.itinerary,
        media: tourData.media,
        availability: tourData.availability,
        status: tourData.basicInfo.status,
        updatedAt: new Date().toISOString(),
      };

      // Update the document in Firestore
      await updateDoc(doc(db, "tours", tour.id), updatedTourData);

      toast.success("Tour updated successfully!");
      onUpdate(updatedTourData); // Notify parent component of the update
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error updating tour:", error);
      toast.error(`Failed to update tour: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className="relative bg-stone-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-stone-700 shadow-2xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-stone-700/50 hover:bg-stone-600 rounded-full transition-colors"
          >
            <FaTimes className="text-stone-300" />
          </button>

          {/* Modal Content */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <FaEdit className="mr-2 text-amber-400" />
              Edit Tour: {tourData.basicInfo.title}
            </h2>

            {/* Reuse your existing TourForm component */}
            <TourForm
              tourData={tourData}
              setTourData={setTourData}
              handleImageUpload={handleImageUpload}
              isLoading={isLoading}
              deleteLoading={deleteLoading}
              onDeleteCoverImage={handleDeleteCoverImage}
              onDeleteGalleryImage={handleDeleteGalleryImage}
            />

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 mt-6 border-t border-stone-700 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-stone-700 hover:bg-stone-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-amber-600 hover:bg-amber-500 disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
