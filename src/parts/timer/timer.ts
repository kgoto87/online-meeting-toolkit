import createPredefinedButton from "./predefinedButton";
import { Time } from "./time";

const timer = document.createElement("div");
timer.className = "timer";
timer.addEventListener("mousedown", (e) => {
    e.stopPropagation();
});

const time = new Time();

timer.appendChild(time.wrapper);

const oneMunitueButton = createPredefinedButton(1, 0, () =>
    time.setTimer(1, 0)
);
const fiveMunitueButton = createPredefinedButton(5, 0, () =>
    time.setTimer(5, 0)
);
const tenMunitueButton = createPredefinedButton(10, 0, () =>
    time.setTimer(10, 0)
);

const predefinedButtonWrapper = document.createElement("div");
predefinedButtonWrapper.className = "predefined-button-wrapper";

predefinedButtonWrapper.appendChild(oneMunitueButton);
predefinedButtonWrapper.appendChild(fiveMunitueButton);
predefinedButtonWrapper.appendChild(tenMunitueButton);
timer.appendChild(predefinedButtonWrapper);

export default timer;
