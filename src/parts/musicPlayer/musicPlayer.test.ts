import { describe, expect, test, vi } from "vitest";
import { togglePlay, isPlaying } from ".";

const { mockAudio } = vi.hoisted(() => {
    return {
        mockAudio: document.createElement("audio"),
    };
});

vi.mock("./music", () => ({
    default: mockAudio,
}));

describe("togglePlay function", () => {
    test("should play music when paused", () => {
        const spyOnPlay = vi.spyOn(mockAudio, "play");
        mockAudio.pause();
        togglePlay();
        // Asserting that an async function `play()` has been called because we do not have to consider what it actually does behind the scenes.
        expect(spyOnPlay).toHaveBeenCalledOnce();
    });

    test("should pause music when playing", () => {
        mockAudio.play();
        togglePlay();
        expect(isPlaying).toBeFalsy();
    });
});
