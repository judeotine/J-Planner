import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Plus, Calendar, BookOpen, Smile, Frown, Meh } from 'lucide-react-native';
import { router } from 'expo-router';
import { useData } from '@/hooks/useData';
import { JournalCard } from '@/components/cards/JournalCard';
import { MoodSelector } from '@/components/journal/MoodSelector';
import { formatDate } from '@/utils/dateUtils';

export default function JournalScreen() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  
  const { journalEntries, deleteJournalEntry } = useData();

  const filteredEntries = journalEntries.filter(entry => 
    !selectedMood || entry.mood === selectedMood
  );

  const sortedEntries = filteredEntries.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Group entries by date
  const groupedEntries = sortedEntries.reduce((groups, entry) => {
    const date = formatDate(new Date(entry.createdAt));
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {} as Record<string, typeof sortedEntries>);

  const handleEntryDelete = (entryId: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteJournalEntry(entryId) }
      ]
    );
  };

  const getMoodStats = () => {
    const moodCounts = journalEntries.reduce((counts, entry) => {
      counts[entry.mood] = (counts[entry.mood] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    return [
      { mood: 'happy', count: moodCounts.happy || 0, icon: Smile, color: '#10B981' },
      { mood: 'neutral', count: moodCounts.neutral || 0, icon: Meh, color: '#F59E0B' },
      { mood: 'sad', count: moodCounts.sad || 0, icon: Frown, color: '#EF4444' },
    ];
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Journal</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/modals/create-journal')}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Mood Stats */}
      <View style={styles.statsContainer}>
        <BlurView intensity={20} style={styles.statsCard}>
          <Text style={styles.statsTitle}>Mood Overview</Text>
          <View style={styles.moodStats}>
            {getMoodStats().map(({ mood, count, icon: Icon, color }) => (
              <TouchableOpacity
                key={mood}
                style={[
                  styles.moodStat,
                  selectedMood === mood && { backgroundColor: color + '20', borderColor: color }
                ]}
                onPress={() => setSelectedMood(selectedMood === mood ? null : mood)}
              >
                <Icon size={24} color={color} />
                <Text style={styles.moodCount}>{count}</Text>
                <Text style={styles.moodLabel}>{mood}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </BlurView>
      </View>

      {/* Entries List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {Object.keys(groupedEntries).length > 0 ? (
          Object.entries(groupedEntries).map(([date, entries]) => (
            <View key={date} style={styles.dateGroup}>
              <View style={styles.dateHeader}>
                <Calendar size={16} color="#6366F1" />
                <Text style={styles.dateTitle}>{date}</Text>
              </View>
              <View style={styles.entriesList}>
                {entries.map((entry) => (
                  <JournalCard
                    key={entry.id}
                    entry={entry}
                    onPress={() => router.push(`/modals/view-journal?id=${entry.id}`)}
                    onEdit={() => router.push(`/modals/edit-journal?id=${entry.id}`)}
                    onDelete={() => handleEntryDelete(entry.id)}
                  />
                ))}
              </View>
            </View>
          ))
        ) : (
          <BlurView intensity={20} style={styles.emptyState}>
            <BookOpen size={64} color="#71717A" />
            <Text style={styles.emptyTitle}>
              {selectedMood ? `No ${selectedMood} entries` : 'No journal entries'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {selectedMood 
                ? `You haven't written any ${selectedMood} entries yet`
                : 'Start your journaling journey by creating your first entry'
              }
            </Text>
            {selectedMood && (
              <TouchableOpacity 
                style={styles.clearFilterButton}
                onPress={() => setSelectedMood(null)}
              >
                <Text style={styles.clearFilterText}>Clear Filter</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => router.push('/modals/create-journal')}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Create Entry</Text>
            </TouchableOpacity>
          </BlurView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#EAEAEA',
  },
  addButton: {
    backgroundColor: '#6366F1',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statsCard: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  statsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EAEAEA',
    marginBottom: 16,
  },
  moodStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  moodStat: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    minWidth: 80,
  },
  moodCount: {
    fontSize: 20,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#EAEAEA',
    marginTop: 8,
  },
  moodLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#71717A',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  dateGroup: {
    marginBottom: 32,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  dateTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EAEAEA',
  },
  entriesList: {
    gap: 12,
  },
  emptyState: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#EAEAEA',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#71717A',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  clearFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(113, 113, 122, 0.1)',
    marginTop: 16,
  },
  clearFilterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#71717A',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 24,
    gap: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});