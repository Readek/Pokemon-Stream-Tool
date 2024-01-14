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

export function clearAllCatches(){
    catches.map((pokemon) => (pokemon.clear())); //map doesn't modify the original array, but each .clear() call does.
}
export function randomizeAllCatches(){ //Useful for quick testing.
    catches.map((pokemon) => (pokemon.randomize()));
}
