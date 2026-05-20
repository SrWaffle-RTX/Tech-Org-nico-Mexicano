export type UserRole = 'vendor' | 'client' | 'guest';

export interface User {
  id: string;
  email: string;
  nombre: string;
  telefono?: string;
  direccion?: string;
  role: UserRole;
  fechaRegistro: string;
}

export interface AuthState {
  user: User | null;
  role: UserRole;
  isLoading: boolean;
}
