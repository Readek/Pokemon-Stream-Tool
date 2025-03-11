import { updatePokedexData } from "../../Dex Data.mjs";
import { current } from "../../Globals.mjs";
import { Setting } from "../Setting.mjs";
import { settings } from "../Settings.mjs";

const fullDexCheck = document.getElementById("settingFullDexInput");

export class SettingForceDex extends Setting {

    constructor() {

        super();
        this.#setListener();

    }

    #setListener() {
        fullDexCheck.addEventListener("click", () => {

            this.setForceDex(fullDexCheck.checked);

            // send the data to remote guis
            settings.update();

        })
    
    }

    setForceDex(value) {
        
        fullDexCheck.checked = value;
        current.forceDex = value;
        updatePokedexData(current.generation);

    }

}