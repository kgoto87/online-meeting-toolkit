import { beforeEach, describe, expect, test } from "vitest";
import {
    evaluateOverflows,
    isBottomOverflown,
    isLeftOverflown,
    isRightOverflown,
    isTopOverflown,
} from "./positionEvaluator";

let mockTarget: HTMLDivElement;

beforeEach(function () {
    mockTarget = document.createElement("div");
});

describe("isLeftOverflown", function () {
    test("should be true when left is negative", function () {
        Object.defineProperty(mockTarget, "offsetLeft", {
            value: -10,
        });
        expect(isLeftOverflown(mockTarget)).toBe(true);
    });

    test("should be false when left is zero", function () {
        Object.defineProperty(mockTarget, "offsetLeft", {
            value: 0,
        });
        expect(isLeftOverflown(mockTarget)).toBe(false);
    });

    test("should be false when left is positive", function () {
        Object.defineProperty(mockTarget, "offsetLeft", {
            value: 10,
        });
        expect(isLeftOverflown(mockTarget)).toBe(false);
    });
});

describe("isTopOverflown", function () {
    test("should be true when top is negative", function () {
        Object.defineProperty(mockTarget, "offsetTop", {
            value: -10,
        });
        expect(isTopOverflown(mockTarget)).toBe(true);
    });

    test("should be false when top is zero", function () {
        Object.defineProperty(mockTarget, "offsetTop", {
            value: 0,
        });
        expect(isTopOverflown(mockTarget)).toBe(false);
    });

    test("should be false when top is positive", function () {
        Object.defineProperty(mockTarget, "offsetTop", {
            value: 10,
        });
        expect(isTopOverflown(mockTarget)).toBe(false);
    });
});

describe("isRightOverflown", function () {
    test("should be true when right is out of window", function () {
        Object.defineProperty(mockTarget, "offsetLeft", {
            value: 10,
        });
        Object.defineProperty(mockTarget, "offsetWidth", {
            value: 50,
        });
        Object.defineProperty(window, "innerWidth", {
            value: 50,
        });
        expect(isRightOverflown(mockTarget)).toBe(true);
    });

    test("should be false when right is zero", function () {
        Object.defineProperty(mockTarget, "offsetLeft", {
            value: 0,
        });
        Object.defineProperty(mockTarget, "offsetWidth", {
            value: 100,
        });
        Object.defineProperty(window, "innerWidth", {
            value: 100,
        });
        expect(isRightOverflown(mockTarget)).toBe(false);
    });

    test("should be false when right is within the window", function () {
        Object.defineProperty(mockTarget, "offsetLeft", {
            value: 10,
        });
        Object.defineProperty(mockTarget, "offsetWidth", {
            value: 80,
        });
        Object.defineProperty(window, "innerWidth", {
            value: 100,
        });
        expect(isRightOverflown(mockTarget)).toBe(false);
    });
});

describe("isBottomOverflown", function () {
    test("should be true when bottom is out of window", function () {
        Object.defineProperty(mockTarget, "offsetTop", {
            value: 10,
        });
        Object.defineProperty(mockTarget, "offsetHeight", {
            value: 50,
        });
        Object.defineProperty(window, "innerHeight", {
            value: 50,
        });
        expect(isBottomOverflown(mockTarget)).toBe(true);
    });

    test("should be false when bottom is zero", function () {
        Object.defineProperty(mockTarget, "offsetTop", {
            value: 0,
        });
        Object.defineProperty(mockTarget, "offsetHeight", {
            value: 100,
        });
        Object.defineProperty(window, "innerHeight", {
            value: 100,
        });
        expect(isBottomOverflown(mockTarget)).toBe(false);
    });

    test("should be false when bottom is within the window", function () {
        Object.defineProperty(mockTarget, "offsetTop", {
            value: 10,
        });
        Object.defineProperty(mockTarget, "offsetHeight", {
            value: 80,
        });
        Object.defineProperty(window, "innerHeight", {
            value: 100,
        });
        expect(isBottomOverflown(mockTarget)).toBe(false);
    });
});
