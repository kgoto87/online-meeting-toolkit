import bigEmoji from "./bigEmoji";
import { createEmojiButton } from "./emojiCreator";

const container = document.createElement("div");
container.className = "emojis";

container.appendChild(bigEmoji);

["👍", "😂", "🎉", "😢", "😡", "😮", "🙏", "👏", "🔥", "🙌"].forEach(
    (emoji) => {
        const button = createEmojiButton(emoji);
        container.appendChild(button);
    }
);

export default container;
