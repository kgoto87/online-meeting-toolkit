import { beforeEach, describe, expect, test, vi } from "vitest";
import { makeIncrementButton } from "./incrementButton";

describe("makeIncrementButton", () => {
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

    test("make an increment button", () => {
        const mockInput = document.createElement("input");
        const mockParams = { min: 0, max: 10, step: 1 };
        mockInput.value = "0";
        const incrementButton = makeIncrementButton(mockInput, mockParams);
        expect(incrementButton.innerText).toBe("+");
    });

    describe("holding the button", () => {
        test("increments value on mousedown and continues while held", () => {
            mockState.isRunning = false;
            const mockInput = document.createElement("input");
            const mockParams = { min: 0, max: 10, step: 1 };
            mockInput.value = "0";
            const incrementButton = makeIncrementButton(mockInput, mockParams);

            // Simulate mousedown
            incrementButton.dispatchEvent(new MouseEvent("mousedown"));
            expect(mockInput.value).toBe("1"); // Incremented once immediately

            // Advance timers to simulate holding the button
            vi.advanceTimersByTime(150);
            expect(mockInput.value).toBe("2");
            vi.advanceTimersByTime(300); // 150 * 2
            expect(mockInput.value).toBe("4"); // Incremented twice more (total 450ms)

            // Simulate mouseup
            incrementButton.dispatchEvent(new MouseEvent("mouseup"));
            vi.advanceTimersByTime(150); // Should not increment further
            expect(mockInput.value).toBe("4");
        });

        test("stops incrementing on mouseleave", () => {
            mockState.isRunning = false;
            const mockInput = document.createElement("input");
            const mockParams = { min: 0, max: 10, step: 1 };
            mockInput.value = "0";
            const incrementButton = makeIncrementButton(mockInput, mockParams);

            incrementButton.dispatchEvent(new MouseEvent("mousedown"));
            expect(mockInput.value).toBe("1");

            vi.advanceTimersByTime(150);
            expect(mockInput.value).toBe("2");

            incrementButton.dispatchEvent(new MouseEvent("mouseleave"));
            vi.advanceTimersByTime(150); // Should not increment further
            expect(mockInput.value).toBe("2");
        });

        test("does not increment if state.isRunning is true on mousedown", () => {
            mockState.isRunning = true;
            const mockInput = document.createElement("input");
            const mockParams = { min: 0, max: 10, step: 1 };
            mockInput.value = "0";
            const incrementButton = makeIncrementButton(mockInput, mockParams);

            incrementButton.dispatchEvent(new MouseEvent("mousedown"));
            expect(mockInput.value).toBe("0");

            vi.advanceTimersByTime(150);
            expect(mockInput.value).toBe("0");
        });

        test("stops incrementing if max is reached", () => {
            mockState.isRunning = false;
            const mockInput = document.createElement("input");
            const mockParams = { min: 0, max: 2, step: 1 }; // Max is 2
            mockInput.value = "0";
            const incrementButton = makeIncrementButton(mockInput, mockParams);

            incrementButton.dispatchEvent(new MouseEvent("mousedown"));
            expect(mockInput.value).toBe("1");

            vi.advanceTimersByTime(150);
            expect(mockInput.value).toBe("2"); // Reached max

            vi.advanceTimersByTime(150); // Should not increment further
            expect(mockInput.value).toBe("2");

            incrementButton.dispatchEvent(new MouseEvent("mouseup"));
        });
    });
});
