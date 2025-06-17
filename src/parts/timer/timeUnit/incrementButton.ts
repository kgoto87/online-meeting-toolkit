import { state } from "../../../state";
import { timeParams } from "./types/timeParams";

export function makeIncrementButton(
    input: HTMLInputElement,
    params: timeParams
) {
    const incrementButton = document.createElement("button");
    incrementButton.innerText = "+";
    let intervalId: number | undefined;

    const increment = () => {
        if (state.isRunning) return;
        if (parseInt(input.value) >= params.max) return;
        input.value = (parseInt(input.value) + params.step).toString();
        input.dispatchEvent(new Event("change"));
        document.dispatchEvent(new Event("change-time"));
    };

    incrementButton.addEventListener("mousedown", () => {
        if (state.isRunning) return;
        increment(); // Increment once immediately
        intervalId = window.setInterval(increment, 150); // Continue incrementing every 150ms
    });

    const stopIncrement = () => {
        if (intervalId) {
            window.clearInterval(intervalId);
            intervalId = undefined;
        }
    };

    incrementButton.addEventListener("mouseup", stopIncrement);
    incrementButton.addEventListener("mouseleave", stopIncrement);

    return incrementButton;
}
