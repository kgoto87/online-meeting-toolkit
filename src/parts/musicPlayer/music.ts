import { getSongById, getValidSongId, DEFAULT_SONG_ID } from './songConfig';
import { saveSelectedSong, loadSelectedSong } from './storageUtils';

/**
 * Enhanced music player with song switching capabilities
 */
class Music {
  private audioElement: HTMLAudioElement;
  private currentSongId: string;
  private wasPlaying: boolean = false;

  constructor(initialSongId?: string) {
    this.audioElement = document.createElement("audio");
    this.audioElement.controls = true;
    this.audioElement.autoplay = false;
    this.audioElement.loop = true;
    this.audioElement.volume = 0.01;
    
    // Initialize with valid song ID
    this.currentSongId = getValidSongId(initialSongId);
    // Set the initial source and load
    const songConfig = getSongById(this.currentSongId);
    if (songConfig) {
      this.audioElement.src = chrome.runtime.getURL(songConfig.importPath);
      this.audioElement.load();
    }
  }

  /**
   * Initializes the music player with stored song preference
   * @returns Promise that resolves when initialization is complete
   */
  async initializeFromStorage(): Promise<void> {
    try {
      const storedSongId = await loadSelectedSong();
      if (storedSongId !== this.currentSongId) {
        await this.changeSong(storedSongId);
      }
    } catch (error) {
      console.warn('Failed to initialize from storage, using current song:', error);
      // Continue with current song if storage initialization fails
    }
  }

  /**
   * Gets the underlying audio element
   */
  get element(): HTMLAudioElement {
    return this.audioElement;
  }

  /**
   * Gets the currently selected song ID
   */
  getCurrentSong(): string {
    return this.currentSongId;
  }

  /**
   * Changes the current song to the specified song ID
   * @param songId - The ID of the song to switch to
   * @returns Promise that resolves when the song is loaded, or rejects on error
   */
  async changeSong(songId: string): Promise<void> {
    const validSongId = getValidSongId(songId);
    
    // If it's the same song, no need to change
    if (validSongId === this.currentSongId) {
      return;
    }

    // Store current playback state
    this.wasPlaying = !this.audioElement.paused;

    try {
      // Stop current playback and cleanup
      this.audioElement.pause();
      this.audioElement.currentTime = 0;

      // Load new song
      await this.loadSong(validSongId);
      this.currentSongId = validSongId;

      // Save the new song selection to storage
      await this.saveCurrentSongToStorage();

      // Resume playback if it was playing before
      if (this.wasPlaying) {
        await this.audioElement.play();
      }
    } catch (error) {
      console.warn(`Failed to load song ${songId}, falling back to default:`, error);
      
      // Fallback to default song if the requested song fails
      if (validSongId !== DEFAULT_SONG_ID) {
        try {
          await this.loadSong(DEFAULT_SONG_ID);
          this.currentSongId = DEFAULT_SONG_ID;
          
          // Save the fallback song to storage
          await this.saveCurrentSongToStorage();
          
          if (this.wasPlaying) {
            await this.audioElement.play();
          }
        } catch (fallbackError) {
          console.error('Failed to load fallback song:', fallbackError);
          throw new Error(`Failed to load song ${songId} and fallback failed`);
        }
      } else {
        throw error;
      }
    }
  }

  /**
   * Saves the current song selection to Chrome storage
   * @returns Promise that resolves when save operation completes
   */
  private async saveCurrentSongToStorage(): Promise<void> {
    try {
      await saveSelectedSong(this.currentSongId);
    } catch (error) {
      console.warn('Failed to save current song to storage:', error);
      // Don't throw - gracefully degrade to in-memory only
    }
  }

  /**
   * Loads a song by ID into the audio element
   * @param songId - The song ID to load
   * @returns Promise that resolves when the song is loaded
   */
  private async loadSong(songId: string): Promise<void> {
    const songConfig = getSongById(songId);
    if (!songConfig) {
      throw new Error(`Song with ID ${songId} not found`);
    }

    return new Promise((resolve, reject) => {
      const handleLoad = () => {
        this.audioElement.removeEventListener('canplaythrough', handleLoad);
        this.audioElement.removeEventListener('error', handleError);
        resolve();
      };

      const handleError = () => {
        this.audioElement.removeEventListener('canplaythrough', handleLoad);
        this.audioElement.removeEventListener('error', handleError);
        reject(new Error(`Failed to load audio file: ${songConfig.filename}`));
      };

      this.audioElement.addEventListener('canplaythrough', handleLoad);
      this.audioElement.addEventListener('error', handleError);
      
      // Set the new source
      this.audioElement.src = chrome.runtime.getURL(songConfig.importPath);
      this.audioElement.load();
    });
  }

  /**
   * Plays the current song
   */
  async play(): Promise<void> {
    await this.audioElement.play();
  }

  /**
   * Pauses the current song
   */
  pause(): void {
    this.audioElement.pause();
  }

  /**
   * Toggles play/pause state
   */
  async togglePlay(): Promise<void> {
    if (this.audioElement.paused) {
      await this.play();
    } else {
      this.pause();
    }
  }

  /**
   * Sets the volume (0-1)
   */
  setVolume(volume: number): void {
    this.audioElement.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Gets the current volume (0-1)
   */
  getVolume(): number {
    return this.audioElement.volume;
  }

  /**
   * Cleanup method to remove event listeners and reset state
   */
  destroy(): void {
    this.audioElement.pause();
    this.audioElement.src = '';
    this.audioElement.load();
  }
}

/**
 * Creates a new Music instance and initializes it with stored preferences
 * @param initialSongId - Optional initial song ID (overrides storage)
 * @returns Promise that resolves to the initialized Music instance
 */
export async function createMusicWithStorage(initialSongId?: string): Promise<Music> {
  const musicInstance = new Music(initialSongId);
  
  // Only initialize from storage if no initial song was provided
  if (!initialSongId) {
    await musicInstance.initializeFromStorage();
  }
  
  return musicInstance;
}

// Create and export the default music instance
const music = new Music();

// For backward compatibility, export the audio element directly
export default music.element;

// Export the enhanced music instance for components that need song switching
export { music, Music };
