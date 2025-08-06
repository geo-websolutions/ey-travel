'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { 
  FaHome, 
  FaPlus, 
  FaList, 
  FaChartLine, 
  FaCog,
  FaCalendarCheck,
  FaTimes,
  FaBars
} from 'react-icons/fa';

export const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  };

  const menuButtonVariants = {
    open: { rotate: 180 },
    closed: { rotate: 0 }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-stone-800 rounded-lg shadow-lg"
        onClick={toggleMenu}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={menuButtonVariants}
        transition={{ duration: 0.3 }}
      >
        {isOpen ? (
          <FaTimes className="text-white text-xl" />
        ) : (
          <FaBars className="text-white text-xl" />
        )}
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {(isOpen || isDesktop) && (
          <motion.div
            className="bg-stone-800/90 border-r border-stone-700 p-4 flex flex-col
                      fixed inset-y-0 left-0 w-64 z-40 
                      lg:static lg:z-auto"
            initial="closed"
            animate={isOpen || isDesktop ? 'open' : 'closed'}
            exit="closed"
            variants={sidebarVariants}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="mb-8 p-4">
              <h1 className="text-2xl font-bold text-amber-400">Admin Panel</h1>
              <p className="text-stone-400 text-sm">Tour Management System</p>
            </div>
            
            <nav className="flex-1 space-y-2">
              <motion.button 
                onClick={() => {
                  setActiveTab('dashboard');
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30' : 'hover:bg-stone-700/50'}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaHome className="text-lg" />
                <span>Dashboard</span>
              </motion.button>
              
              <motion.button 
                onClick={() => {
                  setActiveTab('new-tour');
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'new-tour' ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30' : 'hover:bg-stone-700/50'}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaPlus className="text-lg" />
                <span>Create New Tour</span>
              </motion.button>
              
              <motion.button 
                onClick={() => {
                  setActiveTab('tours');
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'tours' ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30' : 'hover:bg-stone-700/50'}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaList className="text-lg" />
                <span>View All Tours</span>
              </motion.button>
              
              <motion.button 
                onClick={() => {
                  setActiveTab('bookings');
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'bookings' ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30' : 'hover:bg-stone-700/50'}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaCalendarCheck className="text-lg" />
                <span>Bookings</span>
              </motion.button>
              
              <motion.button 
                onClick={() => {
                  setActiveTab('analytics');
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'analytics' ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30' : 'hover:bg-stone-700/50'}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaChartLine className="text-lg" />
                <span>Analytics</span>
              </motion.button>
            </nav>
            
            <div className="mt-auto p-4 border-t border-stone-700">
              <motion.button 
                className="w-full hidden items-center space-x-3 px-4 py-3 rounded-lg hover:bg-stone-700/50 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaCog className="text-lg" />
                <span>Settings</span>
              </motion.button>
              <LogoutButton className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-stone-700/50 transition-all mt-2" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={toggleMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
    </>
  );
};