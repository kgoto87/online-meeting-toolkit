import { describe, expect, test, vi, beforeEach } from "vitest";
import { togglePlay, isPlaying, initializeMusicPlayer, destroy } from ".";

const { mockAudio, mockMusic, mockEnhancedMusic, mockSongSelector, mockCreateMusicWithStorage, mockCreateSongSelector, mockLoadSelectedSong } = vi.hoisted(() => {
    const mockAudio = document.createElement("audio");
    const mockMusic = mockAudio;
    
    const mockEnhancedMusic = {
        element: mockAudio,
        getCurrentSong: vi.fn(() => 'yugure_avenue'),
        changeSong: vi.fn(),
        togglePlay: vi.fn(),
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
        mockAudio,
        mockMusic,
        mockEnhancedMusic,
        mockSongSelector,
        mockCreateMusicWithStorage: vi.fn(() => Promise.resolve(mockEnhancedMusic)),
        mockCreateSongSelector: vi.fn(() => mockSongSelector),
        mockLoadSelectedSong: vi.fn(() => Promise.resolve('yugure_avenue'))
    };
});

vi.mock("./music", () => ({
    default: mockMusic,
    music: mockMusic,
    createMusicWithStorage: mockCreateMusicWithStorage,
}));

vi.mock("./songSelector", () => ({
    createSongSelector: mockCreateSongSelector,
}));

vi.mock("./storageUtils", () => ({
    loadSelectedSong: mockLoadSelectedSong,
}));

// Mock Chrome API
global.chrome = {
    runtime: {
        getURL: vi.fn((path) => `chrome-extension://test/${path}`)
    }
} as any;

describe("Music Player Integration", () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        
        // Reset the music player state
        destroy();
        
        // Reset audio element state
        Object.defineProperty(mockAudio, 'paused', {
            writable: true,
            value: true
        });
        
        // Initialize the music player for each test
        await initializeMusicPlayer();
    });

    describe("togglePlay function", () => {
        test("should use enhanced music togglePlay when available", async () => {
            await togglePlay();
            expect(mockEnhancedMusic.togglePlay).toHaveBeenCalledOnce();
        });

        test("should handle toggle play errors gracefully", async () => {
            mockEnhancedMusic.togglePlay.mockRejectedValue(new Error('Test error'));
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            
            await togglePlay();
            
            expect(consoleSpy).toHaveBeenCalledWith('Failed to toggle play:', expect.any(Error));
            consoleSpy.mockRestore();
        });
    });

    describe("isPlaying function", () => {
        test("should return correct playing state from enhanced music", () => {
            mockAudio.paused = false;
            expect(isPlaying()).toBe(true);
            
            mockAudio.paused = true;
            expect(isPlaying()).toBe(false);
        });
    });

    describe("initialization", () => {
        test("should initialize with song selector and enhanced music", async () => {
            expect(mockLoadSelectedSong).toHaveBeenCalled();
            expect(mockCreateMusicWithStorage).toHaveBeenCalledWith('yugure_avenue');
            expect(mockCreateSongSelector).toHaveBeenCalledWith(
                'yugure_avenue',
                expect.any(Function)
            );
        });
    });
});
