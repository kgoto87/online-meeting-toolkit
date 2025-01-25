import "./styles/options.scss";

const messagingTime = 2000;
const messagingBuffer = messagingTime + 100;
const onNewTabInput = document.getElementById("on-new-tab") as HTMLInputElement;
const soundEffectVolumeInput = document.getElementById(
    "sound-effect-volume"
) as HTMLInputElement;
const defaultsoundEffectVolume = 2;
const message = document.getElementById("message") as HTMLDivElement;
const messageText = document.createElement("p");

const saveOptions = (e: Event) => {
    e.preventDefault();
    const options = {
        onNewTab: onNewTabInput.checked,
        soundEffectVolume: soundEffectVolumeInput.value,
    };
    chrome.storage.sync.set(options, () => {
        messageText.textContent = "Options saved.";
        message.appendChild(messageText);
        message.classList.add("show");
        setTimeout(() => {
            message.classList.remove("show");
        }, messagingTime);
        setTimeout(() => {
            message.textContent = "";
            if (message.hasChildNodes()) {
                message.removeChild(messageText);
            }
        }, messagingBuffer);
    });
};

const restoreOptions = () => {
    chrome.storage.sync.get(
        { onNewTab: false, soundEffectVolume: defaultsoundEffectVolume },
        (items) => {
            onNewTabInput.checked = items.onNewTab;
            soundEffectVolumeInput.value = items.soundEffectVolume;
        }
    );
};

document.addEventListener("DOMContentLoaded", restoreOptions);
onNewTabInput.addEventListener("change", saveOptions);
soundEffectVolumeInput.addEventListener("input", saveOptions);
