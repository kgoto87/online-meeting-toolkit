import { beforeEach, describe, expect, test, vi } from "vitest";
import { makeIncrementButton, makeDecrementButton } from "./holdableButton";
import { HOLD_INTERVAL_MS } from "./constants";
import { timeParams } from "./types/timeParams";

// Common setup for both button types
const setupTest = (initialValue: string, operation: "increment" | "decrement") => {
    const mockInput = document.createElement("input");
    mockInput.value = initialValue;
    const mockParams: timeParams = { min: 0, max: 10, step: 1 };

    mockInput.dispatchEvent = vi.fn();
    document.dispatchEvent = vi.fn();

    const button = operation === "increment"
        ? makeIncrementButton(mockInput, mockParams)
        : makeDecrementButton(mockInput, mockParams);

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

    describe("makeIncrementButton", () => {
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
            const { mockInput, button, mockParams } = setupTest("9", "increment");
            button.dispatchEvent(new MouseEvent("mousedown"));
            expect(mockInput.value).toBe(mockParams.max.toString());

            vi.advanceTimersByTime(HOLD_INTERVAL_MS);
            expect(mockInput.value).toBe(mockParams.max.toString());
        });
    });

    describe("makeDecrementButton", () => {
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
            const { mockInput, button, mockParams } = setupTest("1", "decrement");
            button.dispatchEvent(new MouseEvent("mousedown"));
            expect(mockInput.value).toBe(mockParams.min.toString());

            vi.advanceTimersByTime(HOLD_INTERVAL_MS);
            expect(mockInput.value).toBe(mockParams.min.toString());
        });
    });

    describe("Common Holdable Button Behavior", () => {
        const operations: ("increment" | "decrement")[] = ["increment", "decrement"];
        operations.forEach(op => {
            const initialVal = "5";

            test(`[${op}] stops performing update on mouseup`, () => {
                const { mockInput, button } = setupTest(initialVal, op);
                button.dispatchEvent(new MouseEvent("mousedown"));
                const valueAfterMouseDown = mockInput.value;

                vi.advanceTimersByTime(HOLD_INTERVAL_MS);
                const valueAfterInterval = mockInput.value;
                expect(valueAfterInterval).not.toBe(valueAfterMouseDown);

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
