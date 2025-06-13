export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TaskPriority;
  dueDate: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  attachments?: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntry {
  id: string;
  title?: string;
  content: string;
  mood: 'happy' | 'neutral' | 'sad';
  tags?: string[];
  prompts?: JournalPrompt[];
  createdAt: string;
  updatedAt: string;
}

export interface JournalPrompt {
  question: string;
  answer: string;
}

export interface Attachment {
  id: string;
  type: 'image' | 'document' | 'audio';
  uri: string;
  name: string;
  size?: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  pinHash?: string;
  biometricsEnabled: boolean;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  notifications: boolean;
  reminderTime?: string;
  theme?: 'dark';
  fontSize: 'small' | 'medium' | 'large';
  autoBackup: boolean;
}

export interface AppState {
  isLocked: boolean;
  lastActiveTime: number;
  isFirstLaunch: boolean;
}