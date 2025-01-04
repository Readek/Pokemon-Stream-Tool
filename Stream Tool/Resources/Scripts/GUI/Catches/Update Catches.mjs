import { inside } from "../Globals.mjs";
import { catches } from "./Catches.mjs";

const updateButt = document.getElementById("updateCatchesButt");
const updateText = document.getElementById("updateCatchesText");

updateButt.addEventListener("click", updateCatches);

let loading = false;

/** Generates an object with game data, then sends it */
export async function updateCatches() {

    // if for any reason we got here while waiting for a current update, do nothing
    if (loading) return;

     // if this is a remote browser, display some visual feedback
     if (!inside.electron) {
        changeUpdateText("SENDING DATA...");
        // disable updating until we get data back
        disableCatchesUpdate();
    } else {
        loading = true;
    }

    // this is what's going to be sent to the browsers
    const dataJson = {
        id : "gameData",
        type : "Catches",
        pokemons: [], // more lines will be added below
    };

    const promises = [];

    // add the catches info
    for (let i = 0; i < catches.length; i++) {

        if (!catches[i].getSpecies()) continue;

        // add it to the main json
        dataJson.pokemons.push({
            internalSpecies : catches[i].getInternalSpecies(),
            species : catches[i].getSpecies(),
            nickName : catches[i].getNickName(),
            form : catches[i].getForm(),
            gender : catches[i].getGender(),
            shiny : catches[i].getShiny(),
            types : catches[i].getTypes(),
        })

        // download images if needed and wait for them
        if (inside.electron) promises.push(await catches[i].getImgSrc());

    }

    // its time to send the data away
    if (inside.electron) {

        // once pokemon images are loaded, add them in
        const pokeImgs = await Promise.all(promises);
        for (let i = 0; i < pokeImgs.length; i++) {
            dataJson.pokemons[i].img = pokeImgs[i];
        }

        const ipc = await import("../IPC.mjs");
        ipc.updateStoredData("catches", JSON.stringify(dataJson, null, 2));
        ipc.sendData("catches");
        ipc.sendRemoteData("catches");

    } else { // for remote GUIs

        const remote = await import("../Remote Requests.mjs");
        dataJson.id = "";
        dataJson.message = "RemoteUpdateGUI";
        remote.sendRemoteData(dataJson);

    }

    loading = false;

}

/** removes click event listener from update button */
export function disableCatchesUpdate() {
    updateButt.removeEventListener("click", updateCatches);
}
/** enables click event listener to update button */
export function enableCatchesUpdate() {
    updateButt.addEventListener("click", updateCatches);
    changeUpdateText("UPDATE CATCHES");
}

/**
 * Changes the text displayed on the update button
 * @param {String} text - New button text
 */
function changeUpdateText(text) {
    updateText.innerHTML = text;
}