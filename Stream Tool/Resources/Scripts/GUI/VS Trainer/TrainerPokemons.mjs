import { TeamPokemon } from "../Team/TeamPokemon.mjs";

/** @type {TeamPokemon[]} */
export const trainerPokemons = [];

/** Resets all enemy trainer Pokes to a cleared state */
export function clearAllTrainerPokemon(){
    trainerPokemons.map((pokemon) => (pokemon.clear()));
}