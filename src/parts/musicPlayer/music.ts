import { getSongById, getValidSongId, DEFAULT_SONG_ID } from './songConfig';
import { saveSelectedSong, loadSelectedSong } from './storageUtils';

/**
 * Enhanced music player with song switching capabilities and smooth crossfade transitions
 */
class Music {
  private audioElement: HTMLAudioElement;
  private secondaryAudioElement: HTMLAudioElement;
  private currentSongId: string;
  private wasPlaying: boolean = false;
  private crossfadeDuration: number = 2000; // 2 seconds crossfade
  private isTransitioning: boolean = false;

  constructor(initialSongId?: string) {
    // Create primary audio element
    this.audioElement = document.createElement("audio");
    this.audioElement.controls = true;
    this.audioElement.autoplay = false;
    this.audioElement.loop = true;
    this.audioElement.volume = 0.01;
    
    // Create secondary audio element for crossfading
    this.secondaryAudioElement = document.createElement("audio");
    this.secondaryAudioElement.controls = false;
    this.secondaryAudioElement.autoplay = false;
    this.secondaryAudioElement.loop = true;
    this.secondaryAudioElement.volume = 0;
    
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
   * Changes the current song to the specified song ID with smooth crossfade transition
   * @param songId - The ID of the song to switch to
   * @returns Promise that resolves when the song is loaded and transition is complete
   */
  async changeSong(songId: string): Promise<void> {
    const validSongId = getValidSongId(songId);
    
    // If it's the same song, no need to change
    if (validSongId === this.currentSongId) {
      return;
    }

    // Prevent multiple simultaneous transitions
    if (this.isTransitioning) {
      return;
    }

    this.isTransitioning = true;
    this.wasPlaying = !this.audioElement.paused;

    try {
      // Load new song into secondary audio element
      await this.loadSongIntoElement(this.secondaryAudioElement, validSongId);
      
      // If music was playing, start crossfade transition
      if (this.wasPlaying) {
        await this.performCrossfade();
      } else {
        // If not playing, just switch immediately
        this.swapAudioElements();
      }

      this.currentSongId = validSongId;
      
      // Save the new song selection to storage
      await this.saveCurrentSongToStorage();

    } catch (error) {
      console.warn(`Failed to load song ${songId}, falling back to default:`, error);
      
      // Fallback to default song if the requested song fails
      if (validSongId !== DEFAULT_SONG_ID) {
        try {
          await this.loadSongIntoElement(this.secondaryAudioElement, DEFAULT_SONG_ID);
          
          if (this.wasPlaying) {
            await this.performCrossfade();
          } else {
            this.swapAudioElements();
          }
          
          this.currentSongId = DEFAULT_SONG_ID;
          await this.saveCurrentSongToStorage();
          
        } catch (fallbackError) {
          console.error('Failed to load fallback song:', fallbackError);
          throw new Error(`Failed to load song ${songId} and fallback failed`);
        }
      } else {
        throw error;
      }
    } finally {
      this.isTransitioning = false;
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
   * Loads a song by ID into a specific audio element
   * @param audioElement - The audio element to load the song into
   * @param songId - The song ID to load
   * @returns Promise that resolves when the song is loaded
   */
  private async loadSongIntoElement(audioElement: HTMLAudioElement, songId: string): Promise<void> {
    const songConfig = getSongById(songId);
    if (!songConfig) {
      throw new Error(`Song with ID ${songId} not found`);
    }

    return new Promise((resolve, reject) => {
      const handleLoad = () => {
        audioElement.removeEventListener('canplaythrough', handleLoad);
        audioElement.removeEventListener('error', handleError);
        resolve();
      };

      const handleError = () => {
        audioElement.removeEventListener('canplaythrough', handleLoad);
        audioElement.removeEventListener('error', handleError);
        reject(new Error(`Failed to load audio file: ${songConfig.filename}`));
      };

      audioElement.addEventListener('canplaythrough', handleLoad);
      audioElement.addEventListener('error', handleError);
      
      // Set the new source
      audioElement.src = chrome.runtime.getURL(songConfig.importPath);
      audioElement.load();
    });
  }

  /**
   * Performs a smooth crossfade transition between the current and new song
   * @returns Promise that resolves when the crossfade is complete
   */
  private async performCrossfade(): Promise<void> {
    const currentVolume = this.audioElement.volume;
    const currentTime = this.audioElement.currentTime;
    
    // Start the new song at the same position (or from beginning if it's shorter)
    this.secondaryAudioElement.currentTime = Math.min(currentTime, this.secondaryAudioElement.duration || 0);
    this.secondaryAudioElement.volume = 0;
    
    // Start playing the new song
    await this.secondaryAudioElement.play();
    
    // Perform the crossfade
    return new Promise((resolve) => {
      const startTime = Date.now();
      const fadeInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / this.crossfadeDuration, 1);
        
        // Fade out current song
        this.audioElement.volume = currentVolume * (1 - progress);
        
        // Fade in new song
        this.secondaryAudioElement.volume = currentVolume * progress;
        
        if (progress >= 1) {
          clearInterval(fadeInterval);
          
          // Stop and reset the old song
          this.audioElement.pause();
          this.audioElement.currentTime = 0;
          
          // Swap the audio elements
          this.swapAudioElements();
          
          resolve();
        }
      }, 16); // ~60fps for smooth transition
    });
  }

  /**
   * Swaps the primary and secondary audio elements
   */
  private swapAudioElements(): void {
    // Get the parent element if the audio element is in the DOM
    const parent = this.audioElement.parentElement;
    const nextSibling = this.audioElement.nextSibling;
    
    const temp = this.audioElement;
    this.audioElement = this.secondaryAudioElement;
    this.secondaryAudioElement = temp;
    
    // Update controls visibility
    this.audioElement.controls = true;
    this.secondaryAudioElement.controls = false;
    
    // Reset secondary element volume
    this.secondaryAudioElement.volume = 0;
    
    // If the old audio element was in the DOM, replace it with the new one
    if (parent) {
      if (nextSibling) {
        parent.insertBefore(this.audioElement, nextSibling);
      } else {
        parent.appendChild(this.audioElement);
      }
      // Remove the old element from DOM
      if (this.secondaryAudioElement.parentElement) {
        this.secondaryAudioElement.parentElement.removeChild(this.secondaryAudioElement);
      }
    }
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
   * Sets the crossfade duration in milliseconds
   * @param duration - Duration in milliseconds (default: 2000ms)
   */
  setCrossfadeDuration(duration: number): void {
    this.crossfadeDuration = Math.max(100, Math.min(10000, duration)); // Clamp between 100ms and 10s
  }

  /**
   * Gets the current crossfade duration in milliseconds
   */
  getCrossfadeDuration(): number {
    return this.crossfadeDuration;
  }

  /**
   * Cleanup method to remove event listeners and reset state
   */
  destroy(): void {
    this.audioElement.pause();
    this.audioElement.src = '';
    this.audioElement.load();
    
    this.secondaryAudioElement.pause();
    this.secondaryAudioElement.src = '';
    this.secondaryAudioElement.load();
    
    this.isTransitioning = false;
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
