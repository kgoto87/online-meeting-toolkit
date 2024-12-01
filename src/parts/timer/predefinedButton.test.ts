import { expect, test, vi } from "vitest";
import createPredefinedButton from "./predefinedButton";

test("should have 01:00", function () {
    const button = createPredefinedButton(1, 0, () => {});
    expect(button.innerText).toBe("01:00");
});

test("should have 10:10", function () {
    const button = createPredefinedButton(10, 10, () => {});
    expect(button.innerText).toBe("10:10");
});

test("should have callback", function () {
    const mockFunction = vi.fn();
    const button = createPredefinedButton(1, 0, mockFunction);
    button.click();
    expect(mockFunction).toHaveBeenCalled();
});
