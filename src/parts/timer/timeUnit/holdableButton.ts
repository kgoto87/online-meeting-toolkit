import { state } from "../../../state";
import { timeParams } from "./types/timeParams";
import { HOLD_INTERVAL_MS } from "./constants";

type Operation = "increment" | "decrement";

interface OperationSettings {
    updateFn: (currentValue: number, step: number) => number;
    checkBoundaryFn: (currentValue: number, limit: number) => boolean;
    boundaryValue: number;
    buttonText: string;
}

function getOperationSettings(operation: Operation, params: timeParams): OperationSettings {
    if (operation === "increment") {
        return {
            updateFn: (currentValue, step) => currentValue + step,
            checkBoundaryFn: (currentValue, limit) => currentValue >= limit,
            boundaryValue: params.max,
            buttonText: "+",
        };
    } else { // operation === "decrement"
        return {
            updateFn: (currentValue, step) => currentValue - step,
            checkBoundaryFn: (currentValue, limit) => currentValue <= limit,
            boundaryValue: params.min,
            buttonText: "-",
        };
    }
}

// Internal function to handle the common logic
function makeButtonLogic(
    input: HTMLInputElement,
    params: timeParams,
    operation: Operation
) {
    const settings = getOperationSettings(operation, params);

    const button = document.createElement("button");
    button.innerText = settings.buttonText;
    let intervalId: number | undefined;

    const performUpdate = () => {
        if (state.isRunning) return;
        const currentValue = parseInt(input.value);
        if (settings.checkBoundaryFn(currentValue, settings.boundaryValue)) return;

        input.value = settings.updateFn(currentValue, params.step).toString();
        input.dispatchEvent(new Event("change"));
        document.dispatchEvent(new Event("change-time"));
    };

    button.addEventListener("mousedown", () => {
        if (state.isRunning) return;
        performUpdate(); // Perform once immediately
        intervalId = window.setInterval(performUpdate, HOLD_INTERVAL_MS);
    });

    const stopInterval = () => {
        if (intervalId) {
            window.clearInterval(intervalId);
            intervalId = undefined;
        }
    };

    button.addEventListener("mouseup", stopInterval);
    button.addEventListener("mouseleave", stopInterval);

    return button;
}

export function makeIncrementButton(
    input: HTMLInputElement,
    params: timeParams
) {
    return makeButtonLogic(input, params, "increment");
}

export function makeDecrementButton(
    input: HTMLInputElement,
    params: timeParams
) {
    return makeButtonLogic(input, params, "decrement");
}
