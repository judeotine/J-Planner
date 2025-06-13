import React, { createContext, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

// Check if we're running in Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

interface NotificationContextType {
  scheduleTaskReminder: (taskId: string, title: string, date: Date) => Promise<void>;
  scheduleJournalReminder: (time: string) => Promise<void>;
  cancelNotification: (identifier: string) => Promise<void>;
}

export const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    if (Platform.OS !== 'web') {
      requestPermissions();
    }
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'web') return;
    
    try {
      const Notifications = await import('expo-notifications');
      
      // Configure notification behavior
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#6366F1',
        });
      }

      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Notification permissions not granted');
      }
    } catch (error) {
      console.error('Notification setup error:', error);
    }
  };

  // Real notification methods
  const scheduleTaskReminder = async (taskId: string, title: string, date: Date) => {
    if (isExpoGo || Platform.OS === 'web') {
      return mockNotifications.scheduleTaskReminder(taskId, title, date);
    }
    
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Task Reminder',
          body: title,
          data: { taskId },
        },
        trigger: { 
          type: 'date',
          date: date.getTime()
        },
      });
    } catch (error) {
      console.error('Error scheduling task reminder:', error);
    }
  };

  const scheduleJournalReminder = async (time: string) => {
    if (isExpoGo || Platform.OS === 'web') {
      return mockNotifications.scheduleJournalReminder(time);
    }
    
    try {
      // Parse time string (format: 'HH:MM')
      const [hours, minutes] = time.split(':').map(Number);
      const now = new Date();
      const scheduledTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes
      );
      
      // If the time has already passed today, schedule for tomorrow
      if (scheduledTime < now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Journal Reminder',
          body: 'Time to write in your journal!',
        },
        trigger: {
          type: 'calendar',
          hour: hours,
          minute: minutes,
          repeats: true,
        },
      });
    } catch (error) {
      console.error('Error scheduling journal reminder:', error);
    }
  };

  const cancelNotification = async (identifier: string) => {
    if (isExpoGo || Platform.OS === 'web') {
      return mockNotifications.cancelNotification(identifier);
    }
    
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  };

  const notificationMethods = {
    scheduleTaskReminder,
    scheduleJournalReminder,
    cancelNotification,
  };

  return (
    <NotificationContext.Provider value={notificationMethods}>
      {children}
    </NotificationContext.Provider>
  );
};