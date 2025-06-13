import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Plus, Search, Filter, CheckCircle2, Clock, AlertTriangle } from 'lucide-react-native';
import { router } from 'expo-router';
import { useData } from '@/hooks/useData';
import { TaskCard } from '@/components/cards/TaskCard';
import { SearchBar } from '@/components/common/SearchBar';
import { FilterModal } from '@/components/modals/FilterModal';
import { Task, TaskPriority } from '@/types';

export default function TasksScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | 'all'>('all');
  
  const { tasks, updateTask, deleteTask } = useData();

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'completed' && task.completed) ||
                         (selectedFilter === 'pending' && !task.completed) ||
                         (selectedFilter === 'overdue' && !task.completed && new Date(task.dueDate) < new Date());
    
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    
    return matchesSearch && matchesFilter && matchesPriority;
  });

  const pendingTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  const handleTaskComplete = async (task: Task) => {
    await updateTask(task.id, { 
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : undefined
    });
  };

  const handleTaskDelete = (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTask(taskId) }
      ]
    );
  };

  const getFilterColor = (filter: string) => {
    switch (filter) {
      case 'pending': return '#F59E0B';
      case 'completed': return '#10B981';
      case 'overdue': return '#EF4444';
      default: return '#6366F1';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/modals/create-task')}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search and Filter */}
      <View style={styles.controls}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search tasks..."
          style={styles.searchBar}
        />
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setFilterVisible(true)}
        >
          <Filter size={20} color="#6366F1" />
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterChips}
        contentContainerStyle={styles.filterChipsContent}
      >
        {[
          { key: 'all', label: 'All', icon: null, count: tasks.length },
          { key: 'pending', label: 'Pending', icon: Clock, count: tasks.filter(t => !t.completed).length },
          { key: 'completed', label: 'Completed', icon: CheckCircle2, count: tasks.filter(t => t.completed).length },
          { key: 'overdue', label: 'Overdue', icon: AlertTriangle, count: tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length },
        ].map((filter) => {
          const isSelected = selectedFilter === filter.key;
          const Icon = filter.icon;
          
          return (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterChip,
                isSelected && { backgroundColor: getFilterColor(filter.key) }
              ]}
              onPress={() => setSelectedFilter(filter.key as any)}
            >
              {Icon && <Icon size={16} color={isSelected ? '#FFFFFF' : '#71717A'} />}
              <Text style={[
                styles.filterChipText,
                { color: isSelected ? '#FFFFFF' : '#71717A' }
              ]}>
                {filter.label} ({filter.count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Tasks List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Pending ({pendingTasks.length})
            </Text>
            <View style={styles.tasksList}>
              {pendingTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={() => handleTaskComplete(task)}
                  onDelete={() => handleTaskDelete(task.id)}
                  onEdit={() => router.push(`/modals/edit-task?id=${task.id}`)}
                />
              ))}
            </View>
          </View>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Completed ({completedTasks.length})
            </Text>
            <View style={styles.tasksList}>
              {completedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={() => handleTaskComplete(task)}
                  onDelete={() => handleTaskDelete(task.id)}
                  onEdit={() => router.push(`/modals/edit-task?id=${task.id}`)}
                />
              ))}
            </View>
          </View>
        )}

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <BlurView intensity={20} style={styles.emptyState}>
            <CheckCircle2 size={64} color="#71717A" />
            <Text style={styles.emptyTitle}>No tasks found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Try adjusting your search' : 'Create your first task to get started'}
            </Text>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => router.push('/modals/create-task')}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Create Task</Text>
            </TouchableOpacity>
          </BlurView>
        )}
      </ScrollView>

      {/* Filter Modal */}
      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
      />
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
  controls: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  filterChips: {
    paddingLeft: 24,
    marginBottom: 24,
  },
  filterChipsContent: {
    paddingRight: 24,
    gap: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(113, 113, 122, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    gap: 6,
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#EAEAEA',
    marginBottom: 16,
  },
  tasksList: {
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