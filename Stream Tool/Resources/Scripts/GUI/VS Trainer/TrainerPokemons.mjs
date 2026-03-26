import { TeamPokemon } from "../Team/TeamPokemon.mjs";
/** @import { EnemyTrainerName } from "../../Utils/Type Definitions.mjs" */

/** @type {TeamPokemon[]} */
export const trainerPokemons = [];

const addPokeButt = document.getElementById("addTrainerPokeButt");
const noPokesMessage = document.getElementById("noTrainerPokesMessage");
addPokeButt.addEventListener("click", addTrainerPokemon);

export function addTrainerPokemon() {
    trainerPokemons.push(new TeamPokemon(true));
    checkTeamSize();
}

/** Shows or hides add poke button and no pokes message */
function checkTeamSize() {
    if (trainerPokemons.length == 0) {
        noPokesMessage.style.display = "flex";
    } else {
        noPokesMessage.style.display = "none";
    }
    if (trainerPokemons.length >= 6) {
        addPokeButt.style.display = "none";
    } else {
        addPokeButt.style.display = "flex";
    }
}

/**
 * Removes a enemy trainer pokemon from the array
 * @param {Number} id - Class identifier
 */
export function deleteTrainerPokemon(id) {
    for (let i = 0; i < trainerPokemons.length; i++) {
        if (trainerPokemons[i].getId() == id) {
            trainerPokemons.splice(i, 1);
            break;
        }
    }
    checkTeamSize();
}

/** Resets all enemy trainer Pokes to a cleared state */
export function clearAllTrainerPokemon(){
    trainerPokemons.map((pokemon) => (pokemon.clear()));
}


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
