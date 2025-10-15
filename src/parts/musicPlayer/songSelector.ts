import { AVAILABLE_SONGS, getSongById, getValidSongId, type SongConfig } from './songConfig';

/**
 * Song selector component interface
 */
export interface SongSelector {
  /** The HTML select element */
  element: HTMLSelectElement;
  /** Set the callback function called when song selection changes */
  onSongChange: (callback: (songId: string) => void) => void;
  /** Set the currently selected song */
  setSelectedSong: (songId: string) => void;
  /** Get the currently selected song ID */
  getCurrentSong: () => string;
  /** Destroy the component and clean up event listeners */
  destroy: () => void;
}

/**
 * Creates a song selector dropdown component
 * @param initialSongId - The initially selected song ID
 * @param onSongChange - Callback function for song selection changes
 * @returns SongSelector interface
 */
export function createSongSelector(
  initialSongId?: string,
  onSongChange?: (songId: string) => void
): SongSelector {
  // Create the select element
  const selectElement = document.createElement('select');
  selectElement.className = 'song-selector';
  
  // Add accessibility attributes
  selectElement.setAttribute('aria-label', 'Select background music');
  selectElement.setAttribute('role', 'combobox');
  selectElement.setAttribute('aria-expanded', 'false');
  selectElement.setAttribute('tabindex', '0');
  selectElement.title = 'Choose background music track';
  
  // Populate options from available songs
  AVAILABLE_SONGS.forEach((song: SongConfig) => {
    const option = document.createElement('option');
    option.value = song.id;
    option.textContent = song.displayName;
    option.setAttribute('aria-label', `Select ${song.displayName}`);
    selectElement.appendChild(option);
  });

  // Set initial selection
  const validInitialSong = getValidSongId(initialSongId);
  selectElement.value = validInitialSong;

  // Store the change callback
  let changeCallback = onSongChange;

  // Handle selection changes
  const handleChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    const selectedSongId = target.value;
    
    // Update aria-expanded state
    target.setAttribute('aria-expanded', 'false');
    
    if (changeCallback) {
      changeCallback(selectedSongId);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLSelectElement;
    
    switch (event.key) {
      case 'Enter':
      case ' ':
        // Prevent default space/enter behavior and toggle dropdown
        event.preventDefault();
        target.setAttribute('aria-expanded', target.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
        target.focus();
        break;
      case 'Escape':
        target.setAttribute('aria-expanded', 'false');
        target.blur();
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        // Allow default arrow key behavior for option navigation
        target.setAttribute('aria-expanded', 'true');
        break;
    }
  };

  // Handle focus events for accessibility
  const handleFocus = () => {
    selectElement.setAttribute('aria-expanded', 'true');
  };

  const handleBlur = () => {
    selectElement.setAttribute('aria-expanded', 'false');
  };

  // Add event listeners
  selectElement.addEventListener('change', handleChange);
  selectElement.addEventListener('keydown', handleKeyDown);
  selectElement.addEventListener('focus', handleFocus);
  selectElement.addEventListener('blur', handleBlur);

  // Return the interface
  return {
    element: selectElement,
    
    onSongChange: (callback: (songId: string) => void) => {
      changeCallback = callback;
    },
    
    setSelectedSong: (songId: string) => {
      const validSongId = getValidSongId(songId);
      selectElement.value = validSongId;
    },
    
    getCurrentSong: () => {
      return selectElement.value;
    },
    
    destroy: () => {
      selectElement.removeEventListener('change', handleChange);
      selectElement.removeEventListener('keydown', handleKeyDown);
      selectElement.removeEventListener('focus', handleFocus);
      selectElement.removeEventListener('blur', handleBlur);
      if (selectElement.parentNode) {
        selectElement.parentNode.removeChild(selectElement);
      }
    }
  };
}

/**
 * Validates that a song selector has a valid selection
 * @param selector - The song selector to validate
 * @returns True if the selection is valid
 */
export function validateSongSelection(selector: SongSelector): boolean {
  const currentSong = selector.getCurrentSong();
  return getSongById(currentSong) !== undefined;
}

/**
 * Gets the display name for the currently selected song
 * @param selector - The song selector
 * @returns Display name of the selected song or empty string if invalid
 */
export function getSelectedSongDisplayName(selector: SongSelector): string {
  const currentSong = selector.getCurrentSong();
  const songConfig = getSongById(currentSong);
  return songConfig?.displayName || '';
}