'use client'

import { useState, useEffect } from 'react'
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import Image from 'next/image'

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
export default GalleryModal;