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

        const randomKey = Math.random() >= 0.5 ? "ctrlKey" : "altKey";
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

        const altEvent = new KeyboardEvent("keydown", {
            altKey: true,
        });
        evaluator.newEvent(altEvent);

        expect(evaluator.has("a")).toBeFalsy();
    });

    it("should return true when the correct keys are pressed", async function () {
        const evaluator = (await import("./KeyboardShortcutEvaluator")).default;

        const ctrlEvent = new KeyboardEvent("keydown", {
            code: "ControlLeft",
            ctrlKey: true,
        });
        evaluator.newEvent(ctrlEvent);

        const altEvent = new KeyboardEvent("keydown", {
            code: "ShiftLeft",
            altKey: true,
        });
        evaluator.newEvent(altEvent);

        const event = new KeyboardEvent("keydown", {
            key: "a",
            ctrlKey: true,
            altKey: true,
        });
        evaluator.newEvent(event);

        expect(evaluator.has("a")).toBeTruthy();
    });
});
