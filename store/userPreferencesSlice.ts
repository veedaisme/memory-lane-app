import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  animationsEnabled: boolean;
  reducedMotion: boolean;
  defaultCaptureMode: 'quick' | 'detailed' | 'voice';
  locationTrackingEnabled: boolean;
  voiceInputEnabled: boolean;
  autoSave: boolean;
}

const initialState: UserPreferences = {
  theme: 'system',
  fontSize: 16,
  animationsEnabled: true,
  reducedMotion: false,
  defaultCaptureMode: 'quick',
  locationTrackingEnabled: true,
  voiceInputEnabled: true,
  autoSave: true,
};

export const userPreferencesSlice = createSlice({
  name: 'userPreferences',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    setFontSize: (state, action: PayloadAction<number>) => {
      state.fontSize = action.payload;
    },
    setAnimationsEnabled: (state, action: PayloadAction<boolean>) => {
      state.animationsEnabled = action.payload;
    },
    setReducedMotion: (state, action: PayloadAction<boolean>) => {
      state.reducedMotion = action.payload;
    },
    setDefaultCaptureMode: (state, action: PayloadAction<'quick' | 'detailed' | 'voice'>) => {
      state.defaultCaptureMode = action.payload;
    },
    setLocationTrackingEnabled: (state, action: PayloadAction<boolean>) => {
      state.locationTrackingEnabled = action.payload;
    },
    setVoiceInputEnabled: (state, action: PayloadAction<boolean>) => {
      state.voiceInputEnabled = action.payload;
    },
    setAutoSave: (state, action: PayloadAction<boolean>) => {
      state.autoSave = action.payload;
    },
    setUserPreferences: (state, action: PayloadAction<UserPreferences>) => {
      return action.payload;
    },
  },
});

export const {
  setTheme,
  setFontSize,
  setAnimationsEnabled,
  setReducedMotion,
  setDefaultCaptureMode,
  setLocationTrackingEnabled,
  setVoiceInputEnabled,
  setAutoSave,
  setUserPreferences,
} = userPreferencesSlice.actions;

export default userPreferencesSlice.reducer;
