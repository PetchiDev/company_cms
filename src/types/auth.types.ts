export interface UserProfile {
  id: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends LoginCredentials {
  confirmPassword: string;
}
