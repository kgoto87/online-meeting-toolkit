import { makeButtonContainer } from "./buttonContainer";
import { timeParams } from "./types/timeParams";

export class TimeUnit {
    private params: timeParams = {
        min: 0,
        max: 59,
        step: 1,
    };

    readonly wrapper: HTMLDivElement;
    readonly input: HTMLInputElement;

    constructor() {
        this.input = this.makeInput();

        const display = this.makeDisplay();

        this.input.addEventListener("change", () => {
            display.innerText = this.input.value.padStart(2, "0");
        });

        const wrapper = document.createElement("div");
        wrapper.appendChild(this.input);
        wrapper.appendChild(display);
        wrapper.appendChild(makeButtonContainer(this.input, this.params));
        this.wrapper = wrapper;
    }

    private makeInput() {
        const input = document.createElement("input");
        input.type = "number";
        input.value = "0";
        input.min = this.params.min.toString();
        input.max = this.params.max.toString();
        return input;
    }

    private makeDisplay() {
        const display = document.createElement("span");
        display.className = "time-display";
        display.innerText = this.input.value.padStart(2, "0");
        return display;
    }
}
