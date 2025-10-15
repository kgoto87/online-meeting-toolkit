import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  createSongSelector, 
  validateSongSelection, 
  getSelectedSongDisplayName,
  type SongSelector 
} from './songSelector';
import { AVAILABLE_SONGS, DEFAULT_SONG_ID } from './songConfig';

describe('songSelector', () => {
  let selector: SongSelector;

  beforeEach(() => {
    // Clean up any existing selectors
    if (selector) {
      selector.destroy();
    }
  });

  describe('createSongSelector', () => {
    it('should create a select element with all available songs as options', () => {
      selector = createSongSelector();
      
      expect(selector.element.tagName).toBe('SELECT');
      expect(selector.element.className).toBe('song-selector');
      expect(selector.element.children.length).toBe(AVAILABLE_SONGS.length);
      
      // Check that all songs are present as options
      AVAILABLE_SONGS.forEach((song, index) => {
        const option = selector.element.children[index] as HTMLOptionElement;
        expect(option.value).toBe(song.id);
        expect(option.textContent).toBe(song.displayName);
      });
    });

    it('should set the default song as initially selected when no initial song provided', () => {
      selector = createSongSelector();
      
      expect(selector.getCurrentSong()).toBe(DEFAULT_SONG_ID);
      expect(selector.element.value).toBe(DEFAULT_SONG_ID);
    });

    it('should set the provided initial song as selected', () => {
      const initialSong = AVAILABLE_SONGS[1].id;
      selector = createSongSelector(initialSong);
      
      expect(selector.getCurrentSong()).toBe(initialSong);
      expect(selector.element.value).toBe(initialSong);
    });

    it('should fallback to default song when invalid initial song provided', () => {
      selector = createSongSelector('invalid_song_id');
      
      expect(selector.getCurrentSong()).toBe(DEFAULT_SONG_ID);
      expect(selector.element.value).toBe(DEFAULT_SONG_ID);
    });

    it('should call onSongChange callback when selection changes', () => {
      const mockCallback = vi.fn();
      selector = createSongSelector(undefined, mockCallback);
      
      // Simulate selection change
      const newSongId = AVAILABLE_SONGS[1].id;
      selector.element.value = newSongId;
      selector.element.dispatchEvent(new Event('change'));
      
      expect(mockCallback).toHaveBeenCalledWith(newSongId);
    });
  });

  describe('setSelectedSong', () => {
    beforeEach(() => {
      selector = createSongSelector();
    });

    it('should update the selected song to a valid song ID', () => {
      const newSongId = AVAILABLE_SONGS[1].id; // Use second song instead of third
      selector.setSelectedSong(newSongId);
      
      expect(selector.getCurrentSong()).toBe(newSongId);
      expect(selector.element.value).toBe(newSongId);
    });

    it('should fallback to default song when setting invalid song ID', () => {
      selector.setSelectedSong('invalid_song_id');
      
      expect(selector.getCurrentSong()).toBe(DEFAULT_SONG_ID);
      expect(selector.element.value).toBe(DEFAULT_SONG_ID);
    });

    it('should handle undefined song ID by falling back to default', () => {
      selector.setSelectedSong(undefined as any);
      
      expect(selector.getCurrentSong()).toBe(DEFAULT_SONG_ID);
      expect(selector.element.value).toBe(DEFAULT_SONG_ID);
    });
  });

  describe('getCurrentSong', () => {
    beforeEach(() => {
      selector = createSongSelector();
    });

    it('should return the currently selected song ID', () => {
      const songId = AVAILABLE_SONGS[1].id;
      selector.element.value = songId;
      
      expect(selector.getCurrentSong()).toBe(songId);
    });

    it('should return the correct song ID after programmatic change', () => {
      const songId = AVAILABLE_SONGS[1].id; // Use second song instead of third
      selector.setSelectedSong(songId);
      
      expect(selector.getCurrentSong()).toBe(songId);
    });
  });

  describe('onSongChange callback', () => {
    it('should allow updating the callback function', () => {
      const mockCallback1 = vi.fn();
      const mockCallback2 = vi.fn();
      
      selector = createSongSelector(undefined, mockCallback1);
      
      // Change callback
      selector.onSongChange(mockCallback2);
      
      // Trigger change event
      const newSongId = AVAILABLE_SONGS[1].id;
      selector.element.value = newSongId;
      selector.element.dispatchEvent(new Event('change'));
      
      expect(mockCallback1).not.toHaveBeenCalled();
      expect(mockCallback2).toHaveBeenCalledWith(newSongId);
    });

    it('should handle multiple callback updates', () => {
      const mockCallback1 = vi.fn();
      const mockCallback2 = vi.fn();
      const mockCallback3 = vi.fn();
      
      selector = createSongSelector();
      
      selector.onSongChange(mockCallback1);
      selector.onSongChange(mockCallback2);
      selector.onSongChange(mockCallback3);
      
      // Trigger change event
      const newSongId = AVAILABLE_SONGS[1].id;
      selector.element.value = newSongId;
      selector.element.dispatchEvent(new Event('change'));
      
      expect(mockCallback1).not.toHaveBeenCalled();
      expect(mockCallback2).not.toHaveBeenCalled();
      expect(mockCallback3).toHaveBeenCalledWith(newSongId);
    });
  });

  describe('destroy', () => {
    it('should remove event listeners and element from DOM', () => {
      const mockCallback = vi.fn();
      selector = createSongSelector(undefined, mockCallback);
      
      // Add to DOM
      document.body.appendChild(selector.element);
      expect(document.body.contains(selector.element)).toBe(true);
      
      // Destroy
      selector.destroy();
      
      // Element should be removed from DOM
      expect(document.body.contains(selector.element)).toBe(false);
      
      // Event listeners should be removed (change event should not trigger callback)
      selector.element.value = AVAILABLE_SONGS[1].id;
      selector.element.dispatchEvent(new Event('change'));
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should handle destroy when element is not in DOM', () => {
      selector = createSongSelector();
      
      // Should not throw error when element is not in DOM
      expect(() => selector.destroy()).not.toThrow();
    });
  });

  describe('validateSongSelection', () => {
    beforeEach(() => {
      selector = createSongSelector();
    });

    it('should return true for valid song selection', () => {
      selector.setSelectedSong(AVAILABLE_SONGS[1].id);
      
      expect(validateSongSelection(selector)).toBe(true);
    });

    it('should return true for default song selection', () => {
      // Default song should always be valid
      expect(validateSongSelection(selector)).toBe(true);
    });

    it('should return false for invalid song selection', () => {
      // Manually set invalid value (bypassing validation)
      selector.element.value = 'invalid_song_id';
      
      expect(validateSongSelection(selector)).toBe(false);
    });
  });

  describe('getSelectedSongDisplayName', () => {
    beforeEach(() => {
      selector = createSongSelector();
    });

    it('should return display name for valid song selection', () => {
      const song = AVAILABLE_SONGS[1];
      selector.setSelectedSong(song.id);
      
      expect(getSelectedSongDisplayName(selector)).toBe(song.displayName);
    });

    it('should return display name for default song', () => {
      const defaultSong = AVAILABLE_SONGS[0]; // DEFAULT_SONG_ID is first song
      
      expect(getSelectedSongDisplayName(selector)).toBe(defaultSong.displayName);
    });

    it('should return empty string for invalid song selection', () => {
      // Manually set invalid value (bypassing validation)
      selector.element.value = 'invalid_song_id';
      
      expect(getSelectedSongDisplayName(selector)).toBe('');
    });
  });

  describe('DOM integration', () => {
    beforeEach(() => {
      selector = createSongSelector();
    });

    it('should create proper HTML structure', () => {
      expect(selector.element.tagName).toBe('SELECT');
      expect(selector.element.className).toBe('song-selector');
      
      // Check options structure
      const options = Array.from(selector.element.options);
      expect(options.length).toBe(AVAILABLE_SONGS.length);
      
      options.forEach((option, index) => {
        expect(option.tagName).toBe('OPTION');
        expect(option.value).toBe(AVAILABLE_SONGS[index].id);
        expect(option.textContent).toBe(AVAILABLE_SONGS[index].displayName);
      });
    });

    it('should handle user interaction correctly', () => {
      const mockCallback = vi.fn();
      selector.onSongChange(mockCallback);
      
      // Simulate user selecting different option
      const targetSong = AVAILABLE_SONGS[1]; // Use second song instead of third
      selector.element.value = targetSong.id;
      
      // Dispatch change event as browser would
      const changeEvent = new Event('change', { bubbles: true });
      selector.element.dispatchEvent(changeEvent);
      
      expect(mockCallback).toHaveBeenCalledWith(targetSong.id);
      expect(selector.getCurrentSong()).toBe(targetSong.id);
    });
  });

  describe('accessibility features', () => {
    beforeEach(() => {
      selector = createSongSelector();
    });

    it('should have proper ARIA attributes', () => {
      expect(selector.element.getAttribute('aria-label')).toBe('Select background music');
      expect(selector.element.getAttribute('role')).toBe('combobox');
      expect(selector.element.getAttribute('aria-expanded')).toBe('false');
      expect(selector.element.getAttribute('tabindex')).toBe('0');
      expect(selector.element.title).toBe('Choose background music track');
    });

    it('should handle keyboard navigation', () => {
      // Test Enter key
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      selector.element.dispatchEvent(enterEvent);
      expect(selector.element.getAttribute('aria-expanded')).toBe('true');
      
      // Test Escape key
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      selector.element.dispatchEvent(escapeEvent);
      expect(selector.element.getAttribute('aria-expanded')).toBe('false');
    });

    it('should update aria-expanded on focus and blur', () => {
      // Test focus
      selector.element.dispatchEvent(new Event('focus'));
      expect(selector.element.getAttribute('aria-expanded')).toBe('true');
      
      // Test blur
      selector.element.dispatchEvent(new Event('blur'));
      expect(selector.element.getAttribute('aria-expanded')).toBe('false');
    });

    it('should have proper option labels', () => {
      const options = Array.from(selector.element.options);
      
      options.forEach((option, index) => {
        expect(option.getAttribute('aria-label')).toBe(`Select ${AVAILABLE_SONGS[index].displayName}`);
      });
    });
  });
});