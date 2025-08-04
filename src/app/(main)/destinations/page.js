'use client';

import { FaUmbrellaBeach, FaLandmark, FaWater, FaMountain, FaStar } from 'react-icons/fa';
import { GiEgyptianTemple, GiDesert } from 'react-icons/gi';
import TourDestinations from '@/components/home/TourDestinations';
import { motion } from 'framer-motion';

export default function DestinationsPage() {
  return (
    <div className="bg-stone-900 text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/assets/videos/egypt-hero.mp4" type="video/mp4" />
        </video>
        
        <motion.div 
          className="relative z-20 text-center px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover <span className="text-amber-400">Egypt's Treasures</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            From ancient wonders to breathtaking landscapes, explore the very best of Egypt
          </p>
        </motion.div>
      </section>

      {/* Experience Types */}
      <section className="py-16 bg-stone-800/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Types of <span className="text-amber-400">Egyptian Experiences</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { icon: <GiEgyptianTemple size={32} />, label: "Ancient Sites" },
              { icon: <FaLandmark size={32} />, label: "Cultural Tours" },
              { icon: <FaUmbrellaBeach size={32} />, label: "Beach Resorts" },
              { icon: <FaWater size={32} />, label: "Nile Cruises" },
              { icon: <GiDesert size={32} />, label: "Desert Safaris" },
              { icon: <FaMountain size={32} />, label: "Adventure" }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-stone-700/50 p-6 rounded-lg text-center hover:bg-amber-600/20 hover:border-amber-400 border border-transparent transition-all"
              >
                <div className="text-amber-400 mb-3 flex justify-center">
                  {item.icon}
                </div>
                <h3 className="font-medium">{item.label}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Destinations Section */}
      <section className="py-16 container mx-auto px-4">
        <TourDestinations />
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-amber-600/20 to-amber-800/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to <span className="text-amber-400">Explore Egypt</span>?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact our travel experts to plan your perfect Egyptian adventure
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors"
          >
            Get Your Custom Itinerary
          </motion.button>
        </div>
      </section>
    </div>
  );
}