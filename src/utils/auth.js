'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { auth } from '@/lib/firebase';

/**
 * Custom hook for guarding routes based on Firebase and Supabase authentication.
 * Redirects to `redirectPath` if not authenticated.
 *
 * @param {string} redirectPath Path to redirect if unauthenticated
 * @returns {boolean | null} `true` if authenticated, `false` if not, `null` if loading
 */
export function useAuthGuard(redirectPath = '/login') {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Firebase auth check
        const firebaseUser = await new Promise((resolve) => {
          const unsubscribe = auth.onAuthStateChanged((user) => {
            unsubscribe();
            resolve(user);
          });
        });

        // Supabase auth check
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session || !firebaseUser) {
          router.push(redirectPath);
          setIsAuthenticated(false);
          return;
        }

        // All checks passed
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push(redirectPath);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [router, redirectPath]);

  return isAuthenticated;
}
