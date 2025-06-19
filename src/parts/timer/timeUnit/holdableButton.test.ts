import { beforeEach, describe, expect, test, vi } from "vitest";
// Import the new functions to test them directly
import { makeIncrementButton, makeDecrementButton } from "./holdableButton"; // Updated import names
import { HOLD_INTERVAL_MS } from "./constants";
import { timeParams } from "./types/timeParams";

// Define Operation type locally for the test file
type Operation = "increment" | "decrement";

// Common setup for both button types
const setupTest = (initialValue: string, operation: "increment" | "decrement") => {
    const mockInput = document.createElement("input");
    mockInput.value = initialValue;
    const mockParams: timeParams = { min: 0, max: 10, step: 1 };

    // Mock dispatchEvent for input and document
    mockInput.dispatchEvent = vi.fn();
    document.dispatchEvent = vi.fn();

    const button = operation === "increment"
        ? makeIncrementButton(mockInput, mockParams) // Updated function name
        : makeDecrementButton(mockInput, mockParams); // Updated function name

    return { mockInput, mockParams, button };
};

describe("Holdable Buttons", () => {
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
        vi.useFakeTimers();
        mockState.isRunning = false;
    });

    describe("makeIncrementButton", () => { // Updated describe block
        test("creates a button with '+' text", () => {
            const { button } = setupTest("5", "increment");
            expect(button.innerText).toBe("+");
        });

        test("increments value on mousedown and continues while held", () => {
            const { mockInput, button } = setupTest("0", "increment");
            button.dispatchEvent(new MouseEvent("mousedown"));
            expect(mockInput.value).toBe("1");

            vi.advanceTimersByTime(HOLD_INTERVAL_MS);
            expect(mockInput.value).toBe("2");

            vi.advanceTimersByTime(HOLD_INTERVAL_MS * 2);
            expect(mockInput.value).toBe("4");
            expect(mockInput.dispatchEvent).toHaveBeenCalledWith(new Event("change"));
            expect(document.dispatchEvent).toHaveBeenCalledWith(new Event("change-time"));
        });

        test("stops incrementing if max is reached", () => {
            const { mockInput, button, mockParams } = setupTest("9", "increment"); // Start near max
            button.dispatchEvent(new MouseEvent("mousedown")); // value becomes 10 (max)
            expect(mockInput.value).toBe(mockParams.max.toString());

            vi.advanceTimersByTime(HOLD_INTERVAL_MS);
            expect(mockInput.value).toBe(mockParams.max.toString()); // Should not increment further
        });
    });

    describe("makeDecrementButton", () => { // Updated describe block
        test("creates a button with '-' text", () => {
            const { button } = setupTest("5", "decrement");
            expect(button.innerText).toBe("-");
        });

        test("decrements value on mousedown and continues while held", () => {
            const { mockInput, button } = setupTest("10", "decrement");
            button.dispatchEvent(new MouseEvent("mousedown"));
            expect(mockInput.value).toBe("9");

            vi.advanceTimersByTime(HOLD_INTERVAL_MS);
            expect(mockInput.value).toBe("8");

            vi.advanceTimersByTime(HOLD_INTERVAL_MS * 2);
            expect(mockInput.value).toBe("6");
            expect(mockInput.dispatchEvent).toHaveBeenCalledWith(new Event("change"));
            expect(document.dispatchEvent).toHaveBeenCalledWith(new Event("change-time"));
        });

        test("stops decrementing if min is reached", () => {
            const { mockInput, button, mockParams } = setupTest("1", "decrement"); // Start near min
            button.dispatchEvent(new MouseEvent("mousedown")); // value becomes 0 (min)
            expect(mockInput.value).toBe(mockParams.min.toString());

            vi.advanceTimersByTime(HOLD_INTERVAL_MS);
            expect(mockInput.value).toBe(mockParams.min.toString()); // Should not decrement further
        });
    });

    // Common tests for both button types (mouseup, mouseleave, isRunning)
    describe("Common Holdable Button Behavior", () => {
        const operations: Operation[] = ["increment", "decrement"];
        operations.forEach(op => {
            const initialVal = op === "increment" ? "5" : "5";

            test(`[${op}] stops performing update on mouseup`, () => {
                const { mockInput, button } = setupTest(initialVal, op);
                button.dispatchEvent(new MouseEvent("mousedown"));
                const valueAfterMouseDown = mockInput.value;

                vi.advanceTimersByTime(HOLD_INTERVAL_MS);
                const valueAfterInterval = mockInput.value;
                expect(valueAfterInterval).not.toBe(valueAfterMouseDown); // Ensure it changed

                button.dispatchEvent(new MouseEvent("mouseup"));
                vi.advanceTimersByTime(HOLD_INTERVAL_MS * 5);
                expect(mockInput.value).toBe(valueAfterInterval);
            });

            test(`[${op}] stops performing update on mouseleave`, () => {
                const { mockInput, button } = setupTest(initialVal, op);
                button.dispatchEvent(new MouseEvent("mousedown"));
                const valueAfterMouseDown = mockInput.value;

                vi.advanceTimersByTime(HOLD_INTERVAL_MS);
                const valueAfterInterval = mockInput.value;
                expect(valueAfterInterval).not.toBe(valueAfterMouseDown);

                button.dispatchEvent(new MouseEvent("mouseleave"));
                vi.advanceTimersByTime(HOLD_INTERVAL_MS * 5);
                expect(mockInput.value).toBe(valueAfterInterval);
            });

            test(`[${op}] does not perform update if state.isRunning is true`, () => {
                mockState.isRunning = true;
                const { mockInput, button } = setupTest(initialVal, op);
                button.dispatchEvent(new MouseEvent("mousedown"));
                expect(mockInput.value).toBe(initialVal);
                vi.advanceTimersByTime(HOLD_INTERVAL_MS * 2);
                expect(mockInput.value).toBe(initialVal);
            });
        });
    });
});
