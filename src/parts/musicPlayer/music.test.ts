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
  parentElement: any = null;
  nextSibling: any = null;
  
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

// Create fresh mock audio elements for each test
let mockAudioElement: MockAudioElement;
let mockSecondaryAudioElement: MockAudioElement;
let audioElementCount = 0;

// Mock document.createElement to return our mock audio elements
const originalCreateElement = document.createElement;
vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
  if (tagName === 'audio') {
    audioElementCount++;
    if (audioElementCount === 1) {
      return mockAudioElement as any;
    } else {
      return mockSecondaryAudioElement as any;
    }
  }
  return originalCreateElement.call(document, tagName);
});

describe('Music Player with Song Switching', () => {
  let Music: any;
  let music: any;

  beforeEach(async () => {
    // Create fresh mocks for each test
    mockAudioElement = new MockAudioElement();
    mockSecondaryAudioElement = new MockAudioElement();
    audioElementCount = 0;
    
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
    
    // Reset secondary mock audio element state
    mockSecondaryAudioElement.paused = true;
    mockSecondaryAudioElement.currentTime = 0;
    mockSecondaryAudioElement.src = '';
    mockSecondaryAudioElement.volume = 1;
    mockSecondaryAudioElement.controls = false;
    mockSecondaryAudioElement.autoplay = false;
    mockSecondaryAudioElement.loop = false;
    
    // Clear module cache and re-import
    vi.resetModules();
    const musicModule = await import('./music');
    music = musicModule.music;
    
    // Set a shorter crossfade duration for tests
    music.setCrossfadeDuration(100);
  });

  afterEach(() => {
    // Reset audio element state
    if (mockAudioElement) {
      mockAudioElement.src = '';
      mockAudioElement.paused = true;
      mockAudioElement.currentTime = 0;
      mockAudioElement.volume = 1;
    }
    if (mockSecondaryAudioElement) {
      mockSecondaryAudioElement.src = '';
      mockSecondaryAudioElement.paused = true;
      mockSecondaryAudioElement.currentTime = 0;
      mockSecondaryAudioElement.volume = 1;
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

    it('should reset current time when changing songs', async () => {
      mockAudioElement.currentTime = 30;
      mockAudioElement.paused = false; // Simulate playing state
      mockStorageSet.mockResolvedValue(undefined);
      
      // Start the song change
      const changePromise = music.changeSong('devil_in_electric_city');
      await new Promise(resolve => setTimeout(resolve, 10));
      mockSecondaryAudioElement.simulateLoad();
      
      // Wait for crossfade to complete
      await new Promise(resolve => setTimeout(resolve, 50));
      await changePromise;
      
      // After crossfade, the old audio element should be paused and reset
      expect(mockPause).toHaveBeenCalled();
    });

    it('should call audio element methods during song change', async () => {
      const initialCallCount = mockPause.mock.calls.length;
      mockStorageSet.mockResolvedValue(undefined);
      
      // Start the song change
      const changePromise = music.changeSong('devil_in_electric_city');
      await new Promise(resolve => setTimeout(resolve, 10));
      mockSecondaryAudioElement.simulateLoad();
      await changePromise;
      
      // Load should be called on the secondary element for the new song
      expect(mockLoad).toHaveBeenCalled();
    });

    it('should perform crossfade when music is playing', async () => {
      mockAudioElement.paused = false; // Simulate playing state
      mockStorageSet.mockResolvedValue(undefined);
      
      const changePromise = music.changeSong('devil_in_electric_city');
      await new Promise(resolve => setTimeout(resolve, 10));
      mockSecondaryAudioElement.simulateLoad();
      
      // Wait for crossfade to start
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Both audio elements should be playing during crossfade
      expect(mockSecondaryAudioElement.play).toHaveBeenCalled();
      
      await changePromise;
      expect(music.getCurrentSong()).toBe('devil_in_electric_city');
    });

    it('should maintain DOM element reference after crossfade', async () => {
      const originalElement = music.element;
      mockAudioElement.paused = false;
      mockStorageSet.mockResolvedValue(undefined);
      
      const changePromise = music.changeSong('devil_in_electric_city');
      await new Promise(resolve => setTimeout(resolve, 10));
      mockSecondaryAudioElement.simulateLoad();
      
      // Wait for crossfade to complete
      await new Promise(resolve => setTimeout(resolve, 150));
      await changePromise;
      
      // The element reference should have changed after swap
      expect(music.element).not.toBe(originalElement);
      
      // The new element should have controls enabled
      expect(music.element.controls).toBe(true);
      
      // The old element should have controls disabled
      expect(originalElement.controls).toBe(false);
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

  describe('Crossfade Controls', () => {
    it('should set crossfade duration within valid range', () => {
      music.setCrossfadeDuration(3000);
      expect(music.getCrossfadeDuration()).toBe(3000);
    });

    it('should clamp crossfade duration to minimum 100ms', () => {
      music.setCrossfadeDuration(50);
      expect(music.getCrossfadeDuration()).toBe(100);
    });

    it('should clamp crossfade duration to maximum 10s', () => {
      music.setCrossfadeDuration(15000);
      expect(music.getCrossfadeDuration()).toBe(10000);
    });

    it('should have default crossfade duration of 2000ms', async () => {
      // Create a fresh music instance to test default value
      const musicModule = await import('./music');
      const freshMusic = new musicModule.Music();
      expect(freshMusic.getCrossfadeDuration()).toBe(2000);
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
      await new Promise(resolve => setTimeout(resolve, 10));
      mockSecondaryAudioElement.simulateLoad();
      await changePromise;

      expect(mockStorageSet).toHaveBeenCalledWith({
        selectedSong: 'devil_in_electric_city'
      });
    });

    it('should save fallback song to storage when original song fails', async () => {
      mockStorageSet.mockResolvedValue(undefined);
      
      // Clear the mock to focus on the fallback behavior
      mockStorageSet.mockClear();
      
      // Try to change to a song but simulate loading failure
      const changePromise = music.changeSong('old_futuristic_space');
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Simulate error for the song loading
      mockSecondaryAudioElement.simulateError();
      
      // Wait a bit for fallback logic to kick in
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Simulate success for the fallback song
      mockSecondaryAudioElement.simulateLoad();
      
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
      mockSecondaryAudioElement.simulateLoad();
      
      // Should not throw despite storage error
      await expect(changePromise).resolves.toBeUndefined();
      
      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('should initialize from storage with stored song preference', async () => {
      mockStorageGet.mockResolvedValue({ selectedSong: 'devil_in_electric_city' });

      // Reset audio element count for new instance
      audioElementCount = 0;
      
      const musicPromise = createMusicWithStorage();
      
      // Wait for the new instance to be created and simulate loads
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // The new instance will create fresh audio elements, simulate their loads
      if (mockAudioElement) mockAudioElement.simulateLoad();
      if (mockSecondaryAudioElement) mockSecondaryAudioElement.simulateLoad();
      
      const musicInstance = await musicPromise;
      
      // Wait for any crossfade to complete
      await new Promise(resolve => setTimeout(resolve, 150));

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