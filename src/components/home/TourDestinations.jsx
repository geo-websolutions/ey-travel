'use client';

import { motion } from 'framer-motion';
import Link from "next/link";
import Image from 'next/image';

const destinations = [
  {
    name: "Luxor",
    description: "The world's greatest open-air museum with ancient temples and tombs along the Nile River. Walk in the footsteps of pharaohs and discover millennia of history carved in stone.",
    highlight: "Valley of the Kings, Karnak Temple, Luxor Temple, Hot Air Balloon Rides",
    popularTours: [
      "Luxor Full Day Tour",
      "Valley of the Kings VIP Access",
      "Hot Air Balloon Sunrise"
    ],
    image: "/assets/images/luxor.webp",
    alt: "Karnak Temple in Luxor at sunset",
    position: "right"
  },
  {
    name: "Aswan",
    description: "Experience the beauty of Nubian culture against stunning Nile scenery. Aswan offers a more relaxed pace with breathtaking monuments and colorful local markets.",
    highlight: "Philae Temple, Abu Simbel, Felucca Rides, Nubian Villages",
    popularTours: [
      "Philae Temple & High Dam",
      "Abu Simbel Day Trip",
      "Nubian Village Experience"
    ],
    image: "/assets/images/aswan.webp",
    alt: "Nile river view in Aswan",
    position: "left"
  },
  {
    name: "Cairo",
    description: "The vibrant capital where ancient wonders meet modern life. From the iconic pyramids to bustling bazaars, Cairo is a city of contrasts and endless discovery.",
    highlight: "Pyramids of Giza, Egyptian Museum, Islamic Cairo, Khan el-Khalili",
    popularTours: [
      "Pyramids & Sphinx Tour",
      "Egyptian Museum Highlights",
      "Islamic Cairo Walking Tour"
    ],
    image: "/assets/images/cairo.webp",
    alt: "Pyramids of Giza with Cairo skyline",
    position: "right"
  },
  {
    name: "Hurghada",
    description: "Red Sea paradise boasting world-class diving and pristine beaches. Crystal clear waters reveal vibrant coral reefs and abundant marine life.",
    highlight: "Giftun Islands, Desert Safaris, Coral Reefs, Luxury Resorts",
    popularTours: [
      "Giftun Island Snorkeling",
      "Desert Quad Bike Safari",
      "Scuba Diving Adventure"
    ],
    image: "/assets/images/hurghada.webp",
    alt: "Hurghada beach and resort",
    position: "left"
  },
  {
    name: "Marsa Alam",
    description: "Pristine beaches and untouched marine life in Egypt's southern Red Sea coast. Encounter dolphins and explore secluded bays in this diving paradise.",
    highlight: "Dolphin House, Wadi El Gemal, Sataya Reef, Mangrove Forests",
    popularTours: [
      "Dolphin House Snorkeling",
      "Wadi El Gemal National Park",
      "Sataya Reef Excursion"
    ],
    image: "/assets/images/marsa-alam.webp",
    alt: "Marsa Alam underwater coral reef",
    position: "right"
  }
];

export default function TourDestinations() {
  return (
    <div className="relative py-20 bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900/10">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-amber-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-50px" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Explore <span className="text-amber-400">Egypt</span>
          </h2>
          <p className="text-xl md:text-2xl text-stone-300 max-w-3xl mx-auto leading-relaxed">
            Journey through ancient wonders and modern marvels in our handpicked destinations
          </p>
        </motion.div>

        {/* Z-Shaped Destination Layout */}
        <div className="space-y-20 lg:space-y-32">
          {destinations.map((destination, index) => (
            <motion.section
              key={destination.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-50px", once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`relative flex flex-col ${
                destination.position === 'left' ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } items-stretch gap-8 lg:gap-12 min-h-0`}
            >
              {/* Image Section - Fixed height for both mobile and desktop */}
              <div className="flex-1 w-full my-auto">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="relative h-80 lg:h-96 xl:h-[500px] rounded-lg overflow-hidden shadow-2xl group"
                >
                  <Image
                    src={destination.image}
                    alt={destination.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={index < 2}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-stone-900/50 via-stone-900/10 to-transparent lg:bg-gradient-to-t ${
                    destination.position === 'left' 
                      ? 'lg:from-stone-900/40 lg:via-stone-900/5 lg:to-transparent'
                      : 'lg:from-stone-900/40 lg:via-stone-900/5 lg:to-transparent'
                  }`} />
                  
                  {/* Floating Badge - Mobile & Desktop */}
                  <div className="absolute top-6 left-6">
                    <span className="bg-amber-500 text-stone-900 px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wide shadow-lg">
                      {destination.name}
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Content Section */}
              <div className="flex-1 w-full lg:min-h-[500px] flex items-center">
                <motion.div
                  initial={{ opacity: 0, x: destination.position === 'left' ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ margin: "-50px", once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                  className="w-full p-6 lg:p-8"
                >
                  {/* Destination Number - Mobile only */}
                  <div className="flex items-center justify-center lg:justify-start mb-6 lg:hidden">
                    <span className="text-amber-400 text-2xl font-bold mr-3">0{index + 1}</span>
                    <div className="w-12 h-0.5 bg-amber-400"></div>
                  </div>

                  {/* Description */}
                  <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 text-center lg:text-left">
                    Discover {destination.name}
                  </h3>
                  <p className="text-lg text-stone-300 mb-6 leading-relaxed text-center lg:text-left">
                    {destination.description}
                  </p>

                  {/* Highlight */}
                  <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                    <p className="text-amber-300 font-semibold text-sm uppercase tracking-wide mb-2 text-center lg:text-left">
                      Must-See Attractions
                    </p>
                    <p className="text-amber-200 text-lg text-center lg:text-left">{destination.highlight}</p>
                  </div>

                  {/* Popular Tours */}
                  <div className="mb-8">
                    <p className="text-white font-semibold text-lg mb-4 text-center lg:text-left">Popular Tours</p>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center lg:justify-start">
                      {destination.popularTours.map((tour, tourIndex) => (
                        <span
                          key={tourIndex}
                          className="bg-stone-700/50 hover:bg-amber-500/20 border border-stone-600 hover:border-amber-400/50 text-stone-200 hover:text-amber-300 px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer text-sm font-medium text-center"
                        >
                          {tour}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-center lg:text-left"
                  >
                    <Link
                      href={`/destinations/${destination.name.toLowerCase()}`}
                      className="inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-900 font-bold text-lg px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-amber-500/25 min-w-[200px]"
                    >
                      Explore Tours
                      <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </motion.section>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-20"
        >
          <div className="bg-stone-800/50 backdrop-blur-sm rounded-2xl p-8 border border-stone-700 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready for Your Egyptian Adventure?
            </h3>
            <p className="text-stone-300 text-lg mb-6 max-w-2xl mx-auto">
              Browse all our curated tours and find the perfect Egyptian experience tailored to your dreams.
            </p>
            <Link
              href="/destinations"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-900 font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-amber-500/30"
            >
              View All Destinations
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}