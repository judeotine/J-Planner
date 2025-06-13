import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { CheckCircle2, Circle, Clock, AlertTriangle, MoreVertical } from 'lucide-react-native';
import { Task } from '@/types';
import { formatDistanceToNow } from '@/utils/dateUtils';

interface TaskCardProps {
  task: Task;
  compact?: boolean;
  onToggleComplete?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  compact = false,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const isOverdue = !task.completed && new Date(task.dueDate) < new Date();
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#71717A';
    }
  };

  const formatDueDate = (date: string) => {
    const dueDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dueDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (dueDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return formatDistanceToNow(dueDate);
    }
  };

  return (
    <BlurView intensity={20} style={[styles.container, compact && styles.compact]}>
      <TouchableOpacity 
        style={styles.content}
        onPress={onEdit}
        activeOpacity={0.7}
      >
        {/* Completion Toggle */}
        <TouchableOpacity
          style={styles.checkButton}
          onPress={onToggleComplete}
        >
          {task.completed ? (
            <CheckCircle2 size={24} color="#10B981" />
          ) : (
            <Circle size={24} color="#71717A" />
          )}
        </TouchableOpacity>

        {/* Task Content */}
        <View style={styles.taskContent}>
          <Text 
            style={[
              styles.title,
              task.completed && styles.titleCompleted,
              compact && styles.titleCompact,
            ]}
            numberOfLines={compact ? 1 : 2}
          >
            {task.title}
          </Text>
          
          {!compact && task.description && (
            <Text style={styles.description} numberOfLines={2}>
              {task.description}
            </Text>
          )}

          <View style={styles.metadata}>
            {/* Priority */}
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) + '20' }]}>
              <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(task.priority) }]} />
              <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                {task.priority}
              </Text>
            </View>

            {/* Due Date */}
            <View style={styles.dueDateContainer}>
              {isOverdue ? (
                <AlertTriangle size={12} color="#EF4444" />
              ) : (
                <Clock size={12} color="#71717A" />
              )}
              <Text style={[styles.dueDate, isOverdue && styles.overdue]}>
                {formatDueDate(task.dueDate)}
              </Text>
            </View>
          </View>

          {/* Tags */}
          {!compact && task.tags && task.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {task.tags.slice(0, 3).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
              {task.tags.length > 3 && (
                <Text style={styles.moreTagsText}>+{task.tags.length - 3}</Text>
              )}
            </View>
          )}
        </View>

        {/* Actions */}
        {!compact && (
          <TouchableOpacity style={styles.menuButton}>
            <MoreVertical size={20} color="#71717A" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </BlurView>
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
  compact: {
    borderRadius: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 12,
  },
  checkButton: {
    marginTop: 2,
  },
  taskContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EAEAEA',
    lineHeight: 22,
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#71717A',
  },
  titleCompact: {
    fontSize: 14,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#A1A1AA',
    lineHeight: 20,
    marginBottom: 12,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    textTransform: 'capitalize',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDate: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#71717A',
  },
  overdue: {
    color: '#EF4444',
  },
  tagsContainer: {
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
  menuButton: {
    padding: 4,
  },
});