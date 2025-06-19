import { makeDecrementButton, makeIncrementButton } from "./holdableButton"; // Updated import path
import { timeParams } from "./types/timeParams";

export function makeButtonContainer(
    input: HTMLInputElement,
    params: timeParams
) {
    const container = document.createElement("div");
    container.className = "button-container";
    container.appendChild(makeIncrementButton(input, params));
    container.appendChild(makeDecrementButton(input, params));
    return container;
}
