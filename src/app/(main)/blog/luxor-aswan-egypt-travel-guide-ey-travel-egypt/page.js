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
} from "react-icons/fa";

export default function LuxorAswanTravelGuide() {
  const blogData = {
    title:
      "A Journey Through Time with EY Travel Egypt: Discover the Ancient Wonders of Luxor and Aswan",
    slug: "luxor-aswan-egypt-travel-guide-ey-travel-egypt",
    metaDescription:
      "Explore the best of Egypt with EY Travel Egypt — from Luxor's temples to Aswan's charm. Enjoy a Luxor hot air balloon ride and experience the timeless beauty of the Nile.",
    publishedDate: "2025-11-09",
    readTime: "3 min read",
    category: "Travel Guide",
    tags: [
      "Luxor Travel Guide",
      "Aswan Egypt Tours",
      "Luxor Hot Air Balloon",
      "EY Travel Egypt",
      "Nile Cruise Experiences",
      "Egypt Travel Packages",
    ],
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100">
      {/* Hero Section */}
      <section className="relative h-96 w-full overflow-hidden">
        {/* Update this image path with your actual hero image */}
        <Image
          src="/assets/images/blog/luxor-aswan-hero.webp" // PLACEHOLDER: Update this path
          alt="Luxor and Aswan Nile River landscape with ancient temples"
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
                  A Journey Through Time with{" "}
                  <span className="text-amber-400">EY Travel Egypt</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-xl text-amber-200 drop-shadow-md"
                >
                  Discover the Ancient Wonders of Luxor and Aswan
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
                <FaMapMarkerAlt className="mr-2" />
                Tour Highlights
              </h3>
              <ul className="space-y-3 text-stone-300">
                <li className="flex items-start">
                  <FaStar className="text-amber-400 mt-1 mr-3 flex-shrink-0" size={14} />
                  <span>Luxor Hot Air Balloon Ride</span>
                </li>
                <li className="flex items-start">
                  <FaStar className="text-amber-400 mt-1 mr-3 flex-shrink-0" size={14} />
                  <span>Valley of the Kings Exploration</span>
                </li>
                <li className="flex items-start">
                  <FaStar className="text-amber-400 mt-1 mr-3 flex-shrink-0" size={14} />
                  <span>Philae Temple Visit</span>
                </li>
                <li className="flex items-start">
                  <FaStar className="text-amber-400 mt-1 mr-3 flex-shrink-0" size={14} />
                  <span>Abu Simbel Day Trip</span>
                </li>
                <li className="flex items-start">
                  <FaStar className="text-amber-400 mt-1 mr-3 flex-shrink-0" size={14} />
                  <span>Nile Felucca Cruise</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
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
                Egypt is a living museum — and nowhere is that more evident than in Luxor and Aswan,
                the crown jewels of the Nile Valley. With EY Travel Egypt (Elevate Your Travel
                Egypt), you can step back thousands of years into a world of temples, tombs, and
                timeless legends.
              </p>
            </div>

            {/* Luxor Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-amber-400 mb-6 flex items-center">
                <div className="w-2 h-8 bg-amber-500 rounded-full mr-3"></div>
                The Magic of Luxor: World&apos;s Greatest Open-Air Museum
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-stone-300 leading-relaxed mb-4">
                    Begin your adventure in Luxor, often called the world&apos;s greatest open-air
                    museum. At dawn, rise gently in a Luxor hot air balloon, soaring above the
                    Valley of the Kings as the golden sun illuminates the Theban mountains.
                  </p>
                  <p className="text-stone-300 leading-relaxed">
                    This breathtaking view is the perfect introduction to a city where every corner
                    tells a story — from the colossal statues at the Temple of Karnak to the elegant
                    columns of Luxor Temple that glow at sunset.
                  </p>
                </div>
                <div className="relative h-64 rounded-xl overflow-hidden border border-stone-700">
                  {/* PLACEHOLDER: Update with Luxor hot air balloon image */}
                  <Image
                    src="/assets/images/blog/luxor-hot-air-balloon.webp"
                    alt="Luxor hot air balloon ride over Valley of the Kings"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="bg-stone-800/30 rounded-xl p-6 border border-stone-700 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">West Bank Wonders</h3>
                <p className="text-stone-300 leading-relaxed">
                  In the West Bank of Luxor, explore the Tombs of the Pharaohs, each wall alive with
                  color and myth. Visit Hatshepsut&apos;s Temple, a masterpiece of architecture
                  carved into the cliffs, and imagine the ancient processions that once crossed the
                  Nile to worship the gods.
                </p>
              </div>

              <div className="relative h-80 rounded-xl overflow-hidden border border-stone-700 mb-6">
                {/* PLACEHOLDER: Update with Karnak Temple image */}
                <Image
                  src="/assets/images/blog/karnak-temple.webp"
                  alt="Magnificent columns of Karnak Temple in Luxor"
                  fill
                  className="object-cover"
                />
              </div>
            </section>

            {/* Aswan Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-amber-400 mb-6 flex items-center">
                <div className="w-2 h-8 bg-amber-500 rounded-full mr-3"></div>
                Aswan: Where Time Slows and Beauty Unfolds
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="relative h-64 rounded-xl overflow-hidden border border-stone-700 order-2 md:order-1">
                  {/* PLACEHOLDER: Update with Aswan felucca image */}
                  <Image
                    src="/assets/images/blog/aswan-felucca.webp"
                    alt="Traditional felucca sailing on the Nile in Aswan"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="order-1 md:order-2">
                  <p className="text-stone-300 leading-relaxed mb-4">
                    Then follow the river south to Aswan, where time slows and the beauty of
                    Egypt&apos;s southern landscapes unfolds. Visit the Philae Temple, dedicated to
                    Isis, and take a tranquil felucca ride on the Nile&apos;s sparkling waters.
                  </p>
                  <p className="text-stone-300 leading-relaxed">
                    Don&apos;t miss the legendary Abu Simbel Temples, carved by Ramses II — a UNESCO
                    World Heritage site that never fails to awe visitors with its monumental scale
                    and precision.
                  </p>
                </div>
              </div>

              <div className="bg-amber-500/10 rounded-xl p-6 border border-amber-500/30 mb-6">
                <h3 className="text-xl font-bold text-amber-400 mb-3">
                  Why Choose EY Travel Egypt?
                </h3>
                <p className="text-stone-300 leading-relaxed">
                  With EY Travel Egypt, every tour is designed to elevate your experience — blending
                  expert-guided history with personalized comfort. Whether you&apos;re chasing
                  sunrise over Luxor or watching the sunset in Aswan, this journey through time will
                  redefine how you see Egypt.
                </p>
              </div>

              <div className="relative h-80 rounded-xl overflow-hidden border border-stone-700">
                {/* PLACEHOLDER: Update with Abu Simbel image */}
                <Image
                  src="/assets/images/blog/abu-simbel.webp"
                  alt="Magnificent Abu Simbel temples carved into mountainside"
                  fill
                  className="object-cover"
                />
              </div>
            </section>

            {/* Call to Action */}
            <section className="bg-gradient-to-r from-amber-700 to-amber-900 rounded-xl p-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to Explore Ancient Egypt?
              </h2>
              <p className="text-amber-100 mb-6 text-lg">
                Let EY Travel Egypt craft your perfect journey through Luxor and Aswan
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/destinations/luxor"
                  className="inline-flex items-center px-8 py-3 bg-white text-amber-700 font-bold rounded-lg hover:bg-stone-100 transition-colors"
                >
                  Explore Luxor Tours
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:bg-opacity-10 hover:text-amber-700 transition-colors"
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
            More Egypt Travel Guides
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Wonders of Luxor & Aswan",
                description:
                  "Explore ancient temples and hot air balloon adventures in Upper Egypt",
                link: "/blog/luxor-aswan-egypt-travel-guide-ey-travel-egypt",
              },
              {
                title: "5-Day Egypt Itinerary",
                description: "Perfect Luxor & Aswan tour including Nile cruise experience",
                link: "/blog/5-day-itinerary-luxor-aswan-ey-travel-egypt",
              },
              {
                title: "Hidden Gems Along the Nile",
                description: "Discover secret temples and authentic Nubian experiences",
                link: "/blog/hidden-gems-luxor-aswan-ey-travel-egypt",
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
