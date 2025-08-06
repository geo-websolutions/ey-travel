'use client'
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useState, useEffect } from 'react';
import { FaList, FaUsers, FaChartLine, FaStar, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { motion } from 'framer-motion';

export const DashboardStats = ({ tours }) => {
  const [stats, setStats] = useState([
    { title: 'Total Tours', value: null, icon: <FaList className="text-amber-400" />, change: '+0%', loading: true, trend: 'neutral' },
    { title: 'New Bookings', value: '0', icon: <FaUsers className="text-amber-400" />, change: '+0%', loading: false, trend: 'neutral' },
    { title: 'Revenue', value: '$0', icon: <FaChartLine className="text-amber-400" />, change: '+0%', loading: false, trend: 'neutral' },
    { title: 'Featured', value: '0', icon: <FaStar className="text-amber-400" />, change: '+0', loading: false, trend: 'neutral' }
  ]);

  // Calculate monthly percentage change
  const calculateMonthlyChange = (monthlyCounts) => {
    const months = Object.keys(monthlyCounts).sort();
    if (months.length < 2) return { change: '0%', trend: 'neutral' };

    const currentMonth = months[months.length - 1];
    const previousMonth = months[months.length - 2];
    
    const currentCount = monthlyCounts[currentMonth];
    const previousCount = monthlyCounts[previousMonth];
    
    if (previousCount === 0) return { change: '100%', trend: 'up' }; // Handle division by zero
    
    const percentageChange = ((currentCount - previousCount) / previousCount) * 100;
    const roundedChange = Math.round(percentageChange * 10) / 10; // Round to 1 decimal
    
    return {
      change: `${roundedChange >= 0 ? '+' : ''}${roundedChange}%`,
      trend: roundedChange >= 0 ? 'up' : 'down'
    };
  };

  useEffect(() => {
    // Count featured tours from the tours prop
    if (tours) {
      const featuredCount = tours.filter(tour => tour.basicInfo.featured).length;
      setStats(prevStats => prevStats.map(stat => 
        stat.title === 'Featured'
          ? { ...stat, value: featuredCount.toString() }
          : stat
      ));
    }

    // Real-time tour count listener
    const toursUnsubscribe = onSnapshot(collection(db, 'tours'), (snapshot) => {
      try {
        setStats(prevStats => prevStats.map(stat => 
          stat.title === 'Total Tours' 
            ? { ...stat, value: snapshot.size.toString() } 
            : stat
        ));
      } catch (err) {
        setStats(prevStats => prevStats.map(stat => 
          stat.title === 'Total Tours'
            ? { ...stat, value: 'Error' }
            : stat
        ));
      }
    });

    // Monthly stats listener
    const statsUnsubscribe = onSnapshot(doc(db, 'metadata', 'tourStats'), (doc) => {
      try {
        if (!doc.exists()) return;
        
        const { monthlyCounts } = doc.data();
        const { change, trend } = calculateMonthlyChange(monthlyCounts);
        
        setStats(prevStats => prevStats.map(stat => 
          stat.title === 'Total Tours'
            ? { ...stat, change, trend, loading: false }
            : stat
        ));
      } catch (err) {
        setStats(prevStats => prevStats.map(stat => 
          stat.title === 'Total Tours'
            ? { ...stat, change: 'Error', trend: 'neutral', loading: false }
            : stat
        ));
      }
    });

    return () => {
      toursUnsubscribe();
      statsUnsubscribe();
    };
  }, [tours]); // Add tours to dependency array

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-stone-800/50 rounded-xl border border-stone-700 p-4 md:p-6 hover:shadow-amber-500/10 hover:shadow-lg transition-all"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-stone-400 text-sm">{stat.title}</p>
              {stat.loading ? (
                <div className="h-8 mt-2 w-24 bg-stone-700/50 rounded-lg animate-pulse"></div>
              ) : (
                <h3 className="text-xl md:text-2xl font-bold text-white mt-1">
                  {stat.value}
                </h3>
              )}
            </div>
            <div className="p-2 bg-stone-700/50 rounded-lg">
              {stat.icon}
            </div>
          </div>
          <div className="mt-2 md:mt-4 flex items-center gap-1">
            {stat.loading ? (
              <div className="h-4 w-16 bg-stone-700/50 rounded animate-pulse"></div>
            ) : (
              <>
                {stat.trend === 'up' && (
                  <FaArrowUp className="text-green-400 text-xs" />
                )}
                {stat.trend === 'down' && (
                  <FaArrowDown className="text-red-400 text-xs" />
                )}
                <span className={`text-sm ${
                  stat.trend === 'up' ? 'text-green-400' : 
                  stat.trend === 'down' ? 'text-red-400' : 'text-amber-400'
                }`}>
                  {index === 3 ? `` : `${stat.change} from Last Month`}
                </span>
              </>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};