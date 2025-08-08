'use client';

import { motion } from 'framer-motion';
import Link from "next/link";
import Image from 'next/image';

const destinations = [
  {
    name: "Luxor",
    description: "The world's greatest open-air museum with ancient temples and tombs",
    toursCount: 8,
    highlight: "Includes Valley of the Kings, Karnak Temple, and Luxor Temple",
    popularTours: [
      "Luxor Full Day Tour",
      "Valley of the Kings VIP Access",
      "Hot Air Balloon Sunrise"
    ],
    image: "/assets/images/luxor.webp",
    alt: "Karnak Temple in Luxor at sunset"
  },
  {
    name: "Aswan",
    description: "Nubian culture and stunning Nile scenery",
    toursCount: 5,
    highlight: "Visit Philae Temple, Abu Simbel, and take a felucca ride",
    popularTours: [
      "Philae Temple & High Dam",
      "Abu Simbel Day Trip",
      "Nubian Village Experience"
    ],
    image: "/assets/images/aswan.webp",
    alt: "Nile river view in Aswan"
  },
  {
    name: "Cairo",
    description: "Vibrant capital with iconic pyramids and museums",
    toursCount: 10,
    highlight: "Explore the Pyramids of Giza, Egyptian Museum, and Islamic Cairo",
    popularTours: [
      "Pyramids & Sphinx Tour",
      "Egyptian Museum Highlights",
      "Islamic Cairo Walking Tour"
    ],
    image: "/assets/images/cairo.webp",
    alt: "Pyramids of Giza with Cairo skyline"
  },
  {
    name: "Hurghada",
    description: "Red Sea paradise with world-class diving",
    toursCount: 7,
    highlight: "Crystal clear waters, coral reefs, and desert adventures",
    popularTours: [
      "Giftun Island Snorkeling",
      "Desert Quad Bike Safari",
      "Scuba Diving Adventure"
    ],
    image: "/assets/images/hurghada.webp",
    alt: "Hurghada beach and resort"
  },
  {
    name: "Marsa Alam",
    description: "Pristine beaches and untouched marine life",
    toursCount: 4,
    highlight: "Dolphin encounters and secluded bays",
    popularTours: [
      "Dolphin House Snorkeling",
      "Wadi El Gemal National Park",
      "Sataya Reef Excursion"
    ],
    image: "/assets/images/marsa-alam.webp",
    alt: "Marsa Alam underwater coral reef"
  }
];

export default function TourDestinations() {
  return (
    <motion.div 
      className="text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-2">
        Explore <span className="text-amber-400">Egypt's Top Destinations</span>
      </h2>
      <p className="text-lg mb-12 max-w-2xl mx-auto opacity-90">
        Discover the most breathtaking locations across Egypt with our curated selection of destinations
      </p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((destination, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-50px" }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-stone-800 bg-opacity-70 rounded-lg overflow-hidden border border-stone-700 hover:border-amber-400 transition-all flex flex-col h-full group relative"
          >
            {/* Destination Image */}
            <div className="h-48 overflow-hidden relative">
              <Image 
                src={destination.image} 
                alt={destination.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={i < 2}
                placeholder="blur"
                blurDataURL="/assets/images/placeholder.jpg"
              />
              {/* Tours Count Badge */}
              {/* <div className="absolute top-4 right-4 bg-amber-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                {destination.toursCount} {destination.toursCount === 1 ? 'Tour' : 'Tours'}
              </div> */}
            </div>
            
            {/* Destination Content */}
            <div className="p-6 flex-grow">
              <h3 className="text-xl font-bold mb-2 group-hover:text-amber-400 transition-colors">
                {destination.name}
              </h3>
              <p className="text-amber-300 mb-3">{destination.description}</p>
              
              {/* Highlight */}
              <div className="mb-4">
                <p className="text-sm opacity-85 italic">"{destination.highlight}"</p>
              </div>
              
              {/* Popular Tours */}
              <div className="mt-auto pt-4 border-t border-stone-700">
                <p className="text-sm font-medium mb-2">Popular tours include:</p>
                <ul className="text-xs space-y-1">
                  {destination.popularTours.map((tour, idx) => (
                    <li key={idx} className="opacity-80">• {tour}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Explore Button */}
            <Link 
              href={`/destinations/${destination.name.toLowerCase()}`} 
              className="block w-full bg-amber-600 hover:bg-amber-500 text-center py-3 font-medium transition-colors mt-auto"
              aria-label={`Explore ${destination.name} destination`}
            >
              {destination.name} Tours
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}