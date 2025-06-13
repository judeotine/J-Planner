import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Delete } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSequence,
} from 'react-native-reanimated';

interface CustomKeypadProps {
  onKeyPress: (key: string) => void;
}

export const CustomKeypad: React.FC<CustomKeypadProps> = ({ onKeyPress }) => {
  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'delete'],
  ];

  const KeyButton: React.FC<{ value: string }> = ({ value }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePress = () => {
      scale.value = withSequence(
        withTiming(0.95, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
      onKeyPress(value);
    };

    if (!value) return <View style={styles.keyButton} />;

    return (
      <Animated.View style={animatedStyle}>
        <TouchableOpacity style={styles.keyButton} onPress={handlePress}>
          <BlurView intensity={20} style={styles.keyContent}>
            {value === 'delete' ? (
              <Delete size={24} color="#F472B6" />
            ) : (
              <Text style={styles.keyText}>{value}</Text>
            )}
          </BlurView>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {keys.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key, keyIndex) => (
            <KeyButton key={keyIndex} value={key} />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 300,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  keyButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
  },
  keyContent: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  keyText: {
    fontSize: 24,
    fontFamily: 'SpaceGrotesk-SemiBold',
    color: '#EAEAEA',
  },
});