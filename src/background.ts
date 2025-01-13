type storageItems = {
    onNewTab: boolean;
};

async function alreadyLoaded(tabId: number): Promise<boolean> {
    try {
        const [{ result }] = await chrome.scripting.executeScript({
            target: { tabId },
            func: () => (window as any)["onlineMeetingToolkitLoaded"],
        });

        return !!result;
    } catch {
        return false;
    }
}

async function loadToolkit(tabId: number) {
    await chrome.scripting.insertCSS({
        target: { tabId },
        files: ["assets/main.css"],
    });

    await chrome.scripting.executeScript({
        target: { tabId },
        files: ["main.js"],
    });

    chrome.tabs.sendMessage(tabId, { action: "trigger" });
}

async function executeOnNewTab(tabId: number, items: storageItems) {
    if (await alreadyLoaded(tabId)) return;

    try {
        if (items.onNewTab) {
            await loadToolkit(tabId);
        }
    } catch (e) {
        if (!(e instanceof Error)) return;

        if (
            e.message.includes("Cannot access a chrome:// URL") ||
            e.message.includes("Cannot access contents of the page")
        ) {
            return;
        }

        console.info(e);
    }
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get("onNewTab", (items) => {
        const onNewTab = items.onNewTab ?? false;
        chrome.storage.sync.set({ onNewTab });
    });
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        if (tab.url && tab.url.includes("chrome://")) return;

        chrome.storage.sync.get("onNewTab", async (items) =>
            executeOnNewTab(tabId, items as storageItems)
        );
    }
});

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
    const tab = await chrome.tabs.get(tabId!);

    if (tab.url && tab.url.includes("chrome://")) return;

    chrome.storage.sync.get("onNewTab", async (items) =>
        executeOnNewTab(tabId, items as storageItems)
    );
});

chrome.action.onClicked.addListener(async (tab) => {
    if (await alreadyLoaded(tab.id!)) {
        chrome.tabs.sendMessage(tab.id!, { action: "trigger" });
        return;
    }
    await loadToolkit(tab.id!);
});
