import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Fingerprint, Shield, ArrowRight } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import * as LocalAuthentication from 'expo-local-authentication';

export default function BiometricSetupScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { enableBiometrics } = useAuth();

  const handleEnableBiometrics = async () => {
    setIsLoading(true);
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (!hasHardware) {
        Alert.alert('Not Supported', 'Biometric authentication is not supported on this device.');
        router.replace('/(tabs)');
        return;
      }
      
      if (!isEnrolled) {
        Alert.alert(
          'No Biometrics Enrolled',
          'Please set up biometric authentication in your device settings first.',
          [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
        );
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Enable biometric authentication for J-Planner',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (result.success) {
        await enableBiometrics();
        Alert.alert(
          'Success!',
          'Biometric authentication has been enabled.',
          [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
        );
      } else {
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Biometric setup error:', error);
      router.replace('/(tabs)');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <BlurView intensity={20} style={styles.blurContainer}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Shield size={60} color="#6366F1" />
            </View>
            <Text style={styles.title}>Secure Your App</Text>
            <Text style={styles.subtitle}>
              Enable biometric authentication for quick and secure access to your data.
            </Text>
          </View>

          <View style={styles.features}>
            <View style={styles.feature}>
              <Fingerprint size={24} color="#F472B6" />
              <Text style={styles.featureText}>
                Use Face ID, Touch ID, or fingerprint to unlock
              </Text>
            </View>
            <View style={styles.feature}>
              <Shield size={24} color="#F472B6" />
              <Text style={styles.featureText}>
                Keep your personal data secure and private
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.enableButton}
              onPress={handleEnableBiometrics}
              disabled={isLoading}
            >
              <Text style={styles.enableButtonText}>Enable Biometrics</Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip for Now</Text>
            </TouchableOpacity>
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
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  header: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  title: {
    fontSize: 32,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#EAEAEA',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#A1A1AA',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  features: {
    paddingVertical: 40,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#EAEAEA',
    marginLeft: 16,
    flex: 1,
  },
  actions: {
    gap: 16,
  },
  enableButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  enableButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  skipButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: 'rgba(161, 161, 170, 0.1)',
    borderWidth: 1,
    borderColor: '#3F3F46',
  },
  skipButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#A1A1AA',
    textAlign: 'center',
  },
});