export class WindowEvents {
    constructor(private target: HTMLElement) {
        window.addEventListener("resize", () => {
            const { isWidthOverflown, isHeightOverflown } =
                this.evaluateTargetPosition();
            if (isWidthOverflown) {
                this.target.style.left = "auto";
                this.target.style.right = "0";
            }
            if (isHeightOverflown) {
                this.target.style.top = "auto";
                this.target.style.bottom = "0";
            }
        });
    }

    private evaluateTargetPosition() {
        const isWidthOverflown =
            this.target.offsetLeft + this.target.offsetWidth >
            window.innerWidth;
        const isHeightOverflown =
            this.target.offsetTop + this.target.offsetHeight >
            window.innerHeight;
        return { isWidthOverflown, isHeightOverflown };
    }
}
