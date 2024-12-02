import { state, setIsRunning } from "../../state";
import se from "./soundEffect";

let interval: number;

export function createStartButton(
    minutesInput: HTMLInputElement,
    secondsInput: HTMLInputElement
) {
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
        const minutes = parseInt(minutesInput.value) * 60;
        const seconds = parseInt(secondsInput.value);
        let time = minutes + seconds;
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
