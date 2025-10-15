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
        // Don't start dragging if the click is on an interactive element
        const target = e.target as HTMLElement;
        if (this.isInteractiveElement(target)) {
            return;
        }
        
        e.preventDefault();
        this.x = e.clientX;
        this.y = e.clientY;
        document.addEventListener("mouseup", this.onMouseUp);
        document.addEventListener("mousemove", this.onMouseMove);
        this.target.classList.add("dragging");
    }

    private isInteractiveElement(element: HTMLElement): boolean {
        // List of interactive elements that should not trigger dragging
        const interactiveElements = ['SELECT', 'OPTION', 'INPUT', 'BUTTON', 'TEXTAREA', 'A'];
        
        // Check if the element itself is interactive
        if (interactiveElements.includes(element.tagName)) {
            return true;
        }
        
        // Check if the element has interactive attributes
        if (element.hasAttribute('tabindex') || 
            element.hasAttribute('role') || 
            element.classList.contains('song-selector')) {
            return true;
        }
        
        // Check if any parent element (up to the container) is interactive
        let parent = element.parentElement;
        while (parent && parent !== this.target) {
            if (interactiveElements.includes(parent.tagName) || 
                parent.classList.contains('song-selector')) {
                return true;
            }
            parent = parent.parentElement;
        }
        
        return false;
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
