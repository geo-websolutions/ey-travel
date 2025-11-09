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
  FaShip,
  FaUmbrellaBeach,
} from "react-icons/fa";

export default function LuxorAswanNileCruise() {
  const blogData = {
    title: "Sailing the Nile in Style: Luxor to Aswan Cruise with EY Travel Egypt",
    slug: "luxor-aswan-nile-cruise-ey-travel-egypt",
    metaDescription:
      "Embark on a Luxor to Aswan Nile cruise with EY Travel Egypt. Experience ancient temples, sunset sails, and a breathtaking Luxor hot air balloon ride.",
    publishedDate: "2025-11-09",
    readTime: "6 min read",
    category: "Nile Cruise",
    tags: [
      "Luxor Aswan Cruise",
      "Nile River Cruise Egypt",
      "EY Travel Egypt",
      "Luxor Hot Air Balloon",
      "Egypt Luxury Travel",
      "Nile Tour Packages",
    ],
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100">
      {/* Hero Section */}
      <section className="relative h-96 w-full overflow-hidden">
        {/* Update this image path with your actual hero image */}
        <Image
          src="/assets/images/blog/luxor-aswan-nile-cruise2.webp"
          alt="Luxury Nile cruise ship sailing between Luxor and Aswan"
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
                  Sailing the Nile in <span className="text-amber-400">Style</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-xl text-amber-200 drop-shadow-md"
                >
                  Luxor to Aswan Cruise with EY Travel Egypt
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
                <FaShip className="mr-2" />
                Cruise Highlights
              </h3>
              <ul className="space-y-3 text-stone-300">
                <li className="flex items-start">
                  <FaStar className="text-amber-400 mt-1 mr-3 flex-shrink-0" size={14} />
                  <span>Luxor Hot Air Balloon Experience</span>
                </li>
                <li className="flex items-start">
                  <FaStar className="text-amber-400 mt-1 mr-3 flex-shrink-0" size={14} />
                  <span>Edfu Temple Exploration</span>
                </li>
                <li className="flex items-start">
                  <FaStar className="text-amber-400 mt-1 mr-3 flex-shrink-0" size={14} />
                  <span>Kom Ombo Dual Temple Visit</span>
                </li>
                <li className="flex items-start">
                  <FaStar className="text-amber-400 mt-1 mr-3 flex-shrink-0" size={14} />
                  <span>Philae Temple & Nubian Villages</span>
                </li>
                <li className="flex items-start">
                  <FaStar className="text-amber-400 mt-1 mr-3 flex-shrink-0" size={14} />
                  <span>Optional Abu Simbel Extension</span>
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
                <FaUmbrellaBeach className="mr-2" />
                Cruise Inclusions
              </h3>
              <ul className="space-y-2 text-stone-300 text-sm">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>Luxury Cabin Accommodation</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>All Meals & Fine Dining</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>Expert Egyptologist Guide</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>All Temple Entrance Fees</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>Sunset Felucca Rides</span>
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
                There&apos;s no journey on Earth quite like a Nile River cruise — the slow rhythm of
                the river, the call of history from every bank, and the mesmerizing blend of past
                and present. With EY Travel Egypt, you can experience it all through our expertly
                curated Luxor to Aswan cruise packages.
              </p>
            </div>

            {/* Luxor Start Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-amber-400 mb-6 flex items-center">
                <div className="w-2 h-8 bg-amber-500 rounded-full mr-3"></div>
                Beginning in Luxor: Where Adventure Meets the Sky
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-stone-300 leading-relaxed mb-4">
                    Start your voyage in Luxor, where adventure begins high above the city in a hot
                    air balloon ride. From this unique vantage point, watch as the temples, fields,
                    and desert merge into a stunning panorama of history and nature.
                  </p>
                  <p className="text-stone-300 leading-relaxed">
                    After landing, step aboard your Nile cruise ship — a floating palace designed
                    for comfort and discovery. Settle into your luxurious cabin as the ship prepares
                    to embark on its journey southward along the timeless Nile.
                  </p>
                </div>
                <div className="relative h-64 rounded-xl overflow-hidden border border-stone-700">
                  {/* PLACEHOLDER: Update with Luxor hot air balloon and cruise image */}
                  <Image
                    src="/assets/images/blog/luxor-balloon-cruise.webp"
                    alt="Hot air balloon over Luxor with Nile cruise ship below"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="bg-amber-500/10 rounded-xl p-6 border border-amber-500/30 mb-6">
                <h3 className="text-xl font-bold text-amber-400 mb-3">
                  The Floating Palace Experience
                </h3>
                <p className="text-stone-300 leading-relaxed">
                  Your Nile cruise ship is more than just transportation — it&apos;s your luxury
                  hotel, fine dining restaurant, and panoramic observatory all in one. With spacious
                  sundecks, elegant lounges, and gourmet Egyptian cuisine, every moment aboard is
                  designed for comfort and wonder.
                </p>
              </div>
            </section>

            {/* River Journey Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-amber-400 mb-6 flex items-center">
                <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
                Temples Along the Nile: Edfu & Kom Ombo
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="relative h-64 rounded-xl overflow-hidden border border-stone-700 order-2 md:order-1">
                  {/* PLACEHOLDER: Update with Edfu Temple image */}
                  <Image
                    src="/assets/images/blog/edfu-temple.webp"
                    alt="Magnificent Edfu Temple dedicated to Horus"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="order-1 md:order-2">
                  <p className="text-stone-300 leading-relaxed mb-4">
                    As your cruise drifts southward, stop at Edfu Temple, dedicated to the falcon
                    god Horus. This remarkably well-preserved temple offers an incredible glimpse
                    into ancient Egyptian religious practices and architectural brilliance.
                  </p>
                  <p className="text-stone-300 leading-relaxed">
                    Continue to the Temple of Kom Ombo, uniquely devoted to two gods: Sobek, the
                    crocodile god, and Horus the Elder. Each site offers a deeper glimpse into
                    Egypt&apos;s layered mythology and the fascinating pantheon of ancient deities.
                  </p>
                </div>
              </div>

              <div className="relative h-80 rounded-xl overflow-hidden border border-stone-700 mb-6">
                {/* PLACEHOLDER: Update with Kom Ombo Temple image */}
                <Image
                  src="/assets/images/blog/kom-ombo-temple.webp"
                  alt="Kom Ombo Temple overlooking the Nile River"
                  fill
                  className="object-cover"
                />
              </div>
            </section>

            {/* Aswan Arrival Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-amber-400 mb-6 flex items-center">
                <div className="w-2 h-8 bg-green-500 rounded-full mr-3"></div>
                Arrival in Aswan: Where the Nile Reveals Its Soul
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-stone-300 leading-relaxed mb-4">
                    By the time you reach Aswan, the rhythm of the Nile will have seeped into your
                    soul. The pace slows, the air softens, and the beauty of Upper Egypt unfolds in
                    all its glory.
                  </p>
                  <p className="text-stone-300 leading-relaxed mb-4">
                    Here, you can visit the Philae Temple, beautifully situated on an island and
                    dedicated to the goddess Isis. Explore the colorful Nubian villages where
                    ancient traditions continue to thrive amidst modern times.
                  </p>
                  <p className="text-stone-300 leading-relaxed">
                    For the ultimate adventure, venture to the Abu Simbel Temples — masterpieces
                    relocated stone by stone to escape the rising waters of Lake Nasser. These
                    monumental structures stand as a testament to both ancient engineering and
                    modern preservation.
                  </p>
                </div>
                <div className="relative h-80 rounded-xl overflow-hidden border border-stone-700">
                  {/* PLACEHOLDER: Update with Aswan Nile scene image */}
                  <Image
                    src="/assets/images/blog/aswan-nile-scene.webp"
                    alt="Beautiful Nile River scene in Aswan with feluccas"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="bg-stone-800/30 rounded-xl p-6 border border-stone-700">
                <h3 className="text-xl font-bold text-white mb-4">
                  The EY Travel Egypt Difference
                </h3>
                <p className="text-stone-300 leading-relaxed">
                  Every aspect of your cruise — from gourmet dining on deck to expert Egyptologist
                  guides — is arranged by EY Travel Egypt to ensure a seamless, unforgettable
                  journey. Our local expertise, attention to detail, and commitment to authentic
                  experiences transform a simple river cruise into a voyage through civilization
                  itself.
                </p>
              </div>
            </section>

            {/* Call to Action */}
            <section className="bg-gradient-to-r from-amber-700 to-amber-900 rounded-xl p-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to Sail the Nile?
              </h2>
              <p className="text-amber-100 mb-6 text-lg">
                Let EY Travel Egypt guide you on the ultimate Luxor to Aswan Nile cruise adventure
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/destinations/luxor"
                  className="inline-flex items-center px-8 py-3 bg-white text-amber-700 font-bold rounded-lg hover:bg-stone-100 transition-colors"
                >
                  View Cruise Packages
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-amber-700 hover:bg-opacity-10 transition-colors"
                >
                  Get Custom Quote
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
            More Nile Cruise Guides
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
