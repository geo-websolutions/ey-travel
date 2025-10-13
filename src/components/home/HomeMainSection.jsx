'use client';

import { motion } from 'framer-motion';
import HeroSection from '@/components/home/HeroSection';
import ValuePropositions from '@/components/home/ValuePropositions';
import CallToAction from '@/components/home/CallToAction';
import SeoTextSection from '@/components/home/SeoTextSection';
import TourDestinations from '@/components/home/TourDestinations';
import { useState } from 'react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomeMainSection({ tours }) {
  const [isSearching, setIsSearching] = useState(false);
  return (
    <motion.section 
      initial="hidden"
      animate="show"
      variants={container}
      className="bg-soft-black text-stone-100 pt-16 md:pt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeroSection setIsSearching={setIsSearching} isSearching={isSearching} tours={tours} />
        {!isSearching && (
        <>
          <ValuePropositions />
          <TourDestinations />
        </>
        )}
        <CallToAction />
        <SeoTextSection />
      </div> 
    </motion.section>
  );
}