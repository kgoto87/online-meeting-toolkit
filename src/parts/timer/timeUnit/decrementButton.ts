import { state } from "../../../state";
import { timeParams } from "./types/timeParams";

export function makeDecrementButton(
    input: HTMLInputElement,
    params: timeParams
) {
    const decrementButton = document.createElement("button");
    decrementButton.innerText = "-";
    let intervalId: number | undefined;

    const decrement = () => {
        if (state.isRunning) return;
        if (parseInt(input.value) <= params.min) return;
        input.value = (parseInt(input.value) - params.step).toString();
        input.dispatchEvent(new Event("change"));
        document.dispatchEvent(new Event("change-time"));
    };

    decrementButton.addEventListener("mousedown", () => {
        if (state.isRunning) return;
        decrement(); // Decrement once immediately
        intervalId = window.setInterval(decrement, 150); // Continue decrementing every 150ms
    });

    const stopDecrement = () => {
        if (intervalId) {
            window.clearInterval(intervalId);
            intervalId = undefined;
        }
    };

    decrementButton.addEventListener("mouseup", stopDecrement);
    decrementButton.addEventListener("mouseleave", stopDecrement);

    return decrementButton;
}
