import { current } from "../../Globals.mjs";
import { citra } from "./Citra.mjs";
import { rawBattlePokes } from "./Raw Pokes/Raw Pokes.mjs";

const slotOffset = 580;
const blockSize = 332;

class ReadPlayerBattle {

    /**
     * Asks Citra for the player's Pokemon data in a battle
     * @param {String} type - Type of battle
     * @param {Number} pokeNum - What pokemon to read
     */
    async getPokeBattle(type, pokeNum) {

        const addressToRead = getBattleAddress(type);

        // add an offset every time we run this loop
        const readAdress = addressToRead + ((pokeNum) * slotOffset);

        // ask citra for some raw data and wait for it
        const pokeData = await citra.readMemory(readAdress, blockSize);

        // if we got everything we need
        if (pokeData) {

            // create a new pokemon with this new data
            rawBattlePokes[pokeNum].newData(pokeData);

        }

    }

}

/**
 * Returns the memory adress for a player's Pokemon in a battle
 * @param {String} type - Type of battle
 * @returns {Number}
 */
export function getBattleAddress(type) {

    const game = current.game;

    if (type == "Wild") {
        
        if (game == "XY") {
            return 0x8203ED0;
        } else if (game == "ORAS") {
            return 0x82041FC;
        } else if (game == "SM" || game == "USUM") {
            return 0x30002770;
        }

    } else if (type == "Trainer") {
        
        if (game == "XY") {
            return 0x82059E0;
        } else if (game == "ORAS") {
            return 0x8205D0C;
        } else if (game == "SM" || game == "USUM") {
            return 0x30009758;
        }

    } else if (type == "Multi") {
        
        if (game == "XY") {
            return 0x8209D98;
        }
        
    }

}

export const readPokeBattleData = new ReadPlayerBattle;