import musicElement, { createMusicWithStorage } from "./music";
import { createSongSelector, type SongSelector } from "./songSelector";
import { loadSelectedSong } from "./storageUtils";

// Enhanced music instance for song switching
let enhancedMusic: Awaited<ReturnType<typeof createMusicWithStorage>> | null = null;
let songSelector: SongSelector | null = null;
let isInitialized = false;

// Check if we're in a test environment
const isTestEnvironment = typeof globalThis !== 'undefined' && 
  (globalThis as any).vitest !== undefined;

// Create the main container
const musicPlayer = document.createElement("div");
musicPlayer.className = "music-player";

// Initialize the music player with song selector integration
async function initializeMusicPlayer(): Promise<void> {
  if (isInitialized) {
    return;
  }

  try {
    // Load stored song preference
    const storedSongId = await loadSelectedSong();
    
    // Create enhanced music instance with stored preference
    enhancedMusic = await createMusicWithStorage(storedSongId);
    
    // Create song selector with current song
    songSelector = createSongSelector(
      enhancedMusic.getCurrentSong(),
      async (selectedSongId: string) => {
        // Handle song selection changes
        if (enhancedMusic) {
          try {
            await enhancedMusic.changeSong(selectedSongId);
          } catch (error) {
            console.error('Failed to change song:', error);
            // Update selector to reflect the actual current song on error
            if (songSelector) {
              songSelector.setSelectedSong(enhancedMusic.getCurrentSong());
            }
          }
        }
      }
    );
    
    // Add components to the container
    musicPlayer.appendChild(songSelector.element);
    musicPlayer.appendChild(enhancedMusic.element);
    
    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize music player with song selector:', error);
    // Fallback to basic music element if initialization fails
    musicPlayer.appendChild(musicElement);
    isInitialized = true;
  }
}

// Initialize the music player (but don't await in module scope for testing)
if (!isTestEnvironment) {
  initializeMusicPlayer();
}

export default musicPlayer;

export const isPlaying = () => {
  // Ensure initialization for non-test environments
  if (!isInitialized && !isTestEnvironment) {
    initializeMusicPlayer();
  }
  
  if (enhancedMusic) {
    return !enhancedMusic.element.paused;
  }
  return !musicElement.paused;
};

export async function togglePlay(): Promise<void> {
  try {
    // Ensure initialization for non-test environments
    if (!isInitialized && !isTestEnvironment) {
      await initializeMusicPlayer();
    }
    
    if (enhancedMusic) {
      await enhancedMusic.togglePlay();
    } else {
      // Fallback to basic music element
      if (musicElement.paused) {
        await musicElement.play();
      } else {
        musicElement.pause();
      }
    }
  } catch (error) {
    console.error('Failed to toggle play:', error);
  }
}

/**
 * Gets the current song ID from the music player
 * @returns Current song ID or undefined if not available
 */
export function getCurrentSong(): string | undefined {
  return enhancedMusic?.getCurrentSong();
}

/**
 * Changes the current song programmatically
 * @param songId - The song ID to switch to
 * @returns Promise that resolves when the song change is complete
 */
export async function changeSong(songId: string): Promise<void> {
  if (enhancedMusic) {
    await enhancedMusic.changeSong(songId);
    // Update the song selector to reflect the change
    if (songSelector) {
      songSelector.setSelectedSong(enhancedMusic.getCurrentSong());
    }
  }
}

/**
 * Initialize the music player (exposed for testing)
 */
export { initializeMusicPlayer };

/**
 * Cleanup function for proper component lifecycle management
 */
export function destroy(): void {
  if (songSelector) {
    songSelector.destroy();
    songSelector = null;
  }
  
  if (enhancedMusic) {
    enhancedMusic.destroy();
    enhancedMusic = null;
  }
  
  isInitialized = false;
  
  // Clear the container
  while (musicPlayer.firstChild) {
    musicPlayer.removeChild(musicPlayer.firstChild);
  }
}
