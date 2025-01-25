import gong from "../../public/assets/musics/gong.mp3";

const se = document.createElement("audio");
se.src = chrome.runtime.getURL(gong);
chrome.storage.sync.get("soundEffectVolume", (items) => {
    changeVolumeTo(items.soundEffectVolume);
});

chrome.storage.onChanged.addListener((changes) => {
    if (changes.soundEffectVolume === undefined) return;
    changeVolumeTo(changes.soundEffectVolume.newValue);
});

function changeVolumeTo(volume: number) {
    se.volume = volume / 100;
}

export default se;
