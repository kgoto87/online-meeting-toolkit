import { beforeEach, expect, test } from "vitest";
import { MouseEvents } from "./mouseEvents";

let mockTarget: HTMLElement;

beforeEach(function () {
    window = Object.assign(window, { innerWidth: 100 });
    mockTarget = document.createElement("div");
    new MouseEvents(mockTarget);
    document.dispatchEvent(new MouseEvent("mouseup"));
});

test("should add 'dragging' class when mouse down", function () {
    mockTarget.dispatchEvent(new MouseEvent("mousedown"));
    expect(mockTarget.classList.contains("dragging")).toBeTruthy();
});

test("should remove 'dragging' class when mouse up", function () {
    mockTarget.dispatchEvent(new MouseEvent("mousedown"));
    document.dispatchEvent(new MouseEvent("mouseup"));
    expect(mockTarget.classList.contains("dragging")).toBeFalsy();
});

test("should move target when dragging", function () {
    mockTarget.dispatchEvent(
        new MouseEvent("mousedown", { clientX: 0, clientY: 0 })
    );
    document.dispatchEvent(
        new MouseEvent("mousemove", { clientX: 10, clientY: 10 })
    );
    expect(mockTarget.style.left).toBe("10px");
    expect(mockTarget.style.top).toBe("10px");
});

test("should not move target when not dragging", function () {
    mockTarget.dispatchEvent(
        new MouseEvent("mousedown", { clientX: 0, clientY: 0 })
    );
    document.dispatchEvent(
        new MouseEvent("mousemove", { clientX: 10, clientY: 10 })
    );
    mockTarget.dispatchEvent(new MouseEvent("mouseup"));
    document.dispatchEvent(
        new MouseEvent("mousemove", { clientX: 20, clientY: 20 })
    );
    expect(mockTarget.style.left).toBe("10px");
    expect(mockTarget.style.top).toBe("10px");
});

test("should stop at left edge", function () {
    mockTarget.dispatchEvent(
        new MouseEvent("mousedown", { clientX: 0, clientY: 0 })
    );
    // do not really want to simulate the offsetLeft in this way but nothing else worked
    Object.defineProperty(mockTarget, "offsetLeft", { get: () => -10 });
    document.dispatchEvent(
        new MouseEvent("mousemove", { clientX: -10, clientY: 0 })
    );
    expect(mockTarget.style.left).toBe("0px");
});

test("should stop at top edge", function () {
    mockTarget.dispatchEvent(
        new MouseEvent("mousedown", { clientX: 0, clientY: 0 })
    );
    Object.defineProperty(mockTarget, "offsetTop", { get: () => -10 });
    document.dispatchEvent(
        new MouseEvent("mousemove", { clientX: 0, clientY: -10 })
    );
    expect(mockTarget.style.top).toBe("0px");
});

// NOTE: not testing the right and bottom edges as styles cannot be oveerwritten in jsdom
