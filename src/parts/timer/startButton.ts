import { state, setIsRunning } from "../../state";
import se from "./soundEffect";
import { interval } from "./timerConfig";

export function createStartButton(
    minutesInput: HTMLInputElement,
    secondsInput: HTMLInputElement
) {
    const startButton = document.createElement("button");
    startButton.innerText = "Start";
    startButton.addEventListener("click", () => {
        state.isRunning ? stopTimer() : startTimer();
    });

    let timerInterval: number;

    function startTimer() {
        setIsRunning(true);
        minutesInput.disabled = true;
        secondsInput.disabled = true;
        startButton.innerText = "Stop";
        const minutes = parseInt(minutesInput.value) * 60;
        const seconds = parseInt(secondsInput.value);
        let time = minutes + seconds;
        timerInterval = setInterval(() => {
            time--;
            minutesInput.value = Math.floor(time / 60).toString();
            minutesInput.dispatchEvent(new Event("change"));
            secondsInput.value = (time % 60).toString();
            secondsInput.dispatchEvent(new Event("change"));
            if (time <= 0) {
                se.play();
                stopTimer();
            }
        }, interval);
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
