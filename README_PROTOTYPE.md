# Tap-Recap Prototype

A rapid emotion tracking and journaling Progressive Web App (PWA) built with SvelteKit.

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at http://localhost:5173

### Building for Production

```bash
npm run build
npm run preview
```

## Features Implemented

### Core Functionality
- **Tap Page**: Quick emotion logging with mood, actor, and action selection
  - Tag-based filtering system
  - Real-time action filtering based on mood and actor selection
  - Flag emotes as mistake, earlier time, or context not right
  - Toast notifications for successful logging

- **Recap Page**: Review unreviewed emotes with sorting options
  - Mark individual emotes as reviewed
  - Mark all emotes as reviewed at once
  - View flags and metadata for each emote
  - Sort by date (ascending/descending)

- **Calendar Page**: Navigate through months and view emotes by date
  - Visual calendar grid with emote counts per day
  - Color-coded indicators for good/meh/bad emotes
  - Multi-date selection
  - Navigate to Recap or Chart pages with selected dates

- **Chart Page**: Visualize emote trends with Chart.js
  - Line and bar chart options
  - Multiple duration filters (7, 14, 30, 90 days)
  - Summary statistics
  - Good/Meh/Bad mood tracking over time

- **Settings Page**: Full CRUD operations for:
  - Moods management
  - Actors management
  - Actions management
  - User preferences
  - Data export (JSON, YAML)
  - Data import

## Data Layer

- Interface-based architecture for easy swapping of storage providers
- Browser localStorage implementation
- Full CRUD operations for all entities
- Configuration versioning
- Export/Import in JSON and YAML formats

## Key Features Implemented

All the core features from the requirements document:

1. **Tap Page**: Mood → Actor → Action filtering with tag-based system
2. **Recap Page**: View and mark emotes as reviewed
3. **Calendar Page**: Monthly calendar with emote counts and date selection
4. **Chart Page**: Chart.js visualizations with line/bar toggle and duration selection
5. **Settings Pages**: Full CRUD for moods, actors, actions, plus preferences
6. **Data Management**: Export/import in JSON and YAML formats
7. **PWA Support**: Configured for installation as a PWA
8. **Default Configuration**: Pre-loaded with all the moods, actors, and actions from your spec

## To Run the Prototype

The dev server is already running at:
- Local: http://localhost:5173/
- Network: http://192.168.1.80:5173/

You can access it in your browser!

## Features Implemented

1. **Tap Page** - Main emoting interface with mood/actor/action filtering
2. **Recap Page** - Review unreviewed emotes with sorting and marking
3. **Calendar Page** - Visual calendar with emote counts and date selection
4. **Chart Page** - Visualize emote trends with Chart.js (line/bar charts)
5. **Settings Pages**:
   - Main settings menu
   - Moods CRUD
   - Actors CRUD
   - Actions CRUD
   - Preferences management
   - Export data (JSON/YAML)
   - Import data (JSON/YAML)
6. **PWA Configuration** - App is installable as a PWA
7. **Navigation** - Clean navigation bar that auto-hides on Tap page

The prototype is now complete and running at http://localhost:5173/