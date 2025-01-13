import music from "./music";

const musicPlayer = document.createElement("div");
musicPlayer.className = "music-player";
musicPlayer.appendChild(music);

export default musicPlayer;

export const isPlaying = music.paused !== true;

export function toggle() {
    if (music.paused) {
        music.play();
    } else {
        music.pause();
    }
}
