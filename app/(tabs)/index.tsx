import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { NoteCard } from '@/components/NoteCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { NoteEditor } from '@/components/NoteEditor';
import { useNotes } from '@/hooks/useNotes';
import { Note } from '@/store/notesSlice';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { generateMockNotes } from '@/utils/mockData';

export default function TimelineScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const { notes, createNote, editNote, deleteNote } = useNotes();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'Timeline' | 'Map' | 'Graph'>('Timeline');
  
  // Load mock data if no notes exist
  useEffect(() => {
    if (notes.length === 0) {
      const mockNotes = generateMockNotes();
      mockNotes.forEach(note => createNote(note));
    }
  }, []);
  
  const handleNotePress = (note: Note) => {
    setSelectedNote(note);
    setIsEditorVisible(true);
  };
  
  const handleCreateNote = () => {
    setSelectedNote(null);
    setIsEditorVisible(true);
  };
  
  const handleSaveNote = (noteData: Partial<Note>) => {
    if (selectedNote) {
      editNote({ ...noteData, id: selectedNote.id });
    } else {
      createNote(noteData);
    }
  };
  
  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId);
  };
  
  const handleTabPress = (tab: 'Timeline' | 'Map' | 'Graph') => {
    setActiveTab(tab);
  };
  
  const renderEmptyState = () => (
    <ThemedView style={styles.emptyState}>
      <IconSymbol name="note.text" size={48} color={colors.icon} />
      <ThemedText type="subtitle" style={styles.emptyStateTitle}>No notes yet</ThemedText>
      <ThemedText style={styles.emptyStateText}>
        Tap the + button to create your first note
      </ThemedText>
    </ThemedView>
  );
  
  // Toast configuration
  const toastConfig = {
    info: ({ text1, text2, onPress }: any) => (
      <TouchableOpacity
        style={{
          height: 60,
          width: '90%',
          backgroundColor: '#14171A',
          borderRadius: 10,
          padding: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <ThemedText style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
            {text1}
          </ThemedText>
          <ThemedText style={{ color: 'white', fontSize: 14, opacity: 0.8 }}>
            {text2}
          </ThemedText>
        </View>
        <IconSymbol name="arrow.uturn.backward" size={24} color="white" />
      </TouchableOpacity>
    ),
    success: ({ text1 }: any) => (
      <View
        style={{
          height: 60,
          width: '90%',
          backgroundColor: '#4CAF50',
          borderRadius: 10,
          padding: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconSymbol name="checkmark.circle" size={24} color="white" />
          <ThemedText style={{ color: 'white', fontSize: 16, fontWeight: '600', marginLeft: 10 }}>
            {text1}
          </ThemedText>
        </View>
      </View>
    ),
  };
  
  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title">Memory Lane</ThemedText>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <IconSymbol name="bell" size={24} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <IconSymbol name="clock" size={24} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <IconSymbol name="person.crop.circle" size={24} color={colors.icon} />
          </TouchableOpacity>
        </View>
      </ThemedView>
      
      {/* Tab Selector */}
      <ThemedView style={styles.tabContainer}>
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'Timeline' && styles.activeTab
          ]}
          onPress={() => handleTabPress('Timeline')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'Timeline' }}
        >
          <ThemedText 
            style={[
              styles.tabText, 
              activeTab === 'Timeline' && styles.activeTabText
            ]}
          >
            Timeline
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'Map' && styles.activeTab
          ]}
          onPress={() => handleTabPress('Map')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'Map' }}
        >
          <ThemedText 
            style={[
              styles.tabText, 
              activeTab === 'Map' && styles.activeTabText
            ]}
          >
            Map
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'Graph' && styles.activeTab
          ]}
          onPress={() => handleTabPress('Graph')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'Graph' }}
        >
          <ThemedText 
            style={[
              styles.tabText, 
              activeTab === 'Graph' && styles.activeTabText
            ]}
          >
            Graph
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
      
      {/* Note List */}
      <FlatList
        data={notes}
        renderItem={({ item, index }) => (
          <NoteCard 
            note={item} 
            onPress={handleNotePress} 
            onDelete={handleDeleteNote}
            index={index} 
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.notesList}
        ListEmptyComponent={renderEmptyState}
      />
      
      {/* Create Note Button */}
      <TouchableOpacity 
        style={styles.createButton}
        onPress={handleCreateNote}
        accessibilityRole="button"
        accessibilityLabel="Create new note"
      >
        <IconSymbol name="plus" size={32} color="#FFFFFF" />
      </TouchableOpacity>
      
      {/* Bottom Navigation */}
      <ThemedView style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navButton}
          accessibilityRole="button"
          accessibilityLabel="Home"
        >
          <IconSymbol name="house.fill" size={24} color={colors.tabIconSelected} />
          <ThemedText type="caption">Home</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.push('/explore')}
          accessibilityRole="button"
          accessibilityLabel="Explore"
        >
          <IconSymbol name="paperplane" size={24} color={colors.tabIconDefault} />
          <ThemedText type="caption" style={{ color: colors.tabIconDefault }}>
            Explore
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
      
      {/* Note Editor Modal */}
      <Modal
        visible={isEditorVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsEditorVisible(false)}
      >
        <NoteEditor
          note={selectedNote || undefined}
          onSave={handleSaveNote}
          onClose={() => setIsEditorVisible(false)}
        />
      </Modal>
      
      {/* Toast for undo functionality */}
      <Toast config={toastConfig} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#14171A',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: '600',
  },
  notesList: {
    padding: 16,
    paddingBottom: 100,
  },
  createButton: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#14171A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  navButton: {
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 64,
  },
  emptyStateTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    textAlign: 'center',
    opacity: 0.7,
  },
});
