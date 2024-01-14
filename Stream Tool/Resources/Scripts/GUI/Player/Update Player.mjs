import { inside } from "../Globals.mjs";
import { getBadges } from "./Gym Badges.mjs";
import { playerStats } from "./Stats.mjs";

const updateButt = document.getElementById("updatePlayerButt");
const updateText = document.getElementById("updatePlayerText");

updateButt.addEventListener("click", updatePlayer);

/** Generates an object with game data, then sends it */
export async function updatePlayer() {

     // if this is a remote browser, display some visual feedback
     if (!inside.electron) {
        changeUpdateText("SENDING DATA...");
        // disable updating until we get data back
        disablePlayerUpdate();
    }

    // this is what's going to be sent to the browsers
    const dataJson = {
        id : "gameData",
        type : "Player",
        player : {
            badges : getBadges(),
            catches : playerStats.getCatches(),
            kills : playerStats.getKills(),
            deaths : playerStats.getDeaths()
        }
    };

    // its time to send the data away
    if (inside.electron) {

        const ipc = await import("../IPC.mjs");
        ipc.updateStoredData("player", JSON.stringify(dataJson, null, 2));
        ipc.sendData("player");
        ipc.sendRemoteData("player");

    } else { // for remote GUIs

        const remote = await import("../Remote Requests.mjs");
        dataJson.id = "";
        dataJson.message = "RemoteUpdateGUI";
        remote.sendRemoteData(dataJson);

    }
    
}

/** removes click event listener from update button */
export function disablePlayerUpdate() {
    updateButt.removeEventListener("click", updatePlayer);
}
/** enables click event listener to update button */
export function enablePlayerUpdate() {
    updateButt.addEventListener("click", updatePlayer);
    changeUpdateText("UPDATE PLAYER");
}

/**
 * Changes the text displayed on the update button
 * @param {String} text - New button text
 */
function changeUpdateText(text) {
    updateText.innerHTML = text;
}