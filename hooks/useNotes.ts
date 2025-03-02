import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Note, 
  addNote, 
  updateNote, 
  deleteNote, 
  toggleFavorite, 
  setNotes,
  setLoading,
  setError
} from '@/store/notesSlice';
import { RootState } from '@/store';
import { getNotes, saveNotes } from '@/services/storageService';

// Simple ID generator function that doesn't rely on crypto
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export function useNotes() {
  const dispatch = useDispatch();
  const { notes, loading, error } = useSelector((state: RootState) => state.notes);

  // Load notes from storage on initial render
  useEffect(() => {
    const loadNotes = async () => {
      try {
        dispatch(setLoading(true));
        const storedNotes = await getNotes();
        dispatch(setNotes(storedNotes));
      } catch (err) {
        dispatch(setError('Failed to load notes'));
        console.error('Error loading notes:', err);
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadNotes();
  }, [dispatch]);

  // Save notes to storage whenever they change
  useEffect(() => {
    const saveNotesToStorage = async () => {
      try {
        await saveNotes(notes);
      } catch (err) {
        console.error('Error saving notes to storage:', err);
      }
    };

    if (notes.length > 0) {
      saveNotesToStorage();
    }
  }, [notes]);

  const createNote = (noteData: Partial<Note>) => {
    const newNote: Note = {
      id: generateId(),
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      location: {
        latitude: 0,
        longitude: 0,
      },
      tags: [],
      isFavorite: false,
      captureMode: 'quick',
      ...noteData,
    };

    dispatch(addNote(newNote));
    return newNote;
  };

  const editNote = (noteData: Partial<Note>) => {
    if (!noteData.id) return null;

    const existingNote = notes.find(note => note.id === noteData.id);
    if (!existingNote) return null;

    const updatedNote: Note = {
      ...existingNote,
      ...noteData,
      updatedAt: new Date().toISOString(),
    };

    dispatch(updateNote(updatedNote));
    return updatedNote;
  };

  const removeNote = (id: string) => {
    dispatch(deleteNote(id));
  };

  const favoriteNote = (id: string) => {
    dispatch(toggleFavorite(id));
  };

  return {
    notes,
    loading,
    error,
    createNote,
    editNote,
    deleteNote: removeNote,
    toggleFavorite: favoriteNote,
  };
}

export default useNotes;
