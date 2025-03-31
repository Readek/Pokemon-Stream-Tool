import { Setting } from "../Setting.mjs";

export class SettingAlwaysOnTop extends Setting {

    #alwaysOnTopCheck = document.getElementById("alwaysOnTop");

    constructor() {

        super();
        this.load();
        this.#setListener();

    }

    load() {
        this.#alwaysOnTopCheck.checked = this.guiSettings.alwaysOnTop;
        this.#refresh();
    }

    #setListener() {
        this.#alwaysOnTopCheck.addEventListener("click", () => {
            this.#refresh();
        });
    }

    async #refresh() {
        const ipc = await import("../../IPC.mjs");
        ipc.alwaysOnTop(this.#alwaysOnTopCheck.checked);
        this.save("alwaysOnTop", this.#alwaysOnTopCheck.checked);
    }
    
}