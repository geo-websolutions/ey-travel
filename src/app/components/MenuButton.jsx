import { motion } from "framer-motion";

export default function MenuButton({ isOpen, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col justify-center items-center"
      aria-label="Toggle menu"
    >
      <motion.span
        animate={isOpen ? "open" : "closed"}
        variants={{
          closed: { rotate: 0, y: 0 },
          open: { rotate: 45, y: 7 }
        }}
        className="w-6 h-0.5 bg-stone-800 block mb-1.5"
      />
      <motion.span
        animate={isOpen ? "open" : "closed"}
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 }
        }}
        className="w-6 h-0.5 bg-stone-800 block mb-1.5"
      />
      <motion.span
        animate={isOpen ? "open" : "closed"}
        variants={{
          closed: { rotate: 0, y: 0 },
          open: { rotate: -45, y: -7 }
        }}
        className="w-6 h-0.5 bg-stone-800 block"
      />
    </button>
    );
}