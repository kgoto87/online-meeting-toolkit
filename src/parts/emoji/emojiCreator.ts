import bigEmoji from "./bigEmoji";

export function createEmojiButton(emoji: string): HTMLButtonElement {
    const emojiButton = document.createElement("button");
    emojiButton.className = "emoji";
    emojiButton.innerText = emoji;
    emojiButton.addEventListener("click", () => {
        if (bigEmoji.classList.contains("shown")) {
            return;
        }
        bigEmoji.innerText = emojiButton.innerText;
        bigEmoji.classList.add("shown");
        setTimeout(() => {
            bigEmoji.classList.remove("shown");
        }, 1200);
    });
    return emojiButton;
}
