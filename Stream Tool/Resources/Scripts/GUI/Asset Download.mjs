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