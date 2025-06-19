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
    readonly display: HTMLSpanElement;

    constructor(name: string) {
        this.input = this.makeInput(name);

        this.display = this.makeDisplay();

        this.input.addEventListener("change", () => {
            this.display.innerText = this.input.value.padStart(2, "0");
        });

        this.display.addEventListener("click", () => {
            this.input.style.display = "inline";
            this.display.style.display = "none";
            this.input.focus();
        });

        this.input.addEventListener("blur", () => {
            const value = parseInt(this.input.value, 10);
            if (isNaN(value) || value < this.params.min) {
                this.input.value = this.params.min.toString();
            } else if (value > this.params.max) {
                this.input.value = this.params.max.toString();
            } else {
                this.input.value = value.toString(); // Remove leading zeros
            }
            this.display.innerText = this.input.value.padStart(2, "0");
            this.input.style.display = "none";
            this.display.style.display = "inline";
        });

        const wrapper = document.createElement("div");
        wrapper.appendChild(this.input);
        wrapper.appendChild(this.display);
        wrapper.appendChild(makeButtonContainer(this.input, this.params));
        this.wrapper = wrapper;
    }

    private makeInput(name: string): HTMLInputElement {
        const input = document.createElement("input");
        input.type = "number";
        input.value = "0";
        input.min = this.params.min.toString();
        input.max = this.params.max.toString();
        input.name = name;
        return input;
    }

    private makeDisplay() {
        const display = document.createElement("span");
        display.className = "time-display";
        display.innerText = this.input.value.padStart(2, "0");
        return display;
    }
}
