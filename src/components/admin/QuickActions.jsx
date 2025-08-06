'use client'
import Link from 'next/link';
import { FaPlus, FaStar, FaChartLine } from 'react-icons/fa';

export const QuickActions = ({ setActiveTab }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-xl border border-stone-700 p-4 md:p-6 flex flex-col items-center justify-center text-center hover:shadow-amber-500/10 hover:shadow-lg transition-all">
        <div className="p-3 md:p-4 bg-amber-600/10 rounded-full mb-3 md:mb-4">
          <FaPlus className="text-amber-400 text-lg md:text-xl" />
        </div>
        <h3 className="text-base md:text-lg font-semibold text-white mb-1 md:mb-2">Create New Tour</h3>
        <p className="text-stone-400 text-xs md:text-sm mb-3 md:mb-4">Start building your next amazing tour experience</p>
        <Link href="/admin/new-tour" target="_blank" rel="noopener noreferrer">
          <button className="bg-amber-600 hover:bg-amber-500 text-white font-medium py-1 md:py-2 px-4 md:px-6 rounded-lg transition-colors text-sm md:text-base">
            Get Started
          </button>
        </Link>
      </div>
      
      <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-xl border border-stone-700 p-4 md:p-6 flex flex-col items-center justify-center text-center hover:shadow-amber-500/10 hover:shadow-lg transition-all">
        <div className="p-3 md:p-4 bg-amber-600/10 rounded-full mb-3 md:mb-4">
          <FaStar className="text-amber-400 text-lg md:text-xl" />
        </div>
        <h3 className="text-base md:text-lg font-semibold text-white mb-1 md:mb-2">Featured Tours</h3>
        <p className="text-stone-400 text-xs md:text-sm mb-3 md:mb-4">Manage your featured tours and promotions</p>
        <button className="bg-stone-700 hover:bg-stone-600 text-white font-medium py-1 md:py-2 px-4 md:px-6 rounded-lg transition-colors text-sm md:text-base">
          Manage
        </button>
      </div>
      
      <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-xl border border-stone-700 p-4 md:p-6 flex flex-col items-center justify-center text-center hover:shadow-amber-500/10 hover:shadow-lg transition-all">
        <div className="p-3 md:p-4 bg-amber-600/10 rounded-full mb-3 md:mb-4">
          <FaChartLine className="text-amber-400 text-lg md:text-xl" />
        </div>
        <h3 className="text-base md:text-lg font-semibold text-white mb-1 md:mb-2">View Analytics</h3>
        <p className="text-stone-400 text-xs md:text-sm mb-3 md:mb-4">See how your tours are performing</p>
        <button 
          onClick={() => setActiveTab('analytics')}
          className="bg-stone-700 hover:bg-stone-600 text-white font-medium py-1 md:py-2 px-4 md:px-6 rounded-lg transition-colors text-sm md:text-base"
        >
          View Reports
        </button>
      </div>
    </div>
  );
};