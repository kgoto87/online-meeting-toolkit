import { evaluateOverflows } from "./positionEvaluator";

export class MouseEvents {
    private x = 0;
    private y = 0;

    constructor(private target: HTMLElement) {
        target.addEventListener("mousedown", (e) => this.startDragging(e));
    }

    private onMouseUp = () => this.closeDragElement();
    private onMouseMove = (e: MouseEvent) => this.elementDrag(e);

    private startDragging(e: MouseEvent) {
        e.preventDefault();
        this.x = e.clientX;
        this.y = e.clientY;
        document.addEventListener("mouseup", this.onMouseUp);
        document.addEventListener("mousemove", this.onMouseMove);
        this.target.classList.add("dragging");
    }

    private closeDragElement() {
        document.removeEventListener("mouseup", this.onMouseUp);
        document.removeEventListener("mousemove", this.onMouseMove);
        this.target.classList.remove("dragging");
    }

    private elementDrag(e: MouseEvent) {
        e.preventDefault();
        const diffInX = this.x - e.clientX;
        const dissInY = this.y - e.clientY;
        this.x = e.clientX;
        this.y = e.clientY;

        this.target.style.left = `${this.target.offsetLeft - diffInX}px`;
        this.target.style.top = `${this.target.offsetTop - dissInY}px`;
        this.target.style.right = "auto";
        this.target.style.bottom = "auto";

        const {
            isLeftOverflown,
            isTopOverflown,
            isRightOverflown,
            isBottomOverflown,
        } = evaluateOverflows(this.target);

        if (isLeftOverflown) {
            this.target.style.left = "0";
            this.target.style.right = "auto";
        }
        if (isTopOverflown) {
            this.target.style.top = "0";
            this.target.style.bottom = "auto";
        }
        if (isRightOverflown) {
            this.target.style.left = "auto";
            this.target.style.right = "0";
        }
        if (isBottomOverflown) {
            this.target.style.top = "auto";
            this.target.style.bottom = "0";
        }
    }
}
