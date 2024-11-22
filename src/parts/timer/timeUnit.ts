import { state } from "../../state";

export class TimeUnit {
    min = 0;
    max = 59;
    step = 1;

    readonly wrapper: HTMLDivElement;
    readonly input: HTMLInputElement;

    constructor() {
        this.input = this.makeInput();

        const display = this.makeDisplay();

        this.input.addEventListener("change", () => {
            display.innerText = this.input.value.padStart(2, "0");
        });

        const buttonWrapper = document.createElement("div");
        buttonWrapper.className = "button-wrapper";
        buttonWrapper.appendChild(this.makeIncrementButton());
        buttonWrapper.appendChild(this.makeDecrementButton());

        const wrapper = document.createElement("div");
        wrapper.appendChild(this.input);
        wrapper.appendChild(display);
        wrapper.appendChild(buttonWrapper);
        this.wrapper = wrapper;
    }

    private makeInput() {
        const input = document.createElement("input");
        input.type = "number";
        input.value = "0";
        input.min = this.min.toString();
        input.max = this.max.toString();
        return input;
    }

    private makeDisplay() {
        const display = document.createElement("span");
        display.className = "time-display";
        display.innerText = this.input.value.padStart(2, "0");
        return display;
    }

    private makeIncrementButton() {
        const incrementButton = document.createElement("button");
        incrementButton.innerText = "+";
        incrementButton.addEventListener("click", () => {
            if (state.isRunning) return;
            if (parseInt(this.input.value) >= this.max) return;
            this.input.value = (
                parseInt(this.input.value) + this.step
            ).toString();
            this.input.dispatchEvent(new Event("change"));
        });
        return incrementButton;
    }

    private makeDecrementButton() {
        const decrementButton = document.createElement("button");
        decrementButton.innerText = "-";
        decrementButton.addEventListener("click", () => {
            if (state.isRunning) return;
            if (parseInt(this.input.value) <= this.min) return;
            this.input.value = (
                parseInt(this.input.value) - this.step
            ).toString();
            this.input.dispatchEvent(new Event("change"));
        });
        return decrementButton;
    }
}
