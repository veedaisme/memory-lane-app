# Memory Lane Notes

A minimalist note-taking application with a focus on beautiful animations and accessibility.

## Features

- **Timeline View**: Chronological display of notes with titles, content previews, timestamps, and location data
- **Note Editor**: Full-screen modal with formatting options, location tagging, and media attachments
- **Reduced Cognitive Load**: Smart defaults and minimalist design to reduce mental effort
- **Location Context**: Automatic location tagging for all notes
- **Accessibility-First**: Designed to be inclusive for all users

## Technical Implementation

### Architecture

- **Frontend**: React Native with Expo
- **State Management**: Redux Toolkit
- **Storage**: AsyncStorage for local persistence
- **Location**: Expo Location for geolocation services

### Key Components

1. **Timeline View**: Displays notes in a chronological feed
2. **Note Editor**: Full-screen modal for creating and editing notes
3. **Note Card**: Individual note display in the timeline
4. **Location Services**: Automatic location tagging

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd memory-lane-notes

# Install dependencies
npm install

# Start the development server
npm start
```

## Usage

1. **View Notes**: Browse your notes in the Timeline view
2. **Create Note**: Tap the + button to create a new note
3. **Edit Note**: Tap on any note to open it in the editor
4. **Format Text**: Use the formatting toolbar in the editor
5. **Add Tags**: Organize notes with tags
6. **View Location**: See where each note was created

## Phase 1 Implementation

The current implementation includes:

- Timeline view with note cards
- Note editor with formatting options
- Location tagging
- Redux state management
- Local storage persistence

## Upcoming Features

- Map view for geographic visualization of notes
- Memory Lane Graph for discovering connections between notes
- Voice input capabilities
- Cloud synchronization

## Accessibility Features

- Screen reader optimization
- Voice control support
- High contrast mode
- Customizable text size
- Reduced motion options
