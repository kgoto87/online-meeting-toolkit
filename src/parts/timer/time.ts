import { state } from "../../state";
import { createStartButton } from "./startButton";
import { TimeUnit } from "./timeUnit/timeUnit";

export class Time {
    readonly minutes: TimeUnit;
    readonly seconds: TimeUnit;
    readonly wrapper: HTMLDivElement;

    constructor() {
        this.minutes = new TimeUnit();
        this.seconds = new TimeUnit();

        this.wrapper = document.createElement("div");
        this.wrapper.className = "time-wrapper";
        this.wrapper.appendChild(this.minutes.wrapper);
        this.wrapper.appendChild(this.seconds.wrapper);

        const startButton = createStartButton(
            this.minutes.input,
            this.seconds.input
        );
        this.wrapper.appendChild(startButton);
    }

    setTimer(min: number, sec: number) {
        if (state.isRunning) return;

        this.minutes.input.value = min.toString();
        this.minutes.input.dispatchEvent(new Event("change"));
        this.seconds.input.value = sec.toString();
        this.seconds.input.dispatchEvent(new Event("change"));
    }
}
