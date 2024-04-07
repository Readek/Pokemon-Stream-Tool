import { current } from "../../Globals.mjs";
import { citra } from "./Citra.mjs";

const indexSize = 4;

class ReadPartyIndexes {

    /**
     * Asks Citra for the current player Pokemon positions
     * @returns {Number[]} Positions for each pokemon in the party
     */
    async getPartyIndexes() {

        const indexes = [];
        const indexData = [];
        const indexAddress = this.#getIndexAddress(current.game);

        for (let i = 0; i < 6; i++) {
            
            // add an offset every time we run this loop
            const readAddress = indexAddress + i * indexSize;

            // ask citra for some raw data and wait for it
            indexData.push(await citra.readMemory(readAddress, indexSize));
            
        }

        // create an array with the actual party order
        for (let i = 0; i < indexData.length; i++) {
            indexes.push(this.#translateIndex(indexData[i][1]))
        }

        return indexes;

    }

    /**
     * Returns the memory adress for the player's pokemon indexes
     * @param {String} game - Game to read from: XY / ORAS / SM / USUM
     * @returns {Number}
     */
    #getIndexAddress(game) {

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
    #translateIndex(value) {

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

    }

}

export const readPartyIndexes = new ReadPartyIndexes;