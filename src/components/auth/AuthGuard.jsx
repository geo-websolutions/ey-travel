'use client';

import LoadingSpinner from '../LoadingSpinner';
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function AuthGuard({ children }) {
  const isAuthenticated = useAuthGuard('/login');

  if (isAuthenticated === null) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}
