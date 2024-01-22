import { Pokemon } from "./Pokemon.mjs";

/** @type {Pokemon[]} */
export const pokemons = [];

export function clearAllPokemon(){
    pokemons.map((pokemon) => (pokemon.clear())); //map doesn't modify the original array, but each .clear() call does.
}
export function randomizeAllPokemon(){ //Useful for quick testing.
    pokemons.map((pokemon) => (pokemon.randomize()));
}
