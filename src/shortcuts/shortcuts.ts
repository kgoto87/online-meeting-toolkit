import { togglePlay } from "../parts/musicPlayer/musicPlayer";

const pressedKeys = new Set<string>();

document.addEventListener("keydown", (e: KeyboardEvent) => {
    pressedKeys.add(e.code);

    if (
        e.ctrlKey &&
        e.shiftKey &&
        e.key.toLowerCase() === "a" &&
        pressedKeys.size === 3
    ) {
        e.preventDefault();
        togglePlay();
    }
});

document.addEventListener("keyup", (e: KeyboardEvent) => {
    pressedKeys.delete(e.code);
});
