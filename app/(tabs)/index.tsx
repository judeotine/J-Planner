import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Plus, 
  Sun, 
  Moon, 
  Sunrise, 
  CheckCircle,
  Calendar,
  TrendingUp,
  Smile
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useData } from '@/hooks/useData';
import { getGreeting } from '@/utils/timeUtils';
import { TaskCard } from '@/components/cards/TaskCard';
import { QuickActions } from '@/components/home/QuickActions';
import { MoodIndicator } from '@/components/home/MoodIndicator';
import { AIInsight } from '@/components/home/AIInsight';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { tasks, notes, journalEntries, loadData } = useData();
  
  const todayTasks = tasks.filter(task => 
    !task.completed && 
    new Date(task.dueDate).toDateString() === new Date().toDateString()
  );

  const completedToday = tasks.filter(task =>
    task.completed &&
    new Date(task.completedAt || task.updatedAt).toDateString() === new Date().toDateString()
  ).length;

  const latestJournal = journalEntries
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getTimeIcon = () => {
    const hour = new Date().getHours();
    if (hour < 6) return <Moon size={24} color="#6366F1" />;
    if (hour < 12) return <Sunrise size={24} color="#F59E0B" />;
    if (hour < 18) return <Sun size={24} color="#EAB308" />;
    return <Moon size={24} color="#6366F1" />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <LinearGradient
          colors={['rgba(99, 102, 241, 0.1)', 'rgba(15, 15, 15, 0)']}
          style={styles.header}
        >
          <View style={styles.greeting}>
            {getTimeIcon()}
            <View style={styles.greetingText}>
              <Text style={styles.greetingTitle}>{getGreeting()}</Text>
              <Text style={styles.greetingSubtitle}>Ready to plan your day?</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <BlurView intensity={20} style={styles.statsCard}>
            <View style={styles.statItem}>
              <CheckCircle size={20} color="#10B981" />
              <Text style={styles.statNumber}>{completedToday}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Calendar size={20} color="#F59E0B" />
              <Text style={styles.statNumber}>{todayTasks.length}</Text>
              <Text style={styles.statLabel}>Due Today</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <TrendingUp size={20} color="#6366F1" />
              <Text style={styles.statNumber}>{notes.length}</Text>
              <Text style={styles.statLabel}>Notes</Text>
            </View>
          </BlurView>
        </View>

        {/* Quick Actions */}
        <QuickActions />

        {/* Today's Tasks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Tasks</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/tasks')}>
              <Text style={styles.sectionLink}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {todayTasks.length > 0 ? (
            <View style={styles.tasksList}>
              {todayTasks.slice(0, 3).map((task) => (
                <TaskCard key={task.id} task={task} compact />
              ))}
            </View>
          ) : (
            <BlurView intensity={20} style={styles.emptyState}>
              <CheckCircle size={48} color="#71717A" />
              <Text style={styles.emptyTitle}>All caught up!</Text>
              <Text style={styles.emptySubtitle}>No tasks due today</Text>
            </BlurView>
          )}
        </View>

        {/* Mood & Journal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How are you feeling?</Text>
          <MoodIndicator latestEntry={latestJournal} />
        </View>

        {/* AI Insight */}
        <AIInsight 
          tasksCount={tasks.length}
          completedToday={completedToday}
          journalMood={latestJournal?.mood}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  greeting: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingText: {
    marginLeft: 16,
    flex: 1,
  },
  greetingTitle: {
    fontSize: 28,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#EAEAEA',
  },
  greetingSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#A1A1AA',
    marginTop: 4,
  },
  statsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statsCard: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#EAEAEA',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#71717A',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#2A2A2A',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'SpaceGrotesk-SemiBold',
    color: '#EAEAEA',
  },
  sectionLink: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6366F1',
  },
  tasksList: {
    gap: 12,
  },
  emptyState: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#EAEAEA',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#71717A',
    marginTop: 8,
  },
});