const alwaysOnInput = document.getElementById("always-on") as HTMLInputElement;
const saveButton = document.getElementById("save") as HTMLButtonElement;
const message = document.createElement("p");
message.id = "message";

const saveOptions = () => {
    chrome.storage.sync.set({ alwaysOn: alwaysOnInput }, () => {
        message.textContent = "Options saved.";
        setTimeout(() => {
            message.textContent = "";
            message.style.display = "none";
        }, 750);
    });
};

const restoreOptions = () => {
    chrome.storage.sync.get({ alwaysOn: false }, (items) => {
        alwaysOnInput.checked = items.alwaysOn;
    });
};

document.addEventListener("DOMContentLoaded", restoreOptions);
saveButton.addEventListener("click", saveOptions);
