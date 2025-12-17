import { getLocalizedText } from "../../../Utils/Language.mjs";
import { openConfModal } from "../../Confirmation Modal.mjs";
import { fetchFile } from "../../Fetch File.mjs";
import { fileExists } from "../../File System.mjs";
import { stPath } from "../../Globals.mjs";
import { displayNotif } from "../../Notifications.mjs";

const url = "https://unpkg.com/@pkmn/";
const dexUpdateDays = document.getElementById("dexUpdateDays");

document.getElementById("dexUpdateButt").addEventListener("click", () => {
    openConfModal(
        "confModalTitleUpdateDex", "confModalDescUpdateDex",
        "confModalBtnUpdateDex", updateDexLibs
    );
})

/** Updates Pokedex libraries */
async function updateDexLibs(noNotif) {

    const promises = [];

    promises.push(fetchFile(url + "dex", stPath.dexLibs+"dex.js"));
    promises.push(fetchFile(url + "data", stPath.dexLibs+"data.js"));
    promises.push(fetchFile(url + "img", stPath.dexLibs+"img.js"));

    await Promise.all(promises);

    checkLastUpdate();

    if (!noNotif) {
        displayNotif(getLocalizedText("dexUpdateNotif"));
    }

}

/** Checks if Pokedex libraries exist, downloading them if not */
export async function checkDexExistance() {
    if (!await fileExists(stPath.dexLibs+"dex.js")) {
        await updateDexLibs(true);
    }
    // ok this is just because at this point we still havent loaded the user's
    // language so im just waiting a bit so message set by this is localized
    setTimeout(() => {checkLastUpdate()}, 500);
    
}

/** Checks creation date from Pokedex libraries, and updates days since text */
function checkLastUpdate() {

    const fs = require("fs");
    fs.stat(stPath.dexLibs+"dex.js", (err, stats) => {

        if (err) console.log(err);
        const createdDate = Date.parse(stats.birthtime);
        const nowDate = Date.now()
        const days = Math.floor((nowDate - createdDate) / (1000 * 3600 * 24));

        dexUpdateDays.innerText = getLocalizedText("dexUpdateSettingsDays", [days]);

    });

}