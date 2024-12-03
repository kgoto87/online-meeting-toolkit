import { expect, test, vi } from "vitest";
import { createStartButton } from "./startButton";
import { setIsRunning } from "../../state";
import se from "./soundEffect";

const { mockState } = vi.hoisted(() => {
    return {
        mockState: {
            isRunning: false,
        },
    };
});

vi.mock("../../state", () => ({
    state: mockState,
    setIsRunning: vi.fn(),
}));

vi.mock("./soundEffect", () => ({
    default: {
        play: vi.fn(),
    },
}));

vi.mock("./timerConfig", () => ({
    interval: 10,
}));

test("should start when not running", async function () {
    mockState.isRunning = false;

    const mockMinutes = document.createElement("input");
    mockMinutes.value = "1";
    const mockSeconds = document.createElement("input");
    mockSeconds.value = "0";

    const button = createStartButton(mockMinutes, mockSeconds);

    button.click();

    expect(vi.mocked(setIsRunning)).toBeCalledWith(true);
    expect(mockMinutes.disabled).toBeTruthy();
    expect(mockSeconds.disabled).toBeTruthy();
    expect(button.innerText).toBe("Stop");
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

test("should stop when running", function () {
    mockState.isRunning = true;

    const mockMinutes = document.createElement("input");
    const mockSeconds = document.createElement("input");

    const button = createStartButton(mockMinutes, mockSeconds);

    button.click();

    expect(vi.mocked(setIsRunning)).toBeCalledWith(false);
    expect(mockMinutes.disabled).toBeFalsy();
    expect(mockSeconds.disabled).toBeFalsy();
    expect(button.innerText).toBe("Start");
});
