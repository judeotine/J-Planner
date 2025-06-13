import { useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { DataContext } from '../contexts/DataContext';
import type { Task, Note, JournalEntry } from '../types';
import type { DataContextType } from '../contexts/DataContext';

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

const STORAGE_KEYS = {
  TASKS: '@j_planner_tasks',
  NOTES: '@j_planner_notes',
  JOURNAL: '@j_planner_journal',
};

interface DataState {
  tasks: Task[];
  notes: Note[];
  journalEntries: JournalEntry[];
  loading: boolean;
}

export const useDataState = (): DataContextType => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [tasksData, notesData, journalData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.TASKS),
        AsyncStorage.getItem(STORAGE_KEYS.NOTES),
        AsyncStorage.getItem(STORAGE_KEYS.JOURNAL),
      ]);

      setTasks(tasksData ? JSON.parse(tasksData) : []);
      setNotes(notesData ? JSON.parse(notesData) : []);
      setJournalEntries(journalData ? JSON.parse(journalData) : []);
    } catch (error) {
      console.error('Data loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      throw error;
    }
  };

  // Task methods
  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    await saveData(STORAGE_KEYS.TASKS, updatedTasks);
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task =>
      task.id === id
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    );
    
    setTasks(updatedTasks);
    await saveData(STORAGE_KEYS.TASKS, updatedTasks);
  };

  const deleteTask = async (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    await saveData(STORAGE_KEYS.TASKS, updatedTasks);
  };

  // Note methods
  const createNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    await saveData(STORAGE_KEYS.NOTES, updatedNotes);
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    const updatedNotes = notes.map(note =>
      note.id === id
        ? { ...note, ...updates, updatedAt: new Date().toISOString() }
        : note
    );
    
    setNotes(updatedNotes);
    await saveData(STORAGE_KEYS.NOTES, updatedNotes);
  };

  const deleteNote = async (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    await saveData(STORAGE_KEYS.NOTES, updatedNotes);
  };

  // Journal methods
  const createJournalEntry = async (entryData: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEntry: JournalEntry = {
      ...entryData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedEntries = [...journalEntries, newEntry];
    setJournalEntries(updatedEntries);
    await saveData(STORAGE_KEYS.JOURNAL, updatedEntries);
  };

  const updateJournalEntry = async (id: string, updates: Partial<JournalEntry>) => {
    const updatedEntries = journalEntries.map(entry =>
      entry.id === id
        ? { ...entry, ...updates, updatedAt: new Date().toISOString() }
        : entry
    );
    
    setJournalEntries(updatedEntries);
    await saveData(STORAGE_KEYS.JOURNAL, updatedEntries);
  };

  const deleteJournalEntry = async (id: string) => {
    const updatedEntries = journalEntries.filter(entry => entry.id !== id);
    setJournalEntries(updatedEntries);
    await saveData(STORAGE_KEYS.JOURNAL, updatedEntries);
  };

  const exportData = async () => {
    const data = {
      tasks,
      notes,
      journalEntries,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  };

  return {
    tasks,
    notes,
    journalEntries,
    loading,
    createTask,
    updateTask,
    deleteTask,
    createNote,
    updateNote,
    deleteNote,
    createJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    loadData,
    exportData,
  };
};