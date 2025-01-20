import bigEmoji from "./bigEmoji";
import { createEmojiButton } from "./emojiCreator";

const container = document.createElement("div");
container.className = "emojis";

container.appendChild(bigEmoji);

[
    createEmojiButton("👍"),
    createEmojiButton("😂"),
    createEmojiButton("🎉"),
    createEmojiButton("😢"),
    createEmojiButton("😡"),
    createEmojiButton("😮"),
    createEmojiButton("🙏"),
    createEmojiButton("👏"),
    createEmojiButton("🔥"),
    createEmojiButton("🙌"),
].forEach((button) => {
    container.appendChild(button);
});

export default container;
