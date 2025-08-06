'use client'
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';

export const TourFormPlaceholder = () => {
  return (
    <div className="bg-stone-800/50 rounded-xl border border-stone-700 p-6">
      <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-xl border border-stone-700 p-6 flex flex-col items-center justify-center text-center hover:shadow-amber-500/10 hover:shadow-lg transition-all">
        <div className="p-4 bg-amber-600/10 rounded-full mb-4">
          <FaPlus className="text-amber-400 text-xl" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Create New Tour</h3>
        <p className="text-stone-400 text-sm mb-4">Start building your next amazing tour experience</p>
        <Link href="/admin/new-tour" target="_blank" rel="noopener noreferrer">
          <button className="bg-amber-600 hover:bg-amber-500 text-white font-medium py-2 px-6 rounded-lg transition-colors">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};