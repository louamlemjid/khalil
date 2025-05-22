'use client';
import React,{ createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Define types for user and context
interface User {
  id: string;
  nom: string;
  email: string;
  role: 'caisse' | 'manager' | 'stock_manager';
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  canPerformAction: (action: string) => boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType|undefined>(undefined);

// Role-based use case permissions
const rolePermissions: Record<string, string[]> = {
  caisse: ['create_sale', 'view_sale', 'create_payment', 'view_payment'],
  manager: [
    'create_sale',
    'view_sale',
    'create_payment',
    'view_payment',
    'manage_user',
    'manage_client',
    'manage_product',
    'view_stock',
  ],
  stock_manager: ['manage_product', 'manage_stock', 'view_stock'],
};

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user and tokens from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedAccessToken = localStorage.getItem('supabase_access_token');
    const storedRefreshToken = localStorage.getItem('supabase_refresh_token');

    if (storedUser && storedAccessToken && storedRefreshToken) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setAccessToken(storedAccessToken);
      setIsAuthenticated(true);

      // Verify token validity
      supabase.auth.getUser(storedAccessToken).then(({ error }) => {
        if (error) {
          // Attempt to refresh token
          supabase.auth
            .refreshSession({ refresh_token: storedRefreshToken })
            .then(({ data, error: refreshError }) => {
              if (refreshError || !data.session) {
                logout();
              } else {
                setAccessToken(data.session.access_token);
                localStorage.setItem('supabase_access_token', data.session.access_token);
                localStorage.setItem('supabase_refresh_token', data.session.refresh_token);
              }
            });
        }
      });
    }
  }, []);

  // Login function to set user and tokens
  const login = (user: User, accessToken: string, refreshToken: string) => {
    setUser(user);
    setAccessToken(accessToken);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('supabase_access_token', accessToken);
    localStorage.setItem('supabase_refresh_token', refreshToken);
  };

  // Logout function to clear state and storage
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('supabase_access_token');
    localStorage.removeItem('supabase_refresh_token');
    supabase.auth.signOut();
  };

  // Check if the user can perform an action based on their role
  const canPerformAction = (action: string): boolean => {
    if (!user) return false;
    return rolePermissions[user.role]?.includes(action) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        login,
        logout,
        canPerformAction: (action: string) => {
          if (!user) return false;
          return rolePermissions[user.role]?.includes(action) || false;
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}