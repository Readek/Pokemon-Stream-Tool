import { TeamPokemon } from "../Team/TeamPokemon.mjs";
/** @import { EnemyTrainerName } from "../../Utils/Type Definitions.mjs" */

const trainerNameInp = document.getElementById("trainerNameInp");
const trainerName = {};

/**
 * Updates the Enemy Trainer's name input field
 * @param {EnemyTrainerName} nameData - Name of the trainer
 */
export function setEnemyTrainerName(nameData) {

    trainerName.title = nameData.title;
    trainerName.name = nameData.name;

    if (nameData.name) {
        trainerNameInp.value = nameData.title + " " + nameData.name;
    } else {
        trainerNameInp.value = "";
    }

}
/** @returns {EnemyTrainerName} */
export function getEnemyTrainerName() {
    return trainerName;
}

/** @type {TeamPokemon[]} */
export const trainerPokemons = [];

/** Resets all enemy trainer Pokes to a cleared state */
export function clearAllTrainerPokemon(){
    trainerPokemons.map((pokemon) => (pokemon.clear()));
}