'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [textColor, setTextColor] = useState('text-stone-700');
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const navbarRef = useRef(null);

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

  // Detect background color and adjust text color
  useEffect(() => {
    const detectBackgroundColor = () => {
      if (!navbarRef.current) return;

      const navbarRect = navbarRef.current.getBoundingClientRect();
      
      // Sample multiple points below the navbar
      const samplePoints = [
        { x: window.innerWidth * 0.25, y: navbarRect.bottom + 10 },
        { x: window.innerWidth * 0.5, y: navbarRect.bottom + 10 },
        { x: window.innerWidth * 0.75, y: navbarRect.bottom + 10 },
        { x: window.innerWidth * 0.2, y: navbarRect.bottom + 20 },
        { x: window.innerWidth * 0.8, y: navbarRect.bottom + 20 }
      ];

      let darkCount = 0;
      let lightCount = 0;

      samplePoints.forEach(point => {
        const element = document.elementFromPoint(point.x, point.y);
        if (element) {
          const bgColor = window.getComputedStyle(element).backgroundColor;
          const brightness = getBrightnessFromColor(bgColor);
          brightness > 128 ? lightCount++ : darkCount++;
        }
      });

      // Set text color based on majority
      const shouldUseLightText = lightCount > darkCount;
      setTextColor(shouldUseLightText ? 'text-stone-700' : 'text-white');
    };

    const getBrightnessFromColor = (color) => {
      // Handle different color formats
      if (color === 'transparent' || color === 'rgba(0, 0, 0, 0)') {
        // Check parent elements until we find a background color
        return checkParentBackgrounds();
      }

      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.?\d*))?\)/);
      if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        // Calculate perceived brightness
        return (r * 299 + g * 587 + b * 114) / 1000;
      }
      
      // Default to dark background
      return 0;
    };

    const checkParentBackgrounds = () => {
      // Sample a point and traverse up the DOM tree to find background
      const sampleX = window.innerWidth / 2;
      const sampleY = navbarRef.current?.getBoundingClientRect().bottom + 10;
      let element = document.elementFromPoint(sampleX, sampleY);
      
      while (element && element !== document.documentElement) {
        const bgColor = window.getComputedStyle(element).backgroundColor;
        if (bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)') {
          const match = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.?\d*))?\)/);
          if (match) {
            const r = parseInt(match[1]);
            const g = parseInt(match[2]);
            const b = parseInt(match[3]);
            return (r * 299 + g * 587 + b * 114) / 1000;
          }
        }
        element = element.parentElement;
      }
      
      // Default to light background if nothing found
      return 255;
    };

    // Initial detection
    detectBackgroundColor();

    // Detect on scroll and resize with debouncing
    let timeoutId;
    const handleChange = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(detectBackgroundColor, 50);
    };

    window.addEventListener('scroll', handleChange);
    window.addEventListener('resize', handleChange);

    return () => {
      window.removeEventListener('scroll', handleChange);
      window.removeEventListener('resize', handleChange);
      clearTimeout(timeoutId);
    };
  }, [pathname]); // Re-run when route changes

  const isActive = (href) => {
    return href === "/" 
      ? pathname === "/" 
      : pathname === href || pathname.startsWith(`${href}/`);
  };

  const navItems = [
    { 
      href: "/", 
      label: "Home",
    },
    { 
      href: "/destinations", 
      label: "Destinations",
      subItems: [
        { href: "/destinations/luxor", label: "Luxor" },
        { href: "/destinations/aswan", label: "Aswan" },
        { href: "/destinations/cairo", label: "Cairo" },
        { href: "/destinations/hurghada", label: "Hurghada" },
        { href: "/destinations/marsa-alam", label: "Marsa Alam" },
      ]
    },
    { 
      href: "/reservation", 
      label: "Reservation",
    },
    { 
      href: "/about", 
      label: "About Us",
    },
    { href: "/contact", label: "Contact" }
  ];

  const toggleSubmenu = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  // Determine hover and active colors based on detected background
  const getLinkColors = (isActiveLink) => {
    const isDarkBackground = textColor === 'text-white';
    
    if (isActiveLink) {
      return 'text-amber-600 font-medium';
    }
    
    if (isDarkBackground) {
      return 'text-white hover:text-amber-300';
    } else {
      return 'text-stone-700 hover:text-amber-600';
    }
  };

  const getSubmenuColors = (isActiveLink) => {
    const isDarkBackground = textColor === 'text-white';
    
    if (isActiveLink) {
      return 'bg-amber-50 text-amber-700 font-medium';
    }
    
    if (isDarkBackground) {
      return 'text-white hover:bg-white/10 hover:text-amber-300';
    } else {
      return 'text-stone-700 hover:bg-stone-50 hover:text-amber-600';
    }
  };

  return (
    <motion.nav 
      ref={navbarRef}
      initial={isLoading ? { y: -100 } : false}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
        scrolled 
          ? textColor === 'text-white' 
            ? 'bg-black/30 shadow-lg backdrop-blur-sm' 
            : 'bg-white/20 shadow-lg backdrop-blur-sm'
          : textColor === 'text-white'
            ? 'bg-transparent'
            : 'bg-white/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0"
          >
            <Link href="/" className='flex items-center space-x-2'>
              <img 
                className='object-contain h-12' 
                src="/assets/icons/logo.png" 
                alt="EY Travel Logo" 
                width={60}
              />
              <span className={`hidden md:block text-xl font-bold ${textColor}`}>
                EY Travel Egypt
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-5">
            {navItems.map((item, index) => (
              <div key={index} className="relative group">
                {item.subItems ? (
                  <>
                    <button
                      onClick={() => toggleSubmenu(index)}
                      className={`flex items-center py-2.5 rounded-lg transition-colors ${getLinkColors(
                        isActive(item.href) || (item.subItems && item.subItems.some(sub => isActive(sub.href)))
                      )} group-hover:text-amber-600`}
                    >
                      <span className="relative">
                        {item.label}
                        {(isActive(item.href) || (item.subItems && item.subItems.some(sub => isActive(sub.href)))) && (
                          <motion.span 
                            layoutId="navUnderline"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </span>
                      <motion.span
                        animate={{ rotate: openSubmenu === index ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-1"
                      >
                        <ChevronDown size={16} className={textColor === 'text-white' ? 'text-white group-hover:text-amber-300' : 'group-hover:text-amber-600'} />
                      </motion.span>
                    </button>

                    <AnimatePresence>
                      {openSubmenu === index && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 origin-top bg-white rounded-xl shadow-xl ring-1 ring-stone-200 ring-opacity-5 focus:outline-none z-10 overflow-hidden"
                        >
                          <div className="py-1.5">
                            {item.subItems.map((subItem, subIndex) => (
                              <Link
                                key={subIndex}
                                href={subItem.href}
                                className={`block px-4 py-2.5 text-sm transition-colors ${
                                  isActive(subItem.href)
                                    ? 'bg-amber-50 text-amber-700 font-medium'
                                    : 'text-stone-700 hover:bg-stone-50 hover:text-amber-600'
                                }`}
                              >
                                <motion.span
                                  initial={{ x: -5 }}
                                  animate={{ x: 0 }}
                                  transition={{ delay: subIndex * 0.05 }}
                                  className="flex items-center"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-3"></span>
                                  {subItem.label}
                                </motion.span>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link 
                    href={item.href}
                    className="relative px-3 py-2.5"
                  >
                    <motion.span
                      className={`block transition-colors duration-300 ${getLinkColors(isActive(item.href))}`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {item.label}
                    </motion.span>
                    {isActive(item.href) && (
                      <motion.div 
                        layoutId="navUnderline"
                        className="absolute bottom-0 px-3 left-0 right-0 h-0.5 bg-amber-600"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${textColor} hover:text-amber-600 focus:outline-none`}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Keep original styles */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-white shadow-lg"
          >
            <ul className="px-2 py-2 space-y-1">
              {navItems.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b border-stone-100 last:border-b-0"
                >
                  {item.subItems ? (
                    <>
                      <button
                        onClick={() => toggleSubmenu(index)}
                        className={`w-full flex justify-between items-center px-4 py-3 rounded-lg text-left ${
                          isActive(item.href) || (item.subItems && item.subItems.some(sub => isActive(sub.href)))
                            ? 'text-amber-600 font-medium bg-amber-50'
                            : 'text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <span>{item.label}</span>
                        <motion.span
                          animate={{ rotate: openSubmenu === index ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {openSubmenu === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </motion.span>
                      </button>

                      <AnimatePresence>
                        {openSubmenu === index && (
                          <motion.ul
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="pl-6 space-y-1 bg-stone-50/50"
                          >
                            {item.subItems.map((subItem, subIndex) => (
                              <motion.li
                                key={subIndex}
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.2, delay: subIndex * 0.05 }}
                                className="border-t border-stone-100 first:border-t-0"
                              >
                                <Link
                                  href={subItem.href}
                                  onClick={() => setIsMenuOpen(false)}
                                  className={`block px-4 py-2.5 rounded-lg transition-colors ${
                                    isActive(subItem.href)
                                      ? 'bg-amber-100 text-amber-700 font-medium'
                                      : 'text-stone-700 hover:bg-stone-100'
                                  }`}
                                >
                                  <span className="flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-3"></span>
                                    {subItem.label}
                                  </span>
                                </Link>
                              </motion.li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? 'bg-amber-50 text-amber-600 font-medium'
                          : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}