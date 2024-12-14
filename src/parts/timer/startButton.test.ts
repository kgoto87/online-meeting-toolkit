import { describe, expect, test, vi } from "vitest";
import { createStartButton } from "./startButton";
import { setInitialTime, setIsPaused, setIsRunning } from "../../state";
import se from "./soundEffect";

const { mockState } = vi.hoisted(() => {
    return {
        mockState: {
            isRunning: false,
            initialTime: {
                minutes: 0,
                seconds: 0,
            },
            isPaused: false,
        },
    };
});

vi.mock("../../state", () => ({
    state: mockState,
    setIsRunning: vi.fn(),
    setIsPaused: vi.fn(),
    setInitialTime: vi.fn(),
}));

vi.mock("./soundEffect", () => ({
    default: {
        play: vi.fn(),
    },
}));

vi.mock("./timerConfig", () => ({
    interval: 10,
}));

describe("startButton", function () {
    mockState.isRunning = false;
    mockState.isPaused = false;
    mockState.initialTime = {
        minutes: 1,
        seconds: 0,
    };

    const mockMinutes = document.createElement("input");
    mockMinutes.value = "1";
    const mockSeconds = document.createElement("input");
    mockSeconds.value = "0";

    const button = createStartButton(mockMinutes, mockSeconds);

    button.click();

    test("should start when not running", async function () {
        expect(vi.mocked(setIsRunning)).toBeCalledWith(true);
        expect(vi.mocked(setInitialTime)).toBeCalledWith(1, 0);
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
        expect(vi.mocked(setIsRunning)).toBeCalledWith(false);
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

describe("startButton", function () {
    test("should pause when running", function () {
        mockState.isRunning = true;

        const mockMinutes = document.createElement("input");
        const mockSeconds = document.createElement("input");

        const button = createStartButton(mockMinutes, mockSeconds);

        button.click();

        expect(vi.mocked(setIsRunning)).toBeCalledWith(false);
        expect(vi.mocked(setIsPaused)).toBeCalledWith(true);
        expect(mockMinutes.disabled).toBeFalsy();
        expect(mockSeconds.disabled).toBeFalsy();
        expect(button.innerText).toBe("Start");
    });
});
