import { evaluateOverflows } from "./positionEvaluator";

export class WindowEvents {
    constructor(private target: HTMLElement) {
        window.addEventListener("resize", () => {
            const { isRightOverflown, isBottomOverflown } = evaluateOverflows(
                this.target
            );

            if (isRightOverflown) {
                this.target.style.left = "auto";
                this.target.style.right = "0";
            }
            if (isBottomOverflown) {
                this.target.style.top = "auto";
                this.target.style.bottom = "0";
            }
        });
    }
}
