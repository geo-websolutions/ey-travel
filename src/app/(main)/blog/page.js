"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaClock,
  FaArrowRight,
  FaStar,
  FaMapMarkerAlt,
  FaTags,
} from "react-icons/fa";

export default function BlogPage() {
  // Hardcoded blog data with SEO-optimized content
  const blogs = [
    {
      id: 1,
      slug: "luxor-aswan-egypt-travel-guide-ey-travel-egypt",
      title: "Wonders of Luxor & Aswan with EY Travel Egypt",
      description:
        "Explore the magic of Luxor and Aswan with EY Travel Egypt — temples, Nile beauty, and a breathtaking Luxor hot air balloon ride await.",
      image: "/assets/images/blog/luxor-aswan-wonders.webp",
      readTime: "3 min read",
      date: "2025-11-09",
      category: "Travel Guide",
      tags: [
        "luxor travel",
        "aswan tours",
        "egypt holidays",
        "luxor hot air balloon",
        "luxury egypt tour",
        "ey travel egypt",
        "egypt temples",
      ],
    },
    {
      id: 2,
      slug: "luxor-aswan-nile-cruise-ey-travel-egypt",
      title: "Nile Cruise from Luxor to Aswan",
      description:
        "Sail the Nile River in luxury with EY Travel Egypt. Enjoy ancient temples, Nubian charm, and sunrise views from a Luxor hot air balloon.",
      image: "/assets/images/blog/luxor-aswan-nile-cruise.webp",
      readTime: "6 min read",
      date: "2025-11-09",
      category: "Nile Cruise",
      tags: [
        "nile cruise",
        "luxor to aswan",
        "egypt travel",
        "egypt tours",
        "hot air balloon luxor",
        "luxury egypt tour",
        "ey travel egypt",
      ],
    },
    {
      id: 3,
      slug: "hidden-gems-luxor-aswan-ey-travel-egypt",
      title: "Hidden Gems Between Luxor and Aswan",
      description:
        "Discover Egypt’s secret side with EY Travel Egypt. Visit offbeat temples, Nubian villages, and soar high above Luxor in a hot air balloon.",
      image: "/assets/images/blog/hidden-gems.webp",
      readTime: "5 min read",
      date: "2025-11-09",
      category: "Destinations",
      tags: [
        "hidden egypt",
        "offbeat tours",
        "luxor travel",
        "aswan attractions",
        "egypt adventures",
        "hot air balloon ride",
        "ey travel egypt",
      ],
    },
    {
      id: 4,
      slug: "5-day-itinerary-luxor-aswan-ey-travel-egypt",
      title: "5-Day Egypt Itinerary: Luxor & Aswan",
      description:
        "Plan your perfect 5-day Egypt trip with EY Travel Egypt — Nile cruise, temples, and a sunrise hot air balloon over Luxor’s ancient landscape",
      image: "/assets/images/blog/5-day-luxor-aswan.webp",
      readTime: "5 min read",
      date: "2025-11-09",
      category: "Travel Tips",
      tags: [
        "egypt itinerary",
        "luxor aswan tour",
        "nile cruise egypt",
        "5 day egypt trip",
        "luxor hot air balloon",
        "ey travel egypt",
      ],
    },
    {
      id: 5,
      slug: "cultural-tours-nile-luxor-aswan-ey-travel-egypt",
      title: "Culture Along the Nile with EY Travel Egypt",
      description:
        "Experience Egypt’s soul with EY Travel Egypt — from Luxor’s temples and hot air balloons to Aswan’s Nubian music and river sails.",
      image: "/assets/images/blog/cultural-tours.webp",
      readTime: "5 min read",
      date: "2025-11-09",
      category: "Cultural Travel",
      tags: [
        "egypt culture",
        "luxor aswan travel",
        "nile experience",
        "nubian village",
        "ey travel egypt",
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100">
      {/* Hero Section with Background Image */}
      <section className="relative h-80 w-full overflow-hidden">
        {/* Background Image - Update the path as needed */}
        <Image
          src="/assets/images/blog/blog-hero-bg.webp" // Update this path to your background image
          alt="Luxor and Aswan Nile River Landscape"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-stone-900/60 to-stone-900/80" />

        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl px-4"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              EY Travel <span className="text-amber-400">Egypt Blog</span>
            </h1>
            <p className="text-xl md:text-2xl text-amber-200 drop-shadow-md mb-6">
              Expert Travel Tips & Guides for Luxor, Aswan & Nile Adventures
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {["Luxor Tours", "Aswan Travel", "Nile Cruise", "Egypt Tips", "Temple Guides"].map(
                (tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-amber-600/20 text-amber-300 rounded-full text-sm border border-amber-500/30"
                  >
                    #{tag}
                  </span>
                )
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SEO Introduction Section */}
      <section className="py-12 bg-stone-800/50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-amber-400 mb-6">
              Discover the Magic of Upper Egypt
            </h2>
            <p className="text-lg text-stone-300 leading-relaxed mb-6">
              Welcome to the EY Travel Egypt blog, your ultimate resource for exploring the ancient
              wonders of <strong>Luxor and Aswan</strong>. As leading experts in{" "}
              <strong>Egypt travel adventures</strong>, we share insider tips, comprehensive guides,
              and unforgettable
              <strong> Nile cruise experiences</strong> to help you plan the perfect journey through
              Egypt&apos;s most spectacular historical sites.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center p-4">
                <FaMapMarkerAlt className="text-amber-400 text-2xl mx-auto mb-3" />
                <h3 className="font-bold text-white mb-2">Expert Local Guides</h3>
                <p className="text-stone-400 text-sm">
                  Insider knowledge from Egyptian travel specialists
                </p>
              </div>
              <div className="text-center p-4">
                <FaStar className="text-amber-400 text-2xl mx-auto mb-3" />
                <h3 className="font-bold text-white mb-2">Luxury Experiences</h3>
                <p className="text-stone-400 text-sm">
                  Premium Nile cruises and personalized tours
                </p>
              </div>
              <div className="text-center p-4">
                <FaTags className="text-amber-400 text-2xl mx-auto mb-3" />
                <h3 className="font-bold text-white mb-2">Best Value</h3>
                <p className="text-stone-400 text-sm">Quality experiences at competitive prices</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {blogs.map((blog, index) => (
              <motion.article
                key={blog.id}
                variants={itemVariants}
                className="bg-stone-800/50 rounded-xl overflow-hidden border border-stone-700 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 group"
              >
                {/* Blog Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-amber-600 text-white text-xs font-bold rounded-full">
                      {blog.category}
                    </span>
                  </div>

                  {/* Read Time */}
                  <div className="absolute top-4 right-4 flex items-center text-white/90 text-xs bg-black/30 px-2 py-1 rounded-full">
                    <FaClock className="mr-1" size={10} />
                    {blog.readTime}
                  </div>
                </div>

                {/* Blog Content */}
                <div className="p-6">
                  {/* Date */}
                  <div className="flex items-center text-stone-400 text-sm mb-3">
                    <FaCalendarAlt className="mr-2" size={12} />
                    {new Date(blog.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors line-clamp-2">
                    {blog.title}
                  </h2>

                  {/* Description */}
                  <p className="text-stone-300 text-sm leading-relaxed mb-4 line-clamp-3">
                    {blog.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {blog.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-stone-700 text-stone-400 text-xs rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                    {blog.tags.length > 2 && (
                      <span className="px-2 py-1 bg-stone-700 text-stone-400 text-xs rounded">
                        +{blog.tags.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Read More Link */}
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="inline-flex items-center text-amber-400 hover:text-amber-300 font-medium text-sm group/link"
                  >
                    Read More
                    <FaArrowRight
                      className="ml-2 group-hover/link:translate-x-1 transition-transform"
                      size={12}
                    />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-amber-700 to-amber-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready for Your Egypt Adventure?
            </h2>
            <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
              Let us help you create unforgettable memories exploring the ancient wonders of Luxor,
              Aswan, and the majestic Nile River.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/destinations"
                className="inline-flex items-center px-8 py-3 bg-white text-amber-700 font-bold rounded-lg hover:bg-stone-100 transition-colors"
              >
                Explore Tours
                <FaArrowRight className="ml-2" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:bg-opacity-10 hover:text-amber-700 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SEO Keywords Section */}
      <section className="py-12 bg-stone-800/30">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold text-amber-400 mb-6">Popular Egypt Travel Topics</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Luxor Temple Tours",
                "Aswan Nile Cruises",
                "Valley of the Kings",
                "Karnak Temple Guide",
                "Philae Temple Aswan",
                "Egypt Travel Tips",
                "Nile River Cruise",
                "Ancient Egypt History",
                "Family Egypt Tours",
                "Luxor Day Trips",
                "Aswan Dam Visit",
                "Egyptian Museum Cairo",
                "Red Sea Hurghada",
                "Egypt Desert Safari",
                "Cultural Egypt Tours",
              ].map((keyword, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-stone-700 text-stone-300 rounded-full text-sm border border-stone-600 hover:border-amber-400 hover:text-amber-300 transition-colors cursor-default"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
