import { Pokemon } from "./Pokemon.mjs";
/** @import { PokemonSentData } from "../../Utils/Type Definitions.mjs" */

const pokesDiv = document.getElementById("botPokes");

class Pokemons {

    /** @type {Pokemon[]} */
    #pokemons = [];

    /**
     * Gets the selected pokemon class
     * @param {Number} pokeNumber - Pokemon slot
     * @returns {Pokemon}
     */
    pokemon(pokeNumber) {
        return this.#pokemons[pokeNumber]
    }

    /**
     * Updates all pokemon info with the provided data
     * @param {PokemonSentData[]} data - Data for all pokemons
     * @param {Boolean} bTypeChanged - If we just swapped battle type
     */
    update(data, bTypeChanged) {

        for (let i = 0; i < Math.max(this.#pokemons.length, data.length); i++) {

            // if we got sent more pokes than we have, create new ones
            if (!this.#pokemons[i]) {
                this.#pokemons.push(document.createElement("team-pokemon"));
                pokesDiv.appendChild(this.#pokemons[i]);
            }

            // if we got sent less pokes than we have, delete the rest
            if (!data[i]) {
                this.#pokemons[i].delet();
                this.#pokemons.splice(i, 1);
                i--;
            } else {
                // update all that data
                this.#pokemons[i].update(data[i], bTypeChanged);
            }

        }

    }

    show() {
        pokesDiv.style.animation = "showPokes .7s both";
    }

    async hide() {
        const fadeTime = .7
        pokesDiv.style.animation = `hidePokes ${fadeTime}s both`;
        await pokesDiv.getAnimations()[0].finished;
    }

}

/** Player's non-trainer battle party pokemon data */
export const pokemons = new Pokemons;