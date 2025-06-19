import bigEmoji from "./bigEmoji";

declare global {
    interface Navigator {
        userAgentData?: {
            readonly platform: string;
        };
    }
}

const shortcutKeys = ["z", "x", "c", "v"];

const getShortcutKeyDisplayText = (key: string) => {
    const isMac =
        (navigator.userAgentData &&
            navigator.userAgentData.platform === "macOS") ||
        navigator.userAgent.includes("Mac");
    if (isMac) {
        return `Cmd + Ctrl + ${key}`;
    }
    return `Ctrl + Win + ${key}`;
};

export function createEmojiButton(
    emoji: string,
    index: number
): HTMLButtonElement {
    const emojiButton = document.createElement("button");
    emojiButton.className = "emoji";
    emojiButton.innerText = emoji;
    const shortcutKey = shortcutKeys[index];
    if (shortcutKey) {
        emojiButton.title = getShortcutKeyDisplayText(shortcutKey);
    }
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
