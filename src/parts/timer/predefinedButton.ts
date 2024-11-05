export default function createPredefinedButton(
    minutes: number,
    seconds: number,
    callback: () => void
): HTMLButtonElement {
    const button = document.createElement("button");
    button.innerText = `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    button.addEventListener("click", callback);
    return button;
}
