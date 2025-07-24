'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Head from 'next/head';

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact EY Travel Egypt | Start Your Premium Egyptian Adventure</title>
        <meta 
          name="description" 
          content="Begin crafting your perfect Egypt tour with our travel experts. Get personalized advice for luxury Nile cruises, Red Sea escapes, and cultural experiences." 
        />
        <meta name="keywords" content="Egypt tour contact, luxury travel Egypt, custom Egypt itinerary, Nile cruise booking, private Egypt tours" />
      </Head>

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
              alt="Sunset over the Nile River with felucca sailboats"
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
                Let&apos;s craft your perfect adventure amidst pyramids, temples, and golden sands. Our travel experts await your inquiry.
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
                  <span className="text-amber-400">Personalized</span> Travel Consultation
                </h2>
                <p className="text-lg mb-8">
                  Share your travel dreams with us, and we&apos;ll design an Egyptian experience that exceeds expectations. Whether you envision private tomb explorations, luxury Nile cruises, or family-friendly adventures, we&apos;ll make it reality.
                </p>
                
                <div className="space-y-6 mb-10">
                  {[
                    {
                      icon: "✉️",
                      title: "Email Us",
                      detail: "contact@eytravelegypt.com",
                      link: "mailto:contact@eytravelegypt.com"
                    },
                    {
                      icon: "📞",
                      title: "Call Us",
                      detail: "+20 123 456 7890",
                      link: "tel:+201234567890"
                    },
                    {
                      icon: "🕒",
                      title: "Availability",
                      detail: "Sun-Thu: 8AM-10PM (GMT+2)\nFri-Sat: 10AM-8PM",
                      link: null
                    }
                  ].map((contact, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                      viewport={{ margin: "-20px" }}
                      className="flex items-start gap-4"
                    >
                      <span className="text-2xl mt-1">{contact.icon}</span>
                      <div>
                        <h3 className="font-bold text-lg text-amber-400">{contact.title}</h3>
                        {contact.link ? (
                          <a 
                            href={contact.link} 
                            className="hover:text-amber-300 transition-colors"
                          >
                            {contact.detail}
                          </a>
                        ) : (
                          <p className="whitespace-pre-line">{contact.detail}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Animated Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ margin: "-50px" }}
              className="bg-stone-800/70 border border-stone-700 rounded-xl p-8 shadow-xl"
            >
              <form className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label htmlFor="name" className="block mb-2 font-medium">Full Name</label>
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
                  <label htmlFor="email" className="block mb-2 font-medium">Email Address</label>
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
                  <label htmlFor="tour" className="block mb-2 font-medium">Tour Interest</label>
                  <select
                    id="tour"
                    className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all appearance-none"
                  >
                    <option value="">Select an option</option>
                    <option value="luxor-aswan">Luxor & Aswan Nile Cruise</option>
                    <option value="cairo-tours">Cairo & Pyramids Exploration</option>
                    <option value="red-sea">Red Sea Luxury Escape</option>
                    <option value="custom">Custom Itinerary</option>
                  </select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <label htmlFor="message" className="block mb-2 font-medium">Your Travel Vision</label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                    placeholder="Tell us about your dream Egypt trip..."
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
                    Begin Your Adventure
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
                Find Us in <span className="text-amber-400">Luxor</span>
              </h2>
              <p className="text-xl max-w-3xl mx-auto">
                Visit our office in the heart of Egypt&apos;s vibrant ancient city
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
                <h3 className="text-xl font-bold mb-4 text-amber-400">Our Office</h3>
                <address className="not-italic space-y-4">
                  <p className="flex items-start">
                    <span className="mr-3">📍</span>
                    <span>123 Al Mahata st, Luxor, Egypt</span>
                  </p>
                  {/* <p className="flex items-start">
                    <span className="mr-3">🏢</span>
                    <span>Mondial Plaza, 5th Floor</span>
                  </p> */}
                  <p className="flex items-start">
                    <span className="mr-3">⏰</span>
                    <span>Saturday-Thursday: 9AM-5PM<br/>Friday: Closed</span>
                  </p>
                </address>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ margin: "-50px" }}
                className="relative h-96 w-full rounded-xl overflow-hidden border-2 border-amber-400/30"
              >
                {/* Google Maps iframe with responsive sizing */}
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4264.616652867881!2d32.6426226!3d25.6978599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x144915cc3a509501%3A0xb268ab349c3d0b13!2sAl%20Mahata%2C%20Luxor%20City%2C%20Luxor%2C%20Luxor%20Governorate!5e1!3m2!1sen!2seg!4v1753332388917!5m2!1sen!2seg" 
                  className="absolute top-0 left-0 w-full h-full"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  aria-label="EY Travel Egypt Location in Luxor"
                />
                
                {/* Gradient overlay with CTA button */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4 sm:p-6">
                  <motion.a 
                    href="https://maps.app.goo.gl/Jd1swwMX4yYLq3yk9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="mr-2">🗺️</span>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Questions Before You Begin?</h2>
              <p className="text-xl mb-8">
                Our Egypt travel specialists are ready to advise on visas, best seasons to visit, cultural tips, and tour customization.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <a
                    href="tel:+201234567890"
                    className="inline-block px-8 py-3 bg-black text-amber-400 rounded-lg font-bold hover:bg-stone-900 transition-colors"
                    aria-label="Call our Egypt travel experts"
                  >
                    Call Now
                  </a>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <a
                    href="#contact-form"
                    className="inline-block px-8 py-3 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:bg-opacity-10 transition-colors"
                    aria-label="Jump to contact form"
                  >
                    Message Us
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