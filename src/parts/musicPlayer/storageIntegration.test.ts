import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveSelectedSong, loadSelectedSong } from './storageUtils';
import { DEFAULT_SONG_ID } from './songConfig';

// Mock Chrome storage API
const mockChromeStorage = {
  sync: {
    set: vi.fn(),
    get: vi.fn()
  }
};

// Mock chrome global
Object.defineProperty(global, 'chrome', {
  value: {
    storage: mockChromeStorage
  },
  writable: true
});

describe('Storage Integration - Basic Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockChromeStorage.sync.get.mockResolvedValue({});
    mockChromeStorage.sync.set.mockResolvedValue(undefined);
  });

  it('should save and load song preferences', async () => {
    // Test saving
    await saveSelectedSong('devil_in_electric_city');
    expect(mockChromeStorage.sync.set).toHaveBeenCalledWith({
      selectedSong: 'devil_in_electric_city'
    });

    // Test loading
    mockChromeStorage.sync.get.mockResolvedValue({
      selectedSong: 'devil_in_electric_city'
    });
    
    const loadedSong = await loadSelectedSong();
    expect(loadedSong).toBe('devil_in_electric_city');
    expect(mockChromeStorage.sync.get).toHaveBeenCalledWith(['selectedSong']);
  });

  it('should handle invalid songs by falling back to default', async () => {
    // Save invalid song should save default
    await saveSelectedSong('invalid_song');
    expect(mockChromeStorage.sync.set).toHaveBeenCalledWith({
      selectedSong: DEFAULT_SONG_ID
    });

    // Load invalid song should return default
    mockChromeStorage.sync.get.mockResolvedValue({
      selectedSong: 'invalid_song'
    });
    
    const loadedSong = await loadSelectedSong();
    expect(loadedSong).toBe(DEFAULT_SONG_ID);
  });

  it('should handle storage errors gracefully', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    // Test save error
    mockChromeStorage.sync.set.mockRejectedValue(new Error('Storage error'));
    await expect(saveSelectedSong('yugure_avenue')).resolves.toBeUndefined();
    
    // Test load error
    mockChromeStorage.sync.get.mockRejectedValue(new Error('Storage error'));
    const result = await loadSelectedSong();
    expect(result).toBe(DEFAULT_SONG_ID);
    
    expect(consoleWarnSpy).toHaveBeenCalledTimes(2);
    consoleWarnSpy.mockRestore();
  });
});