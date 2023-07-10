import { pokeFinder } from "../../Finder/Pokemon Finder.mjs";
import { current, dexGens } from "../../Globals.mjs";
import { clearAllPokemon } from "../../Pokemon/Pokemons.mjs";
import { Setting } from "../Setting.mjs";

export class SettingGameSelect extends Setting {

    #gameSelectSelect = document.getElementById("gameSelect");

    constructor() {

        super();
        this.#setListener();

    }

    #setListener() {
        this.#gameSelectSelect.addEventListener("change", () => {
            this.setGen(Number(this.#gameSelectSelect.value));
        });
    }

    setGen(value) {

        // just in case
        value = Number(value);

        this.#gameSelectSelect.value = value;
        current.generation = value;
        current.pkmnSpecies = dexGens.get(value).species
        pokeFinder.loadCharacters();
        clearAllPokemon();

    }

}