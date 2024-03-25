import { inside } from "../Globals.mjs";
import { wildEncounter } from "./Wild Pokemon.mjs";

const updateButt = document.getElementById("updateWildButt");
const updateText = document.getElementById("updateWildText");

updateButt.addEventListener("click", updateWildEnc);

/** Generates an object with wild encounter data, then sends it */
export async function updateWildEnc() {

    // if this is a remote browser, display some visual feedback
    if (!inside.electron) {
       changeUpdateText("SENDING DATA...");
       // disable updating until we get data back
       disableWildUpdate();
   }

   // this is what's going to be sent to the browsers
   const dataJson = {
       id : "gameData",
       type : "Wild Encounter",
       pokemon : await wildEncounter.sendData(),
       inCombat : wildEncounter.getInCombat()
   };

   // its time to send the data away
   if (inside.electron) {

        const ipc = await import("../IPC.mjs");
        ipc.updateStoredData("wild", JSON.stringify(dataJson, null, 2));
        ipc.sendData("wild");
        ipc.sendRemoteData("wild");

    } else { // for remote GUIs

        const remote = await import("../Remote Requests.mjs");
        dataJson.id = "";
        dataJson.message = "RemoteUpdateGUI";
        remote.sendRemoteData(dataJson);

    }

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