import { Pokemon } from "./Pokemon.mjs";
/** @import { PokemonSentData } from "../../Utils/Type Definitions.mjs" */

const pokesDiv = document.getElementById("botPokes");

class Pokemons {

    /** @type {Pokemon[]} */
    #pokemons = [];

    constructor() {

        for (const pokeDiv of document.getElementsByClassName("pokeDiv")) {
            this.#pokemons.push(new Pokemon(pokeDiv))
        }

    }

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
        
        for (let i = 0; i < this.#pokemons.length; i++) {
            this.#pokemons[i].update(data[i], bTypeChanged);            
        }

    }

    show() {
        pokesDiv.style.animation = "showPokes .7s both";
    }

    async hide() {
        const fadeTime = .7
        pokesDiv.style.animation = `hidePokes ${fadeTime}s both`;
        await new Promise(resolve => setTimeout(resolve, fadeTime*1000));
    }

}

/** Player's party pokemons */
export const pokemons = new Pokemons;