import { inside } from "../Globals.mjs";
import { displayLoadImgsMessage, hideLoadImgsMessage } from "../Loading Images Message.mjs";
import { wildEncounter } from "./Wild Pokemon.mjs";

const updateButt = document.getElementById("updateWildButt");
const updateText = document.getElementById("updateWildText");

updateButt.addEventListener("click", updateWildEnc);

let loading = false;

/** Generates an object with wild encounter data, then sends it */
export async function updateWildEnc() {

    // if for any reason we got here while waiting for a current update, do nothing
    if (loading) return;

    // if this is a remote browser, display some visual feedback
    if (!inside.electron) {
       changeUpdateText("SENDING DATA...");
       // disable updating until we get data back
       disableWildUpdate();
    } else {
        // show some feedback if img loading takes too long
        displayLoadImgsMessage("wild");
        loading = true;
    }

   // this is what's going to be sent to the browsers
   const dataJson = {
       id : "gameData",
       type : "Wild Encounter",
       pokemons : [await wildEncounter.sendData()],
   };

   // its time to send the data away
   if (inside.electron) {

        const ipc = await import("../IPC.mjs");
        ipc.updateStoredData("wild", JSON.stringify(dataJson, null, 2));
        ipc.sendData("wild");
        ipc.sendRemoteData("wild");

        hideLoadImgsMessage("wild");

    } else { // for remote GUIs

        const remote = await import("../Remote Requests.mjs");
        dataJson.id = "";
        dataJson.message = "RemoteUpdateGUI";
        remote.sendRemoteData(dataJson);

    }

    loading = false;

}

/** removes click event listener from update button */
export function disableWildUpdate() {
    updateButt.removeEventListener("click", updateWildEnc);
}
/** enables click event listener to update button */
export function enableWildUpdate() {
    updateButt.addEventListener("click", updateWildEnc);
    changeUpdateText("UPDATE ENCOUNTER");
}

/**
 * Changes the text displayed on the update button
 * @param {String} text - New button text
 */
function changeUpdateText(text) {
    updateText.innerHTML = text;
}