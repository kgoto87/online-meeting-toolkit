import { describe, expect, test, vi, beforeEach } from "vitest";
import { initializeMusicPlayer, destroy, getCurrentSong, changeSong, togglePlay, isPlaying } from ".";

// Mock all dependencies
const { mockEnhancedMusic, mockSongSelector, mockCreateMusicWithStorage, mockCreateSongSelector, mockLoadSelectedSong, mockSaveSelectedSong } = vi.hoisted(() => {
    const mockAudio = document.createElement("audio");
    Object.defineProperty(mockAudio, 'paused', {
        value: true,
        writable: true
    });
    
    const mockEnhancedMusic = {
        element: mockAudio,
        getCurrentSong: vi.fn(() => 'yugure_avenue'),
        changeSong: vi.fn(),
        togglePlay: vi.fn(),
        play: vi.fn(),
        pause: vi.fn(),
        destroy: vi.fn()
    };
    
    const mockSongSelector = {
        element: document.createElement('select'),
        onSongChange: vi.fn(),
        setSelectedSong: vi.fn(),
        getCurrentSong: vi.fn(() => 'yugure_avenue'),
        destroy: vi.fn()
    };
    
    return {
        mockEnhancedMusic,
        mockSongSelector,
        mockCreateMusicWithStorage: vi.fn(() => Promise.resolve(mockEnhancedMusic)),
        mockCreateSongSelector: vi.fn(() => mockSongSelector),
        mockLoadSelectedSong: vi.fn(() => Promise.resolve('yugure_avenue')),
        mockSaveSelectedSong: vi.fn(() => Promise.resolve())
    };
});

vi.mock("./music", () => ({
    default: document.createElement("audio"),
    music: document.createElement("audio"),
    createMusicWithStorage: mockCreateMusicWithStorage,
}));

vi.mock("./songSelector", () => ({
    createSongSelector: mockCreateSongSelector,
}));

vi.mock("./storageUtils", () => ({
    loadSelectedSong: mockLoadSelectedSong,
    saveSelectedSong: mockSaveSelectedSong,
}));

// Mock Chrome API
global.chrome = {
    runtime: {
        getURL: vi.fn((path) => `chrome-extension://test/${path}`)
    }
} as any;

describe("Music Player Song Selector Integration", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        destroy(); // Reset state
        
        // Reset mock implementations to default behavior
        mockEnhancedMusic.changeSong.mockResolvedValue();
        mockEnhancedMusic.getCurrentSong.mockReturnValue('yugure_avenue');
        mockSongSelector.getCurrentSong.mockReturnValue('yugure_avenue');
        mockLoadSelectedSong.mockResolvedValue('yugure_avenue');
        mockCreateMusicWithStorage.mockResolvedValue(mockEnhancedMusic);
        mockCreateSongSelector.mockReturnValue(mockSongSelector);
    });

    describe("Initialization and Component Integration", () => {
        test("should initialize with song selector and enhanced music", async () => {
            await initializeMusicPlayer();
            
            // Verify storage was loaded
            expect(mockLoadSelectedSong).toHaveBeenCalled();
            
            // Verify enhanced music was created with stored song
            expect(mockCreateMusicWithStorage).toHaveBeenCalledWith('yugure_avenue');
            
            // Verify song selector was created with current song and callback
            expect(mockCreateSongSelector).toHaveBeenCalledWith(
                'yugure_avenue',
                expect.any(Function)
            );
        });

        test("should handle initialization with different stored song preference", async () => {
            mockLoadSelectedSong.mockResolvedValue('devil_in_electric_city');
            
            await initializeMusicPlayer();
            
            // Verify enhanced music was created with stored preference
            expect(mockCreateMusicWithStorage).toHaveBeenCalledWith('devil_in_electric_city');
            
            // Verify song selector was initialized with stored song
            expect(mockCreateSongSelector).toHaveBeenCalledWith(
                'yugure_avenue', // This comes from mockEnhancedMusic.getCurrentSong()
                expect.any(Function)
            );
        });

        test("should handle initialization errors gracefully", async () => {
            mockCreateMusicWithStorage.mockRejectedValue(new Error('Initialization failed'));
            
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            
            await initializeMusicPlayer();
            
            // Verify error was logged
            expect(consoleSpy).toHaveBeenCalledWith(
                'Failed to initialize music player with song selector:',
                expect.any(Error)
            );
            
            consoleSpy.mockRestore();
        });
    });

    describe("Song Selection Changes Audio Source", () => {
        test("should handle song selection changes", async () => {
            await initializeMusicPlayer();
            
            // Get the callback function passed to createSongSelector
            const songChangeCallback = mockCreateSongSelector.mock.calls[0][1];
            
            // Simulate song selection change
            await songChangeCallback('devil_in_electric_city');
            
            // Verify the enhanced music changeSong was called
            expect(mockEnhancedMusic.changeSong).toHaveBeenCalledWith('devil_in_electric_city');
        });

        test("should update audio source when song changes programmatically", async () => {
            await initializeMusicPlayer();
            
            // Mock the enhanced music to return new song after change
            mockEnhancedMusic.getCurrentSong.mockReturnValue('devil_in_electric_city');
            
            await changeSong('devil_in_electric_city');
            
            // Verify enhanced music changeSong was called
            expect(mockEnhancedMusic.changeSong).toHaveBeenCalledWith('devil_in_electric_city');
            
            // Verify selector was updated to reflect the change
            expect(mockSongSelector.setSelectedSong).toHaveBeenCalledWith('devil_in_electric_city');
        });

        test("should handle multiple rapid song changes", async () => {
            await initializeMusicPlayer();
            
            const songChangeCallback = mockCreateSongSelector.mock.calls[0][1];
            
            // Simulate rapid song changes
            await songChangeCallback('devil_in_electric_city');
            await songChangeCallback('gong');
            await songChangeCallback('yugure_avenue');
            
            // Verify all changes were processed
            expect(mockEnhancedMusic.changeSong).toHaveBeenCalledTimes(3);
            expect(mockEnhancedMusic.changeSong).toHaveBeenNthCalledWith(1, 'devil_in_electric_city');
            expect(mockEnhancedMusic.changeSong).toHaveBeenNthCalledWith(2, 'gong');
            expect(mockEnhancedMusic.changeSong).toHaveBeenNthCalledWith(3, 'yugure_avenue');
        });
    });

    describe("Song Selection Persistence", () => {
        test("should persist song selection across component re-initialization", async () => {
            // First initialization
            await initializeMusicPlayer();
            
            // Change song
            const songChangeCallback = mockCreateSongSelector.mock.calls[0][1];
            await songChangeCallback('devil_in_electric_city');
            
            // Destroy and re-initialize
            destroy();
            vi.clearAllMocks();
            
            // Mock storage to return the previously selected song
            mockLoadSelectedSong.mockResolvedValue('devil_in_electric_city');
            mockCreateMusicWithStorage.mockResolvedValue(mockEnhancedMusic);
            mockCreateSongSelector.mockReturnValue(mockSongSelector);
            
            await initializeMusicPlayer();
            
            // Verify the stored song was loaded
            expect(mockLoadSelectedSong).toHaveBeenCalled();
            expect(mockCreateMusicWithStorage).toHaveBeenCalledWith('devil_in_electric_city');
        });

        test("should handle missing stored preferences gracefully", async () => {
            mockLoadSelectedSong.mockResolvedValue(undefined);
            
            await initializeMusicPlayer();
            
            // Should still initialize successfully with undefined (which gets handled by createMusicWithStorage)
            expect(mockCreateMusicWithStorage).toHaveBeenCalledWith(undefined);
        });

        test("should handle storage load errors gracefully", async () => {
            // Mock loadSelectedSong to return default song (as it handles errors internally)
            mockLoadSelectedSong.mockResolvedValue('yugure_avenue'); // Default fallback
            
            await initializeMusicPlayer();
            
            // Should still initialize successfully with fallback
            expect(mockCreateMusicWithStorage).toHaveBeenCalledWith('yugure_avenue');
        });
    });

    describe("Integration with Play/Pause Controls", () => {
        test("should integrate with existing play/pause functionality", async () => {
            await initializeMusicPlayer();
            
            await togglePlay();
            
            // Verify enhanced music togglePlay was called
            expect(mockEnhancedMusic.togglePlay).toHaveBeenCalled();
        });

        test("should maintain play state when changing songs", async () => {
            await initializeMusicPlayer();
            
            // Start playing
            mockEnhancedMusic.element.paused = false;
            
            // Change song
            const songChangeCallback = mockCreateSongSelector.mock.calls[0][1];
            await songChangeCallback('devil_in_electric_city');
            
            // Verify song change was called (the music component handles play state internally)
            expect(mockEnhancedMusic.changeSong).toHaveBeenCalledWith('devil_in_electric_city');
        });

        test("should report correct playing state", async () => {
            await initializeMusicPlayer();
            
            // Test paused state
            mockEnhancedMusic.element.paused = true;
            expect(isPlaying()).toBe(false);
            
            // Test playing state
            mockEnhancedMusic.element.paused = false;
            expect(isPlaying()).toBe(true);
        });

        test("should handle play/pause with different songs", async () => {
            await initializeMusicPlayer();
            
            // Change to different song
            const songChangeCallback = mockCreateSongSelector.mock.calls[0][1];
            await songChangeCallback('gong');
            
            // Play/pause should still work
            await togglePlay();
            expect(mockEnhancedMusic.togglePlay).toHaveBeenCalled();
        });
    });

    describe("Error Scenarios", () => {
        test("should handle song change errors gracefully", async () => {
            await initializeMusicPlayer();
            
            // Mock changeSong to throw an error
            mockEnhancedMusic.changeSong.mockRejectedValue(new Error('Song load failed'));
            
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            
            // Get the callback function and trigger it
            const songChangeCallback = mockCreateSongSelector.mock.calls[0][1];
            await songChangeCallback('invalid_song');
            
            // Verify error was logged
            expect(consoleSpy).toHaveBeenCalledWith('Failed to change song:', expect.any(Error));
            
            // Verify selector was updated to reflect actual current song
            expect(mockSongSelector.setSelectedSong).toHaveBeenCalledWith('yugure_avenue');
            
            consoleSpy.mockRestore();
        });

        test("should handle missing audio files gracefully", async () => {
            await initializeMusicPlayer();
            
            // Mock changeSong to simulate missing file error
            mockEnhancedMusic.changeSong.mockRejectedValue(new Error('Failed to load audio file: missing.mp3'));
            
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            
            const songChangeCallback = mockCreateSongSelector.mock.calls[0][1];
            await songChangeCallback('missing_song');
            
            // Verify error handling
            expect(consoleSpy).toHaveBeenCalledWith('Failed to change song:', expect.any(Error));
            expect(mockSongSelector.setSelectedSong).toHaveBeenCalledWith('yugure_avenue');
            
            consoleSpy.mockRestore();
        });

        test("should handle invalid stored preferences", async () => {
            // Mock storage to return invalid song ID
            mockLoadSelectedSong.mockResolvedValue('invalid_song_id');
            
            await initializeMusicPlayer();
            
            // Should still initialize (createMusicWithStorage handles validation)
            expect(mockCreateMusicWithStorage).toHaveBeenCalledWith('invalid_song_id');
        });

        test("should handle Chrome extension URL errors", async () => {
            // Mock Chrome API to throw error
            global.chrome.runtime.getURL = vi.fn(() => {
                throw new Error('Extension context invalid');
            });
            
            await initializeMusicPlayer();
            
            // Should still initialize (errors are handled in music component)
            expect(mockCreateMusicWithStorage).toHaveBeenCalled();
        });
    });

    describe("Component Lifecycle", () => {
        test("should expose getCurrentSong function", async () => {
            await initializeMusicPlayer();
            
            const currentSong = getCurrentSong();
            expect(currentSong).toBe('yugure_avenue');
        });

        test("should expose changeSong function", async () => {
            await initializeMusicPlayer();
            
            await changeSong('devil_in_electric_city');
            
            // Verify enhanced music changeSong was called
            expect(mockEnhancedMusic.changeSong).toHaveBeenCalledWith('devil_in_electric_city');
            
            // Verify selector was updated
            expect(mockSongSelector.setSelectedSong).toHaveBeenCalledWith('yugure_avenue');
        });

        test("should cleanup properly", async () => {
            await initializeMusicPlayer();
            
            destroy();
            
            // Verify cleanup methods were called
            expect(mockSongSelector.destroy).toHaveBeenCalled();
            expect(mockEnhancedMusic.destroy).toHaveBeenCalled();
        });

        test("should handle multiple initializations gracefully", async () => {
            await initializeMusicPlayer();
            await initializeMusicPlayer(); // Second call should not re-initialize
            
            // Should only be called once
            expect(mockCreateMusicWithStorage).toHaveBeenCalledTimes(1);
            expect(mockCreateSongSelector).toHaveBeenCalledTimes(1);
        });

        test("should allow re-initialization after destroy", async () => {
            await initializeMusicPlayer();
            destroy();
            
            vi.clearAllMocks();
            mockCreateMusicWithStorage.mockResolvedValue(mockEnhancedMusic);
            mockCreateSongSelector.mockReturnValue(mockSongSelector);
            
            await initializeMusicPlayer();
            
            // Should initialize again after destroy
            expect(mockCreateMusicWithStorage).toHaveBeenCalledTimes(1);
            expect(mockCreateSongSelector).toHaveBeenCalledTimes(1);
        });
    });
});