import { mover } from "./mouseEvents";

const container = document.createElement("div");
container.id = "online-meeting-toolkit";
container.style.bottom = "0";
container.style.right = "0";

//new MouseEvents(container);
container.addEventListener("mousedown", mover.onMouseDown);

export default container;
