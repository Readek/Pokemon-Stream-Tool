import { current } from "../../Globals.mjs";
import { citra } from "./Citra.mjs";
import { getBattleAddress } from "./Memory Locations/Battle Pokemon.mjs";

let oldArr = [];

/** Reads a memory region, and logs in the console whenever a value has changed */
export async function debugCitraMemory() {

    const addressToRead = getBattleAddress("Wild", current.game);
    const slotOffset = current.generation == 6 ? 580 : 816; // gen7 poke size is bigger
    
    // for gen 6, the order follows: player pokes -> enemy pokes -> fill with clones
    // meaning in a wild battle if you only have 1 poke, slot [0] is yours, [1] is enemy
    // for gen 7, the order is fixed: player [0->5], ally? [6->11], enemy [12->17]
    const pokemonSlot = 12;
    const readAdress = addressToRead + (pokemonSlot * slotOffset);

    // ask citra for some raw data and wait for it
    const pokeData = await citra.readMemory(readAdress, slotOffset);

    // if any data from this new batch is different from previous, log it
    for (let i = 0; i < oldArr.length; i++) {
        if (oldArr[i] != pokeData[i]) {
            // memory address, old value, new value
            console.log(i + " (0x" + i.toString(16) + ")", oldArr[i], pokeData[i]);
        }

    }

    // the old to the new
    oldArr = pokeData;

}
