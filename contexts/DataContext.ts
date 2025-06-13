import { createContext } from 'react';
import { Task, Note, JournalEntry } from '@/types';

export interface DataContextType {
  tasks: Task[];
  notes: Note[];
  journalEntries: JournalEntry[];
  loading: boolean;
  // Task methods
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  // Note methods
  createNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  // Journal methods
  createJournalEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => Promise<void>;
  deleteJournalEntry: (id: string) => Promise<void>;
  // Utility methods
  loadData: () => Promise<void>;
  exportData: () => Promise<string>;
}

export const DataContext = createContext<DataContextType | null>(null);
