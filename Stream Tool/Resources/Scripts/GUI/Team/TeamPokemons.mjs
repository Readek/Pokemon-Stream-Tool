import { TeamPokemon } from "./TeamPokemon.mjs";

/** @type {TeamPokemon[]} */
export const pokemons = [];

const addPokeButt = document.getElementById("addTeamPokeButt");
const noPokesMessage = document.getElementById("noTeamPokesMessage");
addPokeButt.addEventListener("click", addTeamPokemon);

export function addTeamPokemon() {
    pokemons.push(new TeamPokemon());
    checkTeamSize();
}

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
    checkTeamSize();
}

/** Shows or hides add poke button and no pokes message */
function checkTeamSize() {
    if (pokemons.length == 0) {
        noPokesMessage.style.display = "flex";
    } else {
        noPokesMessage.style.display = "none";
    }
    if (pokemons.length >= 6) {
        addPokeButt.style.display = "none";
    } else {
        addPokeButt.style.display = "flex";
    }
}

export function clearAllPokemon(){
    pokemons.map((pokemon) => (pokemon.clear())); //map doesn't modify the original array, but each .clear() call does.
}
export function randomizeAllPokemon(){ //Useful for quick testing.
    pokemons.map((pokemon) => (pokemon.randomize()));
}
