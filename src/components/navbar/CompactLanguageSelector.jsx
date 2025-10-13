// components/CompactLanguageSelector.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGlobe, FaChevronDown } from 'react-icons/fa';

const languages = [
  { code: 'en', name: 'EN' },
  { code: 'de', name: 'DE' },
  { code: 'es', name: 'ES' },
  { code: 'fr', name: 'FR' },
  { code: 'ar', name: 'AR' },
  { code: 'it', name: 'IT' },
  { code: 'ru', name: 'RU' },
];

export default function CompactLanguageSelector({ currentLanguage = 'en', onLanguageChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const dropdownRef = useRef(null);
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode);
    setIsOpen(false);
    if (onLanguageChange) {
      onLanguageChange(languageCode);
    }
    // Here you would typically:
    // 1. Update your i18n context
    // 2. Change the document direction for RTL languages
    // 3. Update the URL or make an API call
  };

  const currentLang = languages.find(lang => lang.code === selectedLanguage);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Ultra Compact Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center p-2 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-600 transition-all duration-200"
        aria-label="Select language"
      >
        <FaGlobe className="text-amber-400" size={14} />
        <span className="ml-1 text-xs font-medium text-white sm:hidden">
          {currentLang?.name}
        </span>
        <span className="ml-1 text-xs font-medium text-white hidden sm:block">
          {currentLang?.name}
        </span>
      </button>

      {/* Compact Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-32 bg-stone-800 border border-stone-600 rounded-lg shadow-xl z-50"
          >
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language.code)}
                className={`w-full px-3 py-2 text-sm transition-all duration-200 flex items-center justify-between ${
                  selectedLanguage === language.code
                    ? 'bg-amber-600 text-white'
                    : 'text-white hover:bg-stone-700'
                }`}
              >
                <span>{language.name}</span>
                {selectedLanguage === language.code && (
                  <div className="w-2 h-2 bg-amber-400 rounded-full" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}