import { describe, expect, test, vi } from "vitest";
import { createStartButton } from "./startButton";
import { state } from "../../state";
import se from "./soundEffect";

vi.mock("./soundEffect", () => ({
    default: {
        play: vi.fn(),
    },
}));

vi.mock("./timerConfig", () => ({
    interval: 10,
}));

describe("a stopped startButton", function () {
    state.isRunning = false;
    state.isPaused = false;

    const mockMinutes = document.createElement("input");
    mockMinutes.value = "1";
    const mockSeconds = document.createElement("input");
    mockSeconds.value = "0";

    const button = createStartButton(mockMinutes, mockSeconds);

    button.click();

    test("should start", async function () {
        expect(state.isRunning).toBeTruthy();
        expect(state.initialTime).toEqual({ minutes: 1, seconds: 0 });
        expect(mockMinutes.disabled).toBeTruthy();
        expect(mockSeconds.disabled).toBeTruthy();
        expect(button.innerText).toBe("Stop");
    });

    test("should count down to zero", async function () {
        await vi.waitFor(
            function () {
                expect(mockMinutes.value).toBe("0");
                expect(mockSeconds.value).toBe("0");
            },
            { timeout: 660, interval: 10 }
        );
        expect(vi.mocked(se.play)).toBeCalled();
        expect(state.isRunning).toBeFalsy();
    });

    test("should reset the timer to its initial time when finished", async function () {
        await vi.waitFor(
            function () {
                expect(mockMinutes.value).toBe("1");
                expect(mockSeconds.value).toBe("0");
            },
            { timeout: 100, interval: 10 }
        );
    });
});

describe("a running startButton", function () {
    const mockMinutes = document.createElement("input");
    mockMinutes.value = "1";
    const mockSeconds = document.createElement("input");
    mockSeconds.value = "0";

    state.initialTime = { minutes: 1, seconds: 0 };

    const button = createStartButton(mockMinutes, mockSeconds);

    test("should pause", function () {
        state.isRunning = true;

        button.click();

        expect(state.isRunning).toBeFalsy();
        expect(state.isPaused).toBeTruthy();
        expect(mockMinutes.disabled).toBeFalsy();
        expect(mockSeconds.disabled).toBeFalsy();
        expect(button.innerText).toBe("Start");
    });
});
