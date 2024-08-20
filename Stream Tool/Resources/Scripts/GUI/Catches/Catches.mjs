import { current } from "../Globals.mjs";
import { Catch } from "./Catch.mjs";

/** @type {Catch[]} */
export const catches = [];

document.getElementById("addCatchButt").addEventListener("click", () => {
    catches.push(new Catch());
});

/**
 * Removes a Catch from the array
 * @param {Number} id - Catch identifier
 */
export function deleteCatch(id) {

    for (let i = 0; i < catches.length; i++) {
        if (catches[i].getId() == id) {
            catches.splice(i, 1);
            break;
        }
    }
    
}

document.getElementById("clearCatchesButt").addEventListener("click", () => {
    clearAllCatches();
});

/** Clears all catches currently loaded */
function clearAllCatches(){
    for (let i = catches.length-1; i >= 0; i--) {
        catches[i].delet();
    }
    catches.push(new Catch());
}
export function randomizeAllCatches(){ //Useful for quick testing.
    catches.map((pokemon) => (pokemon.randomize()));
}

/** Adds the entire current pokedex as catches */
export function catchesAsPokedex() {
    
    const speciesList = [...current.pkmnSpecies].filter(
        (poke) => (!poke.forme) // Checks if the Pokémon is not a forme (other than the base forme).
    ).sort(
        (poke1, poke2) => (poke1.num - poke2.num) // Sorts by National Dex number. 
    );

    for (let i = 0; i < speciesList.length; i++) {
        catches.push(new Catch());
        catches[i].setSpecies(speciesList[i].name);
    }

}
