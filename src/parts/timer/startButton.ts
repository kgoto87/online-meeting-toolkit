import { state, setIsRunning, setIsPaused, setInitialTime } from "../../state";
import se from "./soundEffect";
import { interval } from "./timerConfig";

export function createStartButton(
    minutesInput: HTMLInputElement,
    secondsInput: HTMLInputElement
) {
    const startButton = document.createElement("button");
    startButton.innerText = "Start";
    startButton.addEventListener("click", () => {
        state.isRunning ? pauseTimer() : startTimer();
    });

    let timerInterval: number;

    function startTimer() {
        setIsRunning(true);

        minutesInput.disabled = true;
        secondsInput.disabled = true;
        startButton.innerText = "Stop";
        const minutes = parseInt(minutesInput.value);
        const seconds = parseInt(secondsInput.value);
        if (!state.isPaused) {
            setInitialTime(minutes, seconds);
        }
        let time = minutes * 60 + seconds;
        timerInterval = setInterval(() => {
            time = countDown(time);
            if (time <= 0) {
                se.play();
                stopTimer();
                setTimeout(() => {
                    minutesInput.value = state.initialTime.minutes.toString();
                    minutesInput.dispatchEvent(new Event("change"));
                    secondsInput.value = state.initialTime.seconds.toString();
                    secondsInput.dispatchEvent(new Event("change"));
                }, interval);
            }
        }, interval);
    }

    function countDown(time: number): number {
        time--;
        minutesInput.value = Math.floor(time / 60).toString();
        minutesInput.dispatchEvent(new Event("change"));
        secondsInput.value = (time % 60).toString();
        secondsInput.dispatchEvent(new Event("change"));
        return time;
    }

    function pauseTimer() {
        setIsPaused(true);
        stopTimer();
    }

    function stopTimer() {
        setIsRunning(false);
        minutesInput.disabled = false;
        secondsInput.disabled = false;
        startButton.innerText = "Start";
        clearInterval(timerInterval);
    }

    return startButton;
}
