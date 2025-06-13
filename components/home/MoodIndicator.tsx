import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Smile, Frown, Meh, Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import { JournalEntry } from '@/types';

interface MoodIndicatorProps {
  latestEntry?: JournalEntry;
}

export const MoodIndicator: React.FC<MoodIndicatorProps> = ({ latestEntry }) => {
  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy': return <Smile size={32} color="#10B981" />;
      case 'sad': return <Frown size={32} color="#EF4444" />;
      case 'neutral': return <Meh size={32} color="#F59E0B" />;
      default: return <Meh size={32} color="#71717A" />;
    }
  };

  const getMoodMessage = (mood: string) => {
    switch (mood) {
      case 'happy': return 'You seem to be in a great mood!';
      case 'sad': return 'Take care of yourself today.';
      case 'neutral': return 'A balanced day ahead.';
      default: return 'How are you feeling today?';
    }
  };

  return (
    <TouchableOpacity 
      onPress={() => router.push('/modals/create-journal')}
      activeOpacity={0.7}
    >
      <BlurView intensity={20} style={styles.container}>
        <View style={styles.content}>
          <View style={styles.moodDisplay}>
            {latestEntry ? getMoodIcon(latestEntry.mood) : <Plus size={32} color="#6366F1" />}
          </View>
          <View style={styles.textContent}>
            <Text style={styles.message}>
              {latestEntry ? getMoodMessage(latestEntry.mood) : 'Start journaling today'}
            </Text>
            <Text style={styles.action}>
              {latestEntry ? 'Tap to add new entry' : 'Tap to create your first entry'}
            </Text>
          </View>
        </View>
      </BlurView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  moodDisplay: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  textContent: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EAEAEA',
    marginBottom: 4,
  },
  action: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#71717A',
  },
});