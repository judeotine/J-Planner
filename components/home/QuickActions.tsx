import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Plus, CheckSquare, FileText, BookOpen } from 'lucide-react-native';
import { router } from 'expo-router';

export const QuickActions: React.FC = () => {
  const actions = [
    {
      icon: CheckSquare,
      label: 'Task',
      color: '#6366F1',
      route: '/modals/create-task',
    },
    {
      icon: FileText,
      label: 'Note',
      color: '#F472B6',
      route: '/modals/create-note',
    },
    {
      icon: BookOpen,
      label: 'Journal',
      color: '#10B981',
      route: '/modals/create-journal',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => router.push(action.route as any)}
              activeOpacity={0.7}
            >
              <BlurView intensity={20} style={styles.actionCard}>
                <View style={[styles.iconContainer, { backgroundColor: action.color + '20' }]}>
                  <Icon size={24} color={action.color} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </BlurView>
            </TouchableOpacity>
          );
        })}
      </View>
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
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    padding: 20,
    alignItems: 'center',
    overflow: 'hidden',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#EAEAEA',
  },
});