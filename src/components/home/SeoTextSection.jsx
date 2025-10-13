'use client';

import { motion } from 'framer-motion';

export default function SeoTextSection() {
  return (
    <motion.div
      className="mt-20 prose prose-invert max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ margin: "-100px" }}
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Why Choose EY Travels for Your Egypt Vacation?</h2>
      <p className="mb-4">
        As <strong>specialists in Egypt tours</strong>, we offer unparalleled access to the country's most iconic sites. Our <strong>Luxor and Aswan packages</strong> include private guided tours of Karnak Temple, Valley of the Kings, and Philae Temple, while our <strong>Red Sea vacations</strong> in Hurghada and Marsa Alam feature the best snorkeling and diving spots.
      </p>
      <p className="mb-4">
        Every <strong>Cairo and Giza tour</strong> includes skip-the-line access to the Pyramids and Sphinx, with options for private interior explorations. We work directly with <strong>local Egyptologists</strong> who bring ancient history to life with stories you won't hear elsewhere.
      </p>
      <p className="mb-4">
        From the moment you land at Cairo Airport until your departure, our English-speaking representatives ensure <strong>hassle-free travel</strong> throughout Egypt. All our vehicles are modern air-conditioned, and every hotel is personally inspected by our team.
      </p>
    </motion.div>
  );
}