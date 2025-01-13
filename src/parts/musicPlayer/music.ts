import YugureAvenue from "../../public/assets/musics/yugure_avenue.mp3";

const music = document.createElement("audio");
music.src = chrome.runtime.getURL(YugureAvenue);
music.controls = true;
music.autoplay = false;
music.loop = true;
music.volume = 0.01;

export default music;
