import { setLanguage } from "../../../Utils/Language.mjs";
import { current } from "../../Globals.mjs";
import { Setting } from "../Setting.mjs";
import { settings } from "../Settings.mjs";

const langSelectSelect = document.getElementById("langSelect");

export class SettingLangSelect extends Setting {

    constructor() {

        super();
        this.#setListener();

    }

    #setListener() {

        langSelectSelect.addEventListener("change", () => {

            this.setLanguage(langSelectSelect.value);

            // send the data to remote guis
            settings.update();

        });

    }

    /**
     * Changes all texts to desired language
     * @param {String} value - Language code
     */
    setLanguage(value) {

        current.lang = value || "EN";

        // in case function wasn't triggered by the change event
        langSelectSelect.value = current.lang;

        setLanguage(langSelectSelect.value, "gui");

    }

}