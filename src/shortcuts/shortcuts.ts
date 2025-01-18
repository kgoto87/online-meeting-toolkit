import { togglePlay } from "../parts/musicPlayer";
import evaluator from "./KeyboardShortcutEvaluator";

document.addEventListener("keydown", (e: KeyboardEvent) => {
    evaluator.newEvent(e);

    if (evaluator.has("a")) {
        e.preventDefault();
        togglePlay();
    }
});

document.addEventListener("keyup", (e: KeyboardEvent) => {
    evaluator.removeEvent(e);
});
