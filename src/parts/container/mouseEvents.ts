export class MouseEvents {
    private pos1 = 0;
    private pos2 = 0;
    private pos3 = 0;
    private pos4 = 0;

    constructor(private target: HTMLElement) {
        target.addEventListener("mousedown", (e) => this.dragMouseDown(e));

        window.addEventListener("resize", () => {
            if (
                this.target.offsetLeft + this.target.offsetWidth >
                window.innerWidth
            ) {
                this.target.style.left = "auto";
                this.target.style.right = "0";
            }
            if (
                this.target.offsetTop + this.target.offsetHeight >
                window.innerHeight
            ) {
                this.target.style.top = "auto";
                this.target.style.bottom = "0";
            }
        });
    }

    private onMouseUp = () => this.closeDragElement();
    private onMouseMove = (e: MouseEvent) => this.elementDrag(e);

    dragMouseDown(e: MouseEvent) {
        e.preventDefault();
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;
        document.addEventListener("mouseup", this.onMouseUp);
        document.addEventListener("mousemove", this.onMouseMove);
        this.target.style.cursor = "grabbing";
    }

    closeDragElement() {
        document.removeEventListener("mouseup", this.onMouseUp);
        document.removeEventListener("mousemove", this.onMouseMove);
        this.target.style.cursor = "";
    }

    elementDrag(e: MouseEvent) {
        e.preventDefault();
        this.pos1 = this.pos3 - e.clientX;
        this.pos2 = this.pos4 - e.clientY;
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;
        this.target.style.left = `${this.target.offsetLeft - this.pos1}px`;
        this.target.style.top = `${this.target.offsetTop - this.pos2}px`;
        this.target.style.right = "auto";
        this.target.style.bottom = "auto";

        if (this.target.offsetLeft < 0) {
            this.target.style.left = "0";
            this.target.style.right = "auto";
        }
        if (this.target.offsetTop < 0) {
            this.target.style.top = "0";
            this.target.style.bottom = "auto";
        }
        if (
            this.target.offsetLeft + this.target.offsetWidth >
            window.innerWidth
        ) {
            this.target.style.left = "auto";
            this.target.style.right = "0";
        }
        if (
            this.target.offsetTop + this.target.offsetHeight >
            window.innerHeight
        ) {
            this.target.style.top = "auto";
            this.target.style.bottom = "0";
        }
    }
}
