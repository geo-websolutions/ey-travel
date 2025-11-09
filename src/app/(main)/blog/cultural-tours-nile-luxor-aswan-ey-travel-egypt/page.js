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
  FaMusic,
  FaUtensils,
  FaHandsHelping,
} from "react-icons/fa";

export default function CulturalToursNileLuxorAswan() {
  const blogData = {
    title: "Cultural Encounters on the Nile: From Pharaohs to Felluccas with EY Travel Egypt",
    slug: "cultural-tours-nile-luxor-aswan-ey-travel-egypt",
    metaDescription:
      "Experience Egypt's vibrant culture with EY Travel Egypt — from Luxor's temples and hot air balloons to Aswan's Nubian life and Nile adventures.",
    publishedDate: "2025-11-09",
    readTime: "5 min read",
    category: "Cultural Travel",
    tags: [
      "Egypt Cultural Tours",
      "Luxor and Aswan Culture",
      "Nile Travel Experiences",
      "Hot Air Balloon Luxor",
      "EY Travel Egypt",
      "Elevate Your Travel Egypt",
    ],
  };

  const culturalExperiences = [
    {
      icon: FaMusic,
      title: "Nubian Music & Dance",
      description: "Traditional performances in authentic village settings",
    },
    {
      icon: FaUtensils,
      title: "Egyptian Cuisine",
      description: "Cooking classes and traditional meal experiences",
    },
    {
      icon: FaHandsHelping,
      title: "Local Artisans",
      description: "Meet craftspeople preserving ancient techniques",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100">
      {/* Hero Section */}
      <section className="relative h-96 w-full overflow-hidden">
        {/* PLACEHOLDER: Update with cultural experiences hero image */}
        <Image
          src="/assets/images/blog/cultural-tours2.webp"
          alt="Cultural experiences along the Nile from Luxor to Aswan with EY Travel Egypt"
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
                  Cultural Encounters on <span className="text-amber-400">the Nile</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-xl text-amber-200 drop-shadow-md"
                >
                  From Pharaohs to Felluccas with EY Travel Egypt
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
                <FaMusic className="mr-2" />
                Cultural Highlights
              </h3>
              <ul className="space-y-3 text-stone-300">
                <li className="flex items-start">
                  <FaStar className="text-amber-400 mt-1 mr-3 flex-shrink-0" size={14} />
                  <span>Luxor Hot Air Balloon Sunrise</span>
                </li>
                <li className="flex items-start">
                  <FaStar className="text-amber-400 mt-1 mr-3 flex-shrink-0" size={14} />
                  <span>Nubian Village Immersion</span>
                </li>
                <li className="flex items-start">
                  <FaStar className="text-amber-400 mt-1 mr-3 flex-shrink-0" size={14} />
                  <span>Traditional Felucca Sailing</span>
                </li>
                <li className="flex items-start">
                  <FaStar className="text-amber-400 mt-1 mr-3 flex-shrink-0" size={14} />
                  <span>Local Cuisine Experiences</span>
                </li>
                <li className="flex items-start">
                  <FaStar className="text-amber-400 mt-1 mr-3 flex-shrink-0" size={14} />
                  <span>Artisan Craft Workshops</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-stone-800/50 rounded-xl p-6 border border-stone-700"
            >
              <h3 className="text-lg font-bold text-amber-400 mb-4">Authentic Experiences</h3>
              <div className="space-y-4">
                {culturalExperiences.map((experience, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                      <experience.icon className="text-amber-400" size={16} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">{experience.title}</h4>
                      <p className="text-stone-400 text-xs">{experience.description}</p>
                    </div>
                  </div>
                ))}
              </div>
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
                Travel isn&apos;t just about places — it&apos;s about people, stories, and culture.
                On a journey with EY Travel Egypt, you&apos;ll experience the living heart of Egypt
                along the Nile River, from Luxor&apos;s ancient splendor to Aswan&apos;s warm
                hospitality.
              </p>
            </div>

            {/* Luxor Cultural Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-amber-400 mb-6 flex items-center">
                <div className="w-2 h-8 bg-amber-500 rounded-full mr-3"></div>
                Luxor: Where Ancient Splendor Meets Modern Life
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-stone-300 leading-relaxed mb-4">
                    In Luxor, you&apos;ll start your day floating high in a hot air balloon,
                    watching the sunrise over temples that have stood for 3,000 years. This magical
                    experience connects you to the same landscape that pharaohs and priests
                    witnessed millennia ago.
                  </p>
                  <p className="text-stone-300 leading-relaxed">
                    As you drift silently above the Nile, you&apos;ll see the patchwork of fields,
                    the winding river, and the monumental temples from a perspective that few
                    experience — a truly spiritual beginning to your cultural journey.
                  </p>
                </div>
                <div className="relative h-64 rounded-xl overflow-hidden border border-stone-700">
                  {/* PLACEHOLDER: Update with Luxor cultural image */}
                  <Image
                    src="/assets/images/blog/luxor-cultural.webp"
                    alt="Hot air balloon over Luxor with ancient temples below"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="bg-stone-800/30 rounded-xl p-6 border border-stone-700 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">Guided by Egyptologists</h3>
                <p className="text-stone-300 leading-relaxed">
                  On the ground, you&apos;ll explore Karnak, Luxor Temple, and the Valley of the
                  Kings, guided by Egyptologists who reveal the secrets behind every carving. These
                  aren&apos;t just historical lectures — they&apos;re passionate storytelling
                  sessions that bring ancient Egyptian culture to life through the eyes of those who
                  understand it best.
                </p>
              </div>

              {/* PLACEHOLDER: Update with temple guide image */}
              <div className="relative h-64 rounded-xl overflow-hidden border border-stone-700 mb-6">
                <Image
                  src="/assets/images/blog/egyptologist-guide.webp"
                  alt="Egyptologist guide explaining temple carvings in Luxor"
                  fill
                  className="object-cover"
                />
              </div>
            </section>

            {/* Aswan Cultural Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-amber-400 mb-6 flex items-center">
                <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
                Aswan: The Rhythm of Nubian Life
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="relative h-64 rounded-xl overflow-hidden border border-stone-700 order-2 md:order-1">
                  {/* PLACEHOLDER: Update with Nubian village image */}
                  <Image
                    src="/assets/images/blog/nubian-life.webp"
                    alt="Colorful Nubian village life along the Nile in Aswan"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="order-1 md:order-2">
                  <p className="text-stone-300 leading-relaxed mb-4">
                    Continue to Aswan, a city known for its beauty and calm rhythm. Here, life moves
                    with the river. The slower pace allows for deeper connections with local people
                    and their centuries-old traditions.
                  </p>
                  <p className="text-stone-300 leading-relaxed">
                    Visit the Nubian villages, where colorful houses line the water and music fills
                    the air. These vibrant communities maintain cultural practices that date back to
                    ancient times, offering a living connection to Egypt&apos;s diverse heritage.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Culinary & Craft Traditions</h3>
                  <p className="text-stone-300 leading-relaxed mb-4">
                    Savor authentic Egyptian dishes in local homes, learning about spices and
                    cooking techniques passed down through generations. From koshary and ful medames
                    to sweet basbousa, each meal tells a story of cultural exchange and local
                    ingredients.
                  </p>
                  <p className="text-stone-300 leading-relaxed">
                    Learn about local crafts from artisans who continue ancient traditions —
                    pottery, weaving, and jewelry-making that reflect both Pharaonic and Nubian
                    influences in their designs and techniques.
                  </p>
                </div>
                <div className="relative h-64 rounded-xl overflow-hidden border border-stone-700">
                  {/* PLACEHOLDER: Update with culinary experience image */}
                  <Image
                    src="/assets/images/blog/egyptian-cuisine.webp"
                    alt="Traditional Egyptian cuisine and cooking experiences"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </section>

            {/* Nile Experiences Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-amber-400 mb-6 flex items-center">
                <div className="w-2 h-8 bg-green-500 rounded-full mr-3"></div>
                The Living Nile: Feluccas & Sunset Sails
              </h2>

              <div className="bg-amber-500/10 rounded-xl p-6 border border-amber-500/30 mb-6">
                <p className="text-stone-300 leading-relaxed mb-4">
                  Enjoy a felucca sail as the sun dips below the horizon, experiencing the Nile as
                  Egyptians have for thousands of years. These traditional wooden sailing boats
                  offer an intimate connection with the river that motorized vessels can&apos;t
                  match.
                </p>
                <p className="text-stone-300 leading-relaxed">
                  As you glide silently across the water, you&apos;ll hear the sounds of daily life
                  from the riverbanks — children playing, merchants calling, and the gentle rhythm
                  of a civilization that has always depended on this life-giving river.
                </p>
              </div>

              {/* PLACEHOLDER: Update with felucca sailing image */}
              <div className="relative h-80 rounded-xl overflow-hidden border border-stone-700 mb-6">
                <Image
                  src="/assets/images/blog/felucca-sunset.webp"
                  alt="Traditional felucca sailing at sunset on the Nile"
                  fill
                  className="object-cover"
                />
              </div>
            </section>

            {/* EY Travel Philosophy Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-amber-400 mb-6 flex items-center">
                <div className="w-2 h-8 bg-purple-500 rounded-full mr-3"></div>
                The EY Travel Egypt Difference: Elevating Cultural Travel
              </h2>

              <div className="bg-stone-800/30 rounded-xl p-6 border border-stone-700">
                <p className="text-stone-300 leading-relaxed mb-4">
                  These experiences — cultural, historical, and human — are what define Elevate Your
                  Travel Egypt (EY Travel Egypt). We believe that true travel should transform both
                  the traveler and the communities visited.
                </p>
                <p className="text-stone-300 leading-relaxed">
                  Whether it&apos;s a private guided tour, a hot air balloon flight, or a Nile
                  cruise, each journey connects travelers to the real Egypt — a place where ancient
                  wonders and living traditions intertwine. Our carefully crafted experiences ensure
                  you don&apos;t just see Egypt; you feel it, taste it, and carry its spirit with
                  you long after you return home.
                </p>
              </div>
            </section>

            {/* Call to Action */}
            <section className="bg-gradient-to-r from-amber-700 to-amber-900 rounded-xl p-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready for a Cultural Journey?
              </h2>
              <p className="text-amber-100 mb-6 text-lg">
                Let EY Travel Egypt connect you with the living heart of ancient Egypt
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/destinations/luxor"
                  className="inline-flex items-center px-8 py-3 bg-white text-amber-700 font-bold rounded-lg hover:bg-stone-100 transition-colors"
                >
                  Explore Cultural Tours
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-amber-700 hover:bg-opacity-10 transition-colors"
                >
                  Plan Authentic Experience
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
            More Cultural Travel Experiences
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Hidden Gems of the Nile",
                description: "Discover off-the-beaten-path cultural experiences",
                link: "/blog/hidden-gems-luxor-aswan-ey-travel-egypt",
              },
              {
                title: "5-Day Egypt Itinerary",
                description: "Perfect cultural immersion in Luxor and Aswan",
                link: "/blog/5-day-itinerary-luxor-aswan-ey-travel-egypt",
              },
              {
                title: "Nile Cruise Guide",
                description: "Cultural experiences along the river journey",
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
