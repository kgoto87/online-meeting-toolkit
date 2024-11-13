import "./styles.scss";
import container from "./parts/container";
import musicPlayer from "./parts/musicPlayer";
import timer from "./parts/timer/timer";

if (!(window as any)['onlineMeetingToolkitLoaded']) {
    (window as any)['onlineMeetingToolkitLoaded'] = true;
  
    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === 'trigger') {
        if (document.getElementById(container.id)) {
            document.body.removeChild(container);
        } else {

            container.appendChild(timer);
            container.appendChild(musicPlayer);

            document.body.appendChild(container);
        }
      }
    });
}
