import gong from "../../public/assets/musics/gong.mp3";
import createPredefinedButton from "./predefinedButton";
import createTimeUnit from "./timeUnit";

const se = document.createElement("audio");
se.src = chrome.runtime.getURL(gong);
se.volume = 0.02;

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
