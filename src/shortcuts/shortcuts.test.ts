import { beforeEach, describe, expect, test, vi } from "vitest";
import "./shortcuts";
import userEvent from "@testing-library/user-event";
import { togglePlay } from "../parts/musicPlayer/musicPlayer";

vi.mock("../parts/musicPlayer/musicPlayer", () => {
    return {
        togglePlay: vi.fn(),
    };
});

describe("Keyboard Shortcut", function () {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test("should handle Control+Shift+A keyboard shortcut", async () => {
        const user = userEvent.setup();

        await user.keyboard("{Control>}{Shift>}a{/Shift}{/Control}");

        expect(vi.mocked(togglePlay)).toHaveBeenCalled();
    });

    test("should not handle Control+Shift+S+A keyboard shortcut", async () => {
        const user = userEvent.setup();

        await user.keyboard("{Control>}{Shift>}{s>}a{/s}{/Shift}{/Control}");

        expect(vi.mocked(togglePlay)).toHaveBeenCalledTimes(0);
    });
});
