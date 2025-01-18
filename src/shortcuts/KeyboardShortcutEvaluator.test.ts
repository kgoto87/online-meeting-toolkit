import { beforeEach, describe, expect, it, vi } from "vitest";

describe("Keyboard Shortcut", function () {
    beforeEach(() => {
        vi.resetModules();
    });

    it("should throw an error when no event is present", async function () {
        const evaluator = (await import("./KeyboardShortcutEvaluator")).default;

        expect(() => {
            evaluator.has("a");
        }).toThrowError("No event to evaluate");
    });

    it("should retun false when no basic keys are pressed", async function () {
        const evaluator = (await import("./KeyboardShortcutEvaluator")).default;

        const event = new KeyboardEvent("keydown", { key: "a" });
        evaluator.newEvent(event);
        expect(evaluator.has("a")).toBeFalsy();
    });

    it("should return false when only one basic key is pressed", async function () {
        const evaluator = (await import("./KeyboardShortcutEvaluator")).default;

        const event = new KeyboardEvent("keydown", {
            key: "a",
        });
        evaluator.newEvent(event);

        const randomKey = Math.random() >= 0.5 ? "CtrlKey" : "ShiftKey";
        const ctrlEvent = new KeyboardEvent("keydown", {
            code: "randomKey",
            [randomKey]: true,
        });
        evaluator.newEvent(ctrlEvent);

        expect(evaluator.has("a")).toBeFalsy();
    });

    it("should return false when the wrong key is pressed", async function () {
        const evaluator = (await import("./KeyboardShortcutEvaluator")).default;

        const event = new KeyboardEvent("keydown", {
            key: "b",
        });
        evaluator.newEvent(event);

        const ctrlEvent = new KeyboardEvent("keydown", {
            ctrlKey: true,
        });
        evaluator.newEvent(ctrlEvent);

        const shiftEvent = new KeyboardEvent("keydown", {
            shiftKey: true,
        });
        evaluator.newEvent(shiftEvent);

        expect(evaluator.has("a")).toBeFalsy();
    });

    it("should return true when the correct keys are pressed", async function () {
        const evaluator = (await import("./KeyboardShortcutEvaluator")).default;

        const ctrlEvent = new KeyboardEvent("keydown", {
            code: "ControlLeft",
            ctrlKey: true,
        });
        evaluator.newEvent(ctrlEvent);

        const shiftEvent = new KeyboardEvent("keydown", {
            code: "ShiftLeft",
            shiftKey: true,
        });
        evaluator.newEvent(shiftEvent);

        const event = new KeyboardEvent("keydown", {
            key: "a",
            ctrlKey: true,
            shiftKey: true,
        });
        evaluator.newEvent(event);

        expect(evaluator.has("a")).toBeTruthy();
    });
});
