import YugureAvenue from "../../public/assets/musics/yugure_avenue.mp3";
import DevilInElectricCity from "../../public/assets/musics/devil_in_electric_city.mp3";

/**
 * Configuration interface for song metadata
 */
export interface SongConfig {
  /** Unique identifier (filename without extension) */
  id: string;
  /** User-friendly display name */
  displayName: string;
  /** Full filename with extension */
  filename: string;
  /** Import path for the audio file */
  importPath: string;
}

/**
 * Registry of all available songs in the music player
 */
export const AVAILABLE_SONGS: SongConfig[] = [
  {
    id: 'yugure_avenue',
    displayName: 'Yugure Avenue',
    filename: 'yugure_avenue.mp3',
    importPath: YugureAvenue
  },
  {
    id: 'devil_in_electric_city',
    displayName: 'Devil in Electric City',
    filename: 'devil_in_electric_city.mp3',
    importPath: DevilInElectricCity
  }
];

/**
 * Default song ID (first song in the registry)
 */
export const DEFAULT_SONG_ID = AVAILABLE_SONGS[0].id;

/**
 * Validates if a song ID exists in the available songs registry
 * @param songId - The song ID to validate
 * @returns True if the song ID is valid, false otherwise
 */
export function isValidSongId(songId: string): boolean {
  return AVAILABLE_SONGS.some(song => song.id === songId);
}

/**
 * Retrieves song configuration by ID
 * @param songId - The song ID to look up
 * @returns Song configuration object or undefined if not found
 */
export function getSongById(songId: string): SongConfig | undefined {
  return AVAILABLE_SONGS.find(song => song.id === songId);
}

/**
 * Gets a valid song ID, falling back to default if invalid
 * @param songId - The song ID to validate
 * @returns Valid song ID (either the input or default)
 */
export function getValidSongId(songId: string | undefined): string {
  if (!songId || !isValidSongId(songId)) {
    return DEFAULT_SONG_ID;
  }
  return songId;
}

/**
 * Gets all available song IDs
 * @returns Array of all song IDs
 */
export function getAllSongIds(): string[] {
  return AVAILABLE_SONGS.map(song => song.id);
}