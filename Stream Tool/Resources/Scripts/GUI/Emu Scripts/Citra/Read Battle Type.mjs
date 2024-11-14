import { current } from "../../Globals.mjs";
import { citra } from "./Citra.mjs";
import { getBattleAddress } from "./Memory Locations/Battle Pokemon.mjs";
/** @import { BattleType } from "../../../Utils/Type Definitions.mjs" */

const battleTypes = ["Wild", "Trainer", "Multi"];
const dataBegin = 4; // where to start to read
const dataLenght = 6; // max data to read

/**
 * Compares data to determine if the player is currently in a battle
 * @returns {BattleType}
 */
export async function getBattleType() {

    // battle data memory is used for other stuff when outside battle
    // because of this, we need to check if the memory is what we expect
    // so we check if the data we get has a valid dex ID and valid HP values

    for (let i = 0; i < battleTypes.length; i++) {

        const address = getBattleAddress(battleTypes[i], current.game);
        const data = await citra.readMemory(address + dataBegin, dataLenght);

        // if we lost connection with the emu
        if (!data) return;

        if (checkData(data)) { // if the data is an actual poke

            // in gen7, battle memory doesn't get flushed out after a battle
            // this means that we need to make aditional checks
            if (current.generation == 7) {

                // i have literally no idea what this is
                // but its 0 out of combat and 1 in combat
                const someAdd = current.game == "SM" ? 0x341C8CCD : 0x33FC1F65;
                const someData = await citra.readMemory(someAdd, 1);
                if (!someData[0]) return "None";

                // also, in gen7 every battle type happens on the same memory location
                // and again, i have no idea what this is, but 0 for wilds 1 for trainers
                const otherAdd = current.game == "SM" ? 0x3421BD74 : 0x340178B9;
                const otherData = await citra.readMemory(otherAdd, 1);
                if (!otherData[0]) return "Wild";
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
