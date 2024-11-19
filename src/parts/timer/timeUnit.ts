import { state } from "../../state";

const min = 0;
const max = 59;
const step = 1;

export default function createTimeUnit() {
    const input = document.createElement("input");
    input.type = "number";
    input.value = "0";
    input.min = min.toString();
    input.max = max.toString();

    const display = document.createElement("span");
    display.className = "time-display";
    display.innerText = input.value.padStart(2, "0");
    input.addEventListener("change", () => {
        display.innerText = input.value.padStart(2, "0");
    });

    const incrementButton = document.createElement("button");
    incrementButton.innerText = "+";
    incrementButton.addEventListener("click", () => {
        if (state.isRunning) return;
        if (parseInt(input.value) >= max) return;
        input.value = (parseInt(input.value) + step).toString();
        input.dispatchEvent(new Event("change"));
    });

    const decrementButton = document.createElement("button");
    decrementButton.innerText = "-";
    decrementButton.addEventListener("click", () => {
        if (state.isRunning) return;
        if (parseInt(input.value) <= min) return;
        input.value = (parseInt(input.value) - step).toString();
        input.dispatchEvent(new Event("change"));
    });

    const buttonWrapper = document.createElement("div");
    buttonWrapper.className = "button-wrapper";
    buttonWrapper.appendChild(incrementButton);
    buttonWrapper.appendChild(decrementButton);

    const wrapper = document.createElement("div");
    wrapper.appendChild(input);
    wrapper.appendChild(display);
    wrapper.appendChild(buttonWrapper);

    return wrapper;
}
