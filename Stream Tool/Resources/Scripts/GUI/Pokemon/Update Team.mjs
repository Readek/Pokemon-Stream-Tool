import { inside } from "../Globals.mjs";
import { pokemons } from "./Pokemons.mjs";

const updateButt = document.getElementById("updateTeamButt");
const updateText = document.getElementById("updateTeamText");

updateButt.addEventListener("click", updateTeam);

/** Generates an object with game data, then sends it */
export async function updateTeam() {

     // if this is a remote browser, display some visual feedback
     if (!inside.electron) {
        changeUpdateText("SENDING DATA...");
        // disable updating until we get data back
        disableTeamUpdate();
    }

    // this is what's going to be sent to the browsers
    const dataJson = {
        id : "gameData",
        type : "Team",
        playerPokemons: [] // more lines will be added below
    };

    // add the teams's info
    for (let i = 0; i < pokemons.length; i++) {

        // finally, add it to the main json
        dataJson.playerPokemons.push({
            species : pokemons[i].getSpecies(),
            nickName : pokemons[i].getNickName(),
            lvl : pokemons[i].getLvl(),
            form : pokemons[i].getForm(),
            gender : pokemons[i].getGender(),
            types : pokemons[i].getTypes(),
            img : pokemons[i].getSpriteImgSrc()
        })

    }

    // its time to send the data away
    if (inside.electron) {

        const ipc = await import("../IPC.mjs");
        ipc.updateTeamData(JSON.stringify(dataJson, null, 2));
        ipc.sendTeamData();
        ipc.sendRemoteTeamData();

    } else { // for remote GUIs

        const remote = await import("../Remote Requests.mjs");
        dataJson.id = "";
        dataJson.message = "RemoteUpdateGUI";
        remote.sendRemoteData(dataJson);

    }
    
}

/** removes click event listener from update button */
export function disableTeamUpdate() {
    updateButt.removeEventListener("click", updateTeam);
}
/** enables click event listener to update button */
export function enableTeamUpdate() {
    updateButt.addEventListener("click", updateTeam);
    changeUpdateText("UPDATE TEAM");
}

/**
 * Changes the text displayed on the update button
 * @param {String} text - New button text
 */
function changeUpdateText(text) {
    updateText.innerHTML = text;
}