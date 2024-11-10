const container = document.createElement("div");
container.id = "online-meeting-toolkit";
container.style.bottom = "0";
container.style.right = "0";

// make container draggable and move around on the screen
let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
container.onmousedown = dragMouseDown;

function dragMouseDown(e: MouseEvent) {
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
    container.style.cursor = "grabbing";
}

function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    container.style.cursor = "";
}

function elementDrag(e: MouseEvent) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    container.style.left = `${container.offsetLeft - pos1}px`;
    container.style.top = `${container.offsetTop - pos2}px`;
    container.style.right = "auto";
    container.style.bottom = "auto";

    if (container.offsetLeft < 0) {
        container.style.left = "0";
        container.style.right = "auto";
    }
    if (container.offsetTop < 0) {
        container.style.top = "0";
        container.style.bottom = "auto";
    }
    if (container.offsetLeft + container.offsetWidth > window.innerWidth) {
        container.style.left = "auto";
        container.style.right = "0";
    }
    if (container.offsetTop + container.offsetHeight > window.innerHeight) {
        container.style.top = "auto";
        container.style.bottom = "0";
    }
}

window.addEventListener("resize", () => {
    if (container.offsetLeft + container.offsetWidth > window.innerWidth) {
        container.style.left = "auto";
        container.style.right = "0";
    }
    if (container.offsetTop + container.offsetHeight > window.innerHeight) {
        container.style.top = "auto";
        container.style.bottom = "0";
    }
});

export default container;
