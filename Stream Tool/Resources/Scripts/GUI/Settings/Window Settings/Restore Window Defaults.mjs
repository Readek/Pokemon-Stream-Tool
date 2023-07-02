import { inside } from "../../Globals.mjs";
import { settings } from "../Settings.mjs";

const restoreWindowButt = document.getElementById("restoreWindowButt");

// only electron cares about this
if (inside.electron) {
    restoreWindowButt.addEventListener("click", () => {
        restoreWindowDefaults()
    });
}

export async function restoreWindowDefaults() {
    settings.resizable.set(false);
    settings.windowZoom.set(100);
    const ipc = await import("../../IPC.mjs");
    ipc.defaultWindowDimensions();
}

