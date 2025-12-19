import { getLocalizedText } from "../../../Utils/Language.mjs";
import { openConfModal } from "../../Confirmation Modal.mjs";
import { fetchFile } from "../../Fetch File.mjs";
import { fileExists } from "../../File System.mjs";
import { stPath } from "../../Globals.mjs";
import { displayNotif } from "../../Notifications.mjs";

const url = "https://unpkg.com/@pkmn/";
const urlApi = "https://registry.npmjs.org/@pkmn/dex/";

const dexUpdText = document.getElementById("dexUpdateText");

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

    if (!noNotif) {
        displayNotif(getLocalizedText("dexUpdateNotif"));
    }

}

/** Checks if Pokedex libraries exist, downloading them if not */
export async function checkDexExistance() {
    if (!await fileExists(stPath.dexLibs+"dex.js")) {
        await updateDexLibs(true);
    }
    checkLastUpdate();
}

/** Checks creation date from Pokedex libraries, and updates info text */
function checkLastUpdate() {

    const fs = require("fs");
    // get currently installed library creation date
    fs.stat(stPath.dexLibs+"dex.js", (err, stats) => {

        if (err) console.log(err);
        const createdDate = Date.parse(stats.mtime);

        // now fetch last npm library update time
        fetch(urlApi).then(res => {

            // if api rejects us, bail out
            if (!res.ok) {
                dexUpdText.innerText = getLocalizedText("dexUpdateSettingsError");
                dexUpdText.setAttribute("locText", "dexUpdateSettingsError");
                return;
            }

            res.json().then(data => {

                const dexUpdateTime = Date.parse(data.time.modified);

                let locValue = dexUpdateTime > createdDate ? "Yes" : "No";

                dexUpdText.innerText = getLocalizedText(`dexUpdateSettings${locValue}Update`);
                dexUpdText.setAttribute("locText", `dexUpdateSettings${locValue}Update`);

            });

        })

    });

}