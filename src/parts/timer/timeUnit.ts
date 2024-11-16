import { state } from "../../state";

export default function createTimeUnit() {
    const input = document.createElement("input");
    input.type = "number";
    input.value = "0";
    input.min = "0";
    input.max = "59";

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
        if (parseInt(input.value) >= 59) return;
        input.value = (parseInt(input.value) + 1).toString();
        input.dispatchEvent(new Event("change"));
    });

    const decrementButton = document.createElement("button");
    decrementButton.innerText = "-";
    decrementButton.addEventListener("click", () => {
        if (state.isRunning) return;
        if (parseInt(input.value) <= 0) return;
        input.value = (parseInt(input.value) - 1).toString();
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

    return { wrapper, input };
}
