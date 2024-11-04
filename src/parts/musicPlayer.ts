import YugureAvenue from "../public/assets/musics/yugure_avenue.mp3";

const musicPlayer = document.createElement("div");
musicPlayer.className = "music-player";

const music = document.createElement("audio");
music.src = chrome.runtime.getURL(YugureAvenue);
music.controls = true;
music.autoplay = true;
music.loop = true;
music.volume = 0.1;

musicPlayer.appendChild(music);

export default musicPlayer;
