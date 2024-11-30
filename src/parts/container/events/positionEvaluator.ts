export type overflows = {
    isLeftOverflown: boolean;
    isTopOverflown: boolean;
    isRightOverflown: boolean;
    isBottomOverflown: boolean;
};

export function evaluateOverflows(target: HTMLElement): overflows {
    return {
        isLeftOverflown: isLeftOverflown(target),
        isTopOverflown: isTopOverflown(target),
        isRightOverflown: isRightOverflown(target),
        isBottomOverflown: isBottomOverflown(target),
    };
}

export function isLeftOverflown(target: HTMLElement): boolean {
    return target.offsetLeft < 0;
}

export function isTopOverflown(target: HTMLElement): boolean {
    return target.offsetTop < 0;
}

export function isRightOverflown(target: HTMLElement): boolean {
    return target.offsetLeft + target.offsetWidth > window.innerWidth;
}

export function isBottomOverflown(target: HTMLElement): boolean {
    return target.offsetTop + target.offsetHeight > window.innerHeight;
}
