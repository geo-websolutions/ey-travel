'use client';

import LoadingSpinner from './LoadingSpinner';
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function AuthGuard({ children }) {
  const isAuthenticated = useAuthGuard('/login');

  if (isAuthenticated === null) {
    // Still checking auth status
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // Will redirect automatically, just avoid flashing content
    return null;
  }

  // Authenticated
  return children;
}
