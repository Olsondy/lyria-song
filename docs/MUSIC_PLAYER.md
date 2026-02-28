# Music Player Architecture

## Overview

The music player is implemented as a global, persistent player that works across page navigations. It uses `howler.js` as the core audio engine with a custom React hook wrapper for state management.

## Architecture

### Global Player

The music player persists across page navigations and maintains a single source of truth for playback state.

### Core Hook

`useHowlerAudio` provides a React-friendly wrapper around Howler.js:

```typescript
// src/hooks/use-howler-audio.ts
export function useHowlerAudio(): UseHowlerAudioReturn {
  // Wraps Howl.js with React state management
}
```

### Context Provider

`MusicPlayerProvider` provides global state management via React context:

```typescript
// src/contexts/music-player-context.tsx
export function MusicPlayerProvider({ children }) {
  // Uses useHowlerAudio hook and adds custom state
}
```

### State Management

Single source of truth via `useMusicPlayer` hook:

```typescript
const { playTrack, pause, isPlaying, currentTrack } = useMusicPlayer();
```

## Track Interface

```typescript
interface Track {
  url: string;
  title: string;
  artist: string;
  coverUrl: string;
}
```

## Key Features

### 1. Playback Controls

- **Play/Pause**: Toggle playback with smooth animations
- **Close**: Dismiss the player and stop playback
- **Track Selection**: Call `playTrack(track)` from anywhere to start playback

### 2. Progress Bar

- **Draggable**: User can seek to any position
- **Real-time Updates**: Position updates using `requestAnimationFrame`
- **High-frequency Tracking**: Smooth progress bar movement

### 3. Time Display

- **Format**: MM:SS (minutes:seconds)
- **Current Time**: Shows current playback position
- **Total Duration**: Shows total track length

### 4. Smooth Animations

- Uses Framer Motion for all animations
- Slide-in/slide-out transitions
- Hover effects on controls

## Usage

### Playing a Track

```typescript
import { useMusicPlayer } from "@/contexts/music-player-context";

function MyComponent() {
  const { playTrack } = useMusicPlayer();

  const handlePlay = () => {
    playTrack({
      url: "https://example.com/audio.mp3",
      title: "My Song",
      artist: "Artist Name",
      coverUrl: "https://example.com/cover.jpg"
    });
  };

return <button onClick={handlePlay}>Play</button>;
}
```

### Album Detail Playback

- `My Songs > Albums` detail view uses the same global player context.
- `Play Album` starts playback from the first playable song in album order (`music_album_clips.position` ascending).
- Song rows in album detail route playback through the shared `useClipPlayer` hook (`handlePlay`) so behavior matches the main My Songs list.
- Album detail row actions (share/favorite/extend/get-stems/vocal-remover) do not create a separate player instance; all interactions still target the same global player state.

### Accessing Player State

```typescript
const {
  isPlaying,      // boolean - current playback state
  isLoaded,       // boolean - whether audio is loaded (handles Strict Mode remount)
  currentTrack,   // Track | null - currently loaded track
  playTrack,      // (track: Track) => void - play a track
  pause,          // () => void - pause playback
  close,          // () => void - close player
} = useMusicPlayer();
```

### Strict Mode Compatibility

The `useHowlerAudio` hook properly handles React Strict Mode's mount-unmount-remount cycle:

- `isLoaded` state tracks whether audio is currently loaded
- On cleanup (unmount), `isLoaded` is set to `false`
- Components can check `isLoaded` to determine if reload is needed after remount
- This prevents issues where refs retain old values but the audio instance was unloaded

Example usage in components:

```typescript
const { load, isLoaded } = useHowlerAudio();
const loadedUrlRef = useRef<string | null>(null);

useEffect(() => {
  // Load if URL changed OR if audio was unloaded (Strict Mode remount)
  if (audioUrl && (loadedUrlRef.current !== audioUrl || !isLoaded)) {
    load(audioUrl);
    loadedUrlRef.current = audioUrl;
  }
}, [audioUrl, load, isLoaded]);
```

## Component Location

The global music player is rendered in: `src/components/global-music-player.tsx`

## Styling

The player uses:
- Fixed position at bottom of screen
- Glassmorphism effect (`backdrop-blur-md`, `bg-white/95`)
- Responsive design (adjusts for mobile)
- Smooth transitions for all state changes

## Related Files

- `src/components/global-music-player.tsx` - Main player component
- `src/contexts/music-player-context.tsx` - Player context provider
- `src/hooks/use-howler-audio.ts` - Core Howler.js wrapper hook
- `src/hooks/use-audio-position.ts` - High-frequency position tracking hook
- `src/lib/suno.ts` - Suno music API client (provides track URLs)
