import { TeamPokemon } from "../Team/TeamPokemon.mjs";

const trainerNameInp = document.getElementById("trainerNameInp");

/**
 * Updates the Enemy Trainer's name input field
 * @param {String} name - Name of the trainer
 */
export function setEnemyTrainerName(name) {
    trainerNameInp.value = name;
}
/** @returns {String} */
export function getEnemyTrainerName() {
    return trainerNameInp.value;
}

/** @type {TeamPokemon[]} */
export const trainerPokemons = [];

/** Resets all enemy trainer Pokes to a cleared state */
export function clearAllTrainerPokemon(){
    trainerPokemons.map((pokemon) => (pokemon.clear()));
}