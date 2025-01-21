import emoji from "../parts/emoji";
import { togglePlay } from "../parts/musicPlayer";
import evaluator from "./KeyboardShortcutEvaluator";

document.addEventListener("keydown", (e: KeyboardEvent) => {
    evaluator.newEvent(e);

    // Music player shortcuts
    if (evaluator.has("a")) {
        e.preventDefault();
        togglePlay();
    }

    // Emoji shortcuts
    if (evaluator.has("z")) {
        e.preventDefault();
        const emojiButton = emoji.getElementsByClassName(
            "emoji"
        )[0] as HTMLButtonElement;
        emojiButton.click();
    }

    if (evaluator.has("x")) {
        e.preventDefault();
        const emojiButton = emoji.getElementsByClassName(
            "emoji"
        )[1] as HTMLButtonElement;
        emojiButton.click();
    }

    if (evaluator.has("c")) {
        e.preventDefault();
        const emojiButton = emoji.getElementsByClassName(
            "emoji"
        )[2] as HTMLButtonElement;
        emojiButton.click();
    }

    if (evaluator.has("v")) {
        e.preventDefault();
        const emojiButton = emoji.getElementsByClassName(
            "emoji"
        )[3] as HTMLButtonElement;
        emojiButton.click();
    }
});
