"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  FaEnvelope,
  FaPhone,
  FaClock,
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Contact() {
  return (
    <>
      <main className="bg-soft-black text-stone-100">
        {/* Hero Section with Animated Background */}
        <header className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-10"
          />
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src="/assets/images/contact-hero.jpg"
              alt="Sunset over the Nile River with felucca sailboats - EY Travel Egypt Luxury Tours"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </motion.div>
          <div className="container relative z-20 h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="max-w-3xl text-center mx-auto"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Begin Your <span className="text-amber-400">Egyptian Journey</span>
              </h1>
              <p className="text-xl md:text-2xl opacity-90">
                Let&apos;s craft your perfect adventure amidst pyramids, temples, and golden sands.
                Our Egypt travel experts await your inquiry.
              </p>
            </motion.div>
          </div>
        </header>

        {/* Contact Form Section */}
        <section className="py-20 container px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ margin: "-100px" }}
            className="grid lg:grid-cols-2 gap-12 items-start"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ margin: "-50px" }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  <span className="text-amber-400">Personalized</span> Egypt Travel Consultation
                </h2>
                <p className="text-lg mb-8">
                  Share your travel dreams with EY Travel Egypt, and we&apos;ll design an Egyptian
                  experience that exceeds expectations. Whether you envision private tomb
                  explorations, luxury Nile cruises, or family-friendly adventures, we&apos;ll make
                  it reality.
                </p>

                {/* Contact Information with React Icons */}
                <div className="space-y-6 mb-8">
                  {[
                    {
                      icon: FaEnvelope,
                      title: "Email Us",
                      detail: "info@eytravelegypt.com",
                      link: "mailto:info@eytravelegypt.com",
                      description: "Get personalized Egypt tour quotes",
                    },
                    {
                      icon: FaPhone,
                      title: "Call Us",
                      detail: "+2 010 8017 4045",
                      link: "tel:+201080174045",
                      description: "Speak directly with our Egypt travel experts",
                    },
                    {
                      icon: FaWhatsapp,
                      title: "WhatsApp",
                      detail: "+2 012 7892 6104",
                      link: "https://wa.me/201278926104",
                      description: "Quick responses for Egypt tour inquiries",
                    },
                    {
                      icon: FaClock,
                      title: "Availability",
                      detail: "Sun-Thu: 8AM-10PM (GMT+2)\nFri-Sat: 10AM-8PM",
                      link: null,
                      description: "Egypt local time - Ready to assist you",
                    },
                  ].map((contact, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                      viewport={{ margin: "-20px" }}
                      className="flex items-start gap-4 p-4 rounded-lg bg-stone-800/50 hover:bg-stone-800/70 transition-colors"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                        <contact.icon className="text-white text-lg" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-amber-400 mb-1">{contact.title}</h3>
                        {contact.link ? (
                          <a
                            href={contact.link}
                            className="hover:text-amber-300 transition-colors block text-lg font-medium"
                            target={contact.link.startsWith("http") ? "_blank" : "_self"}
                            rel={contact.link.startsWith("http") ? "noopener noreferrer" : ""}
                          >
                            {contact.detail}
                          </a>
                        ) : (
                          <p className="text-lg font-medium whitespace-pre-line">
                            {contact.detail}
                          </p>
                        )}
                        <p className="text-stone-400 text-sm mt-1">{contact.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Social Media Links */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  viewport={{ margin: "-20px" }}
                  className="bg-stone-800/50 rounded-lg p-6"
                >
                  <h3 className="font-bold text-xl text-amber-400 mb-4">
                    Follow Our Egypt Adventures
                  </h3>
                  <p className="text-stone-300 mb-4">
                    See real photos and reviews from our Egypt tours and travel experiences
                  </p>
                  <div className="flex gap-4">
                    {[
                      {
                        icon: FaFacebook,
                        label: "Facebook",
                        link: "https://www.facebook.com/share/19wmjzPp8h/",
                        color: "hover:text-blue-500",
                      },
                      {
                        icon: FaInstagram,
                        label: "Instagram",
                        link: "https://www.instagram.com/eytravelegypt",
                        color: "hover:text-pink-500",
                      },
                    ].map((social, i) => (
                      <motion.a
                        key={i}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-4 py-2 bg-stone-700 rounded-lg transition-all ${social.color} text-white hover:bg-stone-600`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={`Follow EY Travel Egypt on ${social.label}`}
                      >
                        <social.icon className="text-lg" />
                        <span>{social.label}</span>
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Animated Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ margin: "-50px" }}
              className="bg-stone-800/70 border border-stone-700 rounded-xl p-8 shadow-xl"
              id="contact-form"
            >
              <h3 className="text-2xl font-bold mb-6 text-amber-400">Plan Your Egypt Tour</h3>
              <form className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label htmlFor="name" className="block mb-2 font-medium">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                    placeholder="Your name"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label htmlFor="email" className="block mb-2 font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                    placeholder="your@email.com"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <label htmlFor="tour" className="block mb-2 font-medium">
                    Egypt Tour Interest
                  </label>
                  <select
                    id="tour"
                    className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all appearance-none"
                  >
                    <option value="">Select your Egypt tour preference</option>
                    <option value="luxor-aswan">Luxor & Aswan Adventure</option>
                    <option value="cairo-tours">Cairo & Pyramids Exploration</option>
                    <option value="red-sea">Red Sea Luxury Escape</option>
                    <option value="custom">Custom Egypt Itinerary</option>
                  </select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <label htmlFor="message" className="block mb-2 font-medium">
                    Your Egypt Travel Vision
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                    placeholder="Tell us about your dream Egypt trip - pyramids, temples, Nile cruise, balloon flight, desert safari..."
                  ></textarea>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  viewport={{ margin: "-20px" }}
                  className="pt-2"
                >
                  <button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                  >
                    Begin Your Egypt Adventure
                  </button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        </section>

        {/* Map & Location Section */}
        <section className="py-20 bg-stone-900/50">
          <div className="container px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-100px" }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Find EY Travel Egypt in <span className="text-amber-400">Luxor</span>
              </h2>
              <p className="text-xl max-w-3xl mx-auto">
                Visit our office in the heart of Egypt&apos;s vibrant ancient city - your gateway to
                Luxor temples, Valley of the Kings, and Nile cruise adventures
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ margin: "-50px" }}
                className="bg-stone-800 p-8 rounded-xl"
              >
                <h3 className="text-xl font-bold mb-6 text-amber-400 flex items-center gap-2">
                  <FaMapMarkerAlt />
                  Our Luxor Office
                </h3>
                <address className="not-italic space-y-4">
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-amber-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">123 Al Mahata Street</p>
                      <p className="text-stone-300">Luxor City, Luxor Governorate, Egypt</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaClock className="text-amber-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Saturday-Thursday: 9AM-5PM</p>
                      <p className="text-stone-300">Friday: Closed</p>
                    </div>
                  </div>
                </address>

                <div className="mt-6 pt-6 border-t border-stone-700">
                  <h4 className="font-bold mb-3 text-amber-400">Why Visit Our Luxor Office?</h4>
                  <ul className="text-stone-300 space-y-2">
                    <li>• Personalized Egypt tour planning</li>
                    <li>• Meet our expert guides</li>
                    <li>• Get local Egypt travel tips</li>
                  </ul>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ margin: "-50px" }}
                className="relative h-96 w-full rounded-xl overflow-hidden border-2 border-amber-400/30"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4264.616652867881!2d32.6426226!3d25.6978599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x144915cc3a509501%3A0xb268ab349c3d0b13!2sAl%20Mahata%2C%20Luxor%20City%2C%20Luxor%2C%20Luxor%20Governorate!5e1!3m2!1sen!2seg!4v1753332388917!5m2!1sen!2seg"
                  className="absolute top-0 left-0 w-full h-full"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  aria-label="EY Travel Egypt Location in Luxor - Egypt Tour Company"
                  title="EY Travel Egypt Office Location in Luxor"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4 sm:p-6">
                  <motion.a
                    href="https://maps.app.goo.gl/Jd1swwMX4yYLq3yk9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaMapMarkerAlt className="mr-2" />
                    Open in Google Maps
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-amber-700 to-amber-900">
          <div className="container px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{}}
              transition={{ type: "spring" }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Questions About Your Egypt Tour?
              </h2>
              <p className="text-xl mb-8">
                Our Egypt travel specialists at EY Travel Egypt are ready to advise on visas, best
                seasons to visit, cultural tips, and tour customization for your perfect Egyptian
                adventure.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <a
                    href="tel:+201080174045"
                    className="inline-flex items-center px-8 py-3 bg-black text-amber-400 rounded-lg font-bold hover:bg-stone-900 transition-colors"
                    aria-label="Call EY Travel Egypt experts"
                  >
                    <FaPhone className="mr-2" />
                    Call Now
                  </a>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <a
                    href="https://wa.me/201278926104"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500 transition-colors"
                    aria-label="Message EY Travel Egypt on WhatsApp"
                  >
                    <FaWhatsapp className="mr-2" />
                    WhatsApp
                  </a>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <a
                    href="#contact-form"
                    className="inline-flex items-center px-8 py-3 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:bg-opacity-10 transition-colors"
                    aria-label="Jump to EY Travel Egypt contact form"
                  >
                    <FaEnvelope className="mr-2" />
                    Email Us
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
