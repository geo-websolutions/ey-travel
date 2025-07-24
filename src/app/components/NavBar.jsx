'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import MenuButton from './MenuButton';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href) => {
    return href === "/" 
      ? pathname === "/" 
      : pathname === href || pathname.startsWith(`${href}/`);
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/tours", label: "Tour Packages" },
    { href: "/reservation", label: "Reservation" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" }
  ];

  return (
    <motion.nav 
      initial={isLoading ? { y: -100 } : false}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`fixed top-0 w-full z-[100] transition-all duration-300 ${scrolled ? 'bg-stone-300/95 shadow-lg backdrop-blur-sm' : 'bg-stone-300'}`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo with animation */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/" className='flex items-center space-x-2'>
              <img 
                className='object-contain h-12' 
                src="/assets/icons/logo.png" 
                alt="EY Travel Logo" 
                width={60}
              />
              {/* Company Name - Hidden on mobile, shown on desktop */}
              <span className="hidden md:block text-xl font-bold text-stone-800">
                EY Travel Egypt
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                className="relative px-4 py-2"
              >
                <motion.span
                  className={`block transition-colors duration-300 ${
                    isActive(item.href) 
                      ? 'text-amber-500 font-medium' 
                      : 'text-stone-700 hover:text-amber-500'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {item.label}
                </motion.span>
                {isActive(item.href) && (
                  <motion.div 
                    layoutId="navUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <MenuButton 
              isOpen={isMenuOpen} 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
            />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <ul className="px-4 pb-4">
              {navItems.map((item) => (
                <motion.li
                  key={item.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link 
                    href={item.href}
                    className={`block px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-amber-400/10 text-amber-500 font-medium'
                        : 'text-stone-700 hover:bg-stone-200'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}