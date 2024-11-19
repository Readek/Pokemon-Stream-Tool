import { fetchFile } from "./Fetch File.mjs"
import { fileExists } from "./File System.mjs"
import { stPath } from "./Globals.mjs"

/** Downloads Pokemon and Icon Spritesheets if not already downloaded */
export async function fetchSpritesheets() {

    // icons spritesheet
    if (!await fileExists(stPath.assets + "/Pokemon/sprites/pokemonicons-sheet.png")) {
        await fetchFile(
        "https://gitlab.com/pokemon-stream-tool/pokemon-stream-tool-assets/-/raw/main/play.pokemonshowdown.com/sprites/pokemonicons-sheet.png",
        stPath.assets + "/Pokemon/sprites/pokemonicons-sheet.png"
        )
    }

    // items icons spritesheet
    if (!await fileExists(stPath.assets + "/Items/itemicons-sheet.png")) {
        await fetchFile(
        "https://gitlab.com/pokemon-stream-tool/pokemon-stream-tool-assets/-/raw/main/play.pokemonshowdown.com/sprites/itemicons-sheet.png",
        stPath.assets + "/Items/itemicons-sheet.png"
    )
    }

    // offsets
    if (!await fileExists(stPath.assets + "/Pokemon/sprites/offsets.json")) {
    await fetchFile(
        "https://gitlab.com/pokemon-stream-tool/pokemon-stream-tool-assets/-/raw/main/offsets.json",
        stPath.assets + "/Pokemon/sprites/offsets.json"
    )
    }

}