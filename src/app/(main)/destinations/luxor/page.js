'use client';

import { FaStar, FaClock, FaUsers, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { GiEgyptianTemple, GiStonePath } from 'react-icons/gi';
import { motion } from 'framer-motion';

// Tour data
const luxorTours = [
  {
    id: 1,
    title: "Luxor Full Day Tour",
    description: "Explore Luxor's greatest treasures in one comprehensive day",
    insight: "This tour covers both East and West Bank highlights with an expert Egyptologist guide",
    price: 120,
    featured: true,
    type: "Historical",
    duration: "8 hours",
    groupSize: "Small group (max 12)",
    includes: ["Entrance fees", "Expert guide", "Lunch", "Hotel pickup"],
    highlights: [
      "Valley of the Kings (3 tombs)",
      "Hatshepsut Temple",
      "Karnak Temple",
      "Luxor Temple",
      "Colossi of Memnon"
    ]
  },
  {
    id: 2,
    title: "Hot Air Balloon Sunrise",
    description: "Breathtaking views of Luxor from above at sunrise",
    insight: "Early morning flight provides cooler temperatures and magical light over ancient sites",
    price: 85,
    featured: true,
    type: "Adventure",
    duration: "3 hours",
    groupSize: "Shared flight (16-20)",
    includes: ["Flight certificate", "Transport", "Tea/coffee"],
    highlights: [
      "Sunrise over Nile Valley",
      "Aerial view of temples",
      "Photo opportunities",
      "Peaceful experience"
    ]
  },
  {
    id: 3,
    title: "Valley of the Kings VIP Access",
    description: "Exclusive access to normally closed tombs",
    insight: "Special permission allows access to tombs not open to general public",
    price: 250,
    featured: false,
    type: "Premium",
    duration: "5 hours",
    groupSize: "Private (2-4)",
    includes: ["Special permits", "Egyptologist", "Water/snacks"],
    highlights: [
      "Tomb of Seti I (additional fee)",
      "Nefertari's Tomb (when available)",
      "KV9 (Ramses V/VI)",
      "KV17 (Seti I)"
    ]
  },
  {
    id: 4,
    title: "Karnak Temple Sound & Light Show",
    description: "Evening spectacle bringing ancient history to life",
    insight: "Dramatic lighting and narration tell Karnak's 4,000 year story",
    price: 65,
    featured: false,
    type: "Cultural",
    duration: "2 hours",
    groupSize: "Medium group",
    includes: ["Show tickets", "Transport", "Guide"],
    highlights: [
      "Illuminated temple at night",
      "Historical narration",
      "Dramatic sound effects",
      "Evening temperatures"
    ]
  },
  {
    id: 5,
    title: "West Bank Cycling Tour",
    description: "Eco-friendly exploration of ancient sites by bicycle",
    insight: "Avoid crowds and experience local life while visiting monuments",
    price: 75,
    featured: true,
    type: "Active",
    duration: "6 hours",
    groupSize: "Small group (max 8)",
    includes: ["Bike rental", "Helmet", "Guide", "Water"],
    highlights: [
      "Local villages",
      "Tombs of Nobles",
      "Ramesseum",
      "Deir el-Medina"
    ]
  }
];

export default function LuxorToursPage() {
  return (
    <div className="min-h-screen bg-stone-900 text-white">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/70 to-stone-900/20 z-10" />
        <img 
          src="/assets/images/luxor-hero.jpg" 
          alt="Luxor temples at sunset" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Luxor <span className="text-amber-400">Tours & Experiences</span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            Walk in the footsteps of pharaohs in the world's greatest open-air museum
          </motion.p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-6">
            Discover <span className="text-amber-400">Ancient Thebes</span>
          </h2>
          <p className="text-lg mb-6">
            Luxor, ancient Thebes, was the glorious capital of Egypt at the height of its power. Today it offers more monumental wonders than anywhere else in the world.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { icon: <GiEgyptianTemple size={24} />, label: "60+ Ancient Sites" },
              { icon: <FaClock size={24} />, label: "4000+ Years of History" },
              { icon: <GiStonePath size={24} />, label: "2 UNESCO Areas" },
              { icon: <FaMapMarkerAlt size={24} />, label: "Nile River Views" }
            ].map((item, index) => (
              <div key={index} className="bg-stone-800/50 p-4 rounded-lg">
                <div className="text-amber-400 mb-2">{item.icon}</div>
                <p className="text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Tours Section */}
      <section className="pb-16 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">
            Our <span className="text-amber-400">Luxor Tours</span>
          </h2>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-amber-600 rounded-lg text-sm">All Tours</button>
            <button className="px-4 py-2 bg-stone-700 rounded-lg text-sm">Historical</button>
            <button className="px-4 py-2 bg-stone-700 rounded-lg text-sm">Adventure</button>
          </div>
        </div>

        {/* Tours Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {luxorTours.map((tour, index) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`bg-stone-800 rounded-lg overflow-hidden border ${tour.featured ? 'border-amber-400/50' : 'border-stone-700'} hover:shadow-lg hover:shadow-amber-400/10 transition-all`}
            >
              {/* Featured Badge */}
              {tour.featured && (
                <div className="absolute top-4 left-4 bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
                  <FaStar className="mr-1" size={10} /> FEATURED
                </div>
              )}

              {/* Tour Image */}
              <div className="h-48 bg-stone-700 relative overflow-hidden">
                <img 
                  src={`/assets/images/luxor-tour-${tour.id}.jpg`} 
                  alt={tour.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {/* Tour Type */}
                <div className="absolute bottom-4 right-4 bg-stone-900/80 text-white text-xs px-2 py-1 rounded">
                  {tour.type}
                </div>
              </div>

              {/* Tour Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{tour.title}</h3>
                  <div className="text-amber-400 font-bold text-lg">${tour.price}</div>
                </div>
                
                <p className="text-amber-300 mb-3">{tour.description}</p>
                
                <div className="mb-4">
                  <p className="text-sm italic opacity-80">"{tour.insight}"</p>
                </div>
                
                <div className="flex items-center text-sm space-x-4 mb-4 text-stone-400">
                  <div className="flex items-center">
                    <FaClock className="mr-1" size={12} /> {tour.duration}
                  </div>
                  <div className="flex items-center">
                    <FaUsers className="mr-1" size={12} /> {tour.groupSize}
                  </div>
                </div>
                
                <div className="border-t border-stone-700 pt-4">
                  <p className="text-sm font-medium mb-2">Tour includes:</p>
                  <ul className="text-xs space-y-1 mb-4">
                    {tour.includes.map((item, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="text-amber-400 mr-1">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button className="w-full bg-amber-600 hover:bg-amber-500 py-2 rounded-lg font-medium transition-colors">
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Luxor Section */}
      <section className="py-16 bg-stone-800/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Why Visit <span className="text-amber-400">Luxor</span>?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-stone-800/50 p-6 rounded-lg border border-stone-700">
                <h3 className="text-xl font-bold mb-3 text-amber-400">East Bank</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-amber-400 mr-2">•</span>
                    <span>Karnak Temple - Largest religious complex ever built</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-400 mr-2">•</span>
                    <span>Luxor Temple - Magnificently illuminated at night</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-400 mr-2">•</span>
                    <span>Luxor Museum - Finest collection of ancient artifacts</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-stone-800/50 p-6 rounded-lg border border-stone-700">
                <h3 className="text-xl font-bold mb-3 text-amber-400">West Bank</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-amber-400 mr-2">•</span>
                    <span>Valley of the Kings - 60+ royal tombs including Tutankhamun</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-400 mr-2">•</span>
                    <span>Hatshepsut Temple - Dramatic cliffside mortuary temple</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-400 mr-2">•</span>
                    <span>Valley of the Queens - Resting place of Nefertari and others</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            Need Help <span className="text-amber-400">Choosing a Tour</span>?
          </h2>
          <p className="text-lg mb-8">
            Our Luxor specialists can create a custom itinerary based on your interests and schedule
          </p>
          <button className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors">
            Contact Our Experts
          </button>
        </div>
      </section>
    </div>
  );
}