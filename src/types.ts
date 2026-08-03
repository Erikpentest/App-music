export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // seconds
  audioUrl: string;
  coverUrl: string;
  genre: string;
  year: number;
  lyrics?: string;
  isLiked?: boolean;
  bpm?: number;
  chords?: string[];
  isAiGenerated?: boolean;
  isBeatStudioTrack?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  tracks: Track[];
  createdAt: string;
  isUserCreated?: boolean;
}

export interface EqualizerSettings {
  enabled: boolean;
  preGain: number; // -12 to 12 dB
  presetName: string;
  bands: number[]; // 10 values representing dB gains (-12 to 12)
}

export type VisualizerMode = 'bars' | 'wave' | 'particles' | 'circle';

export interface AiLyricsStructure {
  type: string; // e.g. "Verso 1", "Refrão"
  lyrics: string;
  chords?: string;
}

export interface AiGeneratedSong {
  id: string;
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  keySignature: string;
  structure: AiLyricsStructure[];
  compositionNotes: string;
  createdAt: string;
}

export interface RecommendationTrack {
  title: string;
  artist: string;
  genre: string;
  reason: string;
}

export interface AiRecommendation {
  playlistName: string;
  description: string;
  vibeTag: string;
  tracks: RecommendationTrack[];
}

export type ActiveTab = 'home' | 'browse' | 'library' | 'ai-studio' | 'beat-maker' | 'radio';

export interface SongInsights {
  meaning: string;
  musicalCuriosities: string[];
  recommendedInstruments: string[];
  similarStyleArtists: string[];
}
