import { getValidSongId, DEFAULT_SONG_ID } from './songConfig';

/**
 * Storage key for the selected song preference
 */
const STORAGE_KEY = 'selectedSong';

/**
 * Interface for storage data structure
 */
export interface StorageData {
  selectedSong?: string;
}

/**
 * Saves the selected song ID to Chrome storage
 * @param songId - The song ID to save
 * @returns Promise that resolves when the save operation completes
 */
export async function saveSelectedSong(songId: string): Promise<void> {
  try {
    const validSongId = getValidSongId(songId);
    const storageData: StorageData = { selectedSong: validSongId };
    
    await chrome.storage.sync.set(storageData);
  } catch (error) {
    console.warn('Failed to save selected song to storage:', error);
    // Don't throw - gracefully degrade to in-memory only
  }
}

/**
 * Loads the selected song ID from Chrome storage
 * @returns Promise that resolves to the stored song ID or default if not found/invalid
 */
export async function loadSelectedSong(): Promise<string> {
  try {
    const result = await chrome.storage.sync.get([STORAGE_KEY]);
    const storedSongId = result[STORAGE_KEY];
    
    // Validate and return the stored song ID, or default if invalid
    return getValidSongId(storedSongId);
  } catch (error) {
    console.warn('Failed to load selected song from storage:', error);
    // Fallback to default song on storage errors
    return DEFAULT_SONG_ID;
  }
}

/**
 * Clears the selected song preference from Chrome storage
 * @returns Promise that resolves when the clear operation completes
 */
export async function clearSelectedSong(): Promise<void> {
  try {
    await chrome.storage.sync.remove([STORAGE_KEY]);
  } catch (error) {
    console.warn('Failed to clear selected song from storage:', error);
    // Don't throw - operation is not critical
  }
}

/**
 * Checks if Chrome storage is available
 * @returns True if Chrome storage API is available, false otherwise
 */
export function isStorageAvailable(): boolean {
  return typeof chrome !== 'undefined' && 
         !!chrome.storage && 
         !!chrome.storage.sync &&
         typeof chrome.storage.sync.get === 'function' &&
         typeof chrome.storage.sync.set === 'function';
}

/**
 * Gets all storage data for debugging purposes
 * @returns Promise that resolves to all stored data or empty object on error
 */
export async function getAllStorageData(): Promise<StorageData> {
  try {
    if (!isStorageAvailable()) {
      return {};
    }
    
    const result = await chrome.storage.sync.get(null);
    return result as StorageData;
  } catch (error) {
    console.warn('Failed to get all storage data:', error);
    return {};
  }
}