'use client';

import { motion } from 'framer-motion';

const cardItem = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
};

const features = [
  {
    icon: "𓃭",
    title: "Authentic Egypt Experiences",
    desc: "Private access to restricted sites like the Valley of the Kings and Abu Simbel with archaeologists who worked on excavations. Our Luxor and Aswan Nile cruises include exclusive evening temple visits."
  },
  {
    icon: "𓂀",
    title: "Luxury Egyptian Accommodations",
    desc: "Stay in 5-star Cairo hotels with pyramid views, private dahabiyas sailing the Nile, and beachfront Hurghada & Marsa Alam resorts. All properties personally vetted by our team."
  },
  {
    icon: "𓆎",
    title: "Seamless Egypt Travel",
    desc: "VIP airport meets, private transfers, and 24/7 English-speaking concierge from arrival to departure. Our Cairo, Giza, and Red Sea tours include all entry fees and permits."
  }
];

export default function ValuePropositions() {
  return (
    <motion.div 
      className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-20"
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {features.map((feature, i) => (
        <motion.div 
          key={i}
          variants={cardItem}
          whileHover={{ y: -5 }}
          className="bg-stone-800 bg-opacity-50 p-8 rounded-xl"
        >
          <div className="text-amber-400 text-4xl mb-4">{feature.icon}</div>
          <h2 className="text-xl font-bold mb-3">{feature.title}</h2>
          <p className="opacity-85">{feature.desc}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}