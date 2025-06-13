import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="pin-setup" />
      <Stack.Screen name="pin-unlock" />
      <Stack.Screen name="biometric-setup" />
    </Stack>
  );
}