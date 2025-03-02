import React, { useRef } from 'react';
import { StyleSheet, TouchableOpacity, View, Animated, Dimensions } from 'react-native';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
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
  onDelete: (noteId: string) => void;
  index: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DELETE_THRESHOLD = -80;

export function NoteCard({ note, onPress, onDelete, index }: NoteCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const animatedStyle = useStaggeredAnimation(index);
  
  // Pan gesture handling for swipe-to-delete
  const translateX = useRef(new Animated.Value(0)).current;
  const gestureState = useRef(new Animated.Value(State.UNDETERMINED)).current;
  
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, state: gestureState } }],
    { useNativeDriver: true }
  );
  
  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX } = event.nativeEvent;
      
      // If swiped far enough to the left, trigger delete
      if (translationX < DELETE_THRESHOLD) {
        Animated.timing(translateX, {
          toValue: -SCREEN_WIDTH,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          onDelete(note.id);
        });
      } else {
        // Otherwise, reset position
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 10,
        }).start();
      }
    }
  };
  
  // Background delete view that appears when swiping
  const deleteOpacity = translateX.interpolate({
    inputRange: [-100, -20],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  
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
      <GestureHandlerRootView style={styles.gestureContainer}>
        <View style={styles.deleteBackground}>
          <Animated.View style={[styles.deleteButton, { opacity: deleteOpacity }]}>
            <IconSymbol name="trash" size={24} color="#FFFFFF" />
          </Animated.View>
        </View>
        
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View style={[
            styles.cardContainer,
            { transform: [{ translateX }] }
          ]}>
            <TouchableOpacity
              style={styles.touchable}
              onPress={() => onPress(note)}
              activeOpacity={1}
              accessibilityRole="button"
              accessibilityLabel={`Note: ${note.title}`}
              accessibilityHint="Double tap to open this note. Swipe left to delete."
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
        </PanGestureHandler>
      </GestureHandlerRootView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  gestureContainer: {
    width: '100%',
    position: 'relative',
  },
  cardContainer: {
    width: '100%',
    zIndex: 1,
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
  deleteBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: '#FF3B30',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
