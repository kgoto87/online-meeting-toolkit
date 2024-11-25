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
    });

    test("make an increment button", () => {
        const mockInput = document.createElement("input");
        const mockParams = { min: 0, max: 10, step: 1 };
        mockInput.value = "0";
        const incrementButton = makeIncrementButton(mockInput, mockParams);
        expect(incrementButton.innerText).toBe("+");
    });

    describe("clicking the button", () => {
        test("nothing happens when running", () => {
            mockState.isRunning = true;
            const mockInput = document.createElement("input");
            const mockParams = { min: 0, max: 10, step: 1 };
            mockInput.value = "0";
            mockInput.value = "0";
            const incrementButton = makeIncrementButton(mockInput, mockParams);
            incrementButton.click();
            expect(mockInput.value).toBe("0");
        });

        test("nothing happens when at max", () => {
            mockState.isRunning = false;
            const mockInput = document.createElement("input");
            const mockParams = { min: 0, max: 10, step: 1 };
            mockInput.value = "0";
            mockInput.value = "10";
            const incrementButton = makeIncrementButton(mockInput, mockParams);
            incrementButton.click();
            expect(mockInput.value).toBe("10");
        });

        test("increment the value", () => {
            mockState.isRunning = false;
            const mockInput = document.createElement("input");
            const mockParams = { min: 0, max: 10, step: 1 };
            mockInput.value = "0";
            mockInput.value = "5";
            const incrementButton = makeIncrementButton(mockInput, mockParams);
            incrementButton.click();
            expect(mockInput.value).toBe("6");
        });
    });
});
