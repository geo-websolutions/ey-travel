'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { auth } from '@/lib/firebase';

export function LogoutButton({ className = '' }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Sign out from Firebase
      await auth.signOut();
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Redirect after successful logout
      router.push('/login');
      router.refresh(); // Ensure client cache is cleared
    } catch (error) {
      console.error('Logout failed:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`px-4 py-2 border border-transparent rounded-md justify-center shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 ${className}`}
    >
      {isLoggingOut ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-stone-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Logging out...
        </span>
      ) : (
        'Logout'
      )}
    </button>
  );
}