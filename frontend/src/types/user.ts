export interface User {
  id: string;
  phone: string;
  fullName: string;
  avatarUrl?: string;
  role: 'ROLE_CUSTOMER' | 'ROLE_SALES' | 'ROLE_ADMIN';
  isProfileComplete: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token?: string;
}
