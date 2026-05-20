import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ADMIN_EMAIL } from '../constants/config';
import type { User, UserRole, AuthState } from '../types/user';

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (nombre: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_KEY = '@techorganico_auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('guest');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    try {
      const stored = await AsyncStorage.getItem(AUTH_KEY);
      if (stored) {
        const parsed: User = JSON.parse(stored);
        setUser(parsed);
        setRole(parsed.role);
      }
    } catch {
      // sesión corrupta, continuar como guest
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, _password: string) {
    const determinedRole: UserRole = email === ADMIN_EMAIL ? 'vendor' : 'client';
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      nombre: email.split('@')[0] ?? email,
      role: determinedRole,
      fechaRegistro: new Date().toISOString(),
    };
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
    setUser(newUser);
    setRole(determinedRole);
  }

  async function register(nombre: string, email: string, _password: string) {
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      nombre,
      role: 'client',
      fechaRegistro: new Date().toISOString(),
    };
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
    setUser(newUser);
    setRole('client');
  }

  async function logout() {
    await AsyncStorage.removeItem(AUTH_KEY);
    setUser(null);
    setRole('guest');
  }

  return (
    <AuthContext.Provider value={{ user, role, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext debe usarse dentro de AuthProvider');
  return ctx;
}
