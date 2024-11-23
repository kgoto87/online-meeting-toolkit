import { state } from "../../../state";
import { timeParams } from "./types/timeParams";

export function makeIncrementButton(
    input: HTMLInputElement,
    params: timeParams
) {
    const incrementButton = document.createElement("button");
    incrementButton.innerText = "+";
    incrementButton.addEventListener("click", () => {
        if (state.isRunning) return;
        if (parseInt(input.value) >= params.max) return;
        input.value = (parseInt(input.value) + params.step).toString();
        input.dispatchEvent(new Event("change"));
    });
    return incrementButton;
}
