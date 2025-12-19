import { getLocalizedText } from "../../../Utils/Language.mjs";
import { fetchOffsets, fetchSpritesheets } from "../../Asset Download.mjs";
import { openConfModal } from "../../Confirmation Modal.mjs";
import { stPath } from "../../Globals.mjs";
import { displayNotif } from "../../Notifications.mjs";

document.getElementById("killCacheButt").addEventListener("click", () => {
    openConfModal(
        "confModalTitleKillCache", "confModalDescKillCache",
        "confModalBtnKillCache", clearAssetCache
    );
})

/** Removes all downloaded assets and re-downloads base files */
function clearAssetCache() {

    const fs = require("fs");

    // remove them spritesheets!
    fs.rmSync(stPath.assets + "/Pokemon/pokemonicons-sheet.png");
    fs.rmSync(stPath.assets + "/Items/itemicons-sheet.png");
    fs.rmSync(stPath.assets + "/Pokemon/offsets.json");

    // all image folders!
    const folds = fs.readdirSync(stPath.assets + "/Pokemon/sprites", {withFileTypes: true})
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    folds.forEach(dir => {
        fs.rmSync(`${stPath.assets}/Pokemon/sprites/${dir}`, { recursive: true});
    });

    // download poke and item spritesheets, and offsets!
    fetchSpritesheets();
    fetchOffsets();

    displayNotif(getLocalizedText("killCacheNotif"));

}