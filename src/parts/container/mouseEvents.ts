export const mover = {
    positions: {
        top: 0,
        left: 0,
        mouseX: 0,
        mouseY: 0,
    },
    target: null as HTMLElement | null,
    onMouseDown: function (e: MouseEvent) {
        if (e === null || e.target === null) return;

        this.target = e.target as HTMLElement;

        e.preventDefault();
        this.positions.mouseX = e.clientX;
        this.positions.mouseY = e.clientY;
        document.addEventListener("mouseup", this.onMouseUp);
        document.addEventListener("mousemove", this.onMouseMove);
        this.target.style.cursor = "grabbing";
    },
    onMouseUp: function () {
        document.removeEventListener("mouseup", this.onMouseUp);
        document.removeEventListener("mousemove", this.onMouseMove);
        this.target!.style.cursor = "";
        this.target = null;
    },
    onMouseMove: function (e: MouseEvent) {
        if (e === null || e.target === null) return;

        e.preventDefault();
        this.positions.left = this.positions.mouseX - e.clientX;
        this.positions.top = this.positions.mouseY - e.clientY;
        this.positions.mouseX = e.clientX;
        this.positions.mouseY = e.clientY;
        this.target!.style.left = `${
            this.target!.offsetLeft - this.positions.left
        }px`;
        this.target!.style.top = `${
            this.target!.offsetTop - this.positions.top
        }px`;
        this.target!.style.right = "auto";
        this.target!.style.bottom = "auto";

        if (this.target!.offsetLeft < 0) {
            this.target!.style.left = "0";
            this.target!.style.right = "auto";
        }
        if (this.target!.offsetTop < 0) {
            this.target!.style.top = "0";
            this.target!.style.bottom = "auto";
        }
        if (
            this.target!.offsetLeft + this.target!.offsetWidth >
            window.innerWidth
        ) {
            this.target!.style.left = "auto";
            this.target!.style.right = "0";
        }
        if (
            this.target!.offsetTop + this.target!.offsetHeight >
            window.innerHeight
        ) {
            this.target!.style.top = "auto";
            this.target!.style.bottom = "0";
        }
    },
};

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
        if (e === null || e.target === null) return;

        const target = e.target as HTMLElement;

        e.preventDefault();
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;
        document.addEventListener("mouseup", this.onMouseUp);
        document.addEventListener("mousemove", this.onMouseMove);
        target.style.cursor = "grabbing";
    }

    closeDragElement() {
        document.removeEventListener("mouseup", this.onMouseUp);
        document.removeEventListener("mousemove", this.onMouseMove);
        this.target.style.cursor = "";
    }

    elementDrag(e: MouseEvent) {
        if (e === null || e.target === null) return;

        const target = e.target as HTMLElement;
        console.log(target);

        e.preventDefault();
        this.pos1 = this.pos3 - e.clientX;
        this.pos2 = this.pos4 - e.clientY;
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;
        target.style.left = `${target.offsetLeft - this.pos1}px`;
        target.style.top = `${target.offsetTop - this.pos2}px`;
        target.style.right = "auto";
        target.style.bottom = "auto";

        if (target.offsetLeft < 0) {
            target.style.left = "0";
            target.style.right = "auto";
        }
        if (target.offsetTop < 0) {
            target.style.top = "0";
            target.style.bottom = "auto";
        }
        if (target.offsetLeft + target.offsetWidth > window.innerWidth) {
            target.style.left = "auto";
            target.style.right = "0";
        }
        if (target.offsetTop + target.offsetHeight > window.innerHeight) {
            target.style.top = "auto";
            target.style.bottom = "0";
        }
    }
}
