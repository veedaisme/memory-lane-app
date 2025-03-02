import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '@/store/notesSlice';
import { UserPreferences } from '@/store/userPreferencesSlice';

const NOTES_STORAGE_KEY = 'memory_lane_notes';
const USER_PREFERENCES_STORAGE_KEY = 'memory_lane_user_preferences';

export const saveNotes = async (notes: Note[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving notes to storage:', error);
    throw error;
  }
};

export const getNotes = async (): Promise<Note[]> => {
  try {
    const notesJson = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
    return notesJson ? JSON.parse(notesJson) : [];
  } catch (error) {
    console.error('Error getting notes from storage:', error);
    return [];
  }
};

export const saveUserPreferences = async (preferences: UserPreferences): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving user preferences to storage:', error);
    throw error;
  }
};

export const getUserPreferences = async (): Promise<UserPreferences | null> => {
  try {
    const preferencesJson = await AsyncStorage.getItem(USER_PREFERENCES_STORAGE_KEY);
    return preferencesJson ? JSON.parse(preferencesJson) : null;
  } catch (error) {
    console.error('Error getting user preferences from storage:', error);
    return null;
  }
};
