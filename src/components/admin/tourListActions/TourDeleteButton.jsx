'use client'
import { FaTrash } from 'react-icons/fa';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { toast } from 'react-toastify';

export function TourDeleteButton({ tour }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this tour? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);

    try {
      // 1. Delete cover image from Supabase storage
      if (tour.media.coverImage) {
        const coverImagePath = tour.media.coverImage.split('tour-images/')[1];
        const { error: coverError } = await supabase.storage
          .from('tour-images')
          .remove([coverImagePath]);
        
        if (coverError) {
          throw new Error(`Failed to delete cover image: ${coverError.message}`);
        }
      }

      // 2. Delete gallery images from Supabase storage
      if (tour.media.gallery?.length > 0) {
        const galleryPaths = tour.media.gallery.map(img => img.split('tour-images/')[1]);
        const { error: galleryError } = await supabase.storage
          .from('tour-images')
          .remove(galleryPaths);
        
        if (galleryError) {
          throw new Error(`Failed to delete gallery images: ${galleryError.message}`);
        }
      }

      // 3. Only proceed to delete Firestore document if all images were deleted successfully
      await deleteDoc(doc(db, 'tours', tour.id));

      toast.success('Tour deleted successfully!');
    } catch (error) {
      console.error('Error deleting tour:', error);
      toast.error(error.message || 'Failed to delete tour. Please try again.');
      return; // Stop further execution
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className={`p-1 md:p-2 rounded-lg transition-colors cursor-pointer ${
        isDeleting 
          ? 'bg-stone-700 text-stone-400' 
          : 'bg-stone-700 hover:bg-red-400 text-stone-300'
      }`}
      aria-label="Delete tour"
    >
      {isDeleting ? (
        <span className="text-xs">Deleting...</span>
      ) : (
        <FaTrash className="h-3 w-3 md:h-4 md:w-4" />
      )}
    </button>
  );
}