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
  FaCompass,
  FaUserFriends,
  FaHeart,
} from "react-icons/fa";

export default function HiddenGemsLuxorAswan() {
  const blogData = {
    title: "Hidden Treasures of the Nile: Off-the-Beaten-Path Adventures with EY Travel Egypt",
    slug: "hidden-gems-luxor-aswan-ey-travel-egypt",
    metaDescription:
      "Discover Egypt's hidden gems with EY Travel Egypt. From Luxor's hot air balloons to Aswan's Nubian villages, find Egypt's most authentic travel experiences.",
    publishedDate: "2025-11-09",
    readTime: "5 min read",
    category: "Destinations",
    tags: [
      "Hidden Gems Egypt",
      "Offbeat Luxor Tours",
      "Aswan Local Experiences",
      "Luxor Hot Air Balloon Egypt",
      "EY Travel Egypt",
      "Nubian Village Tours",
    ],
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100">
      {/* Hero Section */}
      <section className="relative h-96 w-full overflow-hidden">
        <Image
          src="/assets/images/blog/hidden-gems2.webp"
          alt="Hidden treasures and off-the-beaten-path locations in Luxor and Aswan"
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
                  Hidden Treasures of <span className="text-amber-400">the Nile</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-xl text-amber-200 drop-shadow-md"
                >
                  Off-the-Beaten-Path Adventures with EY Travel Egypt
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
                <FaCompass className="mr-2" />
                Hidden Gems Included
              </h3>
              <ul className="space-y-3 text-stone-300">
                <li className="flex items-start">
                  <FaStar className="text-amber-400 mt-1 mr-3 flex-shrink-0" size={14} />
                  <span>Sunrise Hot Air Balloon in Luxor</span>
                </li>
                <li className="flex items-start">
                  <FaStar className="text-amber-400 mt-1 mr-3 flex-shrink-0" size={14} />
                  <span>Deir el-Medina Workers' Village</span>
                </li>
                <li className="flex items-start">
                  <FaStar className="text-amber-400 mt-1 mr-3 flex-shrink-0" size={14} />
                  <span>Tombs of the Nobles</span>
                </li>
                <li className="flex items-start">
                  <FaStar className="text-amber-400 mt-1 mr-3 flex-shrink-0" size={14} />
                  <span>Esna Temple Astrological Carvings</span>
                </li>
                <li className="flex items-start">
                  <FaStar className="text-amber-400 mt-1 mr-3 flex-shrink-0" size={14} />
                  <span>Authentic Nubian Village Visits</span>
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
                <FaUserFriends className="mr-2" />
                Why Go Offbeat?
              </h3>
              <ul className="space-y-2 text-stone-300 text-sm">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>Avoid tourist crowds</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>Authentic local interactions</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>Unique photo opportunities</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>Deeper cultural understanding</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>Support local communities</span>
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
                Everyone knows about the Pyramids, the Sphinx, and the Valley of the Kings — but
                what about the Egypt that few travelers ever see? With EY Travel Egypt, you can
                uncover the lesser-known, soul-stirring corners of Luxor and Aswan.
              </p>
            </div>

            {/* Luxor Hidden Gems Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-amber-400 mb-6 flex items-center">
                <div className="w-2 h-8 bg-amber-500 rounded-full mr-3"></div>
                Luxor's Secret Sunrise: Beyond the Tourist Trail
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-stone-300 leading-relaxed mb-4">
                    Begin your adventure in Luxor, where most tourists never rise early enough to
                    experience the serenity of a hot air balloon ride. Drifting above the green
                    farmlands and ancient monuments, you'll see Egypt wake up from a perspective few
                    ever experience.
                  </p>
                  <p className="text-stone-300 leading-relaxed">
                    While others sleep, you'll float peacefully above the Valley of the Kings,
                    watching the first rays of sun paint the Theban mountains in golden hues. This
                    tranquil experience offers a private audience with ancient history.
                  </p>
                </div>
                <div className="relative h-64 rounded-xl overflow-hidden border border-stone-700">
                  <Image
                    src="/assets/images/blog/sunrise-balloon.webp"
                    alt="Peaceful sunrise hot air balloon ride over Luxor"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="relative h-64 rounded-xl overflow-hidden border border-stone-700">
                  <Image
                    src="/assets/images/blog/deir-el-medina.webp"
                    alt="Ancient workers' village of Deir el-Medina in Luxor"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    Deir el-Medina: The Artisans' Village
                  </h3>
                  <p className="text-stone-300 leading-relaxed mb-4">
                    Then, dive deeper. Visit Deir el-Medina, the ancient workers' village where the
                    artisans of the Valley of the Kings once lived. This remarkably preserved
                    settlement offers intimate insights into the daily lives of the craftsmen who
                    built Egypt's most famous tombs.
                  </p>
                  <p className="text-stone-300 leading-relaxed">
                    Walk through the same streets where ancient artists and builders lived, and see
                    the humble homes that contrast sharply with the magnificent tombs they created
                    for pharaohs.
                  </p>
                </div>
              </div>

              <div className="bg-amber-500/10 rounded-xl p-6 border border-amber-500/30">
                <h3 className="text-xl font-bold text-amber-400 mb-3">
                  Tombs of the Nobles: Ancient Lives Revealed
                </h3>
                <p className="text-stone-300 leading-relaxed">
                  Explore the quiet Tombs of the Nobles, where vibrant wall paintings reveal the
                  daily life of ancient Egyptians. Unlike the royal tombs focused on the afterlife,
                  these tombs depict scenes of farming, feasting, and family life — offering a rare
                  glimpse into ancient Egyptian society.
                </p>
              </div>
            </section>

            {/* Esna Temple Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-amber-400 mb-6 flex items-center">
                <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
                Esna: The Hidden Temple with Celestial Secrets
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-stone-300 leading-relaxed mb-4">
                    In Esna, just south of Luxor, step inside a lesser-visited temple adorned with
                    astrological carvings that remain astonishingly well-preserved. The Temple of
                    Khnum sits 9 meters below modern street level, hidden from casual view but rich
                    with ancient wisdom.
                  </p>
                  <p className="text-stone-300 leading-relaxed">
                    Marvel at the vibrant colors still visible on the temple ceiling, where
                    astronomical charts and zodiac signs reveal the ancient Egyptians' sophisticated
                    understanding of the cosmos.
                  </p>
                </div>
                <div className="relative h-64 rounded-xl overflow-hidden border border-stone-700">
                  <Image
                    src="/assets/images/blog/esna-temple.webp"
                    alt="Astrological carvings in Esna Temple"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </section>

            {/* Nubian Village Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-amber-400 mb-6 flex items-center">
                <div className="w-2 h-8 bg-green-500 rounded-full mr-3"></div>
                Nubian Encounters: Living Culture Along the Nile
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="relative h-64 rounded-xl overflow-hidden border border-stone-700 order-2 md:order-1">
                  <Image
                    src="/assets/images/blog/nubian-village.webp"
                    alt="Colorful Nubian village with traditional architecture"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="order-1 md:order-2">
                  <p className="text-stone-300 leading-relaxed mb-4">
                    As you continue toward Aswan, take time to stop at Kom Ombo and then head off
                    the tourist map entirely — into Nubian villages painted with vivid blues and
                    pinks. These vibrant communities maintain traditions that date back thousands of
                    years.
                  </p>
                  <p className="text-stone-300 leading-relaxed">
                    Here, you'll meet locals, sample traditional dishes like ful medames and
                    karkadeh tea, and see how ancient customs live on in modern Egypt. Experience
                    the famous Nubian hospitality and learn about their unique cultural heritage.
                  </p>
                </div>
              </div>

              <div className="bg-stone-800/30 rounded-xl p-6 border border-stone-700">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <FaHeart className="text-amber-400 mr-2" />
                  The EY Travel Egypt Philosophy: Transformative Travel
                </h3>
                <p className="text-stone-300 leading-relaxed">
                  At EY Travel Egypt, we believe travel should transform. That's why every offbeat
                  itinerary combines authentic encounters with comfort, safety, and the perfect
                  touch of adventure. We work directly with local communities to ensure your visit
                  supports sustainable tourism and preserves these precious cultural treasures for
                  future generations.
                </p>
              </div>

              <div className="relative h-80 rounded-xl overflow-hidden border border-stone-700 mt-6">
                <Image
                  src="/assets/images/blog/nubian-culture.webp"
                  alt="Traditional Nubian cultural activities and crafts"
                  fill
                  className="object-cover"
                />
              </div>
            </section>

            {/* Call to Action */}
            <section className="bg-gradient-to-r from-amber-700 to-amber-900 rounded-xl p-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to Discover Egypt's Secrets?
              </h2>
              <p className="text-amber-100 mb-6 text-lg">
                Let EY Travel Egypt guide you to the hidden treasures most tourists never see
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/destinations/luxor"
                  className="inline-flex items-center px-8 py-3 bg-white text-amber-700 font-bold rounded-lg hover:bg-stone-100 transition-colors"
                >
                  Explore Hidden Gems Tours
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-amber-700 hover:bg-opacity-10 transition-colors"
                >
                  Plan Custom Adventure
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
            More Authentic Egypt Experiences
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Cultural Tours Along the Nile",
                description: "Experience Egypt's soul through authentic cultural encounters",
                link: "/blog/cultural-tours-nile-luxor-aswan-ey-travel-egypt",
              },
              {
                title: "5-Day Egypt Itinerary",
                description: "Perfect blend of famous sites and hidden treasures",
                link: "/blog/5-day-itinerary-luxor-aswan-ey-travel-egypt",
              },
              {
                title: "Nile Cruise in Style",
                description: "Luxury cruise experience between Luxor and Aswan",
                link: "/blog/luxor-aswan-nile-cruise-ey-travel-egypt",
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
