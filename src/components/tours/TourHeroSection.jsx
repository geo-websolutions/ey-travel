import { motion } from "framer-motion"
import Image from "next/image";

export default function TourHeroSection({ destinationData }) {
  return (
    <section className="relative lg:mt-20 md:10 h-130 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-stone-900/10 z-10" />
      <Image 
        src={destinationData.image.src}
        alt={destinationData.image.alt}
        fill
        className="absolute inset-0 w-full h-full object-cover"
        priority
      />
      
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {destinationData.city} <span className="text-amber-400">Tours & Experiences</span>
        </motion.h1>
        <motion.p 
          className="text-xl md:text-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          {destinationData.paragraph}
        </motion.p>
      </div>
    </section>
  )
}