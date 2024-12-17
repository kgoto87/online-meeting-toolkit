import { beforeEach, describe, expect, test, vi } from "vitest";
import { makeDecrementButton } from "./decrementButton";

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
    });

    test("make a decrement button", () => {
        const mockInput = document.createElement("input");
        const mockParams = { min: 0, max: 10, step: 1 };
        mockInput.value = "0";
        const incrementButton = makeDecrementButton(mockInput, mockParams);
        expect(incrementButton.innerText).toBe("-");
    });

    describe("clicking the button", () => {
        test("nothing happens when running", () => {
            mockState.isRunning = true;
            const mockInput = document.createElement("input");
            const mockParams = { min: 0, max: 10, step: 1 };
            mockInput.value = "0";
            const decrementButton = makeDecrementButton(mockInput, mockParams);
            decrementButton.click();
            expect(mockInput.value).toBe("0");
        });

        test("nothing happens when at min", () => {
            mockState.isRunning = false;
            const mockInput = document.createElement("input");
            const mockParams = { min: 0, max: 10, step: 1 };
            mockInput.value = "0";
            const decrementButton = makeDecrementButton(mockInput, mockParams);
            decrementButton.click();
            expect(mockInput.value).toBe("0");
        });

        test("decrement the value", () => {
            let eventDispatched = false;
            document.addEventListener(
                "change-time",
                () => (eventDispatched = true)
            );

            mockState.isRunning = false;
            const mockInput = document.createElement("input");
            const mockParams = { min: 0, max: 10, step: 1 };
            mockInput.value = "5";
            const decrementButton = makeDecrementButton(mockInput, mockParams);
            decrementButton.click();
            expect(mockInput.value).toBe("4");
            expect(eventDispatched).toBeTruthy();
        });
    });
});
