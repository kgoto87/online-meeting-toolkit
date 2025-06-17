import { beforeEach, describe, expect, test, vi } from "vitest";
import { makeDecrementButton } from "./decrementButton";
import { HOLD_INTERVAL_MS } from "./constants";

describe("makeDecrementButton", () => {
    const { mockState } = vi.hoisted(() => {
        return {
            mockState: {
                isRunning: false,
            },
        };
    });
    vi.mock("../../../state", () => ({
        state: mockState,
    }));

    beforeEach(() => {
        vi.resetModules();
        vi.useFakeTimers(); // Add this line
    });

    test("make a decrement button", () => {
        const mockInput = document.createElement("input");
        const mockParams = { min: 0, max: 10, step: 1 };
        mockInput.value = "0";
        const incrementButton = makeDecrementButton(mockInput, mockParams);
        expect(incrementButton.innerText).toBe("-");
    });

    describe("holding the button", () => {
        test("decrements value on mousedown and continues while held", () => {
            mockState.isRunning = false;
            const mockInput = document.createElement("input");
            const mockParams = { min: 0, max: 10, step: 1 };
            mockInput.value = "10";
            const decrementButton = makeDecrementButton(mockInput, mockParams);

            // Simulate mousedown
            decrementButton.dispatchEvent(new MouseEvent("mousedown"));
            expect(mockInput.value).toBe("9"); // Decremented once immediately

            // Advance timers to simulate holding the button
            vi.advanceTimersByTime(HOLD_INTERVAL_MS);
            expect(mockInput.value).toBe("8");
            vi.advanceTimersByTime(HOLD_INTERVAL_MS * 2);
            expect(mockInput.value).toBe("6");

            // Simulate mouseup
            decrementButton.dispatchEvent(new MouseEvent("mouseup"));
            vi.advanceTimersByTime(HOLD_INTERVAL_MS); // Should not decrement further
            expect(mockInput.value).toBe("6");
        });

        test("stops decrementing on mouseleave", () => {
            mockState.isRunning = false;
            const mockInput = document.createElement("input");
            const mockParams = { min: 0, max: 10, step: 1 };
            mockInput.value = "10";
            const decrementButton = makeDecrementButton(mockInput, mockParams);

            decrementButton.dispatchEvent(new MouseEvent("mousedown"));
            expect(mockInput.value).toBe("9");

            vi.advanceTimersByTime(HOLD_INTERVAL_MS);
            expect(mockInput.value).toBe("8");

            decrementButton.dispatchEvent(new MouseEvent("mouseleave"));
            vi.advanceTimersByTime(HOLD_INTERVAL_MS); // Should not decrement further
            expect(mockInput.value).toBe("8");
        });

        test("does not decrement if state.isRunning is true on mousedown", () => {
            mockState.isRunning = true;
            const mockInput = document.createElement("input");
            const mockParams = { min: 0, max: 10, step: 1 };
            mockInput.value = "5";
            const decrementButton = makeDecrementButton(mockInput, mockParams);

            decrementButton.dispatchEvent(new MouseEvent("mousedown"));
            expect(mockInput.value).toBe("5");

            vi.advanceTimersByTime(HOLD_INTERVAL_MS);
            expect(mockInput.value).toBe("5");
        });

        test("stops decrementing if min is reached", () => {
            mockState.isRunning = false;
            const mockInput = document.createElement("input");
            const mockParams = { min: 8, max: 10, step: 1 }; // Min is 8
            mockInput.value = "10";
            const decrementButton = makeDecrementButton(mockInput, mockParams);

            decrementButton.dispatchEvent(new MouseEvent("mousedown"));
            expect(mockInput.value).toBe("9");

            vi.advanceTimersByTime(HOLD_INTERVAL_MS);
            expect(mockInput.value).toBe("8"); // Reached min

            vi.advanceTimersByTime(HOLD_INTERVAL_MS); // Should not decrement further
            expect(mockInput.value).toBe("8");

            decrementButton.dispatchEvent(new MouseEvent("mouseup"));
        });
    });
});
