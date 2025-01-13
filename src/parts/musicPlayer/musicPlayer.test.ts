import { describe, expect, test, vi } from "vitest";
import { toggle, isPlaying } from "./musicPlayer";

const { mockAudio } = vi.hoisted(() => {
    return {
        mockAudio: document.createElement("audio"),
    };
});

vi.mock("./music", () => ({
    default: mockAudio,
}));

describe("Toggle function", () => {
    test("should play music when paused", () => {
        const spyOnPlay = vi.spyOn(mockAudio, "play");
        mockAudio.pause();
        toggle();
        // Asserting that an async function `play()` has been called because we do not have to consider what it actually does behind the scenes.
        expect(spyOnPlay).toHaveBeenCalledOnce();
    });

    test("should pause music when playing", () => {
        mockAudio.play();
        toggle();
        expect(isPlaying).toBeFalsy();
    });
});
