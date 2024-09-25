import { getJson, saveSettings } from "../File System.mjs";
import { inside, stPath } from "../Globals.mjs";

const guiSettings = await getJson(`${stPath.text}/GUI Settings`);

export class Setting {

    guiSettings;

    constructor() {

        this.guiSettings = guiSettings;

    }

    /**
     * Updates a setting inside "GUI Settings.json"
     * @param {String} name - Name of the json variable
     * @param {} value - Value to add to the variable
     */
    async save(name, value) {
    
        if (inside.electron) {

            // update the setting's value
            this.guiSettings[name] = value;

            // save the file
            saveSettings(this.guiSettings);

        }

    }

}
