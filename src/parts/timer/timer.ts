import createPredefinedButton from "./predefinedButton";
import { Time } from "./time";

const timer = document.createElement("div");
timer.className = "timer";
timer.addEventListener("mousedown", (e) => {
    e.stopPropagation();
});

const time = new Time();

timer.appendChild(time.wrapper);

const predefinedButtons = [
    createPredefinedButton(1, 0, () => time.setTimer(1, 0)),
    createPredefinedButton(5, 0, () => time.setTimer(5, 0)),
    createPredefinedButton(10, 0, () => time.setTimer(10, 0)),
];

const predefinedButtonWrapper = document.createElement("div");
predefinedButtonWrapper.className = "predefined-button-wrapper";

predefinedButtons.forEach((button) => {
    predefinedButtonWrapper.appendChild(button);
});

timer.appendChild(predefinedButtonWrapper);

export default timer;
