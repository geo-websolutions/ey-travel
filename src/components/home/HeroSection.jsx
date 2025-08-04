'use client';

import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1 }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function HeroSection() {
  return (
    <motion.div variants={container} className="text-center mb-16">
      <motion.h1
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
  );
}