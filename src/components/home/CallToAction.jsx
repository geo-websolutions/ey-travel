'use client';

import { motion } from 'framer-motion';
import Link from "next/link";

export default function CallToAction() {
  return (
    <motion.div 
      className="mt-20 text-center bg-gradient-to-r from-amber-700 to-amber-900 rounded-xl p-8 md:p-12 max-w-4xl mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{}}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready for Your Egyptian Adventure?</h2>
      <p className="text-lg mb-6 max-w-2xl mx-auto">
        As licensed Egypt tour operators with over 15 years of experience, we handle every detail from airport arrival to departure.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link 
            href="/contact" 
            className="px-8 py-3 bg-black text-amber-400 rounded-lg font-bold hover:bg-stone-900 transition-colors block"
            aria-label="Request a custom Egypt tour quote"
          >
            Request Custom Quote
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link 
            href="tel:+20123456789" 
            className="px-8 py-3 border-2 border-amber-400 text-amber-400 rounded-lg font-bold hover:bg-amber-400 hover:text-stone-300 hover:bg-opacity-10 transition-colors block"
            aria-label="Call our Egypt travel experts"
          >
            Call Our Experts
          </Link>
        </motion.div>
      </div>
      <div className="flex justify-center gap-6 flex-wrap">
        <span className="text-sm opacity-80">✓ Licensed Tour Operator</span>
        <span className="text-sm opacity-80">✓ 24/7 Customer Support</span>
        <span className="text-sm opacity-80">✓ Best Price Guarantee</span>
      </div>
    </motion.div>
  );
}