import { beforeEach, describe, expect, test, vi } from "vitest";
import "./shortcuts";
import { togglePlay } from "../parts/musicPlayer";

vi.mock("../parts/musicPlayer", () => {
    return {
        togglePlay: vi.fn(),
    };
});

let { mockEvaluator } = vi.hoisted(() => {
    const mockEvaluator = {
        has: vi.fn(),
        newEvent: vi.fn(),
        removeEvent: vi.fn(),
    };

    return { mockEvaluator };
});

vi.mock("./KeyboardShortcutEvaluator", () => {
    return {
        default: mockEvaluator,
    };
});

describe("Keyboard Shortcut", function () {
    const mockEvent = new KeyboardEvent("keydown", {});

    beforeEach(() => {
        vi.resetAllMocks();
    });

    test("should toggle music status when Control+Shift+A keyboard shortcut are pressed", () => {
        mockEvaluator.has.withImplementation(
            (key: string) => key === "a",
            () => {
                document.dispatchEvent(mockEvent);
                expect(vi.mocked(togglePlay)).toHaveBeenCalled();
            }
        );
    });
});
