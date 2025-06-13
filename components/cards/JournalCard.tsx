import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { BookOpen, Smile, Frown, Meh, Calendar, MoreVertical } from 'lucide-react-native';
import { JournalEntry } from '@/types';
import { formatTime } from '@/utils/dateUtils';

interface JournalCardProps {
  entry: JournalEntry;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const JournalCard: React.FC<JournalCardProps> = ({
  entry,
  onPress,
  onEdit,
  onDelete,
}) => {
  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy': return <Smile size={16} color="#10B981" />;
      case 'sad': return <Frown size={16} color="#EF4444" />;
      case 'neutral': return <Meh size={16} color="#F59E0B" />;
      default: return <Meh size={16} color="#71717A" />;
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy': return '#10B981';
      case 'sad': return '#EF4444';
      case 'neutral': return '#F59E0B';
      default: return '#71717A';
    }
  };

  const previewText = entry.content.substring(0, 120);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <BlurView intensity={20} style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <BookOpen size={16} color="#6366F1" />
            {entry.title ? (
              <Text style={styles.title} numberOfLines={1}>
                {entry.title}
              </Text>
            ) : (
              <Text style={styles.defaultTitle}>Journal Entry</Text>
            )}
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <MoreVertical size={16} color="#71717A" />
          </TouchableOpacity>
        </View>

        <Text style={styles.content} numberOfLines={3}>
          {previewText}
          {entry.content.length > 120 && '...'}
        </Text>

        <View style={styles.footer}>
          <View style={styles.metadata}>
            <Calendar size={12} color="#71717A" />
            <Text style={styles.time}>
              {formatTime(new Date(entry.createdAt))}
            </Text>
          </View>

          <View style={[styles.moodBadge, { backgroundColor: getMoodColor(entry.mood) + '20' }]}>
            {getMoodIcon(entry.mood)}
            <Text style={[styles.moodText, { color: getMoodColor(entry.mood) }]}>
              {entry.mood}
            </Text>
          </View>
        </View>

        {entry.prompts && entry.prompts.length > 0 && (
          <View style={styles.promptsIndicator}>
            <Text style={styles.promptsText}>
              {entry.prompts.length} prompt{entry.prompts.length !== 1 ? 's' : ''} answered
            </Text>
          </View>
        )}
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
    padding: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EAEAEA',
    flex: 1,
  },
  defaultTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#A1A1AA',
    flex: 1,
  },
  menuButton: {
    padding: 4,
  },
  content: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#A1A1AA',
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#71717A',
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  moodText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    textTransform: 'capitalize',
  },
  promptsIndicator: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },
  promptsText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6366F1',
  },
});