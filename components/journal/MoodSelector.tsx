import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Smile, Frown, Meh } from 'lucide-react-native';

interface MoodSelectorProps {
  selectedMood: 'happy' | 'neutral' | 'sad';
  onMoodChange: (mood: 'happy' | 'neutral' | 'sad') => void;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onMoodChange,
}) => {
  const moods = [
    { key: 'happy' as const, icon: Smile, label: 'Happy', color: '#10B981' },
    { key: 'neutral' as const, icon: Meh, label: 'Neutral', color: '#F59E0B' },
    { key: 'sad' as const, icon: Frown, label: 'Sad', color: '#EF4444' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling?</Text>
      <View style={styles.moodsContainer}>
        {moods.map((mood) => {
          const Icon = mood.icon;
          const isSelected = selectedMood === mood.key;
          
          return (
            <TouchableOpacity
              key={mood.key}
              style={[
                styles.moodButton,
                isSelected && {
                  backgroundColor: mood.color + '20',
                  borderColor: mood.color,
                }
              ]}
              onPress={() => onMoodChange(mood.key)}
            >
              <Icon 
                size={32} 
                color={isSelected ? mood.color : '#71717A'} 
              />
              <Text style={[
                styles.moodLabel,
                { color: isSelected ? mood.color : '#71717A' }
              ]}>
                {mood.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EAEAEA',
    marginBottom: 16,
  },
  moodsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  moodButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    backgroundColor: 'rgba(26, 26, 26, 0.5)',
  },
  moodLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginTop: 8,
  },
});