import { useState, useEffect, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { AppState } from 'react-native';
import { router } from 'expo-router';

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

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const useAuthState = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [lastActiveTime, setLastActiveTime] = useState(Date.now());

  const LOCK_TIMEOUT = 60000; // 1 minute

  useEffect(() => {
    checkSetupStatus();
    
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        const now = Date.now();
        if (isAuthenticated && now - lastActiveTime > LOCK_TIMEOUT) {
          setIsAuthenticated(false);
          if (Platform.OS !== 'web') {
            router.replace('/(auth)/pin-unlock');
          }
        }
      } else if (nextAppState === 'background') {
        setLastActiveTime(Date.now());
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [isAuthenticated, lastActiveTime]);

  const checkSetupStatus = async () => {
    try {
      const pinHash = await AsyncStorage.getItem('pin_hash');
      const biometrics = await AsyncStorage.getItem('biometrics_enabled');
      
      setIsSetup(!!pinHash);
      setBiometricsEnabled(biometrics === 'true');
    } catch (error) {
      console.error('Setup check error:', error);
    }
  };

  const setupPin = async (pin: string) => {
    try {
      // Simple hash for demo - in production use proper crypto
      const pinHash = btoa(pin);
      await AsyncStorage.setItem('pin_hash', pinHash);
      setIsSetup(true);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('PIN setup error:', error);
      throw error;
    }
  };

  const verifyPin = async (pin: string) => {
    try {
      const storedHash = await AsyncStorage.getItem('pin_hash');
      const pinHash = btoa(pin);
      
      if (storedHash === pinHash) {
        setIsAuthenticated(true);
        setLastActiveTime(Date.now());
        return true;
      }
      return false;
    } catch (error) {
      console.error('PIN verification error:', error);
      return false;
    }
  };

  const enableBiometrics = async () => {
    try {
      if (Platform.OS !== 'web') {
        await AsyncStorage.setItem('biometrics_enabled', 'true');
        setBiometricsEnabled(true);
      }
    } catch (error) {
      console.error('Biometrics enable error:', error);
      throw error;
    }
  };

  const authenticateWithBiometrics = async () => {
    try {
      if (Platform.OS === 'web') {
        return false;
      }

      // Import dynamically for web compatibility
      const LocalAuthentication = await import('expo-local-authentication');
      
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access J-Planner',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (result.success) {
        setIsAuthenticated(true);
        setLastActiveTime(Date.now());
        return true;
      }
      return false;
    } catch (error) {
      console.error('Biometric auth error:', error);
      return false;
    }
  };

  const logout = async () => {
    setIsAuthenticated(false);
    if (Platform.OS !== 'web') {
      router.replace('/(auth)/pin-unlock');
    }
  };

  return {
    isAuthenticated,
    isSetup,
    biometricsEnabled,
    setupPin,
    verifyPin,
    enableBiometrics,
    authenticateWithBiometrics,
    logout,
  };
};