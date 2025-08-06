'use client'

import { useState } from 'react';
import { LogoutButton } from '@/components/auth/LogoutButton';
import Link from 'next/link';
import { getRecentTours } from '@/utils/getAllTours';
import { 
  FaHome, 
  FaPlus, 
  FaList, 
  FaUsers, 
  FaChartLine, 
  FaCog,
  FaStar,
  FaEye,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarCheck,
  FaDotCircle,
  FaSearch
} from 'react-icons/fa';

const recentTours = await getRecentTours();

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Sample data for the dashboard
  const stats = [
    { title: 'Total Tours', value: '0', icon: <FaList className="text-amber-400" />, change: '+0%' },
    { title: 'New Bookings', value: '0', icon: <FaUsers className="text-amber-400" />, change: '+0%' },
    { title: 'Revenue', value: '$0', icon: <FaChartLine className="text-amber-400" />, change: '+0%' },
    { title: 'Featured', value: '0', icon: <FaStar className="text-amber-400" />, change: '+0' }
  ];

  
  console.log(recentTours)

  return (
    <div className="min-h-screen bg-stone-900 text-stone-200">
      {/* Sidebar Navigation */}
      <div className="fixed inset-y-0 left-0 w-64 bg-stone-800/90 border-r border-stone-700 p-4 flex flex-col">
        <div className="mb-8 p-4">
          <h1 className="text-2xl font-bold text-amber-400">Admin Panel</h1>
          <p className="text-stone-400 text-sm">Tour Management System</p>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30' : 'hover:bg-stone-700/50'}`}
          >
            <FaHome className="text-lg" />
            <span>Dashboard</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('new-tour')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'new-tour' ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30' : 'hover:bg-stone-700/50'}`}
          >
            <FaPlus className="text-lg" />
            <span>Create New Tour</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('tours')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'tours' ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30' : 'hover:bg-stone-700/50'}`}
          >
            <FaList className="text-lg" />
            <span>View All Tours</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'bookings' ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30' : 'hover:bg-stone-700/50'}`}
          >
            <FaCalendarCheck className="text-lg" />
            <span>Bookings</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'analytics' ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30' : 'hover:bg-stone-700/50'}`}
          >
            <FaChartLine className="text-lg" />
            <span>Analytics</span>
          </button>
        </nav>
        
        <div className="mt-auto p-4 border-t border-stone-700">
          <button className="w-full hidden items-center space-x-3 px-4 py-3 rounded-lg hover:bg-stone-700/50 transition-all">
            <FaCog className="text-lg" />
            <span>Settings</span>
          </button>
          <LogoutButton className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-stone-700/50 transition-all mt-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'new-tour' && 'Create New Tour'}
            {activeTab === 'tours' && 'All Tours'}
            {activeTab === 'bookings' && 'Bookings'}
            {activeTab === 'analytics' && 'Analytics'}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-stone-800 border border-stone-700 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              <FaSearch className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
            </div>
            <div className="h-10 w-10 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold">
              AD
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-stone-800/50 rounded-xl border border-stone-700 p-6 hover:shadow-amber-500/10 hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-stone-400 text-sm">{stat.title}</p>
                      <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                    </div>
                    <div className="p-2 bg-stone-700/50 rounded-lg">
                      {stat.icon}
                    </div>
                  </div>
                  <p className="text-amber-400 text-sm mt-4">{stat.change} from last month</p>
                </div>
              ))}
            </div>

            {/* Recent Tours */}
            <div className="bg-stone-800/50 rounded-xl border border-stone-700 overflow-hidden">
              <div className="p-6 border-b border-stone-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Recent Tours</h3>
                <button 
                  onClick={() => setActiveTab('tours')}
                  className="text-amber-400 hover:text-amber-300 text-sm font-medium"
                >
                  View All
                </button>
              </div>
              <div className="divide-y divide-stone-700">
                {recentTours.map((tour) => (
                  <div key={tour.id} className="p-4 hover:bg-stone-700/30 transition-colors grid grid-cols-5 items-center">
                    <div className="col-span-2">
                      <h4 className="font-medium text-white">{tour.basicInfo.title}</h4>
                      <p className="text-stone-400 text-sm">{tour.basicInfo.category}</p>
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${tour.basicInfo.status === 'Active' ? 'bg-green-900/50 text-green-400' : 'bg-amber-900/50 text-amber-400'}`}>
                        {tour.basicInfo.status}
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-medium">0</p>
                      <p className="text-stone-400 text-xs">bookings</p>
                    </div>
                    <div className="text-right">
                      <p className="text-amber-400 font-bold">${tour.pricing.basePrice}</p>
                      <button 
                        className="text-xs text-stone-400 hover:text-amber-400"
                      >
                        Edit Tour
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-xl border border-stone-700 p-6 flex flex-col items-center justify-center text-center hover:shadow-amber-500/10 hover:shadow-lg transition-all">
                <div className="p-4 bg-amber-600/10 rounded-full mb-4">
                  <FaPlus className="text-amber-400 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Create New Tour</h3>
                <p className="text-stone-400 text-sm mb-4">Start building your next amazing tour experience</p>
                <Link href="/admin/new-tour" target="_blank" rel="noopener noreferrer">
                  <button
                    className="bg-amber-600 hover:bg-amber-500 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                  >
                    Get Started
                  </button>
                </Link>
                
              </div>
              
              <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-xl border border-stone-700 p-6 flex flex-col items-center justify-center text-center hover:shadow-amber-500/10 hover:shadow-lg transition-all">
                <div className="p-4 bg-amber-600/10 rounded-full mb-4">
                  <FaStar className="text-amber-400 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Featured Tours</h3>
                <p className="text-stone-400 text-sm mb-4">Manage your featured tours and promotions</p>
                <button className="bg-stone-700 hover:bg-stone-600 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                  Manage
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-xl border border-stone-700 p-6 flex flex-col items-center justify-center text-center hover:shadow-amber-500/10 hover:shadow-lg transition-all">
                <div className="p-4 bg-amber-600/10 rounded-full mb-4">
                  <FaChartLine className="text-amber-400 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">View Analytics</h3>
                <p className="text-stone-400 text-sm mb-4">See how your tours are performing</p>
                <button 
                  onClick={() => setActiveTab('analytics')}
                  className="bg-stone-700 hover:bg-stone-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  View Reports
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tours List View */}
        {activeTab === 'tours' && (
          <div className="bg-stone-800/50 rounded-xl border border-stone-700 overflow-hidden">
            <div className="p-6 border-b border-stone-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">All Tours</h3>
              <div className="flex space-x-4">
                <select className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50">
                  <option disabled>Filter by Status</option>
                  <option>Active</option>
                  <option>Draft</option>
                  <option>Archived</option>
                </select>
                <button 
                  onClick={() => setActiveTab('new-tour')}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-medium py-1.5 px-4 rounded-lg text-sm transition-colors flex items-center"
                >
                  <FaPlus className="mr-2" size={12} /> New Tour
                </button>
              </div>
            </div>
            <div className="divide-y divide-stone-700">
              {recentTours.map((tour) => (
                <div key={tour.id} className="p-4 hover:bg-stone-700/30 transition-colors grid grid-cols-12 items-center">
                  <div className="col-span-4 flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-lg bg-stone-700 overflow-hidden">
                      {/* Tour image would go here */}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{tour.title}</h4>
                      <p className="text-stone-400 text-sm">{tour.category}</p>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${tour.status === 'Active' ? 'bg-green-900/50 text-green-400' : 'bg-amber-900/50 text-amber-400'}`}>
                      {tour.status}
                    </span>
                  </div>
                  <div className="col-span-2 text-center">
                    <p className="text-white font-medium">{tour.bookings}</p>
                    <p className="text-stone-400 text-xs">bookings</p>
                  </div>
                  <div className="col-span-2 text-center">
                    <p className="text-amber-400 font-bold">${tour.price}</p>
                  </div>
                  <div className="col-span-2 flex justify-end space-x-2">
                    <button className="p-2 bg-stone-700 hover:bg-stone-600 rounded-lg transition-colors cursor-pointer">
                      <FaEye className="h-4 w-4 text-stone-300" />
                    </button>
                    <button 
                      onClick={() => setActiveTab('new-tour')}
                      className="p-2 bg-stone-700 hover:bg-stone-600 rounded-lg transition-colors cursor-pointer"
                    >
                      <FaEdit className="h-4 w-4 text-stone-300" />
                    </button>
                    <button className="p-2 bg-stone-700 hover:bg-red-400 rounded-lg transition-colors cursor-pointer">
                      <FaTrash className="h-4 w-4 text-stone-300" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-stone-700 flex justify-between items-center">
              <p className="text-stone-400 text-sm">Showing 1 to 3 of 24 tours</p>
              <div className="flex space-x-2">
                <button className="p-2 bg-stone-700 hover:bg-stone-600 rounded-lg transition-colors disabled:opacity-50" disabled>
                  <FaChevronLeft className="h-4 w-4 text-stone-300" />
                </button>
                <button className="px-3 py-1 bg-amber-600 text-white rounded-lg text-sm">1</button>
                <button className="px-3 py-1 bg-stone-700 hover:bg-stone-600 text-white rounded-lg text-sm">2</button>
                <button className="px-3 py-1 bg-stone-700 hover:bg-stone-600 text-white rounded-lg text-sm">3</button>
                <button className="p-2 bg-stone-700 hover:bg-stone-600 rounded-lg transition-colors">
                  <FaChevronRight className="h-4 w-4 text-stone-300" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New Tour Form */}
        {activeTab === 'new-tour' && (
          <div className="bg-stone-800/50 rounded-xl border border-stone-700 p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Create New Tour</h3>
            
            <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-xl border border-stone-700 p-6 flex flex-col items-center justify-center text-center hover:shadow-amber-500/10 hover:shadow-lg transition-all">
                <div className="p-4 bg-amber-600/10 rounded-full mb-4">
                  <FaPlus className="text-amber-400 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Create New Tour</h3>
                <p className="text-stone-400 text-sm mb-4">Start building your next amazing tour experience</p>
                <Link href="/admin/new-tour" target="_blank" rel="noopener noreferrer">
                  <button
                    className="bg-amber-600 hover:bg-amber-500 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                  >
                    Get Started
                  </button>
                </Link>
              </div>
          </div>
        )}

        {/* Bookings View */}
        {activeTab === 'bookings' && (
          <div className="bg-stone-800/50 rounded-xl border border-stone-700 p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Bookings Management</h3>
            <div className="bg-stone-800/40 rounded-lg border border-stone-700 p-6">
              <p className="text-stone-400">Bookings data and management tools will appear here.</p>
            </div>
          </div>
        )}

        {/* Analytics View */}
        {activeTab === 'analytics' && (
          <div className="bg-stone-800/50 rounded-xl border border-stone-700 p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Tour Analytics</h3>
            <div className="bg-stone-800/40 rounded-lg border border-stone-700 p-6">
              <p className="text-stone-400">Analytics charts and reports will appear here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;