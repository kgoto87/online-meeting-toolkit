const onNewTabInput = document.getElementById("on-new-tab") as HTMLInputElement;
const saveButton = document.getElementById("save") as HTMLButtonElement;
const message = document.createElement("p");
message.id = "message";

const saveOptions = (e: MouseEvent) => {
    e.preventDefault();
    chrome.storage.sync.set({ onNewTab: onNewTabInput.checked }, () => {
        message.textContent = "Options saved.";
        setTimeout(() => {
            message.textContent = "";
            message.style.display = "none";
        }, 750);
    });
};

const restoreOptions = () => {
    chrome.storage.sync.get({ onNewTab: false }, (items) => {
        onNewTabInput.checked = items.onNewTab;
    });
};

document.addEventListener("DOMContentLoaded", restoreOptions);
saveButton.addEventListener("click", saveOptions);
