import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaStar, FaClock, FaUsers } from 'react-icons/fa';

function formatToTitleCase(text) {
  if (!text) return ''; // Handle empty input

  // Replace underscores and dashes with spaces
  const withSpaces = text.replace(/[_-]/g, ' ');

  // Capitalize the first letter of each word
  return withSpaces.replace(/\b\w/g, char => char.toUpperCase());
}

export default function TourCardsSection({ tours, city, slug }) {

  if (!tours || tours.length === 0) {
    return (
      <section className="py-16 container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">No Tours Available</h2>
          <p className="text-lg text-stone-400">Please check back later for available tours.</p>
        </div>
      </section>
    );
  }
  return (
    <section className="pb-16 container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">
          Our <span className="text-amber-400">{city} Tours</span>
        </h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-amber-600 rounded-lg text-sm">All Tours</button>
          <button className="px-4 py-2 bg-stone-700 rounded-lg text-sm">Historical</button>
          <button className="px-4 py-2 bg-stone-700 rounded-lg text-sm">Adventure</button>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour, index) => (
          <motion.div
            key={tour.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-50px" }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className={`bg-stone-800 rounded-lg overflow-hidden border ${tour.basicInfo.featured ? 'border-amber-400/50' : 'border-stone-700'} hover:shadow-lg hover:shadow-amber-400/10 transition-all flex flex-col h-full`}
          >
            {/* Featured Badge */}
            {tour.basicInfo.featured && (
              <div className="absolute top-4 left-4 bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
                <FaStar className="mr-1" size={10} /> FEATURED
              </div>
            )}

            {/* Tour Image */}
            <Link href={`tours/${tour.basicInfo.slug}`} className="h-50 bg-stone-700 relative overflow-hidden">
              <Image 
                src={tour.media.coverImage}
                alt={tour.basicInfo.title}
                fill
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              {/* Tour Type */}
              <div className="absolute bottom-4 right-4 bg-stone-900/80 text-white text-xs px-2 py-1 rounded">
                {console.log(tour.basicInfo.type)}
                {(Array.isArray(tour.basicInfo.type) ? tour.basicInfo.type : [tour.basicInfo.type])
                  .map((type, i) => (
                    <span 
                      key={i} 
                      className="bg-stone-900/80 text-white text-xs px-2 py-1 rounded"
                    >
                      {formatToTitleCase(type)}
                    </span>
                  ))}
              </div>
            </Link>

            {/* Tour Content - Optimized spacing */}
            <div className="p-6 flex flex-col h-80">
              <div className="flex-1"> {/* This will grow to fill available space */}
                <Link href={`tours/${tour.basicInfo.slug}`} className="block mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{tour.basicInfo.title}</h3>
                    <div className="text-amber-400 font-bold text-lg">${tour.pricing.basePrice}</div>
                  </div>
                  <p className="text-amber-300">{tour.basicInfo.shortDescription}</p>
                </Link>
              </div>

              {/* Bottom-aligned section */}
              <div>
                <div className="flex items-center text-sm space-x-4 mb-4 text-stone-400">
                  <div className="flex items-center">
                    <FaClock className="mr-1" size={12} /> {tour.basicInfo.duration} {tour.basicInfo.durationType}
                  </div>
                  <div className="flex items-center">
                    <FaUsers className="mr-1" size={12} /> (Max Group Size) {tour.basicInfo.maxGroupSize} People
                  </div>
                </div>
                <Link href={`tours/${tour.basicInfo.slug}`}>
                  <button className="w-full bg-amber-600 hover:bg-amber-500 py-2 rounded-lg font-medium transition-colors cursor-pointer">
                    View Tour
                  </button>
                </Link>
                
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}