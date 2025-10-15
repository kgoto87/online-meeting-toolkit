import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import * as songConfig from './songConfig';

// Mock Chrome runtime and storage APIs
const mockGetURL = vi.fn();
const mockStorageSet = vi.fn();
const mockStorageGet = vi.fn();
const mockStorageRemove = vi.fn();

global.chrome = {
  runtime: {
    getURL: mockGetURL
  },
  storage: {
    sync: {
      set: mockStorageSet,
      get: mockStorageGet,
      remove: mockStorageRemove
    }
  }
} as any;

// Mock audio element methods
const mockPlay = vi.fn();
const mockPause = vi.fn();
const mockLoad = vi.fn();

// Mock HTMLAudioElement
class MockAudioElement {
  src = '';
  controls = false;
  autoplay = false;
  loop = false;
  volume = 1;
  currentTime = 0;
  paused = true;
  
  play = mockPlay;
  pause = mockPause;
  load = mockLoad;
  
  private listeners: { [key: string]: Function[] } = {};
  
  addEventListener(event: string, listener: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }
  
  removeEventListener(event: string, listener: Function) {
    if (this.listeners[event]) {
      const index = this.listeners[event].indexOf(listener);
      if (index > -1) {
        this.listeners[event].splice(index, 1);
      }
    }
  }
  
  dispatchEvent(event: string) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(listener => listener());
    }
  }
  
  // Helper method to simulate successful load
  simulateLoad() {
    this.dispatchEvent('canplaythrough');
  }
  
  // Helper method to simulate load error
  simulateError() {
    this.dispatchEvent('error');
  }
}

// Create a fresh mock audio element for each test
let mockAudioElement: MockAudioElement;

// Mock document.createElement to return our mock audio element
const originalCreateElement = document.createElement;
vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
  if (tagName === 'audio') {
    return mockAudioElement as any;
  }
  return originalCreateElement.call(document, tagName);
});

describe('Music Player with Song Switching', () => {
  let Music: any;
  let music: any;

  beforeEach(async () => {
    // Create fresh mock for each test
    mockAudioElement = new MockAudioElement();
    
    vi.clearAllMocks();
    mockGetURL.mockImplementation((path: string) => `chrome-extension://test/${path}`);
    mockPlay.mockResolvedValue(undefined);
    
    // Reset storage mocks
    mockStorageSet.mockResolvedValue(undefined);
    mockStorageGet.mockResolvedValue({});
    mockStorageRemove.mockResolvedValue(undefined);
    
    // Reset mock audio element state
    mockAudioElement.paused = true;
    mockAudioElement.currentTime = 0;
    mockAudioElement.src = '';
    mockAudioElement.volume = 1;
    mockAudioElement.controls = false;
    mockAudioElement.autoplay = false;
    mockAudioElement.loop = false;
    
    // Clear module cache and re-import
    vi.resetModules();
    const musicModule = await import('./music');
    music = musicModule.music;
  });

  afterEach(() => {
    // Reset audio element state
    if (mockAudioElement) {
      mockAudioElement.src = '';
      mockAudioElement.paused = true;
      mockAudioElement.currentTime = 0;
      mockAudioElement.volume = 1;
    }
  });

  describe('Initialization', () => {
    it('should initialize with default song', () => {
      expect(music.getCurrentSong()).toBe(songConfig.DEFAULT_SONG_ID);
    });

    it('should set up audio element with correct properties', () => {
      expect(mockAudioElement.controls).toBe(true);
      expect(mockAudioElement.autoplay).toBe(false);
      expect(mockAudioElement.loop).toBe(true);
      expect(mockAudioElement.volume).toBe(0.01);
    });

    it('should load initial song', () => {
      expect(mockLoad).toHaveBeenCalled();
      expect(mockGetURL).toHaveBeenCalled();
    });
  });

  describe('getCurrentSong', () => {
    it('should return the current song ID', () => {
      const currentSong = music.getCurrentSong();
      expect(currentSong).toBe(songConfig.DEFAULT_SONG_ID);
    });
  });

  describe('changeSong', () => {
    it('should not change if the same song is requested', async () => {
      const currentSong = music.getCurrentSong();
      const initialCallCount = mockLoad.mock.calls.length;
      
      await music.changeSong(currentSong);
      
      expect(mockLoad).toHaveBeenCalledTimes(initialCallCount);
      expect(music.getCurrentSong()).toBe(currentSong);
    });

    it('should fallback to valid song ID for invalid input', () => {
      // Test the synchronous validation part
      const initialSong = music.getCurrentSong();
      
      // This should not change the current song since it's invalid
      // and the async part would handle the actual loading
      expect(songConfig.getValidSongId('invalid_song')).toBe(songConfig.DEFAULT_SONG_ID);
      expect(songConfig.getValidSongId('')).toBe(songConfig.DEFAULT_SONG_ID);
      expect(songConfig.getValidSongId(undefined)).toBe(songConfig.DEFAULT_SONG_ID);
    });

    it('should reset current time when changing songs', () => {
      mockAudioElement.currentTime = 30;
      
      // Test that pause and reset happens synchronously
      music.changeSong('devil_in_electric_city');
      
      expect(mockPause).toHaveBeenCalled();
      expect(mockAudioElement.currentTime).toBe(0);
    });

    it('should call audio element methods during song change', () => {
      const initialCallCount = mockPause.mock.calls.length;
      
      // This will trigger the synchronous part of changeSong
      music.changeSong('devil_in_electric_city');
      
      expect(mockPause).toHaveBeenCalledTimes(initialCallCount + 1);
      expect(mockLoad).toHaveBeenCalled();
    });
  });

  describe('Playback Controls', () => {
    it('should play the current song', async () => {
      await music.play();
      expect(mockPlay).toHaveBeenCalled();
    });

    it('should pause the current song', () => {
      music.pause();
      expect(mockPause).toHaveBeenCalled();
    });

    it('should toggle play when paused', async () => {
      mockAudioElement.paused = true;
      await music.togglePlay();
      expect(mockPlay).toHaveBeenCalled();
    });

    it('should toggle pause when playing', async () => {
      mockAudioElement.paused = false;
      await music.togglePlay();
      expect(mockPause).toHaveBeenCalled();
    });
  });

  describe('Volume Controls', () => {
    it('should set volume within valid range', () => {
      music.setVolume(0.5);
      expect(mockAudioElement.volume).toBe(0.5);
    });

    it('should clamp volume to minimum 0', () => {
      music.setVolume(-0.5);
      expect(mockAudioElement.volume).toBe(0);
    });

    it('should clamp volume to maximum 1', () => {
      music.setVolume(1.5);
      expect(mockAudioElement.volume).toBe(1);
    });

    it('should get current volume', () => {
      mockAudioElement.volume = 0.7;
      expect(music.getVolume()).toBe(0.7);
    });
  });

  describe('Cleanup', () => {
    it('should cleanup audio element on destroy', () => {
      music.destroy();
      
      expect(mockPause).toHaveBeenCalled();
      expect(mockAudioElement.src).toBe('');
      expect(mockLoad).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid song IDs gracefully', async () => {
      const changePromise = music.changeSong('nonexistent_song');
      mockAudioElement.simulateLoad();
      await changePromise;
      
      // Should fallback to default song
      expect(music.getCurrentSong()).toBe(songConfig.DEFAULT_SONG_ID);
    });

    it('should handle undefined song ID', async () => {
      const changePromise = music.changeSong(undefined as any);
      mockAudioElement.simulateLoad();
      await changePromise;
      
      expect(music.getCurrentSong()).toBe(songConfig.DEFAULT_SONG_ID);
    });

    it('should handle empty string song ID', async () => {
      const changePromise = music.changeSong('');
      mockAudioElement.simulateLoad();
      await changePromise;
      
      expect(music.getCurrentSong()).toBe(songConfig.DEFAULT_SONG_ID);
    });
  });

  describe('Integration with Song Config', () => {
    it('should use song config to get song details', () => {
      const targetSong = 'devil_in_electric_city';
      const songDetails = songConfig.getSongById(targetSong);
      
      expect(songDetails).toBeDefined();
      expect(songDetails?.id).toBe(targetSong);
      expect(songDetails?.displayName).toBe('Devil in Electric City');
      expect(songDetails?.filename).toBe('devil_in_electric_city.mp3');
    });

    it('should validate song IDs using song config', async () => {
      const validSong = 'yugure_avenue';
      const invalidSong = 'invalid_song';
      
      // Valid song should work
      const validPromise = music.changeSong(validSong);
      mockAudioElement.simulateLoad();
      await validPromise;
      expect(music.getCurrentSong()).toBe(validSong);
      
      // Invalid song should fallback
      const invalidPromise = music.changeSong(invalidSong);
      mockAudioElement.simulateLoad();
      await invalidPromise;
      expect(music.getCurrentSong()).toBe(songConfig.DEFAULT_SONG_ID);
    });
  });

  describe('Storage Integration', () => {
    let createMusicWithStorage: any;

    beforeEach(async () => {
      const musicModule = await import('./music');
      createMusicWithStorage = musicModule.createMusicWithStorage;
    });

    it('should save song selection to storage when changing songs', async () => {
      mockStorageSet.mockResolvedValue(undefined);
      
      const changePromise = music.changeSong('devil_in_electric_city');
      // Wait for event listeners to be set up
      await new Promise(resolve => setTimeout(resolve, 10));
      mockAudioElement.simulateLoad();
      await changePromise;

      expect(mockStorageSet).toHaveBeenCalledWith({
        selectedSong: 'devil_in_electric_city'
      });
    });

    it('should save fallback song to storage when original song fails', async () => {
      mockStorageSet.mockResolvedValue(undefined);
      
      // First change to a non-default song to set up the test
      const initialPromise = music.changeSong('devil_in_electric_city');
      await new Promise(resolve => setTimeout(resolve, 10));
      mockAudioElement.simulateLoad();
      await initialPromise;
      
      // Clear the mock to focus on the fallback behavior
      mockStorageSet.mockClear();
      
      // Now try to change to a different song but simulate loading failure
      const changePromise = music.changeSong('old_futuristic_space');
      await new Promise(resolve => setTimeout(resolve, 10));
      // Simulate error for the song loading, then success for the fallback
      mockAudioElement.simulateError();
      await new Promise(resolve => setTimeout(resolve, 10));
      mockAudioElement.simulateLoad();
      await changePromise;

      expect(mockStorageSet).toHaveBeenCalledWith({
        selectedSong: songConfig.DEFAULT_SONG_ID
      });
    });

    it('should handle storage save errors gracefully', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockStorageSet.mockRejectedValue(new Error('Storage error'));

      const changePromise = music.changeSong('devil_in_electric_city');
      await new Promise(resolve => setTimeout(resolve, 10));
      mockAudioElement.simulateLoad();
      
      // Should not throw despite storage error
      await expect(changePromise).resolves.toBeUndefined();
      
      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('should initialize from storage with stored song preference', async () => {
      mockStorageGet.mockResolvedValue({ selectedSong: 'devil_in_electric_city' });

      const musicPromise = createMusicWithStorage();
      // Wait a tick for event listeners to be set up
      await new Promise(resolve => setTimeout(resolve, 0));
      mockAudioElement.simulateLoad();
      const musicInstance = await musicPromise;

      expect(mockStorageGet).toHaveBeenCalledWith(['selectedSong']);
      expect(musicInstance.getCurrentSong()).toBe('devil_in_electric_city');
    });

    it('should use default song when no storage preference exists', async () => {
      mockStorageGet.mockResolvedValue({});

      const musicInstance = await createMusicWithStorage();

      expect(musicInstance.getCurrentSong()).toBe(songConfig.DEFAULT_SONG_ID);
    });

    it('should fallback to default when stored song is invalid', async () => {
      mockStorageGet.mockResolvedValue({ selectedSong: 'invalid_song' });

      const musicInstance = await createMusicWithStorage();

      expect(musicInstance.getCurrentSong()).toBe(songConfig.DEFAULT_SONG_ID);
    });

    it('should handle storage load errors gracefully', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockStorageGet.mockRejectedValue(new Error('Storage error'));

      const musicInstance = await createMusicWithStorage();

      expect(musicInstance.getCurrentSong()).toBe(songConfig.DEFAULT_SONG_ID);
      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('should not initialize from storage when initial song is provided', async () => {
      mockStorageGet.mockResolvedValue({ selectedSong: 'devil_in_electric_city' });

      const musicInstance = await createMusicWithStorage('devil_in_electric_city');

      // Should use provided song, not storage
      expect(musicInstance.getCurrentSong()).toBe('devil_in_electric_city');
      // Storage should not be queried when initial song is provided
      expect(mockStorageGet).not.toHaveBeenCalled();
    });

    it('should call initializeFromStorage method correctly', async () => {
      mockStorageGet.mockResolvedValue({ selectedSong: 'yugure_avenue' });

      const musicInstance = new (await import('./music')).Music();
      const initSpy = vi.spyOn(musicInstance, 'initializeFromStorage');

      await musicInstance.initializeFromStorage();

      expect(initSpy).toHaveBeenCalled();
      expect(mockStorageGet).toHaveBeenCalledWith(['selectedSong']);
    });
  });
});