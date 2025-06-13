import React, { createContext } from 'react';
import { useAuthState } from '@/hooks/useAuth';

interface AuthContextType {
  isAuthenticated: boolean;
  isSetup: boolean;
  biometricsEnabled: boolean;
  setupPin: (pin: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<boolean>;
  enableBiometrics: () => Promise<void>;
  authenticateWithBiometrics: () => Promise<boolean>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuthState();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};