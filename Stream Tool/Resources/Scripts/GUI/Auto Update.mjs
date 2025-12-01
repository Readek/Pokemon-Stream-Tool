import { openInfoModal } from "./Confirmation Modal.mjs";
import { current, inside } from "./Globals.mjs";
import { sendRemoteData } from "./Remote Requests.mjs";

const autoUpdateButt = document.getElementById("citraButt");
const autoUpdateButtText = document.getElementById("citraButtText");
const autoUpdateHelpButt = document.getElementById("autoHelpButt");
const updateButt = document.getElementById("updateTeamButt");

/** 
 * Shows or hides auto update button for generations that support it
 * @param {Number} gen - Current Generation
 */
export async function displayAutoButt(gen) {

    // disable everything by default
    autoUpdateButt.style.display = "none";
    autoUpdateHelpButt.style.display = "none";
    if (inside.electron) {
        const autoUpdateToggleCitra = await import("./Emu Scripts/Citra/Auto Update Gen 6 7.mjs");
        autoUpdateButt.removeEventListener("click", autoUpdateToggleCitra.autoUpdateToggleCitra);
    } else {
        autoUpdateButt.removeEventListener("click", sendToggleAuto);
    }

    // but some gens have auto support
    if (gen == 6 || gen == 7) {

        autoUpdateButt.style.display = "flex";
        autoUpdateHelpButt.style.display = "flex";

        if (inside.electron) {

            const citraAuto = await import("./Emu Scripts/Citra/Auto Update Gen 6 7.mjs");
            autoUpdateButt.addEventListener("click", citraAuto.autoUpdateToggleCitra);

        } else {
            autoUpdateButt.addEventListener("click", sendToggleAuto);
        }

    }

}

/** Sends signal to the GUI to toggle auto update */
function sendToggleAuto() {
    sendRemoteData({
        message: "RemoteUpdateGUI",
        type: "Auto",
        value: !current.autoStatus
    })
}
/**
 * Toggles auto update state
 * @param {Boolean} value 
 */
export async function setAutoState(value) {

    if (inside.electron) {

        current.autoStatus = !value;

        const citraAuto = await import("./Emu Scripts/Citra/Auto Update Gen 6 7.mjs");
        citraAuto.autoUpdateToggleCitra();

    } else {

        current.autoStatus = value;
        updateButt.disabled = value;

        if (value) {
            autoUpdateButtText.innerText = "AUTO ON";
            autoUpdateButt.classList.remove("citraButtOff");
        } else {
            autoUpdateButtText.innerText = "AUTO OFF";
            autoUpdateButt.classList.add("citraButtOff");
        }

    }

}

// set up help button
autoUpdateHelpButt.addEventListener("click", () => {
    openInfoModal("autoHelpModalTitle", "autoHelpModalDesc");
})