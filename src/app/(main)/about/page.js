'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Head from 'next/head';

export default function About() {
  return (
    <>
      <Head>
        <title>About EY Travels Egypt | Premium Hassle-Free Egypt Tours</title>
        <meta 
          name="description" 
          content="Founded by a world traveler, EY Travels Egypt delivers premium, hassle-free tours with insider knowledge. Experience Egypt's wonders through our carefully crafted luxury itineraries." 
        />
        <meta name="keywords" content="luxury Egypt tours, premium Cairo travel, hassle-free Nile cruise, private Egypt guides, personalized travel experiences" />
      </Head>

      <main className="bg-soft-black text-stone-100">
        {/* Hero Section */}
        <header className="relative h-[80vh] min-h-[600px]">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <Image
            src="/assets/images/about-hero.jpg"
            alt="Private tour guide showing ancient artifacts to delighted travelers"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="container relative z-20 h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-amber-400">EY Travels Egypt</span>: Where Premium Meets Authentic
              </h1>
              <p className="text-xl md:text-2xl opacity-90">
                Years crafting unforgettable Egyptian experiences for travelers worldwide. 
                From luxury Nile cruises to budget-friendly group tours - we make Egypt accessible to all.
              </p>
            </motion.div>
          </div>
        </header>

        {/* Our Story Section */}
        <section className="py-20 container px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ margin: "-100px" }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="text-amber-400">My Journey</span>, Your Advantage
              </h2>
              <p className="text-lg mb-6">
                Having traveled extensively abroad as a student, I intimately understand what travelers truly need - the comfort of knowing every detail is handled, the joy of authentic experiences, and the freedom to simply marvel at Egypt&apos;s ancient wonders without logistical worries.
              </p>
              <p className="text-lg mb-6">
                At EY Travels Egypt, we&apos;ve taken that hard-won knowledge and applied it to crafting exceptional Egyptian adventures. Every itinerary is designed with the care I wish I&apos;d found in my own travels - seamless transitions, insider access, and local experts who make history come alive.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-amber-400 mr-2">✓</span>
                  <span>Premium comfort at every stage of your journey</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-400 mr-2">✓</span>
                  <span>Personally vetted Egyptologists and local guides</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-400 mr-2">✓</span>
                  <span>24/7 concierge service anticipating your needs</span>
                </li>
              </ul>
            </div>
            <div className="relative h-96 rounded-xl overflow-hidden">
              <Image
                src="/assets/images/team.jpg"
                alt="Our team carefully reviewing tour details to ensure perfect experiences"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </motion.div>
        </section>

        {/* Service Spectrum Section */}
        <section className="py-20 bg-stone-900/50">
          <div className="container px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-100px" }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-amber-400">Beyond Expectations</span> at Every Turn
              </h2>
              <p className="text-xl max-w-3xl mx-auto">
                We don&apos;t just show you Egypt - we immerse you in its magic while handling every practical detail behind the scenes
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Effortless Exploration",
                  desc: "From VIP airport meets to private transfers between sites, we eliminate the friction of travel. Your only job is to soak in the majesty of the pyramids, the serenity of the Nile, and the warmth of Egyptian hospitality.",
                  icon: "✨"
                },
                {
                  title: "Insider Access",
                  desc: "Our carefully cultivated relationships mean you'll experience moments most tourists miss - private viewings, special permissions, and local encounters that transform a trip into a lifelong memory.",
                  icon: "🔑"
                },
                {
                  title: "Tailored Perfection",
                  desc: "Whether you seek dawn at Abu Simbel without the crowds, a sunset felucca ride with champagne, or child-friendly history lessons at the Egyptian Museum, we craft experiences to your exact preferences.",
                  icon: "🎯"
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ margin: "-50px" }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-stone-800 p-8 rounded-xl"
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-amber-400">{item.title}</h3>
                  <p className="opacity-90">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Premium Services Section */}
        <section className="py-20 container px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              The <span className="text-amber-400">EY Travels</span> Promise
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                {[
                  {
                    title: "White Glove Service",
                    desc: "From the moment you inquire until you return home, you'll experience concierge-level attention. We handle everything, special dietary needs, photography permits, and all those invisible details that make travel truly seamless."
                  },
                  {
                    title: "Authentic Connections",
                    desc: "We introduce you to Egypt through the eyes of those who know it best - respected archaeologists, Nubian village elders, third-generation papyrus artists, and chefs preserving ancient recipes."
                  }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ margin: "-50px" }}
                    transition={{ delay: i * 0.2 }}
                    className="flex"
                  >
                    <div className="bg-amber-400 text-stone-900 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mr-4 font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="opacity-90">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="space-y-8">
                {[
                  {
                    title: "No Hidden Stress",
                    desc: "What sets us apart is what you won't experience - no haggling with drivers, no confusion at sites, no uncertainty about quality. We've pre-vetted every element so you can focus entirely on the experience."
                  },
                  {
                    title: "Memories Over Itineraries",
                    desc: "While we plan with military precision, we remain flexible to magic moments - stopping longer at a site that captivates you, adding an unexpected local festival to your schedule, or rearranging for perfect photography light."
                  }
                ].map((item, i) => (
                  <motion.div
                    key={i + 2}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ margin: "-50px" }}
                    transition={{ delay: (i + 2) * 0.2 }}
                    className="flex"
                  >
                    <div className="bg-amber-400 text-stone-900 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mr-4 font-bold">
                      {i + 3}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="opacity-90">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Your Egyptian Masterpiece Awaits</h2>
              <p className="text-xl mb-8">
                Let&apos;s craft a journey that honors both Egypt&apos;s grandeur and your personal travel style - where every detail whispers quality and every moment sparkles with discovery.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <a
                    href="/contact"
                    className="inline-block px-8 py-3 bg-black text-amber-400 rounded-lg font-bold hover:bg-stone-900 transition-colors"
                    aria-label="Begin designing your premium Egypt experience"
                  >
                    Design Your Journey
                  </a>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <a
                    href="/tours"
                    className="inline-block px-8 py-3 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:bg-opacity-10 transition-colors"
                    aria-label="Discover our signature Egypt tour experiences"
                  >
                    Explore Our Experiences
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