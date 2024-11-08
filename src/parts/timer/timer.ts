import gong from "../../public/assets/musics/gong.mp3";
import createPredefinedButton from "./predefinedButton";

const se = document.createElement("audio");
se.src = chrome.runtime.getURL(gong);
se.volume = 0.02;

const timer = document.createElement("div");
timer.className = "timer";
timer.addEventListener("mousedown", (e) => {
    e.stopPropagation();
});

const minutesInput = document.createElement("input");
minutesInput.type = "number";
minutesInput.value = "0";
minutesInput.min = "0";
minutesInput.max = "59";

const minutesDisplay = document.createElement("span");
minutesDisplay.className = "time-display";
minutesDisplay.innerText = minutesInput.value.padStart(2, "0");
minutesInput.addEventListener("change", () => {
    minutesDisplay.innerText = minutesInput.value.padStart(2, "0");
});

const incrementMinuteButton = document.createElement("button");
incrementMinuteButton.innerText = "+";
incrementMinuteButton.addEventListener("click", () => {
    if (parseInt(minutesInput.value) >= 59) return;
    minutesInput.value = (parseInt(minutesInput.value) + 1).toString();
    minutesInput.dispatchEvent(new Event("change"));
});

const decrementMinuteButton = document.createElement("button");
decrementMinuteButton.innerText = "-";
decrementMinuteButton.addEventListener("click", () => {
    if (parseInt(minutesInput.value) <= 0) return;
    minutesInput.value = (parseInt(minutesInput.value) - 1).toString();
    minutesInput.dispatchEvent(new Event("change"));
});

const minutesButtonWrapper = document.createElement("div");
minutesButtonWrapper.className = "button-wrapper";
minutesButtonWrapper.appendChild(incrementMinuteButton);
minutesButtonWrapper.appendChild(decrementMinuteButton);

const minutesWrapper = document.createElement("div");
minutesWrapper.appendChild(minutesInput);
minutesWrapper.appendChild(minutesDisplay);
minutesWrapper.appendChild(minutesButtonWrapper);

const secondsInput = document.createElement("input");
secondsInput.type = "number";
secondsInput.value = "0";
secondsInput.min = "0";
secondsInput.max = "59";

const secondsDisplay = document.createElement("span");
secondsDisplay.className = "time-display";
secondsDisplay.innerText = secondsInput.value.padStart(2, "0");
secondsInput.addEventListener("change", () => {
    secondsDisplay.innerText = secondsInput.value.padStart(2, "0");
});

const incrementSecondButton = document.createElement("button");
incrementSecondButton.innerText = "+";
incrementSecondButton.addEventListener("click", () => {
    if (parseInt(secondsInput.value) >= 59) return;
    secondsInput.value = (parseInt(secondsInput.value) + 1).toString();
    secondsInput.dispatchEvent(new Event("change"));
});

const decrementSecondButton = document.createElement("button");
decrementSecondButton.innerText = "-";
decrementSecondButton.addEventListener("click", () => {
    if (parseInt(secondsInput.value) <= 0) return;
    secondsInput.value = (parseInt(secondsInput.value) - 1).toString();
    secondsInput.dispatchEvent(new Event("change"));
});

const secondsButtonWrapper = document.createElement("div");
secondsButtonWrapper.className = "button-wrapper";
secondsButtonWrapper.appendChild(incrementSecondButton);
secondsButtonWrapper.appendChild(decrementSecondButton);

const secondsWrapper = document.createElement("div");
secondsWrapper.appendChild(secondsInput);
secondsWrapper.appendChild(secondsDisplay);
secondsWrapper.appendChild(secondsButtonWrapper);

const timeWrapper = document.createElement("div");
timeWrapper.className = "time-wrapper";
timeWrapper.appendChild(minutesWrapper);
timeWrapper.appendChild(secondsWrapper);

let interval: number;
let isRunning = false;

const startButton = document.createElement("button");
startButton.innerText = "Start";
startButton.addEventListener("click", () => {
    isRunning ? stopTimer() : startTimer();
});

function startTimer() {
    isRunning = true;
    minutesInput.disabled = true;
    secondsInput.disabled = true;
    startButton.innerText = "Stop";
    let time = parseInt(minutesInput.value) * 60 + parseInt(secondsInput.value);
    interval = setInterval(() => {
        time--;
        minutesInput.value = Math.floor(time / 60).toString();
        minutesInput.dispatchEvent(new Event("change"));
        secondsInput.value = (time % 60).toString();
        secondsInput.dispatchEvent(new Event("change"));
        if (time <= 0) {
            se.play();
            stopTimer();
        }
    }, 1000);
}

function stopTimer() {
    isRunning = false;
    minutesInput.disabled = false;
    secondsInput.disabled = false;
    startButton.innerText = "Start";
    clearInterval(interval);
}

timeWrapper.appendChild(startButton);
timer.appendChild(timeWrapper);

function setTimer(min: number, sec: number) {
    if (!isRunning) {
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
