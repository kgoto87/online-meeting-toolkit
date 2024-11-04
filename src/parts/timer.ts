import gong from "../public/assets/musics/gong.mp3";

const se = document.createElement("audio");
se.src = chrome.runtime.getURL(gong);
se.volume = 0.008;

const timer = document.createElement("div");
timer.className = "timer";
timer.addEventListener("mousedown", (e) => {
    e.stopPropagation();
});

const minutes = document.createElement("input");
minutes.type = "number";
minutes.value = "0";
minutes.min = "0";
minutes.max = "59";

const seconds = document.createElement("input");
seconds.type = "number";
seconds.value = "0";
seconds.min = "0";
seconds.max = "59";

const time = document.createElement("span");
timer.appendChild(minutes);
timer.appendChild(seconds);

let interval: number;
let isRunning = false;

const startButton = document.createElement("button");
startButton.innerText = "Start";
startButton.addEventListener("click", () => {
    isRunning ? stopTimer() : startTimer();
});

function startTimer() {
    isRunning = true;
    minutes.disabled = true;
    seconds.disabled = true;
    startButton.innerText = "Stop";
    let time = parseInt(minutes.value) * 60 + parseInt(seconds.value);
    interval = setInterval(() => {
        time--;
        minutes.value = Math.floor(time / 60).toString();
        seconds.value = (time % 60).toString();
        if (time <= 0) {
            se.play();
            stopTimer();
        }
    }, 1000);
}

function stopTimer() {
    isRunning = false;
    minutes.disabled = false;
    seconds.disabled = false;
    startButton.innerText = "Start";
    clearInterval(interval);
}

timer.appendChild(time);
timer.appendChild(startButton);

export default timer;
