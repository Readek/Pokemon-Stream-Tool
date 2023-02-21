import { viewport } from "./Viewport.mjs";
import { inside, stPath } from "./Globals.mjs";
import { getJson, saveJson } from "./File System.mjs";


class GuiSettings {

    #alwaysOnTopCheck = document.getElementById("alwaysOnTop");
    #resizableCheck = document.getElementById("resizableWindow");
    #lessZoomButt = document.getElementById("lessZoomButt");
    #moreZoomButt = document.getElementById("moreZoomButt");
    #zoomTextValue = document.getElementById("zoomTextValue");
    #zoomValue = 100;
    #restoreWindowButt = document.getElementById("restoreWindowButt");

    constructor() {

        // only electron cares about this
        if (inside.electron) {
            this.#setAlwaysOnTopListener();
            this.#setResizableListener();
            this.#lessZoomButt.addEventListener("click", () => {this.#lessZoom()})
            this.#moreZoomButt.addEventListener("click", () => {this.#moreZoom()})
            this.#restoreWindowButt.addEventListener("click", () => {
                this.#restoreWindowDefaults()
            });
        } else {
            document.getElementById("settingsElectron").style.display = "none";
        }

        // clicking the settings button will bring up the menu
        document.getElementById('settingsRegion').addEventListener("click", () => {
            viewport.toSettings();
        });

    }

    /** Loads all settings from the "GUI Settings.json" file */
    async load() {

        // get us the json file
        const guiSettings = await getJson(`${stPath.text}/GUI Settings`);

        // and update it all!
        if (inside.electron) {
            this.#alwaysOnTopCheck.checked = guiSettings.alwaysOnTop;
            this.toggleAlwaysOnTop();
            this.#resizableCheck.checked = guiSettings.resizable;
            this.toggleResizable();
            this.#zoomValue = guiSettings.zoom;
            this.#changeZoom();
        }
        
    }

    /**
     * Updates a setting inside "GUI Settings.json"
     * @param {String} name - Name of the json variable
     * @param {} value - Value to add to the variable
     */
    async save(name, value) {
    
        if (inside.electron) {
            // read the file
            const guiSettings = await getJson(`${stPath.text}/GUI Settings`);

            // update the setting's value
            guiSettings[name] = value;

            // save the file
            saveJson(`/GUI Settings`, guiSettings);
        }

    }

    #setAlwaysOnTopListener() {
        this.#alwaysOnTopCheck.addEventListener("click", () => {
            this.toggleAlwaysOnTop();
        });
    }
    async toggleAlwaysOnTop() {
        const ipc = await import("./IPC.mjs");
        ipc.alwaysOnTop(this.#alwaysOnTopCheck.checked);
        this.save("alwaysOnTop", this.#alwaysOnTopCheck.checked);
    }

    #setResizableListener() {
        this.#resizableCheck.addEventListener("click", () => {
            this.toggleResizable();
        });
    }
    async toggleResizable() {
        const ipc = await import("./IPC.mjs");
        ipc.resizable(this.#resizableCheck.checked);
        this.save("resizable", this.#resizableCheck.checked);
    }

    #lessZoom() {
        if (this.#zoomValue > 100) {
            this.#zoomValue -= 10;
            this.#changeZoom();
        }
    }
    #moreZoom() {
        if (this.#zoomValue < 400) {
            this.#zoomValue += 10;
            this.#changeZoom();
        }
    }
    #changeZoom() {
        const { webFrame } = require('electron');
        webFrame.setZoomFactor(this.#zoomValue / 100);
        this.#zoomTextValue.innerHTML = `${this.#zoomValue}%`;
        this.save("zoom", this.#zoomValue);
    }

    async #restoreWindowDefaults() {
        this.#resizableCheck.checked = false;
        this.toggleResizable();
        this.#zoomValue = 100;
        this.#changeZoom();
        const ipc = await import("./IPC.mjs");
        ipc.defaultWindowDimensions();
    }

}

export const settings = new GuiSettings;