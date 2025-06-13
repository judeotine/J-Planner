import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

// Dark Theme
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#6366F1',
    secondary: '#F472B6',
    tertiary: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    background: '#0F0F0F',
    surface: '#1A1A1A',
    surfaceVariant: '#2A2A2A',
    onBackground: '#EAEAEA',
    onSurface: '#EAEAEA',
    onSurfaceVariant: '#A1A1AA',
    outline: '#71717A',
  },
};

// Light Theme
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4F46E5',
    secondary: '#DB2777',
    tertiary: '#059669',
    error: '#DC2626',
    warning: '#D97706',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    surfaceVariant: '#F3F4F6',
    onBackground: '#111827',
    onSurface: '#111827',
    onSurfaceVariant: '#4B5563',
    outline: '#9CA3AF',
  },
};

// Common colors
export const colors = {
  dark: {
    background: '#0F0F0F',
    surface: '#1A1A1A',
    surfaceVariant: '#2A2A2A',
    primary: '#6366F1',
    secondary: '#F472B6',
    accent: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    text: '#EAEAEA',
    textSecondary: '#A1A1AA',
    textTertiary: '#71717A',
    border: '#2A2A2A',
    borderLight: '#3F3F46',
  },
  light: {
    background: '#FFFFFF',
    surface: '#F9FAFB',
    surfaceVariant: '#F3F4F6',
    primary: '#4F46E5',
    secondary: '#DB2777',
    accent: '#059669',
    error: '#DC2626',
    warning: '#D97706',
    text: '#111827',
    textSecondary: '#4B5563',
    textTertiary: '#6B7280',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontFamily: 'SpaceGrotesk-Bold',
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontFamily: 'SpaceGrotesk-Bold',
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontFamily: 'SpaceGrotesk-SemiBold',
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontFamily: 'SpaceGrotesk-SemiBold',
    lineHeight: 28,
  },
  body1: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    lineHeight: 20,
  },
};