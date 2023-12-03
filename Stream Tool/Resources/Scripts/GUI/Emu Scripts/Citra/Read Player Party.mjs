import { citra } from "./Citra.mjs";
import { RawPokemon } from "./Raw Pokemon.mjs";

const blockSize = 56;
const slotOffset = 484;
const statDataOffset = 112;
const slotDataSize = (8 + (4 * blockSize));
const statDataSize = 22;

class ReadPlayerParty {

    /**
     * Asks Citra for the current player Pokemon party
     * @returns {RawPokemon[]} Pokemon party data
     */
    async getParty() {

        const party = [];
        const partyAdress = this.#getPartyAdress("XY"); // todo have a game selector

        // of course, we asume there are 6 max player pokemon
        for (let i = 0; i < 6; i++) {
            
            // add an offset every time we run this loop
            const readAdress = partyAdress + (i * slotOffset);

            // ask citra for some raw data and wait for it
            const partyData = await citra.readMemory(readAdress, slotDataSize);
            const partyStats = await citra.readMemory(readAdress + slotDataSize + statDataOffset, statDataSize);
            
            // if we got everything we need
            if (partyData && partyStats) {
                
                // merge the datas together
                const data = new Uint8Array([...partyData, ...partyStats]);

                // create a new pokemon and push it to the party array
                party.push(new RawPokemon(data));

            }

        }

        return party;

    }

    /**
     * Returns the memory adress for the player party
     * @param {String} game - Game to read from: XY / ORAS / SM / USUM
     * @returns {Number}
     */
    #getPartyAdress(game) {

        if (game == "XY") {
            return 0x8CE1CE8; // seems to only read 1.0 version?
        } else if ("ORAS") {
            return 0x8CF727C
        } else if ("SM") {
            return 0x34195E10;
        } else if ("USUM") {
            return 0x33F7FA44;
        }

    }

}

export const readPartyData = new ReadPlayerParty;