'use client'
import { useState } from 'react';
import { FaPlus, FaEye, FaEdit, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { TourViewModal } from './tourListActions/TourViewModal';
import { TourEditModal } from './tourListActions/TourEditModal';
import { TourDeleteButton } from './tourListActions/TourDeleteButton';
import Image from 'next/image';

export const ToursList = ({ tours, setActiveTab }) => {
  const [selectedTour, setSelectedTour] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingTour, setEditingTour] = useState(null);

  // Filter tours based on selected status
  const filteredTours = tours.filter(tour => {
    if (statusFilter === 'All') return true;
    return tour.basicInfo.status.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="bg-stone-800/50 rounded-xl border border-stone-700 overflow-hidden">
      {/* Modal */}
      {selectedTour && (
        <TourViewModal 
          tour={selectedTour} 
          onClose={() => setSelectedTour(null)} 
        />
      )}
      {editingTour && (
        <TourEditModal 
          tour={editingTour}
          onClose={() => setEditingTour(null)}
          onUpdate={(updatedTour) => {
          }}
        />
      )}
      <div className="p-4 md:p-6 border-b border-stone-700 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h3 className="text-lg font-semibold text-white">All Tours</h3>
        <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
          {/* Filter */}
          <select 
            className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <button 
            onClick={() => setActiveTab('new-tour')}
            className="bg-amber-600 hover:bg-amber-500 text-white font-medium py-1.5 px-4 rounded-lg text-sm transition-colors flex items-center justify-center"
          >
            <FaPlus className="mr-2" size={12} /> New Tour
          </button>
        </div>
      </div>
      <div className="divide-y divide-stone-700">
        {filteredTours.map((tour) => (
          <div key={tour.id} className="p-3 md:p-4 hover:bg-stone-700/30 transition-colors grid grid-cols-12 items-center gap-2">
            <div className="col-span-6 md:col-span-4 flex items-center space-x-2 md:space-x-4">
              <div className="h-12 w-12 md:h-16 md:w-16 rounded-lg bg-stone-700 overflow-hidden">
                <Image 
                  src={tour.media.coverImage}
                  alt={tour.basicInfo.title}
                  className="w-full h-full object-cover"
                  width={100}  
                  height={100} 
                  priority 
                />
              </div>
              <div>
                <h4 className="font-medium text-white text-sm md:text-base">{tour.basicInfo.title}</h4>
                <p className="text-stone-400 text-xs">{tour.basicInfo.category}</p>
              </div>
            </div>
            <div className="col-span-3 md:col-span-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${tour.basicInfo.status === 'Active' ? 'bg-green-900/50 text-green-400' : 'bg-amber-900/50 text-amber-400'}`}>
                {tour.basicInfo.status}
              </span>
            </div>
            <div className="col-span-3 md:col-span-2 text-center">
              <p className="text-white font-medium text-sm md:text-base">0</p>
              <p className="text-stone-400 text-xs">bookings</p>
            </div>
            <div className="hidden md:block md:col-span-2 text-center">
              <p className="text-amber-400 font-bold">${tour.pricing.basePrice}</p>
            </div>
            <div className="col-span-3 md:col-span-2 flex justify-end space-x-1 md:space-x-2">
              {/* View Tour Button */}
              <button 
                onClick={() => setSelectedTour(tour)}
                className="p-1 md:p-2 bg-stone-700 hover:bg-stone-600 rounded-lg transition-colors cursor-pointer"
              >
                <FaEye className="h-3 w-3 md:h-4 md:w-4 text-stone-300" />
              </button>
              {/* Edit Tour Button */}
              <button
                onClick={() => setEditingTour(tour)}
                className="p-1 md:p-2 bg-stone-700 hover:bg-stone-600 rounded-lg transition-colors cursor-pointer"
              >
                <FaEdit className="h-3 w-3 md:h-4 md:w-4 text-stone-300" />
              </button>
              {/* Delete Tour Button */}
              <TourDeleteButton tour={tour} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};