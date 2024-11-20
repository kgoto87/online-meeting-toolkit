import createPredefinedButton from "./predefinedButton";
import { createStartButton } from "./startButton";
import { TimeUnit } from "./timeUnit";
import { state } from "../../state";

const timer = document.createElement("div");
timer.className = "timer";
timer.addEventListener("mousedown", (e) => {
    e.stopPropagation();
});

const minutes = new TimeUnit();
const seconds = new TimeUnit();

const timeWrapper = document.createElement("div");
timeWrapper.className = "time-wrapper";
timeWrapper.appendChild(minutes.wrapper);
timeWrapper.appendChild(seconds.wrapper);

const startButton = createStartButton(minutes.input, seconds.input);

timeWrapper.appendChild(startButton);
timer.appendChild(timeWrapper);

function setTimer(min: number, sec: number) {
    if (state.isRunning) {
        return;
    }

    minutes.input.value = min.toString();
    minutes.input.dispatchEvent(new Event("change"));
    seconds.input.value = sec.toString();
    seconds.input.dispatchEvent(new Event("change"));
}

const oneMunitueButton = createPredefinedButton(1, 0, () => setTimer(1, 0));
const fiveMunitueButton = createPredefinedButton(5, 0, () => setTimer(5, 0));
const tenMunitueButton = createPredefinedButton(10, 0, () => setTimer(10, 0));

const predefinedButtonWrapper = document.createElement("div");
predefinedButtonWrapper.className = "predefined-button-wrapper";

predefinedButtonWrapper.appendChild(oneMunitueButton);
predefinedButtonWrapper.appendChild(fiveMunitueButton);
predefinedButtonWrapper.appendChild(tenMunitueButton);
timer.appendChild(predefinedButtonWrapper);

export default timer;
