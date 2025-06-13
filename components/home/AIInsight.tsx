import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Sparkles, RefreshCw } from 'lucide-react-native';
import { router } from 'expo-router';

interface AIInsightProps {
  tasksCount: number;
  completedToday: number;
  journalMood?: string;
}

export const AIInsight: React.FC<AIInsightProps> = ({
  tasksCount,
  completedToday,
  journalMood,
}) => {
  const [insight, setInsight] = useState('');

  useEffect(() => {
    generateInsight();
  }, [tasksCount, completedToday, journalMood]);

  const generateInsight = () => {
    const insights = [
      `You've completed ${completedToday} tasks today. ${completedToday > 0 ? 'Great progress!' : 'Ready to tackle your goals?'}`,
      `With ${tasksCount} total tasks, ${journalMood === 'happy' ? 'your positive mood will help you stay productive!' : 'breaking them into smaller steps might help.'}`,
      `${journalMood === 'sad' ? 'Take it easy today and focus on self-care alongside your tasks.' : 'You\'re building great productivity habits!'}`,
      'Consider time-blocking your day for better focus and completion rates.',
      'Regular journaling helps track your productivity patterns and mood.',
    ];

    const randomInsight = insights[Math.floor(Math.random() * insights.length)];
    setInsight(randomInsight);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Insight</Text>
      <BlurView intensity={20} style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Sparkles size={20} color="#6366F1" />
          </View>
          <TouchableOpacity onPress={generateInsight} style={styles.refreshButton}>
            <RefreshCw size={16} color="#71717A" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.insightText}>{insight}</Text>
        
        <TouchableOpacity 
          style={styles.chatButton}
          onPress={() => router.push('/(tabs)/assistant')}
        >
          <Text style={styles.chatButtonText}>Chat with AI Assistant</Text>
        </TouchableOpacity>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  title: {
    fontSize: 20,
    fontFamily: 'SpaceGrotesk-SemiBold',
    color: '#EAEAEA',
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    padding: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshButton: {
    padding: 4,
  },
  insightText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#A1A1AA',
    lineHeight: 20,
    marginBottom: 16,
  },
  chatButton: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6366F1',
    alignItems: 'center',
  },
  chatButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6366F1',
  },
});