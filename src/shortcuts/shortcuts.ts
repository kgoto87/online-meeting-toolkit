import { togglePlay } from "../parts/musicPlayer/musicPlayer";

const pressedKeys = new Set<string>();

type Key = "a" | "s" | "d" | "z" | "x" | "c" | "v";

class KeyboardShortcutEvaluator {
    private hasBasicKeys: boolean;

    constructor(private e: KeyboardEvent) {
        this.hasBasicKeys = e.ctrlKey && e.shiftKey;
    }

    has(key: Key): boolean {
        return (
            this.hasBasicKeys &&
            this.e.key.toLowerCase() === key &&
            pressedKeys.size === 3
        );
    }
}

document.addEventListener("keydown", (e: KeyboardEvent) => {
    // TODO: need to move this to the KeyboardShortcutEvaluator
    pressedKeys.add(e.code);

    const evaluator = new KeyboardShortcutEvaluator(e);

    if (evaluator.has("a")) {
        e.preventDefault();
        togglePlay();
    }
});

document.addEventListener("keyup", (e: KeyboardEvent) => {
    pressedKeys.delete(e.code);
});
