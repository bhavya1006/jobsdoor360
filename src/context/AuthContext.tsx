"use client";

import React, { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  email: string;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  signup: (email: string) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('jobsdoor360_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('jobsdoor360_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email: string) => {
    const userData = { email };
    localStorage.setItem('jobsdoor360_user', JSON.stringify(userData));
    setUser(userData);
    router.push('/account');
  };

  const signup = (email: string) => {
    // In a real app, you'd check if user exists. Here we just log them in.
    const userData = { email };
    localStorage.setItem('jobsdoor360_user', JSON.stringify(userData));
    setUser(userData);
    router.push('/account');
  };

  const logout = () => {
    localStorage.removeItem('jobsdoor360_user');
    setUser(null);
    router.push('/');
  };

  const authContextValue = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    loading,
  }), [user, loading]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
