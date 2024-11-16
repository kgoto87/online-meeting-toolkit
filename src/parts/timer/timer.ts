import createPredefinedButton from "./predefinedButton";
import { createStartButton } from "./startButton";
import createTimeUnit from "./timeUnit";
import { state } from "../../state";

const timer = document.createElement("div");
timer.className = "timer";
timer.addEventListener("mousedown", (e) => {
    e.stopPropagation();
});

const { wrapper: minutesWrapper, input: minutesInput } = createTimeUnit();
const { wrapper: secondsWrapper, input: secondsInput } = createTimeUnit();

const timeWrapper = document.createElement("div");
timeWrapper.className = "time-wrapper";
timeWrapper.appendChild(minutesWrapper);
timeWrapper.appendChild(secondsWrapper);

const startButton = createStartButton(minutesInput, secondsInput);

timeWrapper.appendChild(startButton);
timer.appendChild(timeWrapper);

function setTimer(min: number, sec: number) {
    if (!state.isRunning) {
        minutesInput.value = min.toString();
        minutesInput.dispatchEvent(new Event("change"));
        secondsInput.value = sec.toString();
        secondsInput.dispatchEvent(new Event("change"));
    }
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
