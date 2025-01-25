import gong from "../../public/assets/musics/gong.mp3";

const se = document.createElement("audio");
se.src = chrome.runtime.getURL(gong);
chrome.storage.sync.get("soundVolume", (items) => {
    changeVolumeTo(items.soundVolume);
});

chrome.storage.onChanged.addListener((changes) => {
    if (changes.soundVolume === undefined) return;
    changeVolumeTo(changes.soundVolume.newValue);
});

function changeVolumeTo(volume: number) {
    se.volume = volume / 100;
}

export default se;
