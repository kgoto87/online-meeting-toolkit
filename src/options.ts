import "./styles/options.scss";

const messagingTime = 2000;
const messagingBuffer = messagingTime + 100;
const onNewTabInput = document.getElementById("on-new-tab") as HTMLInputElement;
const soundVolumeInput = document.getElementById(
    "sound-volume"
) as HTMLInputElement;
const defaultSoundVolume = 2;
const message = document.getElementById("message") as HTMLDivElement;
const messageText = document.createElement("p");

const saveOptions = (e: Event) => {
    e.preventDefault();
    const options = {
        onNewTab: onNewTabInput.checked,
        soundVolume: soundVolumeInput.value,
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
        { onNewTab: false, soundVolume: defaultSoundVolume },
        (items) => {
            onNewTabInput.checked = items.onNewTab;
            soundVolumeInput.value = items.soundVolume;
        }
    );
};

document.addEventListener("DOMContentLoaded", restoreOptions);
onNewTabInput.addEventListener("change", saveOptions);
soundVolumeInput.addEventListener("input", saveOptions);
