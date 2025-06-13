import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { CustomKeypad } from '@/components/security/CustomKeypad';
import { PinDots } from '@/components/security/PinDots';
import { useAuth } from '@/hooks/useAuth';

const { width } = Dimensions.get('window');

export default function PinSetupScreen() {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState('');
  const { setupPin } = useAuth();

  const shakeAnimation = useSharedValue(0);
  const scaleAnimation = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: shakeAnimation.value },
      { scale: scaleAnimation.value }
    ],
  }));

  const handleKeyPress = (key: string) => {
    if (key === 'delete') {
      if (isConfirming) {
        setConfirmPin(prev => prev.slice(0, -1));
      } else {
        setPin(prev => prev.slice(0, -1));
      }
      setError('');
      return;
    }

    const currentPin = isConfirming ? confirmPin : pin;
    if (currentPin.length >= 6) return;

    const newPin = currentPin + key;
    
    if (isConfirming) {
      setConfirmPin(newPin);
      if (newPin.length === 6) {
        if (newPin === pin) {
          setupPin(newPin);
          router.replace('/(auth)/biometric-setup');
        } else {
          setError('PINs do not match. Please try again.');
          triggerShake();
          setTimeout(() => {
            setPin('');
            setConfirmPin('');
            setIsConfirming(false);
            setError('');
          }, 1000);
        }
      }
    } else {
      setPin(newPin);
      if (newPin.length === 6) {
        setIsConfirming(true);
        scaleAnimation.value = withSequence(
          withTiming(1.05, { duration: 100 }),
          withTiming(1, { duration: 100 })
        );
      }
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
            <Text style={styles.title}>
              {isConfirming ? 'Confirm Your PIN' : 'Set Up Your PIN'}
            </Text>
            <Text style={styles.subtitle}>
              {isConfirming 
                ? 'Enter your PIN again to confirm'
                : 'Create a 6-digit PIN to secure your app'
              }
            </Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </Animated.View>

          <View style={styles.pinContainer}>
            <PinDots 
              length={6} 
              filled={isConfirming ? confirmPin.length : pin.length} 
              error={!!error}
            />
          </View>

          <CustomKeypad onKeyPress={handleKeyPress} />
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
    fontSize: 28,
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
});