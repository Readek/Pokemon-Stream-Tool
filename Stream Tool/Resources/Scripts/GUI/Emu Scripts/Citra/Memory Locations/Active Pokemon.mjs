import { current } from "../../../Globals.mjs";
import { citra } from "../Citra.mjs";

let prevPokes = {
    player : [],
    enemy : []
}

/**
 * Looks for pokemon currently actively fighting
 * @returns {{player:[], enemy:[]} | undefined} Dexnums for current on the field pokemon
 */
export async function getActivePokemon() {

    const blockSize = current.generation == 6 ? 235568 : 20528;
    // on gen6, a maximum of 6 pokes can be active at once, while gen7 is max 4
    const maxPokeCount = current.generation == 6 ? 6 : 4;

    const pokes = {
        player : [],
        enemy : []
    }

    const baseAdress = getActiveAdress(current.game);

    for (let i = 0; i < maxPokeCount; i++) {

        // add an offset every time we run this loop
        const readAddress = baseAdress + i * blockSize;

        // ask citra for some raw data and wait for it
        const data = await citra.readMemory(readAddress, 2);

        // conver it to an actual number
        const dexNum = data[0] + data[1]*256;

        // if theres nothing there stop the loop
        if (dexNum == 0) {
            // on gen 7, some battles have 1 player active poke, but enemy side has 2
            if (current.generation == 7 && i % 2 == false) {
                continue;
            } else {
                break;
            }
        } 

        if (i % 2) {
            pokes.enemy.push(dexNum);
        } else {
            pokes.player.push(dexNum);
        }

    }

    // check if data changed from previous time
    let changed = false;
    for (let i = 0; i < pokes.player.length; i++) {
        if (pokes.player[i] != prevPokes.player[i]) {
            changed = true;
            break;
        }
    }
    for (let i = 0; i < pokes.enemy.length; i++) {
        if (pokes.enemy[i] != prevPokes.enemy[i]) {
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

/** 
 * Im gonna be honest I don't know what these point at, but it works 
 * @param {"XY" | "ORAS" | "SM" | "USUM"} game
 * @returns {Number} Address pointing at a dex number
 */
export function getActiveAdress(game) {

    if (game == "XY") {
        return 0x83E7098;
    } else if (game == "ORAS") {
        return 0x83F9550;
    } else if (game == "SM") {
        return 0x30E93F98;
    } else if (game== "USUM") {
        return 0x3093EF7C;
    }

}