import { citra } from "./Citra.mjs";
import { RawPokemonBattle } from "./Raw Pokemon Battle.mjs";

const slotOffset = 580;

class ReadPlayerBattle {

    /**
     * Asks Citra for the player's Pokemon data in a battle
     * @returns {RawPokemonBattle[]} Pokemon party data
     */
    async getPokeBattle(addressToRead) {

        const pokes = [];

        // of course, we asume there are 6 max player pokemon
        for (let i = 0; i < 6; i++) {
            
            // add an offset every time we run this loop
            const readAdress = addressToRead + (i * slotOffset);

            // ask citra for some raw data and wait for it
            const pokeData = await citra.readMemory(readAdress, slotOffset);

            // if we got everything we need
            if (pokeData) {
                
                // create a new pokemon and push it to the party array
                pokes.push(new RawPokemonBattle(pokeData));

            }

        }

        return pokes;

    }

}

export const readPokeBattleData = new ReadPlayerBattle;