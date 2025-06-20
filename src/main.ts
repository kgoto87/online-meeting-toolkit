import "./styles/main.scss";
import container from "./parts/container";
import "./shortcuts/shortcuts";
import emoji from "./parts/emoji";
import musicPlayer from "./parts/musicPlayer";
import timer from "./parts/timer";

function toggleDisplay() {
    if (document.getElementById(container.id)) {
        document.body.removeChild(container);
    } else {
        container.appendChild(timer);
        container.appendChild(emoji);
        container.appendChild(musicPlayer);

        document.body.appendChild(container);
    }
}

(function () {
    if ((window as any)["onlineMeetingToolkitLoaded"]) {
        return;
    }

    (window as any)["onlineMeetingToolkitLoaded"] = true;

    chrome.runtime.onMessage.addListener((message) => {
        if (message.action === "trigger") {
            toggleDisplay();
        }
    });
})();
