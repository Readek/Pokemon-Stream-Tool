import { resetPokeLocTexts } from "../../../Utils/Language.mjs";
import { updatePokedexData } from "../../Dex Data.mjs";
import { pokeFinder } from "../../Finder/Pokemon Finder.mjs";
import { current } from "../../Globals.mjs";
import { clearAllPokemon } from "../../Team/TeamPokemons.mjs";
import { Setting } from "../Setting.mjs";
import { settings } from "../Settings.mjs";

const genSelectSelect = document.getElementById("genSelect");

export class SettingGenSelect extends Setting {

    constructor() {

        super();
        this.#setListener();

    }

    #setListener() {
        genSelectSelect.addEventListener("change", () => {

            this.setGen(Number(genSelectSelect.value));

            // send the data to remote guis
            settings.update();
            
        });
    }

    /**
     * Changes pokedex data to desired generation
     * @param {Number} value - Generation number
     */
    setGen(value) {

        // just in case
        value = Number(value);

        // in case function wasn't triggered by the change event
        genSelectSelect.value = value;

        // change the global value
        current.generation = value;

        // update that pokedex data
        updatePokedexData(value);

        // resets the player's pokemon team just in case theres a null poke on this gen
        pokeFinder.loadCharacters();
        clearAllPokemon();

        // updates the game select's entries
        settings.gameSelect.addGames(value);

        // some localizations change between gens
        resetPokeLocTexts(value);

    }

}