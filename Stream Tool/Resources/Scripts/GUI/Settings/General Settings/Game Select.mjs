import { pokeFinder } from "../../Finder/Pokemon Finder.mjs";
import { current } from "../../Globals.mjs";
import { Setting } from "../Setting.mjs";

export class SettingGameSelect extends Setting {

    #gameSelectSelect = document.getElementById("gameSelect");

    constructor() {

        super();
        this.load();
        this.#setListener();

    }

    load() {
        this.#gameSelectSelect.value = this.guiSettings.gameGen;
        current.generation = this.guiSettings.gameGen;
        pokeFinder.loadCharacters();
    }

    #setListener() {
        this.#gameSelectSelect.addEventListener("change", () => {
            this.#refresh();
        });
    }

    #refresh() {
        
        current.generation = this.#gameSelectSelect.value;
        pokeFinder.loadCharacters();
        this.save("gameGen", this.#gameSelectSelect.value);

    }

    setGen(value) {

        this.#gameSelectSelect.value = value;
        current.generation = value;
        pokeFinder.loadCharacters();
        this.save("gameGen", this.#gameSelectSelect.value);

    }

}