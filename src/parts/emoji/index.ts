import bigEmoji from "./bigEmoji";
import { createEmojiButton } from "./emojiCreator";

const container = document.createElement("div");
container.className = "emojis";

container.appendChild(bigEmoji);

["👍", "😂", "🎉", "😢", "😡", "😮", "🙏", "👏", "🔥", "🙌"].forEach(
    (emoji, index) => {
        const button = createEmojiButton(emoji, index);
        container.appendChild(button);
    }
);

export default container;
