export type State = {
    isRunning: boolean;
};

export const state: State = {
    isRunning: false,
};

export function setIsRunning(status: boolean) {
    state.isRunning = status;
}
