import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  saveSelectedSong, 
  loadSelectedSong, 
  clearSelectedSong, 
  isStorageAvailable,
  getAllStorageData 
} from './storageUtils';
import { DEFAULT_SONG_ID } from './songConfig';

// Mock Chrome storage API
const mockChromeStorage = {
  sync: {
    set: vi.fn(),
    get: vi.fn(),
    remove: vi.fn()
  }
};

// Mock chrome global
Object.defineProperty(global, 'chrome', {
  value: {
    storage: mockChromeStorage
  },
  writable: true
});

describe('storageUtils', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    // Reset default mock behavior
    mockChromeStorage.sync.get.mockResolvedValue({});
  });

  describe('saveSelectedSong', () => {
    it('should save valid song ID to Chrome storage', async () => {
      mockChromeStorage.sync.set.mockResolvedValue(undefined);

      await saveSelectedSong('yugure_avenue');

      expect(mockChromeStorage.sync.set).toHaveBeenCalledWith({
        selectedSong: 'yugure_avenue'
      });
    });

    it('should save default song ID when invalid song provided', async () => {
      mockChromeStorage.sync.set.mockResolvedValue(undefined);

      await saveSelectedSong('invalid_song');

      expect(mockChromeStorage.sync.set).toHaveBeenCalledWith({
        selectedSong: DEFAULT_SONG_ID
      });
    });

    it('should handle storage errors gracefully', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockChromeStorage.sync.set.mockRejectedValue(new Error('Storage error'));

      // Should not throw
      await expect(saveSelectedSong('yugure_avenue')).resolves.toBeUndefined();
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to save selected song to storage:',
        expect.any(Error)
      );
      
      consoleWarnSpy.mockRestore();
    });
  });

  describe('loadSelectedSong', () => {
    it('should load valid song ID from Chrome storage', async () => {
      mockChromeStorage.sync.get.mockResolvedValue({
        selectedSong: 'devil_in_electric_city'
      });

      const result = await loadSelectedSong();

      expect(result).toBe('devil_in_electric_city');
      expect(mockChromeStorage.sync.get).toHaveBeenCalledWith(['selectedSong']);
    });

    it('should return default song when no stored value exists', async () => {
      mockChromeStorage.sync.get.mockResolvedValue({});

      const result = await loadSelectedSong();

      expect(result).toBe(DEFAULT_SONG_ID);
    });

    it('should return default song when stored value is invalid', async () => {
      mockChromeStorage.sync.get.mockResolvedValue({
        selectedSong: 'invalid_song_id'
      });

      const result = await loadSelectedSong();

      expect(result).toBe(DEFAULT_SONG_ID);
    });

    it('should handle storage errors gracefully', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockChromeStorage.sync.get.mockRejectedValue(new Error('Storage error'));

      const result = await loadSelectedSong();

      expect(result).toBe(DEFAULT_SONG_ID);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to load selected song from storage:',
        expect.any(Error)
      );
      
      consoleWarnSpy.mockRestore();
    });
  });

  describe('clearSelectedSong', () => {
    it('should remove selected song from Chrome storage', async () => {
      mockChromeStorage.sync.remove.mockResolvedValue(undefined);

      await clearSelectedSong();

      expect(mockChromeStorage.sync.remove).toHaveBeenCalledWith(['selectedSong']);
    });

    it('should handle storage errors gracefully', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockChromeStorage.sync.remove.mockRejectedValue(new Error('Storage error'));

      // Should not throw
      await expect(clearSelectedSong()).resolves.toBeUndefined();
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to clear selected song from storage:',
        expect.any(Error)
      );
      
      consoleWarnSpy.mockRestore();
    });
  });

  describe('isStorageAvailable', () => {
    it('should return true when Chrome storage is available', () => {
      const result = isStorageAvailable();
      expect(result).toBe(true);
    });

    it('should return false when chrome is undefined', () => {
      const originalChrome = global.chrome;
      // @ts-ignore
      global.chrome = undefined;

      const result = isStorageAvailable();
      expect(result).toBe(false);

      // Restore chrome
      global.chrome = originalChrome;
    });

    it('should return false when chrome.storage is undefined', () => {
      const originalStorage = global.chrome.storage;
      // @ts-ignore
      global.chrome = { ...global.chrome, storage: undefined };

      const result = isStorageAvailable();
      expect(result).toBe(false);

      // Restore storage
      global.chrome.storage = originalStorage;
    });
  });

  describe('getAllStorageData', () => {
    it('should return all storage data', async () => {
      const mockData = { selectedSong: 'yugure_avenue', otherKey: 'value' };
      mockChromeStorage.sync.get.mockResolvedValueOnce(mockData);

      const result = await getAllStorageData();

      expect(result).toEqual(mockData);
      expect(mockChromeStorage.sync.get).toHaveBeenCalledWith(null);
    });

    it('should return empty object when storage is not available', async () => {
      const originalChrome = global.chrome;
      // @ts-ignore
      global.chrome = undefined;

      const result = await getAllStorageData();

      expect(result).toEqual({});

      // Restore chrome
      global.chrome = originalChrome;
    });

    it('should handle storage errors gracefully', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockChromeStorage.sync.get.mockRejectedValueOnce(new Error('Storage error'));

      const result = await getAllStorageData();

      expect(result).toEqual({});
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to get all storage data:',
        expect.any(Error)
      );
      
      consoleWarnSpy.mockRestore();
    });
  });
});