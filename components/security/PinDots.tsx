import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  useEffect,
} from 'react-native-reanimated';

interface PinDotsProps {
  length: number;
  filled: number;
  error?: boolean;
}

export const PinDots: React.FC<PinDotsProps> = ({ length, filled, error }) => {
  const dots = Array.from({ length }, (_, index) => index);

  const DotComponent: React.FC<{ index: number }> = ({ index }) => {
    const scale = useSharedValue(1);
    const isFilled = index < filled;

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    useEffect(() => {
      if (isFilled) {
        scale.value = withSpring(1.2, { damping: 10 });
        setTimeout(() => {
          scale.value = withSpring(1, { damping: 10 });
        }, 100);
      }
    }, [isFilled]);

    return (
      <Animated.View style={animatedStyle}>
        <View
          style={[
            styles.dot,
            isFilled && styles.dotFilled,
            error && styles.dotError,
          ]}
        />
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {dots.map((_, index) => (
        <DotComponent key={index} index={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#3F3F46',
  },
  dotFilled: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  dotError: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
});