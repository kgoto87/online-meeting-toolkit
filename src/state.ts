export type State = {
    isRunning: boolean;
    initialTime: {
        minutes: number;
        seconds: number;
    };
    isPaused: boolean;
};

export const state: State = {
    isRunning: false,
    initialTime: {
        minutes: 0,
        seconds: 0,
    },
    isPaused: false,
};

export function setIsRunning(status: boolean) {
    state.isRunning = status;
}

export function setInitialTime(minutes: number, seconds: number) {
    state.initialTime = { minutes, seconds };
}

export function setIsPaused(status: boolean) {
    state.isPaused = status;
}
