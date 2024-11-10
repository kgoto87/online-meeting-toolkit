chrome.action.onClicked.addListener(async (tab) => {
    try {
        await chrome.scripting.insertCSS({
            target: {tabId: tab.id!},
            files: ['assets/index.css']
        });

        await chrome.scripting.executeScript({
            target: {tabId: tab.id!},
            files: ['index.js']
        });
    } catch (error) {
        console.debug(error);
    }
  });