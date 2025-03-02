import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
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
  const [deletedNote, setDeletedNote] = useState<Note | null>(null);

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
    // Find the note before deleting it
    const noteToDelete = notes.find(note => note.id === id);
    
    if (noteToDelete) {
      // Save the deleted note for potential undo
      setDeletedNote(noteToDelete);
      
      // Delete the note from Redux store
      dispatch(deleteNote(id));
      
      // Explicitly save the updated notes list to storage after deletion
      const updatedNotes = notes.filter(note => note.id !== id);
      saveNotes(updatedNotes).catch(error => {
        console.error('Error saving notes after deletion:', error);
      });
      
      // Show toast with undo option
      Toast.show({
        type: 'info',
        text1: 'Note deleted',
        text2: 'Tap to undo',
        position: 'bottom',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 80,
        onPress: () => handleUndoDelete(),
        onHide: () => {
          // Clear the deleted note reference when toast is hidden
          setDeletedNote(null);
        }
      });
    }
  };

  const favoriteNote = (id: string) => {
    dispatch(toggleFavorite(id));
  };

  const handleUndoDelete = () => {
    if (deletedNote) {
      // Hide the toast first to prevent multiple taps
      Toast.hide();
      
      // Add the note back to Redux store
      dispatch(addNote(deletedNote));
      
      // Save the updated notes list to storage
      saveNotes([...notes, deletedNote]).catch(error => {
        console.error('Error saving notes after undo deletion:', error);
      });
      
      // Show confirmation toast
      setTimeout(() => {
        Toast.show({
          type: 'success',
          text1: 'Note restored',
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
          bottomOffset: 80,
        });
      }, 300);
      
      // Clear the deleted note reference
      setDeletedNote(null);
    }
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
