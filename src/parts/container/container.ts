import { MouseEvents } from "./events/mouseEvents";
import { WindowEvents } from "./events/windowEvents";

const container = document.createElement("div");
container.id = "online-meeting-toolkit";
container.style.bottom = "0";
container.style.right = "0";

new MouseEvents(container);
new WindowEvents(container);

export default container;