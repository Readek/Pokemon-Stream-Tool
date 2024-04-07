import { citra } from "./Citra.mjs";
import { rawBattlePokes } from "./Raw Pokes/Raw Pokes.mjs";

const slotOffset = 580;
const blockSize = 332;

class ReadPlayerBattle {

    /**
     * Asks Citra for the player's Pokemon data in a battle
     * @returns {Boolean}  True if everything went alright! :)
     */
    async getPokeBattle(addressToRead) {

        // of course, we asume there are 6 max player pokemon
        for (let i = 0; i < 6; i++) {
            
            // add an offset every time we run this loop
            const readAdress = addressToRead + (i * slotOffset);

            // ask citra for some raw data and wait for it
            const pokeData = await citra.readMemory(readAdress, blockSize);

            // if we got everything we need
            if (pokeData) {
                
                // create a new pokemon with this new data
                rawBattlePokes[i].newData(pokeData);

            }

        }

        return true;

    }

}

export const readPokeBattleData = new ReadPlayerBattle;