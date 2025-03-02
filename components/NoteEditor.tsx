import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Keyboard
} from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { IconSymbol } from './ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Note } from '@/store/notesSlice';
import { getCurrentLocation, getAddressFromCoordinates } from '@/services/locationService';

interface NoteEditorProps {
  note?: Note;
  onSave: (note: Partial<Note>) => void;
  onClose: () => void;
}

export function NoteEditor({ note, onSave, onClose }: NoteEditorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [location, setLocation] = useState(note?.location || null);
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [isDraft, setIsDraft] = useState(false);
  
  useEffect(() => {
    const fetchLocation = async () => {
      if (!location) {
        const currentLocation = await getCurrentLocation();
        if (currentLocation) {
          const address = await getAddressFromCoordinates(
            currentLocation.latitude,
            currentLocation.longitude
          );
          setLocation({ ...currentLocation, address });
        }
      }
    };
    
    fetchLocation();
  }, []);
  
  const handleSave = () => {
    if (!content.trim()) return;
    
    const updatedNote: Partial<Note> = {
      ...(note || {}),
      title: title.trim() || undefined,
      content: content.trim(),
      location: location || {
        latitude: 0,
        longitude: 0,
      },
      tags,
      updatedAt: new Date().toISOString(),
    };
    
    if (!note) {
      updatedNote.createdAt = new Date().toISOString();
      updatedNote.captureMode = 'detailed';
      updatedNote.isFavorite = false;
    }
    
    onSave(updatedNote);
    onClose();
  };
  
  const handleDraft = () => {
    setIsDraft(true);
    handleSave();
  };
  
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ThemedView style={styles.header}>
        <TouchableOpacity 
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close editor"
        >
          <IconSymbol name="xmark" size={24} color={colors.icon} />
        </TouchableOpacity>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={[styles.button, styles.draftButton]}
            onPress={handleDraft}
            accessibilityRole="button"
            accessibilityLabel="Save as draft"
          >
            <ThemedText>Draft</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
            accessibilityRole="button"
            accessibilityLabel="Save note"
          >
            <ThemedText style={styles.saveButtonText}>Save</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
      
      <ScrollView style={styles.content}>
        <TextInput
          style={styles.titleInput}
          placeholder="Add title"
          placeholderTextColor="#9BA1A6"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
          accessibilityLabel="Note title"
          accessibilityHint="Enter the title for your note"
        />
        
        <TextInput
          style={styles.contentInput}
          placeholder="Start writing..."
          placeholderTextColor="#9BA1A6"
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
          accessibilityLabel="Note content"
          accessibilityHint="Enter the content for your note"
        />
      </ScrollView>
      
      <ThemedView style={styles.toolbar}>
        <View style={styles.formatButtons}>
          <TouchableOpacity style={styles.formatButton}>
            <IconSymbol name="bold" size={20} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.formatButton}>
            <IconSymbol name="italic" size={20} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.formatButton}>
            <IconSymbol name="underline" size={20} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.formatButton}>
            <IconSymbol name="list.bullet" size={20} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.formatButton}>
            <IconSymbol name="list.number" size={20} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.formatButton}>
            <IconSymbol name="quote.opening" size={20} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.formatButton}>
            <IconSymbol name="link" size={20} color={colors.icon} />
          </TouchableOpacity>
        </View>
        
        <ThemedView style={styles.locationBar}>
          <View style={styles.locationContainer}>
            <IconSymbol name="mappin" size={16} color={colors.icon} />
            <ThemedText type="caption" style={styles.locationText}>
              {location?.address || 'Location unavailable'}
            </ThemedText>
          </View>
          <TouchableOpacity>
            <IconSymbol name="pencil" size={16} color={colors.icon} />
          </TouchableOpacity>
        </ThemedView>
        
        <View style={styles.tagsContainer}>
          <TouchableOpacity 
            style={styles.addTagButton}
            onPress={() => {
              addTag();
              Keyboard.dismiss();
            }}
          >
            <ThemedText type="caption">Add tags</ThemedText>
          </TouchableOpacity>
          
          {tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <ThemedText type="caption">{tag}</ThemedText>
              <TouchableOpacity onPress={() => removeTag(tag)}>
                <IconSymbol name="xmark" size={12} color={colors.icon} />
              </TouchableOpacity>
            </View>
          ))}
          
          {tags.length < 5 && (
            <TextInput
              style={styles.tagInput}
              placeholder="Add tag"
              placeholderTextColor="#9BA1A6"
              value={newTag}
              onChangeText={setNewTag}
              onSubmitEditing={addTag}
              maxLength={20}
            />
          )}
        </View>
        
        <View style={styles.bottomToolbar}>
          <TouchableOpacity style={styles.toolbarButton}>
            <IconSymbol name="photo" size={24} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton}>
            <IconSymbol name="mic.fill" size={24} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton}>
            <IconSymbol name="clock" size={24} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton}>
            <IconSymbol name="paperclip" size={24} color={colors.icon} />
          </TouchableOpacity>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  draftButton: {
    backgroundColor: '#F5F5F5',
  },
  saveButton: {
    backgroundColor: '#14171A',
  },
  saveButtonText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 16,
    color: '#14171A',
  },
  contentInput: {
    fontSize: 16,
    lineHeight: 24,
    color: '#14171A',
    minHeight: 200,
  },
  toolbar: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 8,
  },
  formatButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  formatButton: {
    padding: 8,
  },
  locationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  addTagButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  tag: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tagInput: {
    fontSize: 14,
    minWidth: 80,
  },
  bottomToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
  },
  toolbarButton: {
    padding: 8,
  },
});
