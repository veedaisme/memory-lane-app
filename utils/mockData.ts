import { Note } from '@/store/notesSlice';

// Simple ID generator function that doesn't rely on crypto
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export const generateMockNotes = (): Note[] => {
  const now = new Date();
  
  return [
    {
      id: generateId(),
      title: 'Coffee Shop Ideas',
      content: 'Need to explore more about the new project structure. Maybe we can implement a modular approach with feature-based organization.',
      createdAt: new Date(now.getTime() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
      updatedAt: new Date(now.getTime() - 2 * 60 * 1000).toISOString(),
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
        address: 'Starbucks, Downtown'
      },
      tags: ['work', 'ideas', 'project'],
      isFavorite: false,
      captureMode: 'quick'
    },
    {
      id: generateId(),
      title: 'Meeting Notes',
      content: 'Key points from today\'s team sync: 1. Review sprint goals 2. Discuss blockers 3. Plan for next iteration 4. Assign new tasks',
      createdAt: new Date(now.getTime() - 60 * 60 * 1000).toISOString(), // 1 hour ago
      updatedAt: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
      location: {
        latitude: 37.7833,
        longitude: -122.4167,
        address: 'Office, Meeting Room 3'
      },
      tags: ['work', 'meeting', 'sprint'],
      isFavorite: true,
      captureMode: 'detailed'
    },
    {
      id: generateId(),
      title: 'Weekend Plans',
      content: 'Things to do this weekend: 1. Grocery shopping 2. Call parents 3. Finish reading book 4. Go for a hike if weather permits',
      createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      updatedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
      location: {
        latitude: 37.7694,
        longitude: -122.4862,
        address: 'Home'
      },
      tags: ['personal', 'weekend', 'planning'],
      isFavorite: false,
      captureMode: 'detailed'
    },
    {
      id: generateId(),
      title: 'App Feature Ideas',
      content: 'Potential features for Memory Lane: 1. Dark mode 2. Cloud sync 3. Voice memos 4. Image attachments 5. Handwriting recognition',
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      updatedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      location: {
        latitude: 37.7739,
        longitude: -122.4312,
        address: 'Cafe, Mission District'
      },
      tags: ['work', 'ideas', 'features'],
      isFavorite: true,
      captureMode: 'quick'
    }
  ];
};
