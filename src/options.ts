import "./styles/options.scss";

const messagingTime = 2000;
const messagingBuffer = messagingTime + 100;
const onNewTabInput = document.getElementById("on-new-tab") as HTMLInputElement;
const message = document.getElementById("message") as HTMLDivElement;
const messageText = document.createElement("p");

const saveOptions = (e: Event) => {
    e.preventDefault();
    chrome.storage.sync.set({ onNewTab: onNewTabInput.checked }, () => {
        messageText.textContent = "Options saved.";
        message.appendChild(messageText);
        message.classList.add("show");
        setTimeout(() => {
            message.classList.remove("show");
        }, messagingTime);
        setTimeout(() => {
            message.textContent = "";
            message.removeChild(messageText);
        }, messagingBuffer);
    });
};

const restoreOptions = () => {
    chrome.storage.sync.get({ onNewTab: false }, (items) => {
        onNewTabInput.checked = items.onNewTab;
    });
};

document.addEventListener("DOMContentLoaded", restoreOptions);
onNewTabInput.addEventListener("change", saveOptions);
