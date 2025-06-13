import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { X, Filter } from 'lucide-react-native';
import { TaskPriority } from '@/types';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedPriority: TaskPriority | 'all';
  onPriorityChange: (priority: TaskPriority | 'all') => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  selectedPriority,
  onPriorityChange,
}) => {
  const priorities: Array<{ key: TaskPriority | 'all'; label: string; color: string }> = [
    { key: 'all', label: 'All Priorities', color: '#6366F1' },
    { key: 'high', label: 'High Priority', color: '#EF4444' },
    { key: 'medium', label: 'Medium Priority', color: '#F59E0B' },
    { key: 'low', label: 'Low Priority', color: '#10B981' },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView intensity={20} style={styles.overlay}>
        <View style={styles.container}>
          <BlurView intensity={40} style={styles.modal}>
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <Filter size={20} color="#6366F1" />
                <Text style={styles.title}>Filter Tasks</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={20} color="#71717A" />
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <Text style={styles.sectionTitle}>Priority</Text>
              <View style={styles.optionsContainer}>
                {priorities.map((priority) => (
                  <TouchableOpacity
                    key={priority.key}
                    style={[
                      styles.option,
                      selectedPriority === priority.key && {
                        backgroundColor: priority.color + '20',
                        borderColor: priority.color,
                      }
                    ]}
                    onPress={() => onPriorityChange(priority.key)}
                  >
                    <View style={[styles.priorityDot, { backgroundColor: priority.color }]} />
                    <Text style={[
                      styles.optionText,
                      selectedPriority === priority.key && { color: priority.color }
                    ]}>
                      {priority.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.applyButton} onPress={onClose}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </BlurView>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 400,
  },
  modal: {
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#EAEAEA',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EAEAEA',
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    backgroundColor: 'rgba(26, 26, 26, 0.5)',
    gap: 12,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#EAEAEA',
  },
  applyButton: {
    backgroundColor: '#6366F1',
    margin: 20,
    marginTop: 0,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});