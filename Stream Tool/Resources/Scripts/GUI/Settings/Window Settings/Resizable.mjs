import { Setting } from "../Setting.mjs";

export class SettingResizableWindow extends Setting {

    #resizableCheck = document.getElementById("resizableWindow");

    constructor() {

        super();
        this.load();
        this.#setListener();

    }

    load() {
        this.#resizableCheck.checked = this.guiSettings.resizable;
    }

    set(value) {
        this.#resizableCheck.checked = value;
        this.#refresh();
    }

    #setListener() {
        this.#resizableCheck.addEventListener("click", () => {
            this.#refresh();
        });
    }

    async #refresh() {
        const ipc = await import("../../IPC.mjs");
        ipc.resizable(this.#resizableCheck.checked);
        this.save("resizable", this.#resizableCheck.checked);
    }

}