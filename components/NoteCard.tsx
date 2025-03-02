import React from 'react';
import { StyleSheet, TouchableOpacity, View, Animated } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { IconSymbol } from './ui/IconSymbol';
import { Note } from '@/store/notesSlice';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useStaggeredAnimation } from '@/utils/animations';

interface NoteCardProps {
  note: Note;
  onPress: (note: Note) => void;
  index: number;
}

export function NoteCard({ note, onPress, index }: NoteCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const animatedStyle = useStaggeredAnimation(index);
  
  // Format the time difference
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}min ago`;
    } else if (diffInMinutes < 24 * 60) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / (60 * 24))}d ago`;
    }
  };

  // Truncate content for preview
  const truncateContent = (content: string, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => onPress(note)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Note: ${note.title || 'Untitled'}`}
        accessibilityHint="Double tap to open this note"
      >
        <ThemedView style={styles.card}>
          <View style={styles.header}>
            <ThemedText type="subtitle" style={styles.title}>
              {note.title || 'Untitled'}
            </ThemedText>
            <ThemedText type="caption" style={styles.timestamp}>
              {getTimeAgo(note.createdAt)}
            </ThemedText>
          </View>
          
          <ThemedText style={styles.content}>
            {truncateContent(note.content)}
          </ThemedText>
          
          {note.location.address && (
            <View style={styles.locationContainer}>
              <IconSymbol 
                name="mappin" 
                size={14} 
                color={colors.icon} 
              />
              <ThemedText type="caption" style={styles.locationText}>
                {note.location.address}
              </ThemedText>
            </View>
          )}
        </ThemedView>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  touchable: {
    width: '100%',
  },
  card: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    marginRight: 8,
  },
  timestamp: {
    textAlign: 'right',
  },
  content: {
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    marginLeft: 4,
  },
});
