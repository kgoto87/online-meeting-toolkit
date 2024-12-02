import { expect, test, vi } from "vitest";
import { createStartButton } from "./startButton";
import { setIsRunning } from "../../state";

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
    play: vi.fn(),
}));

test("should start when not running", function () {
    mockState.isRunning = false;

    const mockMinutes = document.createElement("input");
    const mockSeconds = document.createElement("input");

    const button = createStartButton(mockMinutes, mockSeconds);

    button.click();

    expect(vi.mocked(setIsRunning)).toBeCalledWith(true);
});

test("should stop when running", function () {
    mockState.isRunning = true;

    const mockMinutes = document.createElement("input");
    const mockSeconds = document.createElement("input");

    const button = createStartButton(mockMinutes, mockSeconds);

    button.click();

    expect(vi.mocked(setIsRunning)).toBeCalledWith(false);
});
