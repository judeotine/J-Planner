import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { FileText, Tag, Calendar, MoreVertical } from 'lucide-react-native';
import { Note } from '@/types';
import { formatDistanceToNow } from '@/utils/dateUtils';

interface NoteCardProps {
  note: Note;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onPress,
  onEdit,
  onDelete,
}) => {
  const previewText = note.content.replace(/[#*`]/g, '').substring(0, 150);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <BlurView intensity={20} style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <FileText size={16} color="#6366F1" />
            <Text style={styles.title} numberOfLines={1}>
              {note.title}
            </Text>
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <MoreVertical size={16} color="#71717A" />
          </TouchableOpacity>
        </View>

        <Text style={styles.content} numberOfLines={3}>
          {previewText}
        </Text>

        <View style={styles.footer}>
          <View style={styles.metadata}>
            <Calendar size={12} color="#71717A" />
            <Text style={styles.date}>
              {formatDistanceToNow(new Date(note.updatedAt))}
            </Text>
          </View>

          {note.tags && note.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              <Tag size={12} color="#F472B6" />
              <Text style={styles.tagCount}>
                {note.tags.length} tag{note.tags.length !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>

        {note.tags && note.tags.length > 0 && (
          <View style={styles.tags}>
            {note.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {note.tags.length > 3 && (
              <Text style={styles.moreTagsText}>+{note.tags.length - 3}</Text>
            )}
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
    marginBottom: 12,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  date: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#71717A',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tagCount: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#F472B6',
  },
  tags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: 'rgba(244, 114, 182, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(244, 114, 182, 0.3)',
  },
  tagText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#F472B6',
  },
  moreTagsText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#71717A',
  },
});