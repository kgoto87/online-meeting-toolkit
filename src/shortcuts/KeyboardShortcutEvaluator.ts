const KEYS = ["a", "z", "x", "c", "v"];
type Key = (typeof KEYS)[number];

let currentEvent: KeyboardEvent | undefined;
let hasBasicKeys: boolean = false;

export default {
    newEvent: function (e: KeyboardEvent) {
        currentEvent = e;
        hasBasicKeys = e.ctrlKey && e.metaKey;
    },
    has: function (key: Key): boolean {
        if (!currentEvent) {
            throw new Error("No event to evaluate");
        }

        return hasBasicKeys && currentEvent.key.toLowerCase() === key;
    },
};
