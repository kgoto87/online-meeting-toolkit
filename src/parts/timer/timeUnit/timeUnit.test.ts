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

describe("display click behavior", () => {
    const timeUnit = new TimeUnit("test-unit");
    const display = timeUnit.display;
    const input = timeUnit.input;

    test("clicking display should show input and hide display", () => {
        display.dispatchEvent(new Event("click"));
        expect(input.style.display).toBe("inline");
        expect(display.style.display).toBe("none");
    });

    test("input should be focused after display click", () => {
        document.body.appendChild(timeUnit.wrapper);
        display.dispatchEvent(new Event("click"));
        expect(document.activeElement).toBe(input);
        document.body.removeChild(timeUnit.wrapper);
    });

    test("input type should be text after display click", () => {
        display.dispatchEvent(new Event("click"));
        expect(input.type).toBe("text");
    });
});

describe("input blur behavior", () => {
    const timeUnit = new TimeUnit("test-unit");
    const display = timeUnit.display;
    const input = timeUnit.input;

    test("value over max should be set to max on blur", () => {
        display.dispatchEvent(new Event("click"));
        input.value = "100";
        input.dispatchEvent(new Event("blur"));
        expect(input.value).toBe("59");
        expect(display.innerText).toBe("59");
    });

    test("value below min should be set to min on blur", () => {
        display.dispatchEvent(new Event("click"));
        input.value = "-10";
        input.dispatchEvent(new Event("blur"));
        expect(input.value).toBe("0");
        expect(display.innerText).toBe("00");
    });

    test("invalid number should be set to min on blur", () => {
        display.dispatchEvent(new Event("click"));
        input.value = "abc";
        input.dispatchEvent(new Event("blur"));
        expect(input.value).toBe("0");
        expect(display.innerText).toBe("00");
    });

    test("leading zeros should be removed on blur", () => {
        display.dispatchEvent(new Event("click"));
        input.value = "007";
        input.dispatchEvent(new Event("blur"));
        expect(input.value).toBe("7");
        expect(display.innerText).toBe("07");
    });

    test("input should be hidden and display shown on blur", () => {
        display.dispatchEvent(new Event("click"));
        input.dispatchEvent(new Event("blur"));
        expect(input.style.display).toBe("none");
        expect(display.style.display).toBe("inline");
    });

    test("input type should be number after blur", () => {
        display.dispatchEvent(new Event("click"));
        input.dispatchEvent(new Event("blur"));
        expect(input.type).toBe("number");
    });
});
