import { resetPokeLocTexts } from "../../../Utils/Language.mjs";
import { pokeFinder } from "../../Finder/Pokemon Finder.mjs";
import { current, dexGens } from "../../Globals.mjs";
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
        current.pkmnSpecies = dexGens.get(value).species;
        current.abilities = Object.fromEntries([...dexGens.get(value).abilities].map(a => [a.num, a]));
        current.items = Object.fromEntries([...dexGens.get(value).items].map(a => [a.num, a]));
        current.moves = Object.fromEntries([...dexGens.get(value).moves].map(a => [a.num, a]));

        // resets the player's pokemon team just in case theres a null poke on this gen
        pokeFinder.loadCharacters();
        clearAllPokemon();

        // updates the game select's entries
        settings.gameSelect.addGames(value);

        // some localizations change between gens
        resetPokeLocTexts(value);

    }

}