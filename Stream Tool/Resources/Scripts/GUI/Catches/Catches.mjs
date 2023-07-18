import { Catch } from "./Catch.mjs";

/** @type {Catch[]} */
export const catches = [];

document.getElementById("addCatchButt").addEventListener("click", () => {
    catches.push(new Catch());
});

export function clearAllCatches(){
    catches.map((pokemon) => (pokemon.clear())); //map doesn't modify the original array, but each .clear() call does.
}
export function randomizeAllCatches(){ //Useful for quick testing.
    catches.map((pokemon) => (pokemon.randomize()));
}
