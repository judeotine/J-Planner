import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Plus, Search, FileText, Tag, Calendar } from 'lucide-react-native';
import { router } from 'expo-router';
import { useData } from '@/hooks/useData';
import { NoteCard } from '@/components/cards/NoteCard';
import { SearchBar } from '@/components/common/SearchBar';
import { Note } from '@/types';

export default function NotesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  const { notes, deleteNote } = useData();

  // Extract unique tags from all notes
  const allTags = Array.from(
    new Set(notes.flatMap(note => note.tags || []))
  );

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = !selectedTag || (note.tags && note.tags.includes(selectedTag));
    
    return matchesSearch && matchesTag;
  });

  const sortedNotes = filteredNotes.sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const handleNoteDelete = (noteId: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteNote(noteId) }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Notes</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/modals/create-note')}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search notes..."
        />
      </View>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tagsContainer}
          contentContainerStyle={styles.tagsContent}
        >
          <TouchableOpacity
            style={[
              styles.tagChip,
              !selectedTag && styles.tagChipActive
            ]}
            onPress={() => setSelectedTag(null)}
          >
            <Text style={[
              styles.tagChipText,
              !selectedTag && styles.tagChipTextActive
            ]}>
              All ({notes.length})
            </Text>
          </TouchableOpacity>
          
          {allTags.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[
                styles.tagChip,
                selectedTag === tag && styles.tagChipActive
              ]}
              onPress={() => setSelectedTag(selectedTag === tag ? null : tag)}
            >
              <Tag size={14} color={selectedTag === tag ? '#FFFFFF' : '#F472B6'} />
              <Text style={[
                styles.tagChipText,
                selectedTag === tag && styles.tagChipTextActive
              ]}>
                {tag} ({notes.filter(n => n.tags?.includes(tag)).length})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Notes List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {sortedNotes.length > 0 ? (
          <View style={styles.notesList}>
            {sortedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onPress={() => router.push(`/modals/view-note?id=${note.id}`)}
                onEdit={() => router.push(`/modals/edit-note?id=${note.id}`)}
                onDelete={() => handleNoteDelete(note.id)}
              />
            ))}
          </View>
        ) : (
          <BlurView intensity={20} style={styles.emptyState}>
            <FileText size={64} color="#71717A" />
            <Text style={styles.emptyTitle}>No notes found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery || selectedTag 
                ? 'Try adjusting your search or filter' 
                : 'Create your first note to get started'
              }
            </Text>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => router.push('/modals/create-note')}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Create Note</Text>
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
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  tagsContainer: {
    paddingLeft: 24,
    marginBottom: 24,
  },
  tagsContent: {
    paddingRight: 24,
    gap: 12,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(244, 114, 182, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F472B6',
    gap: 6,
  },
  tagChipActive: {
    backgroundColor: '#F472B6',
  },
  tagChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#F472B6',
  },
  tagChipTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  notesList: {
    gap: 16,
    paddingBottom: 24,
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