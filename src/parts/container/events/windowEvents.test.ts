import { beforeEach, expect, test, vi } from "vitest";
import { WindowEvents } from "./windowEvents";

beforeEach(function () {});

test("should have resize event", function () {
    const mockTarget = document.createElement("div");

    const addEventListenerSpy = vi.spyOn(window, "addEventListener");

    new WindowEvents(mockTarget);

    window.dispatchEvent(new Event("resize"));

    expect(addEventListenerSpy).toHaveBeenCalledWith(
        "resize",
        expect.any(Function)
    );
});

// NOTE: no tests for overflows as it is not possible to simulate the offsets
