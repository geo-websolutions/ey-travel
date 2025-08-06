'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { auth } from '@/lib/firebase';

export function useAuthGuard(redirectPath = '/login') {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const checkAuth = useCallback(async () => {
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
        if (!isRedirecting) {
          setIsRedirecting(true);
          router.push(redirectPath);
        }
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      if (!isRedirecting) {
        setIsRedirecting(true);
        router.push(redirectPath);
      }
      setIsAuthenticated(false);
    }
  }, [router, redirectPath, isRedirecting]);

  useEffect(() => {
    let isMounted = true;
    
    if (isMounted) {
      checkAuth();
    }

    return () => {
      isMounted = false;
    };
  }, [checkAuth]);

  return isAuthenticated;
}