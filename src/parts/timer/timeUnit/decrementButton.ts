import { state } from "../../../state";
import { timeParams } from "./types/timeParams";

export function makeDecrementButton(
    input: HTMLInputElement,
    params: timeParams
) {
    const decrementButton = document.createElement("button");
    decrementButton.innerText = "-";
    decrementButton.addEventListener("click", () => {
        if (state.isRunning) return;
        if (parseInt(input.value) <= params.min) return;
        input.value = (parseInt(input.value) - params.step).toString();
        input.dispatchEvent(new Event("change"));
        document.dispatchEvent(new Event("change-time"));
    });
    return decrementButton;
}
