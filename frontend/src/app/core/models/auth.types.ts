export interface LoginCredentials {
  email: string;
  passwordHash?: string; // mapped on server
  password?: string;
}

export interface RegisterData {
  displayName: string;
  email: string;
  password?: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    accessToken: string;
    userId: string;
    displayName: string;
    email: string;
  };
  message?: string;
  errorMessage?: string;
}
