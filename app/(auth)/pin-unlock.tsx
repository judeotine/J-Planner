import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { CustomKeypad } from '@/components/security/CustomKeypad';
import { PinDots } from '@/components/security/PinDots';
import { useAuth } from '@/hooks/useAuth';
import { Fingerprint } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

export default function PinUnlockScreen() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const { verifyPin, authenticateWithBiometrics, biometricsEnabled } = useAuth();

  const shakeAnimation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeAnimation.value }],
  }));

  useEffect(() => {
    // Try biometric authentication on mount if enabled
    if (biometricsEnabled) {
      handleBiometricAuth();
    }
  }, []);

  const handleKeyPress = async (key: string) => {
    if (key === 'delete') {
      setPin(prev => prev.slice(0, -1));
      setError('');
      return;
    }

    if (pin.length >= 6) return;

    const newPin = pin + key;
    setPin(newPin);

    if (newPin.length === 6) {
      const isValid = await verifyPin(newPin);
      if (isValid) {
        router.replace('/(tabs)');
      } else {
        setError('Incorrect PIN. Please try again.');
        setAttempts(prev => prev + 1);
        triggerShake();
        setPin('');
        
        if (attempts >= 4) {
          Alert.alert(
            'Too Many Attempts',
            'Please try again later or contact support.',
            [{ text: 'OK' }]
          );
        }
      }
    }
  };

  const handleBiometricAuth = async () => {
    const success = await authenticateWithBiometrics();
    if (success) {
      router.replace('/(tabs)');
    }
  };

  const triggerShake = () => {
    shakeAnimation.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <BlurView intensity={20} style={styles.blurContainer}>
        <View style={styles.content}>
          <Animated.View style={[styles.header, animatedStyle]}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Enter your PIN to continue</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </Animated.View>

          <View style={styles.pinContainer}>
            <PinDots length={6} filled={pin.length} error={!!error} />
          </View>

          <View style={styles.keypadContainer}>
            <CustomKeypad onKeyPress={handleKeyPress} />
            
            {biometricsEnabled && (
              <TouchableOpacity 
                style={styles.biometricButton} 
                onPress={handleBiometricAuth}
              >
                <Fingerprint size={24} color="#6366F1" />
                <Text style={styles.biometricText}>Use Biometrics</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  blurContainer: {
    flex: 1,
    backgroundColor: 'rgba(15, 15, 15, 0.9)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-evenly',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#EAEAEA',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#A1A1AA',
    textAlign: 'center',
    lineHeight: 22,
  },
  error: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 16,
  },
  pinContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  keypadContainer: {
    alignItems: 'center',
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  biometricText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6366F1',
    marginLeft: 8,
  },
});