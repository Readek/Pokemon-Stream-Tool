import { current } from "../../../Globals.mjs";
import { citra } from "../Citra.mjs";
import { rawPartyPokes } from "../Raw Pokes/Raw Pokes.mjs";

const slotOffset = 484;
const statDataOffset = 112;
const slotDataSize = 232;
const statDataSize = 22;

class ReadPlayerParty {

    /**
     * Asks Citra for the current player Pokemon party
     * @returns {Boolean} True if everything went alright! :)
     */
    async getParty() {

        const partyAdress = this.#getPartyAdress(current.game);

        // of course, we asume there are 6 max player pokemon
        for (let i = 0; i < 6; i++) {

            // add an offset every time we run this loop
            const readAdress = partyAdress + (i * slotOffset);

            // ask citra for some raw data and wait for it
            const partyData = await citra.readMemory(readAdress, slotDataSize);

            // if we got the things, continue getting data
            const partyStats = await citra.readMemory(readAdress + slotDataSize + statDataOffset, statDataSize);

            // if we got everything we need
            if (partyData && partyStats) {

                // merge the datas together
                const data = new Uint8Array([...partyData, ...partyStats]);

                // create a new pokemon with this new data
                rawPartyPokes[i].newData(data);

            }

        }

        return true;

    }

    /**
     * Returns the memory adress for the player party
     * @param {String} game - Game to read from: XY / ORAS / SM / USUM
     * @returns {Number}
     */
    #getPartyAdress(game) {

        if (game == "XY") {
            if (current.version == "1.0") {
                return 0x8CE1CE8;
            } else if (current.version == "1.5") {
                return 0x8CE1CF8;
            }
        } else if (game == "ORAS") {
            if (current.version == "1.0") {
                return 0x8CF727C;
            } else if (current.version == "1.4") {
                return 0x8CFB26C;
            }
        } else if (game == "SM") {
            return 0x34195E10;
        } else if (game == "USUM") {
            return 0x33F7FA44;
        }

    }

}

export const readPartyData = new ReadPlayerParty;