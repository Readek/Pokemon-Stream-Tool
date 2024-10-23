import { current } from "../../Globals.mjs";
import { citra } from "./Citra.mjs";
import { getBattleAddress } from "./Memory Locations/Battle Pokemon.mjs";
import { getEnemyTrainerName } from "./Memory Locations/Enemy Trainer Name.mjs";

const battleTypes = ["Wild", "Trainer", "Multi"];
const dataBegin = 4; // where to start to read
const dataLenght = 6; // max data to read

/**
 * Compares data to determine if the player is currently in a battle
 * @returns {"Wild"|"Trainer"|"Multi"|"None"}
 */
export async function getBattleType() {

    // battle data memory is used for other stuff when outside battle
    // because of this, we need to check if the memory is what we expect
    // so we check if the data we get has a valid dex ID and valid HP values

    for (let i = 0; i < battleTypes.length; i++) {

        const address = getBattleAddress(battleTypes[i], current.game);
        const data = await citra.readMemory(address + dataBegin, dataLenght);

        if (!data) { // if we lost connection with the emu
            return;
        }

        if (checkData(data)) { // if the data is an actual poke

            // we need more checks for gen7
            if (current.generation == 7) {
                // if there is no trainer name, this will be a wild battle
                const trainerName = await getEnemyTrainerName();
                if (!trainerName) return "Wild";
                return "Trainer";
            }

            return battleTypes[i];

        }

    }

    return "None";

}

/**
 * Checks if data could be an actual pokemon
 * @param {Array} data 
 * @returns {Boolean}
 */
function checkData(data) {

    const dexNum = data[0] + data[1]*256;
    const curHP = data[4] + data[5]*256;
    const maxHP = data[2] + data[3]*256;

    return dexNum != 0 && maxHP != 0 // both cant be 0
        && curHP <= maxHP && curHP <= 999 && maxHP <= 999 // valid hp values
        && dexNum <= 809 // max gen 7 dex number

}
