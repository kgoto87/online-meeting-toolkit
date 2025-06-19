import { describe, expect, test } from "vitest";
import { TimeUnit } from "./timeUnit";

describe("timeUnit", () => {
    const timeUnit = new TimeUnit("test-unit");

    test('display should be "00" initially', () => {
        expect(timeUnit.display.innerText).toBe("00");
    });

    test('display should be "01" after incrementing', () => {
        timeUnit.input.value = "1";
        timeUnit.input.dispatchEvent(new Event("change"));
        expect(timeUnit.display.innerText).toBe("01");
    });

    test('display should be "10" after incrementing', () => {
        timeUnit.input.value = "10";
        timeUnit.input.dispatchEvent(new Event("change"));
        expect(timeUnit.display.innerText).toBe("10");
    });
});
