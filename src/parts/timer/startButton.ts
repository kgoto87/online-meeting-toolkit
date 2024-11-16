import gong from "../../public/assets/musics/gong.mp3";
import { state, setIsRunning } from "../../state";

const se = document.createElement("audio");
se.src = chrome.runtime.getURL(gong);
se.volume = 0.02;

export function createStartButton(
    minutesInput: HTMLInputElement,
    secondsInput: HTMLInputElement
) {
    let interval: number;

    const startButton = document.createElement("button");
    startButton.innerText = "Start";
    startButton.addEventListener("click", () => {
        state.isRunning ? stopTimer() : startTimer();
    });

    function startTimer() {
        setIsRunning(true);
        minutesInput.disabled = true;
        secondsInput.disabled = true;
        startButton.innerText = "Stop";
        let time =
            parseInt(minutesInput.value) * 60 + parseInt(secondsInput.value);
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
        setIsRunning(false);
        minutesInput.disabled = false;
        secondsInput.disabled = false;
        startButton.innerText = "Start";
        clearInterval(interval);
    }

    return startButton;
}
