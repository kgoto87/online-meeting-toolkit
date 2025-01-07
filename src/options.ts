import "./styles/options.scss";

const messagingTime = 2000;
const messagingBuffer = messagingTime + 1000;
const onNewTabInput = document.getElementById("on-new-tab") as HTMLInputElement;
const saveButton = document.getElementById("save") as HTMLButtonElement;
const message = document.getElementById("message") as HTMLDivElement;
const messageText = document.createElement("p");

const saveOptions = (e: MouseEvent) => {
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
saveButton.addEventListener("click", saveOptions);
