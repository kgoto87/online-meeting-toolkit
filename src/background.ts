chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ onNewTab: false });
});

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
    const tab = await chrome.tabs.get(tabId!);

    chrome.storage.sync.get("onNewTab", async (items) => {
        if (items.onNewTab) {
            await chrome.scripting.insertCSS({
                target: { tabId: tab.id! },
                files: ["assets/index.css"],
            });

            await chrome.scripting.executeScript({
                target: { tabId: tab.id! },
                files: ["index.js"],
            });

            chrome.tabs.sendMessage(tab.id!, { action: "trigger" });
        }
    });
});

chrome.action.onClicked.addListener(async (tab) => {
    try {
        const [{ result }] = await chrome.scripting.executeScript({
            target: { tabId: tab.id! },
            func: () => (window as any)["onlineMeetingToolkitLoaded"],
        });

        if (result) {
            chrome.tabs.sendMessage(tab.id!, { action: "trigger" });
            return;
        }
    } catch {
        // Script not loaded yet, proceed with injection
    }

    await chrome.scripting.insertCSS({
        target: { tabId: tab.id! },
        files: ["assets/index.css"],
    });

    await chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        files: ["index.js"],
    });

    chrome.tabs.sendMessage(tab.id!, { action: "trigger" });
});
