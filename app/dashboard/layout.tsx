// src/app/dashboard/layout.tsx
'use client'; // This component must be a client component to use useAuth

import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated
    // if (!isAuthenticated) {
    //   router.push('/login');
    // }
    // else router.prefetch('/dashboard');
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    // Optionally render a loading spinner or null while checking auth status
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}