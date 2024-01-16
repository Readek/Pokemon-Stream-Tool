import { inside } from "../Globals.mjs";
import { Pokemon } from "./Pokemon.mjs";

/** @type {Pokemon[]} */
export const pokemons = [];

export function clearAllPokemon(){
    pokemons.map((pokemon) => (pokemon.clear())); //map doesn't modify the original array, but each .clear() call does.
}
export function randomizeAllPokemon(){ //Useful for quick testing.
    pokemons.map((pokemon) => (pokemon.randomize()));
}

// citra memory reading button
if (inside.electron) {

    const readpartydata = await import("../Emu Scripts/Citra/Read Player Party.mjs");
    document.getElementById("citraButt").addEventListener("click", async () => {

        const rawPokes = await readpartydata.readPartyData.getParty();

        for (let i = 0; i < pokemons.length; i++) {
            pokemons[i].setSpecies(rawPokes[i].speciesName());
            pokemons[i].setNickName(rawPokes[i].nickname());
            pokemons[i].setLvl(rawPokes[i].level());
            pokemons[i].setGender(rawPokes[i].gender());
            pokemons[i].setStatus(rawPokes[i].status());
        }

    })

}