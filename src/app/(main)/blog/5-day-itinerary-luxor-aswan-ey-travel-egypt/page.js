"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaClock,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaStar,
  FaShare,
  FaTags,
  FaListOl,
  FaHotel,
  FaShip,
} from "react-icons/fa";

export default function FiveDayItineraryLuxorAswan() {
  const blogData = {
    title: "The Perfect 5-Day Itinerary: Luxor and Aswan Highlights with EY Travel Egypt",
    slug: "5-day-itinerary-luxor-aswan-ey-travel-egypt",
    metaDescription:
      "Plan your perfect Egypt trip with EY Travel Egypt's 5-day Luxor and Aswan itinerary. Includes temples, Nile cruise, and a magical hot air balloon ride.",
    publishedDate: "2025-11-09",
    readTime: "5 min read",
    category: "Travel Tips",
    tags: [
      "Egypt 5-Day Itinerary",
      "Luxor and Aswan Travel Plan",
      "Nile Cruise Egypt",
      "Luxor Hot Air Balloon Ride",
      "EY Travel Egypt",
      "Egypt Tour Packages",
    ],
  };

  const itineraryDays = [
    {
      day: 1,
      title: "Arrival in Luxor & West Bank Wonders",
      activities: [
        "Dawn hot air balloon ride over Luxor",
        "Valley of the Kings exploration",
        "Hatshepsut's Temple visit",
        "Colossi of Memnon photo stop",
        "Welcome dinner at luxury hotel",
      ],
      highlight: "Sunrise hot air balloon experience",
    },
    {
      day: 2,
      title: "East Bank Temples & Night Magic",
      activities: [
        "Karnak Temple Complex tour",
        "Luxor Museum visit",
        "Free time for lunch",
        "Luxor Temple illuminated night tour",
        "Traditional Egyptian dinner",
      ],
      highlight: "Karnak Temple and night illumination",
    },
    {
      day: 3,
      title: "Nile Cruise & Temple Stops",
      activities: [
        "Board luxury Nile cruise ship",
        "Sail south toward Aswan",
        "Edfu Temple visit",
        "Kom Ombo dual temple exploration",
        "Sunset cocktail on cruise deck",
      ],
      highlight: "Nile cruise sailing experience",
    },
    {
      day: 4,
      title: "Aswan Discovery & Nubian Culture",
      activities: [
        "Philae Temple island visit",
        "Traditional felucca sail on Nile",
        "Nubian village cultural experience",
        "Colorful market exploration",
        "Farewell dinner on cruise",
      ],
      highlight: "Nubian village immersion",
    },
    {
      day: 5,
      title: "Grand Finale & Departure",
      activities: [
        "Optional Abu Simbel excursion",
        "Aswan High Dam visit",
        "Unfinished Obelisk viewing",
        "Transfer to airport",
        "Departure with unforgettable memories",
      ],
      highlight: "Optional Abu Simbel temples",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100">
      {/* Hero Section */}
      <section className="relative h-96 w-full overflow-hidden">
        {/* PLACEHOLDER: Update with 5-day itinerary hero image */}
        <Image
          src="/assets/images/blog/5-day-luxor-aswan2.webp"
          alt="5-day Luxor and Aswan itinerary highlights with EY Travel Egypt"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-stone-900/60 to-stone-900/80" />

        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-6xl mx-auto px-4 pb-12 w-full">
            <div className="flex justify-between items-end">
              <div className="max-w-3xl">
                <Link
                  href="/blog"
                  className="inline-flex items-center text-amber-400 hover:text-amber-300 mb-6 transition-colors"
                >
                  <FaArrowLeft className="mr-2" />
                  Back to Blog
                </Link>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg"
                >
                  The Perfect <span className="text-amber-400">5-Day Itinerary</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-xl text-amber-200 drop-shadow-md"
                >
                  Luxor and Aswan Highlights with EY Travel Egypt
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="hidden lg:block text-right"
              >
                <div className="bg-stone-800/50 backdrop-blur-sm rounded-xl p-4 border border-stone-700">
                  <div className="flex items-center text-stone-400 text-sm mb-2">
                    <FaCalendarAlt className="mr-2" />
                    {new Date(blogData.publishedDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex items-center text-stone-400 text-sm">
                    <FaClock className="mr-2" />
                    {blogData.readTime}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-stone-800/50 rounded-xl p-6 border border-stone-700"
            >
              <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center">
                <FaListOl className="mr-2" />
                Quick Overview
              </h3>
              <div className="space-y-3">
                {itineraryDays.map((day) => (
                  <div key={day.day} className="flex items-start">
                    <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 flex-shrink-0">
                      {day.day}
                    </div>
                    <span className="text-stone-300 text-sm">{day.title}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-stone-800/50 rounded-xl p-6 border border-stone-700"
            >
              <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center">
                <FaHotel className="mr-2" />
                Included Services
              </h3>
              <ul className="space-y-2 text-stone-300 text-sm">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>4-star hotels & Nile cruise</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>All transfers & transportation</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>Expert Egyptologist guide</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>All temple entrance fees</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>Daily breakfast & select meals</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="bg-stone-800/50 rounded-xl p-6 border border-stone-700"
            >
              <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center">
                <FaTags className="mr-2" />
                Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {blogData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-stone-700 text-amber-300 text-sm rounded-full border border-stone-600"
                  >
                    #{tag.replace(/\s+/g, "")}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Article Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-3"
          >
            {/* Introduction */}
            <div className="bg-stone-800/50 rounded-xl p-8 border border-stone-700 mb-8">
              <p className="text-xl text-stone-300 leading-relaxed italic border-l-4 border-amber-400 pl-6">
                If you&apos;re planning your first trip to Egypt, five days is the sweet spot —
                enough to explore Luxor and Aswan&apos;s ancient wonders without feeling rushed.
                With EY Travel Egypt, we&apos;ve crafted a 5-day itinerary that balances history,
                adventure, and relaxation.
              </p>
            </div>

            {/* Day 1 */}
            <section className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  1
                </div>
                <h2 className="text-2xl font-bold text-amber-400">Day 1: Arrival in Luxor</h2>
              </div>

              <div className="bg-stone-800/30 rounded-xl p-6 border border-stone-700 mb-4">
                <p className="text-stone-300 leading-relaxed mb-4">
                  Your adventure begins with a dawn hot air balloon ride over Luxor. Watch the
                  temples, Nile, and mountains glow beneath the rising sun. This breathtaking
                  experience sets the tone for your Egyptian adventure.
                </p>
                <p className="text-stone-300 leading-relaxed">
                  After your aerial adventure, visit the Valley of the Kings, Hatshepsut&apos;s
                  Temple, and the Colossi of Memnon. Each site reveals different aspects of ancient
                  Egyptian civilization and royal traditions.
                </p>
              </div>

              {/* PLACEHOLDER: Update with Day 1 image */}
              <div className="relative h-64 rounded-xl overflow-hidden border border-stone-700 mb-6">
                <Image
                  src="/assets/images/blog/day1-luxor-arrival.webp"
                  alt="Hot air balloon over Luxor and West Bank temples"
                  fill
                  className="object-cover"
                />
              </div>
            </section>

            {/* Day 2 */}
            <section className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  2
                </div>
                <h2 className="text-2xl font-bold text-amber-400">Day 2: East Bank Exploration</h2>
              </div>

              <div className="bg-stone-800/30 rounded-xl p-6 border border-stone-700 mb-4">
                <p className="text-stone-300 leading-relaxed mb-4">
                  Discover the majestic Karnak Temple Complex, the largest religious building ever
                  constructed. Wander through the forest of giant columns in the Hypostyle Hall and
                  imagine ancient priests conducting rituals in these sacred spaces.
                </p>
                <p className="text-stone-300 leading-relaxed">
                  Then enjoy Luxor Temple by night, beautifully illuminated against the desert sky.
                  The evening lighting creates a magical atmosphere that brings the ancient stones
                  to life in a completely different way than daytime visits.
                </p>
              </div>

              {/* PLACEHOLDER: Update with Day 2 image */}
              <div className="relative h-64 rounded-xl overflow-hidden border border-stone-700 mb-6">
                <Image
                  src="/assets/images/blog/day2-karnak-temple.webp"
                  alt="Karnak Temple complex and illuminated Luxor Temple at night"
                  fill
                  className="object-cover"
                />
              </div>
            </section>

            {/* Day 3 */}
            <section className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  3
                </div>
                <h2 className="text-2xl font-bold text-amber-400">Day 3: Cruise Southward</h2>
              </div>

              <div className="bg-stone-800/30 rounded-xl p-6 border border-stone-700 mb-4">
                <p className="text-stone-300 leading-relaxed mb-4">
                  Board your Nile cruise — organized by EY Travel Egypt — and sail toward Aswan. As
                  you glide along the timeless river, watch daily Egyptian life unfold along the
                  banks while enjoying modern comforts aboard your floating hotel.
                </p>
                <p className="text-stone-300 leading-relaxed">
                  Visit Edfu Temple, dedicated to the falcon god Horus, and Kom Ombo, uniquely
                  devoted to two gods: Sobek the crocodile and Horus the Elder. Each temple offers
                  unique insights into ancient Egyptian religious practices and architectural
                  styles.
                </p>
              </div>

              {/* PLACEHOLDER: Update with Day 3 image */}
              <div className="relative h-64 rounded-xl overflow-hidden border border-stone-700 mb-6">
                <Image
                  src="/assets/images/blog/day3-nile-cruise.webp"
                  alt="Nile cruise ship and temple visits along the river"
                  fill
                  className="object-cover"
                />
              </div>
            </section>

            {/* Day 4 */}
            <section className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  4
                </div>
                <h2 className="text-2xl font-bold text-amber-400">Day 4: Discover Aswan</h2>
              </div>

              <div className="bg-stone-800/30 rounded-xl p-6 border border-stone-700 mb-4">
                <p className="text-stone-300 leading-relaxed mb-4">
                  Explore Philae Temple, beautifully situated on an island and dedicated to the
                  goddess Isis. The temple&apos;s relocation to higher ground to save it from
                  flooding is a modern engineering marvel.
                </p>
                <p className="text-stone-300 leading-relaxed">
                  Take a traditional felucca ride on the Nile, experiencing the river as Egyptians
                  have for millennia. Then stroll through the colorful Nubian markets, where you can
                  find authentic crafts and interact with local artisans.
                </p>
              </div>

              {/* PLACEHOLDER: Update with Day 4 image */}
              <div className="relative h-64 rounded-xl overflow-hidden border border-stone-700 mb-6">
                <Image
                  src="/assets/images/blog/day4-aswan-discovery.webp"
                  alt="Philae Temple and felucca sailing in Aswan"
                  fill
                  className="object-cover"
                />
              </div>
            </section>

            {/* Day 5 */}
            <section className="mb-12">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  5
                </div>
                <h2 className="text-2xl font-bold text-amber-400">
                  Day 5: Optional Abu Simbel Excursion
                </h2>
              </div>

              <div className="bg-stone-800/30 rounded-xl p-6 border border-stone-700 mb-4">
                <p className="text-stone-300 leading-relaxed">
                  For a grand finale, travel to Abu Simbel, one of the most awe-inspiring temples in
                  Egypt, built by Ramses II. The monumental statues and precise astronomical
                  alignment make this UNESCO World Heritage site an unforgettable conclusion to your
                  Egyptian adventure.
                </p>
              </div>

              <div className="bg-amber-500/10 rounded-xl p-6 border border-amber-500/30 mb-6">
                <h3 className="text-xl font-bold text-amber-400 mb-3">
                  The EY Travel Egypt Advantage
                </h3>
                <p className="text-stone-300 leading-relaxed">
                  Every hotel, transfer, and guided experience is personally arranged by EY Travel
                  Egypt, ensuring a journey as seamless as it is unforgettable. Our local expertise
                  and attention to detail mean you can focus on creating memories while we handle
                  the logistics.
                </p>
              </div>

              {/* PLACEHOLDER: Update with Day 5 image */}
              <div className="relative h-64 rounded-xl overflow-hidden border border-stone-700">
                <Image
                  src="/assets/images/blog/day5-abu-simbel.webp"
                  alt="Magnificent Abu Simbel temples as grand finale"
                  fill
                  className="object-cover"
                />
              </div>
            </section>

            {/* Call to Action */}
            <section className="bg-gradient-to-r from-amber-700 to-amber-900 rounded-xl p-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to Experience This Itinerary?
              </h2>
              <p className="text-amber-100 mb-6 text-lg">
                Let EY Travel Egypt make your perfect 5-day Luxor and Aswan adventure a reality
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/destinations/luxor"
                  className="inline-flex items-center px-8 py-3 bg-white text-amber-700 font-bold rounded-lg hover:bg-stone-100 transition-colors"
                >
                  Book This Itinerary
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-amber-700 hover:bg-opacity-10 transition-colors"
                >
                  Customize Your Trip
                </Link>
              </div>
            </section>

            {/* Share Section */}
            <div className="flex items-center justify-between mt-8 pt-8 border-t border-stone-700">
              <div className="flex items-center text-stone-400 text-sm">
                <FaTags className="mr-2" />
                <span>Filed under: {blogData.category}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-stone-400 text-sm">Share:</span>
                <button className="text-stone-400 hover:text-amber-400 transition-colors">
                  <FaShare size={16} />
                </button>
              </div>
            </div>
          </motion.article>
        </div>
      </div>

      {/* Related Posts Section */}
      <section className="py-16 bg-stone-800/30">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-amber-400 text-center mb-12">
            More Egypt Travel Planning Guides
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Nile Cruise Experience",
                description: "Luxury cruise details between Luxor and Aswan",
                link: "/blog/luxor-aswan-nile-cruise-ey-travel-egypt",
              },
              {
                title: "Hidden Gems Guide",
                description: "Off-the-beaten-path locations in Upper Egypt",
                link: "/blog/hidden-gems-luxor-aswan-ey-travel-egypt",
              },
              {
                title: "Cultural Tours",
                description: "Authentic Egyptian cultural experiences",
                link: "/blog/cultural-tours-nile-luxor-aswan-ey-travel-egypt",
              },
            ].map((post, index) => (
              <Link key={index} href={post.link}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-stone-800/50 rounded-xl p-6 border border-stone-700 hover:border-amber-500/50 transition-all duration-300 h-full"
                >
                  <h3 className="text-lg font-bold text-white mb-2 hover:text-amber-300 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-stone-400 text-sm">{post.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
