// components/LanguageSelector.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGlobe, FaChevronDown, FaCheck } from 'react-icons/fa';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
];

export default function LanguageSelector({ currentLanguage = 'en', onLanguageChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
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
      {/* Desktop & Mobile Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-600 transition-all duration-200 group"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        {/* Globe Icon - Always visible */}
        <FaGlobe className="text-amber-400 group-hover:text-amber-300 transition-colors" size={16} />
        
        {/* Language Code/Name - Hidden on mobile, shown on desktop */}
        <span className="hidden sm:block text-sm font-medium text-white min-w-[40px] text-left">
          {currentLang?.code.toUpperCase()}
        </span>
        
        {/* Chevron Icon */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown 
            className="text-stone-400 group-hover:text-stone-300 transition-colors" 
            size={12} 
          />
        </motion.div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-stone-800 border border-stone-600 rounded-lg shadow-xl backdrop-blur-sm z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-3 border-b border-stone-700">
              <h3 className="text-sm font-semibold text-white flex items-center">
                <FaGlobe className="mr-2 text-amber-400" size={14} />
                Select Language
              </h3>
            </div>

            {/* Language List */}
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.code)}
                  className={`w-full px-4 py-3 text-left transition-all duration-200 flex items-center justify-between group ${
                    selectedLanguage === language.code
                      ? 'bg-amber-600/20 text-amber-400'
                      : 'hover:bg-stone-700/50 text-white'
                  } ${language.rtl ? 'text-right' : ''}`}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    {/* Language Flag Placeholder - You can add actual flags here */}
                    <div className={`w-6 h-4 rounded-sm bg-stone-600 flex items-center justify-center text-xs font-bold ${
                      language.code === 'en' ? 'bg-blue-600 text-white' :
                      language.code === 'de' ? 'bg-yellow-500 text-black' :
                      language.code === 'es' ? 'bg-red-600 text-yellow-300' :
                      language.code === 'fr' ? 'bg-blue-800 text-white' :
                      language.code === 'ar' ? 'bg-green-600 text-white' :
                      language.code === 'it' ? 'bg-green-500 text-white' :
                      'bg-white text-red-600' // Russian
                    }`}>
                      {language.code.toUpperCase()}
                    </div>
                    
                    <div className="flex-1">
                      <div className="text-sm font-medium group-hover:text-amber-300 transition-colors">
                        {language.name}
                      </div>
                      <div className={`text-xs text-stone-400 group-hover:text-stone-300 transition-colors ${language.rtl ? 'text-right' : ''}`}>
                        {language.nativeName}
                      </div>
                    </div>
                  </div>

                  {/* Checkmark for selected language */}
                  {selectedLanguage === language.code && (
                    <FaCheck className="text-amber-400 flex-shrink-0" size={14} />
                  )}
                </button>
              ))}
            </div>

            {/* Footer with current selection */}
            <div className="p-3 border-t border-stone-700 bg-stone-900/50">
              <div className="text-xs text-stone-400">
                Current: <span className="text-amber-400 font-medium">{currentLang?.name}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f59e0b;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}