import { makeDecrementButton } from "./decrementButton";
import { makeIncrementButton } from "./incrementButton";
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
