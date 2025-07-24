'use client';

import { motion } from 'framer-motion';
import Link from "next/link";
import Image from 'next/image';

// Animation variants remain the same...
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const cardItem = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
};


export default function HomeMainSection() {
  return (
    <motion.section 
      initial="hidden"
      animate="show"
      variants={container}
      className="bg-soft-black text-stone-100 pt-16 md:pt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Enhanced Introductory Headline with SEO Keywords */}
        <motion.div variants={item} className="text-center mb-16">
          <motion.h1 // Changed to h1 for main page title
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Premium <span className="text-amber-400">Egypt Tour Packages</span> - Luxor, Aswan, Hurghada & More
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl max-w-3xl mx-auto opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 0.4 }}
          >
            Experience 5,000 years of history with EY Travel's award-winning Egypt tours. From the pyramids of Giza to the temples of Luxor and Red Sea resorts in Hurghada, we offer all-inclusive packages with expert Egyptologists.
          </motion.p>
        </motion.div>

        {/* Enhanced Value Propositions */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-20"
          variants={container}
        >
          {[
            {
              icon: "𓃭",
              title: "Authentic Egypt Experiences",
              desc: "Private access to restricted sites like the Valley of the Kings and Abu Simbel with archaeologists who worked on excavations. Our Luxor and Aswan Nile cruises include exclusive evening temple visits."
            },
            {
              icon: "𓂀",
              title: "Luxury Egyptian Accommodations",
              desc: "Stay in 5-star Cairo hotels with pyramid views, private dahabiyas sailing the Nile, and beachfront Hurghada & Marsa Alam resorts. All properties personally vetted by our team."
            },
            {
              icon: "𓆎",
              title: "Seamless Egypt Travel",
              desc: "VIP airport meets, private transfers, and 24/7 English-speaking concierge from arrival to departure. Our Cairo, Giza, and Red Sea tours include all entry fees and permits."
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              variants={cardItem}
              whileHover={{ y: -5 }}
              className="bg-stone-800 bg-opacity-50 p-8 rounded-xl"
            >
              <div className="text-amber-400 text-4xl mb-4">{feature.icon}</div>
              <h2 className="text-xl font-bold mb-3">{feature.title}</h2>
              <p className="opacity-85">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Tours Section with Location Keywords */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Our <span className="text-amber-400">Egypt Tour Packages</span>
          </h2>
          <p className="text-lg mb-12 max-w-2xl mx-auto opacity-90">
            Carefully curated itineraries covering all major Egyptian destinations with luxury transportation and expert guides
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Classic Egypt: Cairo & Nile Cruise",
                desc: "10-day tour covering Giza Pyramids, Egyptian Museum, Luxor, and Aswan",
                highlight: "Includes private guided tours of all major sites",
                locations: ["Cairo", "Giza", "Luxor", "Aswan"],
                image: "/assets/images/tour-01.jpg",
                alt: "Nile cruise ship with pyramids in background"
              },
              {
                title: "Red Sea Paradise Tour",
                desc: "7-day Hurghada and Marsa Alam beach getaway",
                highlight: "Private boat trips and desert safari included",
                locations: ["Hurghada", "Marsa Alam"],
                image: "/assets/images/tour-02.jpg",
                alt: "Luxury resort by the Red Sea"
              },
              {
                title: "Complete Egypt Immersion",
                desc: "14-day grand tour from Alexandria to Abu Simbel",
                highlight: "Meet with archaeology experts at each site",
                locations: ["Cairo", "Alexandria", "Luxor", "Aswan", "Abu Simbel"],
                image: "/assets/images/tour-03.jpg",
                alt: "Abu Simbel temples at sunrise"
              }
            ].map((tour, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-stone-800 bg-opacity-70 rounded-lg overflow-hidden border border-stone-700 hover:border-amber-400 transition-all flex flex-col h-full group"
              >
                <div className="h-48 overflow-hidden relative">
                  <Image 
                    src={tour.image} 
                    alt={tour.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={i < 2}
                    placeholder="blur"
                    blurDataURL="/assets/images/placeholder.jpg"
                  />
                </div>
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-amber-400 transition-colors">{tour.title}</h3>
                  <p className="text-amber-300 mb-3">{tour.desc}</p>
                  <div className="mb-3">
                    <span className="text-sm font-medium">Destinations: </span>
                    {tour.locations.map((loc, idx) => (
                      <span key={idx} className="text-sm opacity-85">
                        {loc}{idx < tour.locations.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm opacity-85 italic">"{tour.highlight}"</p>
                </div>
                <Link 
                  href="/tours/classic-egypt" 
                  className="block w-full bg-amber-600 hover:bg-amber-500 text-center py-3 font-medium transition-colors mt-auto"
                  aria-label={`Explore ${tour.title} itinerary`}
                >
                  Explore Itinerary
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced CTA with Trust Signals */}
        <motion.div 
          className="mt-20 text-center bg-gradient-to-r from-amber-700 to-amber-900 rounded-xl p-8 md:p-12 max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{}}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready for Your Egyptian Adventure?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            As licensed Egypt tour operators with over 15 years of experience, we handle every detail from airport arrival to departure.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/contact" 
                className="px-8 py-3 bg-black text-amber-400 rounded-lg font-bold hover:bg-stone-900 transition-colors block"
                aria-label="Request a custom Egypt tour quote"
              >
                Request Custom Quote
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="tel:+20123456789" 
                className="px-8 py-3 border-2 border-amber-400 text-amber-400 rounded-lg font-bold hover:bg-amber-400 hover:text-stone-300 hover:bg-opacity-10 transition-colors block"
                aria-label="Call our Egypt travel experts"
              >
                Call Our Experts
              </Link>
            </motion.div>
          </div>
          <div className="flex justify-center gap-6 flex-wrap">
            <span className="text-sm opacity-80">✓ Licensed Tour Operator</span>
            <span className="text-sm opacity-80">✓ 24/7 Customer Support</span>
            <span className="text-sm opacity-80">✓ Best Price Guarantee</span>
          </div>
        </motion.div>

        {/* Added SEO-rich Text Section */}
        <motion.div
          className="mt-20 prose prose-invert max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ margin: "-100px" }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Why Choose EY Travel for Your Egypt Vacation?</h2>
          <p className="mb-4">
            As <strong>specialists in Egypt tours</strong>, we offer unparalleled access to the country's most iconic sites. Our <strong>Luxor and Aswan packages</strong> include private guided tours of Karnak Temple, Valley of the Kings, and Philae Temple, while our <strong>Red Sea vacations</strong> in Hurghada and Marsa Alam feature the best snorkeling and diving spots.
          </p>
          <p className="mb-4">
            Every <strong>Cairo and Giza tour</strong> includes skip-the-line access to the Pyramids and Sphinx, with options for private interior explorations. We work directly with <strong>local Egyptologists</strong> who bring ancient history to life with stories you won't hear elsewhere.
          </p>
          <p className="mb-4">
            From the moment you land at Cairo Airport until your departure, our English-speaking representatives ensure <strong>hassle-free travel</strong> throughout Egypt. All our vehicles are modern air-conditioned, and every hotel is personally inspected by our team.
          </p>
        </motion.div>
      </div>
    </motion.section>
  )
}