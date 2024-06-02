import { current } from "../../../Globals.mjs";
import { citra } from "../Citra.mjs";

const blockSize = 235568;

let prevPokes = {
    player : [],
    enemy : []
}

/**
 * Looks for pokemon currently actively fighting
 * @returns {{player:[], enemy:[]}} Dexnums for currently on the field pokemon
 */
export async function getActivePokemon() {

    const pokes = {
        player : [],
        enemy : []
    }
    
    const baseAdress = getActiveAdress(current.game);

    for (let i = 0; i < 6; i++) { // 6 as its max number of active pokes (3v3)
        
        // add an offset every time we run this loop
        const readAddress = baseAdress + i * blockSize;

        // ask citra for some raw data and wait for it
        const data = await citra.readMemory(readAddress, 2);

        // conver it to an actual number
        const dexNum = data[0] + data[1]*256;

        // if theres nothing there stop the loop
        if (dexNum == 0) break;

        if (i % 2) {
            pokes.enemy.push(dexNum);
        } else {
            pokes.player.push(dexNum);
        }
        
    }
    
    // check if data changed from previous time
    let changed = false;
    for (let i = 0; i < pokes.player.length; i++) {

        if (pokes.player[i] != prevPokes.player[i] || pokes.enemy[i] != prevPokes.enemy[i]) {
            changed = true;
            break;
        }

    }

    if (changed) {
        prevPokes = pokes;
        return pokes;
    } 

}

/** Resets stored active pokemon states */
export function resetActivePokemon() {
    prevPokes = {
        player : [],
        enemy : []
    }
}

function getActiveAdress(game) {

    if (game == "XY") {
        return 0x83E7098;
    }

}