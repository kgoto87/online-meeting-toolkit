type Key = "a";

const numberOfKeys = 3;
let currentEvent: KeyboardEvent | undefined;
let hasBasicKeys: boolean = false;
const pressedKeys = new Set<string>();

export default {
    newEvent: function (e: KeyboardEvent) {
        currentEvent = e;
        pressedKeys.add(e.code);
        hasBasicKeys = e.ctrlKey && e.altKey;
    },
    removeEvent: function (e: KeyboardEvent) {
        pressedKeys.delete(e.code);
        currentEvent = undefined;
        hasBasicKeys = e.ctrlKey && e.altKey;
    },
    has: function (key: Key): boolean {
        if (!currentEvent) {
            throw new Error("No event to evaluate");
        }

        return (
            hasBasicKeys &&
            currentEvent.key.toLowerCase() === key &&
            pressedKeys.size === numberOfKeys
        );
    },
};
