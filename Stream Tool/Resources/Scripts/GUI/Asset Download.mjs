import { fetchFile } from "./Fetch File.mjs"
import { fileExists } from "./File System.mjs"
import { stPath } from "./Globals.mjs"

const url = "https://gitlab.com/pokemon-stream-tool/pokemon-stream-tool-assets/-/raw/main/";

/** Downloads Pokemon and Icon Spritesheets if not already downloaded */
export async function fetchSpritesheets() {

    // icons spritesheet
    if (!await fileExists(stPath.assets + "/Pokemon/pokemonicons-sheet.png")) {
        await fetchFile(
            url + "play.pokemonshowdown.com/sprites/pokemonicons-sheet.png",
            stPath.assets + "/Pokemon/pokemonicons-sheet.png"
        )
    }

    // items icons spritesheet
    if (!await fileExists(stPath.assets + "/Items/itemicons-sheet.png")) {
        await fetchFile(
            url + "play.pokemonshowdown.com/sprites/itemicons-sheet.png",
            stPath.assets + "/Items/itemicons-sheet.png"
        )
    }

}

/** Dowloads offsets json that determines centered positions for pokemon images */
export async function fetchOffsets() {
    if (!await fileExists(stPath.assets + "/Pokemon/offsets.json")) {
        await fetchFile(
            url + "offsets.json",
            stPath.assets + "/Pokemon/offsets.json"
        )
    }
}

/**
 * Finds a requested image depending on current Pokemon data
 * @param {String} name - Pokemon name
 * @param {"gen5ani" | "ani"} sprType - Type of sprites
 * @param {"p1" | "p2"} side - If front facing (`p2`) or back facing (`p1`)
 * @param {"M" | "F" | null} gender
 * @param {Boolean} shiny
 * @returns {String} Image path
 */
export async function fetchPokeImg(name, sprType, side, gender, shiny) {

    // totem forms dont have any assets for gen5 sprites
    if (name.includes("Totem")) name = name.substring(0, name.length - 6);

    let imgData = pkmn.img.Sprites.getPokemon(name, {
        gen: sprType,
        side: side,
        gender: gender,
        shiny: shiny,
        domain: "../../Resources/Assets/Pokemon"
    })

    const browserUrl = imgData.url.replace("https://", ""); // we dont need this
    const cleanUrl = browserUrl.substring(23); // removes until "Pokemon/Sprites/.."
    
    if (!await fileExists(`${stPath.assets}/${cleanUrl}`)) {
        await fetchFile(
            `${url}play.pokemonshowdown.com/${cleanUrl.substring(8)}`,
            stPath.assets + "/" + cleanUrl
        )
    } 

    return browserUrl;

}