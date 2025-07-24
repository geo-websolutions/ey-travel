'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const FullPageBanner = () => {
  const bannerContent = [
    {
      image: '/assets/images/banner-01.jpg',
      title: 'Luxor & Aswan Nile Cruise Tours',
      buttonText: 'View Nile Cruise Packages',
      description: 'Explore ancient temples & sail the Nile in luxury between Egypt\'s historic gems',
      cardDescription: '5-star Nile cruises with Egyptologists | Valley of the Kings access | Luxor & Aswan temple tours'
    },
    {
      image: '/assets/images/banner-02.jpg',
      title: 'Private Giza Pyramids & Cairo Tours',
      buttonText: 'Book Pyramid Excursions',
      description: 'Private guided tours of the Great Pyramids, Sphinx & Egyptian Museum',
      cardDescription: 'VIP pyramid access | Grand Egyptian Museum tours | Cairo city highlights'
    },
    {
      image: '/assets/images/banner-03.jpg',
      title: 'Hurghada Red Sea Vacation Packages',
      buttonText: 'Discover Red Sea Holidays',
      description: 'World-class diving, snorkeling & beach resorts on Egypt\'s Red Sea coast',
      cardDescription: 'All-inclusive resorts | Giftun Island snorkeling | Desert safari combos'
    },
    {
      image: '/assets/images/banner-04.jpg',
      title: 'Marsa Alam Scuba Diving Expeditions',
      buttonText: 'Explore Dive Packages',
      description: 'Pristine coral reefs & dolphin encounters in Egypt\'s southern Red Sea',
      cardDescription: 'Elphinstone Reef diving | Dolphin House snorkeling | Luxury eco-resorts'
    }
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % bannerContent.length);
        setFade(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [bannerContent.length]);

  return (
    <div className="relative inset-0 h-screen w-full z-0 overflow-hidden">
      {bannerContent.map((content, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentIndex 
              ? (fade ? 'opacity-100' : 'opacity-0') 
              : 'opacity-0'
          }`}
        >
          <Image
            src={content.image}
            alt={`Banner ${index + 1}`}
            fill
            className="object-cover w-full h-full"
            priority={index === 0}
            quality={100}
            sizes="100vw"
          />

          {/* Centered Content Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
              {content.title}
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl drop-shadow-md">
              {content.description}
            </p>
            {/* <Link 
              href="/tour-packges" 
              className="px-8 py-3 border-2 border-white text-white rounded-full hover:bg-stone-800 hover:bg-opacity-20 transition-all duration-300 font-medium"
            >
              {content.buttonText}
            </Link> */}
          </div>
        </div>
      ))}

      {/* Enhanced Responsive Bottom Rectangle */}
      <div className="absolute bottom-0 left-0 right-0 mx-auto w-full md:w-5/6 lg:w-3/4 xl:w-2/3 max-w-6xl min-h-24 bg-stone-300 bg-opacity-80 rounded-t-3xl transition-all duration-300 ease-in-out p-4 md:p-6 overflow-hidden z-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Slide Indicator */}
          <div className="flex items-center space-x-2">
            {bannerContent.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? 'bg-stone-700 w-6' : 'bg-stone-500'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Current Slide Info */}
          <div className="text-center md:text-left">
            <h3 className="text-lg md:text-xl font-semibold text-stone-800">
              {bannerContent[currentIndex].title}
            </h3>
            <p className="text-sm md:text-base text-stone-700">
              {bannerContent[currentIndex].cardDescription}
            </p>
          </div>

          {/* Additional Content - Will Expand Container */}
          <div className="w-full md:w-auto">
            <div className="grid grid-cols-2 gap-2 md:gap-4">
              <Link 
                href="/tours" 
                className="px-4 py-2 bg-stone-700 text-white rounded-lg text-sm md:text-base text-center hover:bg-stone-800 transition-colors"
              >
                View Tours
              </Link>
              <Link 
                href="/contact" 
                className="px-4 py-2 border border-stone-700 text-stone-700 rounded-lg text-sm md:text-base text-center hover:bg-stone-300 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Expandable Content Area */}
        <div className="mt-4 pt-4 border-t border-stone-400">
          <p className="text-sm text-stone-700">
            Special offer: Book before {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} and get 10% discount!
          </p>
          {/* Add more content here to expand container vertically */}
        </div>
      </div>
    </div>
  );
};

export default FullPageBanner;