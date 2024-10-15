import { current } from "../../../Globals.mjs";
import { citra } from "../Citra.mjs";

const indexSize = 4;

/**
 * Asks Citra for the current player Pokemon positions
 * @returns {Number[]} Positions for each pokemon in the party
 */
export async function getPartyIndexes() {

    const indexes = [];
    const indexAddress = getIndexAddress(current.game);

    // ask citra for some raw data and wait for it
    const data = await citra.readMemory(indexAddress, indexSize * 6);

    // create an array with the actual party order
    for (let i = 0; i < 6; i++) {
        const indexData = data.slice(i * indexSize, i * indexSize + indexSize);
        indexes.push(translateIndex(indexData[1]));
    }

    return indexes;

}

/**
 * Returns the memory adress for the player's pokemon indexes
 * @param {String} game - Game to read from: XY / ORAS / SM / USUM
 * @returns {Number}
 */
function getIndexAddress(game) {

    if (game == "XY") {
        if (current.version == "1.0") {
            return 0x08CE1C5C;
        } else if (current.version == "1.5") {
            return 0x08CE1C6C;
        }
    } else if (game == "ORAS") {
        if (current.version == "1.0") {
            return 0x08CF71F0;
        } else if (current.version == "1.4") {
            return 0x08CFB1E0;
        }
    } else if (game == "SM") {
        return 0x34195D84;
    } else if (game == "USUM") {
        return 0x33F7F9B8;
    }

}

/**
 * Translates raw data into the pokemon's index number
 * @param {Number} value - Raw data given by Citra
 * @returns {Number} Party index
 */
function translateIndex(value) {

    // this should be properly decrypted, however i have no idea
    // how decrypting works so this ugly wall will have to do

    // XY
    if (value == 28) {
        return 0;
    } else if (value == 30) {
        return 1;
    } else if (value == 32) {
        return 2;
    } else if (value == 34) {
        return 3;
    } else if (value == 36) {
        return 4;
    } else if (value == 38) {
        return 5;
    }

    // ORAS 1.0
    if (value == 114) {
        return 0;
    } else if (value == 116) {
        return 1;
    } else if (value == 118) {
        return 2;
    } else if (value == 119) {
        return 3;
    } else if (value == 121) {
        return 4;
    } else if (value == 123) {
        return 5;
    }

    // ORAS 1.4
    if (value == 178) {
        return 0;
    } else if (value == 180) {
        return 1;
    } else if (value == 181) {
        return 2;
    } else if (value == 183) {
        return 3;
    } else if (value == 185) {
        return 4;
    } else if (value == 187) {
        return 5;
    }

}
