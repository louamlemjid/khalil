// src/components/AuthGuard.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Role } from '@/lib/types';
import { useAuth } from '@/context/AuthContext'; // Import useAuth

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth(); // Get user and isAuthenticated from context
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login'); // Not authenticated at all
      return;
    }

    if (user && !allowedRoles.includes(user.role)) {
      router.push('/dashboard'); // Authenticated but unauthorized for this specific page
    }
  }, [isAuthenticated, user, allowedRoles, router]);

  // Render children only if authenticated and authorized
  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return null; // Or a loading spinner, or an unauthorized message
  }

  return <>{children}</>;
};

export default AuthGuard;   