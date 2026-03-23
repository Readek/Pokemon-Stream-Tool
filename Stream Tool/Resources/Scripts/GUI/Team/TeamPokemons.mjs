import { TeamPokemon } from "./TeamPokemon.mjs";

/** @type {TeamPokemon[]} */
export const pokemons = [];

/**
 * Removes a team pokemon from the array
 * @param {Number} id - Class identifier
 */
export function deleteTeamPokemon(id) {
    for (let i = 0; i < pokemons.length; i++) {
        if (pokemons[i].getId() == id) {
            pokemons.splice(i, 1);
            break;
        }
    }
}

export function clearAllPokemon(){
    pokemons.map((pokemon) => (pokemon.clear())); //map doesn't modify the original array, but each .clear() call does.
}
export function randomizeAllPokemon(){ //Useful for quick testing.
    pokemons.map((pokemon) => (pokemon.randomize()));
}
