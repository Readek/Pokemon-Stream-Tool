import { current } from "../../../Globals.mjs";
import { citra } from "../Citra.mjs";
import { rawBattlePokes, rawEnemyPokes } from "../Raw Pokes/Raw Pokes.mjs";

/**
 * Asks Citra for the player's Pokemon data in a battle
 * @param {String} type - Type of battle
 * @param {Number} pokeOffset - What pokemon to read
 * @param {Number} pokeNum - What pokemon to save to
 * @param {Boolean} enemy - If this is an enemy pokemon
 */
export async function getPokeBattle(type, pokeOffset, pokeNum, enemy) {

    const offSet = current.generation == 6 ? 580 : 816;
    const blockSize = current.generation == 6 ? 332 : 562;

    const addressToRead = getBattleAddress(type);

    // add an offset every time we run this loop
    const readAdress = addressToRead + ((pokeOffset) * offSet);

    // ask citra for some raw data and wait for it
    const pokeData = await citra.readMemory(readAdress, blockSize);

    // if we got everything we need
    if (pokeData) {

        // create a new pokemon with this new data
        if (enemy) {
            rawEnemyPokes[pokeNum].newData(pokeData);
        } else {
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
            return 0x30002770;
            // this used to be 0x30009758, however this seems to be a clone of
            // "Wild" region that insta updates everything as soon as the turn starts
            // instead of updating it as each move happens, so we will be using
            // the "Wild" region
        }

    } else if (type == "Multi") {

        if (game == "XY") {
            return 0x8209D98;
        } else if (game == "ORAS") {
            return 0x820932C;
        }

    }

}
