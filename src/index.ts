import "./styles.scss";
import container from "./parts/container";
import musicPlayer from "./parts/musicPlayer";
import timer from "./parts/timer";

container.appendChild(timer);
container.appendChild(musicPlayer);

document.body.appendChild(container);
