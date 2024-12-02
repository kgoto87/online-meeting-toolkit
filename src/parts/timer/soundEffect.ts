import gong from "../../public/assets/musics/gong.mp3";

const se = document.createElement("audio");
se.src = chrome.runtime.getURL(gong);
se.volume = 0.02;

export default se;
