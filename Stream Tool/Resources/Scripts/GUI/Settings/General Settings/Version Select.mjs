import { current } from "../../Globals.mjs";
import { Setting } from "../Setting.mjs";
import { settings } from "../Settings.mjs";

const versionSelectSelect = document.getElementById("versionSelect");

const versionData = {
    "XY" : ["1.0", "1.5"],
    "ORAS" : ["1.0", "1.4"]
}

export class SettingVersionSelect extends Setting {

    constructor() {

        super();
        this.#setListener();

    }

    #setListener() {
        versionSelectSelect.addEventListener("change", () => {
            
            this.setVersion(versionSelectSelect.value);

            // send the data to remote guis
            settings.update();

        });
    }

    /**
     * Changes version data to desired game version
     * @param {String} value - Game version
     */
    setVersion(value) {

        // in case function wasn't triggered by the change event
        versionSelectSelect.value = value;

        current.version = value;

    }

    /**
     * Clears the version list and adds entries from provided game
     * @param {Number} game - Name of chosen game
     */
    addVersions(game) {

        if (game == "XY" || game == "ORAS") {

            // fill version select and display it
            versionSelectSelect.innerHTML = "";

            for (let i = 0; i < versionData[game].length; i++) {
                this.#addVersionEntry(versionData[game][i], versionData[game][i]);
                
            }

            versionSelectSelect.style.display = "block";

            // auto-select the first version on the list
            this.setVersion(versionSelectSelect.value);


        } else {

            // if no versions, hide select and erase current version
            versionSelectSelect.style.display = "none";
            current.version = null;
            
        }

    }

    /**
     * Adds a new entry on the version select combo
     * @param {String} value - Game version
     */
    #addVersionEntry(value) {

        const entry = document.createElement("option");
        entry.value = value;
        entry.text = value;
        versionSelectSelect.add(entry);

    }

}