import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { ADMIN_EMAIL } from '../constants/config';
import type { User, UserRole, AuthState } from '../types/user';

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (nombre: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('guest');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        try {
          const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (snap.exists()) {
            const data = snap.data();
            const appUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email ?? '',
              nombre: data.nombre ?? '',
              role: data.role as UserRole,
              fechaRegistro: data.fechaRegistro,
            };
            setUser(appUser);
            setRole(appUser.role);
          }
        } catch {
          setUser(null);
          setRole('guest');
        }
      } else {
        setUser(null);
        setRole('guest');
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged se encarga de actualizar el estado
  }

  async function register(nombre: string, email: string, password: string) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const determinedRole: UserRole = email === ADMIN_EMAIL ? 'vendor' : 'client';
    await setDoc(doc(db, 'users', credential.user.uid), {
      nombre,
      email,
      role: determinedRole,
      fechaRegistro: new Date().toISOString(),
    });
    // onAuthStateChanged se encarga de actualizar el estado
  }

  async function logout() {
    await signOut(auth);
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
