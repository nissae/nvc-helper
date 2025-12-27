# NVC Companion App

## Project Overview
The NVC Companion is a web application designed to facilitate Non-Violent Communication (NVC) during conflicts. It provides a structured interface for users to document their communication using the four key NVC components:

1. **Observations** - What you observe (see, hear, remember, imagine) that does or does not contribute to your well-being
2. **Feelings** - How you feel in relation to what you observe
3. **Needs** - The needs, values, desires, etc. that create your feelings
4. **Requests** - Concrete actions you request to enrich your life

## Key Features
- **Immediate Input Screen**: Simple form with fields for all NVC components
- **Session Management**: Save entries locally as JSON, with export options
- **History View**: Review, edit, and delete past communication sessions
- **Responsive Design**: Works across desktop and mobile devices
- **Offline Support**: Works without server or account setup
- **Privacy-First**: All data remains on user's device

## Technical Stack
- **Frontend**: Vanilla JavaScript, CSS, and HTML (no frameworks)
- **Data Storage**: localStorage for session persistence
- **UI Design**: Clean, minimalist interface with calming color scheme (blues/greens/grays)
- **Architecture**: Single-page application with input form and history views

## Architectural Decisions
1. **No Framework Approach**: Using vanilla JS/CSS/HTML for simplicity and zero dependencies
2. **localStorage**: Chosen for offline-first, privacy-focused data persistence
3. **Single Page Application**: All functionality in one page for seamless user experience
4. **Calming Color Palette**: Blues, greens, and grays to reduce stress during conflict resolution

## Project Structure
```
public/
├── index.html      # Main HTML page
├── styles.css      # All CSS styling
└── app.js          # JavaScript application logic
```

## Data Model
Sessions are stored as JSON objects with the following structure:
```json
{
  "id": "unique-timestamp-id",
  "timestamp": "ISO date string",
  "observation": "string",
  "feeling": "string",
  "need": "string",
  "request": "string"
}
```

## Changelog
- **Initial Release**: Created NVC Companion with form input, history view, and export functionality
