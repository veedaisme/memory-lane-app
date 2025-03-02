import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  UserPreferences, 
  setUserPreferences,
  setTheme,
  setFontSize,
  setAnimationsEnabled,
  setReducedMotion,
  setDefaultCaptureMode,
  setLocationTrackingEnabled,
  setVoiceInputEnabled,
  setAutoSave
} from '@/store/userPreferencesSlice';
import { RootState } from '@/store';
import { getUserPreferences, saveUserPreferences } from '@/services/storageService';

export function useUserPreferences() {
  const dispatch = useDispatch();
  const preferences = useSelector((state: RootState) => state.userPreferences);

  // Load preferences from storage on initial render
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const storedPreferences = await getUserPreferences();
        if (storedPreferences) {
          dispatch(setUserPreferences(storedPreferences));
        }
      } catch (err) {
        console.error('Error loading user preferences:', err);
      }
    };

    loadPreferences();
  }, [dispatch]);

  // Save preferences to storage whenever they change
  useEffect(() => {
    const savePreferencesToStorage = async () => {
      try {
        await saveUserPreferences(preferences);
      } catch (err) {
        console.error('Error saving user preferences to storage:', err);
      }
    };

    savePreferencesToStorage();
  }, [preferences]);

  const updateTheme = (theme: 'light' | 'dark' | 'system') => {
    dispatch(setTheme(theme));
  };

  const updateFontSize = (size: number) => {
    dispatch(setFontSize(size));
  };

  const updateAnimationsEnabled = (enabled: boolean) => {
    dispatch(setAnimationsEnabled(enabled));
  };

  const updateReducedMotion = (reduced: boolean) => {
    dispatch(setReducedMotion(reduced));
  };

  const updateDefaultCaptureMode = (mode: 'quick' | 'detailed' | 'voice') => {
    dispatch(setDefaultCaptureMode(mode));
  };

  const updateLocationTrackingEnabled = (enabled: boolean) => {
    dispatch(setLocationTrackingEnabled(enabled));
  };

  const updateVoiceInputEnabled = (enabled: boolean) => {
    dispatch(setVoiceInputEnabled(enabled));
  };

  const updateAutoSave = (enabled: boolean) => {
    dispatch(setAutoSave(enabled));
  };

  return {
    preferences,
    updateTheme,
    updateFontSize,
    updateAnimationsEnabled,
    updateReducedMotion,
    updateDefaultCaptureMode,
    updateLocationTrackingEnabled,
    updateVoiceInputEnabled,
    updateAutoSave,
  };
}

export default useUserPreferences;
