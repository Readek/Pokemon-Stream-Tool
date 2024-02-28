import { Pokemon } from "./Pokemon.mjs";

class Pokemons {

    /** @type {Pokemon} */
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
     * @param {Object} data - Data for all pokemons
     */
    update(data) {
        
        for (let i = 0; i < this.#pokemons.length; i++) {
            this.#pokemons[i].update(data[i]);            
        }

    }

    /** Translates texts related to team Pokemon */
    translate() {

        for (let i = 0; i < this.#pokemons.length; i++) {
            this.#pokemons[i].translate();
        }

    }

}

/** Player's party pokemons */
export const pokemons = new Pokemons;