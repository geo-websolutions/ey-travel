'use client'
import { FaSearch } from 'react-icons/fa';

export const AdminHeader = ({ activeTab }) => {
  const titleMap = {
    'dashboard': 'Dashboard',
    'new-tour': 'Create New Tour',
    'tours': 'All Tours',
    'bookings': 'Bookings',
    'analytics': 'Analytics'
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl font-bold text-white">
        {titleMap[activeTab]}
      </h2>
      <div className="flex items-center space-x-4">
        {/* <div className="relative">
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-stone-800 border border-stone-700 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
          <FaSearch className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
        </div> */}
        <div className="h-10 w-10 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold">
          AD
        </div>
      </div>
    </div>
  );
};