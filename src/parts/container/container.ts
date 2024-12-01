import { MouseEvents } from "./events/mouseEvents";
import { WindowEvents } from "./events/windowEvents";

const container = document.createElement("div");
container.id = "online-meeting-toolkit";

new MouseEvents(container);
new WindowEvents(container);

export default container;
