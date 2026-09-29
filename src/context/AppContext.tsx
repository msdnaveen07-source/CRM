'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, BusinessCategory } from '@/types';

interface CurrentUser {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: UserRole;
  businessCategory: BusinessCategory;
  isImpersonating?: boolean;
  impersonatedBy?: string;
  impersonatedTenantName?: string;
}

interface AppContextType {
  user: CurrentUser;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  switchRole: (role: UserRole, tenantId?: string, tenantName?: string, category?: BusinessCategory) => void;
  stopImpersonating: () => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  isLoaded: boolean;
}

const defaultUser: CurrentUser = {
  id: 'user-client-1',
  tenantId: 'tenant-101',
  name: 'Vikram Sharma',
  email: 'vikram@apexrealestate.com',
  role: 'CLIENT_ADMIN',
  businessCategory: 'REAL_ESTATE'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<CurrentUser>(defaultUser);
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync user state with localStorage to persist across refreshes
  const setUser = (newUser: CurrentUser) => {
    setUserState(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('leadflow-user', JSON.stringify(newUser));
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('leadflow-user');
      if (savedUser) {
        try {
          setUserState(JSON.parse(savedUser));
        } catch (e) {
          console.error("Failed to parse saved user", e);
        }
      }
    }
    setIsLoaded(true);
    // Check saved theme
    const saved = localStorage.getItem('leadflow-theme') as 'light' | 'dark';
    if (saved) {
      setThemeState(saved);
      document.documentElement.classList.toggle('dark', saved === 'dark');
    }
  }, []);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem('leadflow-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const switchRole = (role: UserRole, tenantId?: string, tenantName?: string, category?: BusinessCategory) => {
    if (role === 'SUPER_ADMIN') {
      setUser({
        id: 'user-super-admin',
        tenantId: 'system',
        name: 'System Administrator',
        email: 'admin@leadflow.io',
        role: 'SUPER_ADMIN',
        businessCategory: 'GENERAL_CRM'
      });
    } else if (role === 'TEACHER' || role === 'STUDENT') {
      setUser({
        id: `user-${role.toLowerCase()}-1`,
        tenantId: tenantId || 'tenant-104',
        name: role === 'TEACHER' ? 'Prof. Anitha Ramesh' : 'Kavya S. (Student #402)',
        email: role === 'TEACHER' ? 'anitha@oxfordedu.in' : 'kavya@oxfordedu.in',
        role,
        businessCategory: 'EDUCATION'
      });
    } else if (tenantId && role === 'CLIENT_ADMIN' && user.role === 'SUPER_ADMIN') {
      setUser({
        id: 'user-super-admin',
        tenantId,
        name: `${tenantName || 'Client'} Admin`,
        email: `admin@${tenantId}.com`,
        role: 'CLIENT_ADMIN',
        businessCategory: category || (tenantId === 'tenant-104' ? 'EDUCATION' : 'REAL_ESTATE'),
        isImpersonating: true,
        impersonatedBy: 'user-super-admin',
        impersonatedTenantName: tenantName || tenantId
      });
    } else {
      setUser({
        id: 'user-client-1',
        tenantId: tenantId || 'tenant-101',
        name: role === 'SALES_USER' ? 'Rohan Verma' : 'Vikram Sharma',
        email: role === 'SALES_USER' ? 'rohan@apexrealestate.com' : 'vikram@apexrealestate.com',
        role,
        businessCategory: category || (tenantId === 'tenant-104' ? 'EDUCATION' : 'REAL_ESTATE')
      });
    }
  };

  const stopImpersonating = () => {
    switchRole('SUPER_ADMIN');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        theme,
        setTheme,
        switchRole,
        stopImpersonating,
        commandPaletteOpen,
        setCommandPaletteOpen,
        isLoaded
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
