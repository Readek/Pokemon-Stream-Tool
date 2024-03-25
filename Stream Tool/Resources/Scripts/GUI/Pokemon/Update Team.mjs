import { inside } from "../Globals.mjs";
import { pokemons } from "./TeamPokemons.mjs";

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
        playerPokemons: [], // more lines will be added below
    };

    const promises = [];

    // add the teams's info
    for (let i = 0; i < pokemons.length; i++) {

        // add it to the main json
        dataJson.playerPokemons.push({
            internalSpecies : pokemons[i].getInternalSpecies(),
            species : pokemons[i].getSpecies(),
            nickName : pokemons[i].getNickName() || pokemons[i].getSpecies(),
            lvl : pokemons[i].getLvl(),
            form : pokemons[i].getForm(),
            gender : pokemons[i].getGender(),
            shiny : pokemons[i].getShiny(),
            hpCurrent : pokemons[i].getHpCurrent(),
            hpMax : pokemons[i].getHpMax(),
            status : pokemons[i].getStatus(),
            types : pokemons[i].getTypes(),
        })

        // download images if needed and wait for them
        promises.push(await pokemons[i].getImgSrc())

    }

    // once pokemon images are loaded, add them in
    const pokeImgs = await Promise.all(promises);
    for (let i = 0; i < pokemons.length; i++) {
        dataJson.playerPokemons[i].img = pokeImgs[i];
    }

    // its time to send the data away
    if (inside.electron) {

        const ipc = await import("../IPC.mjs");
        ipc.updateStoredData("team", JSON.stringify(dataJson, null, 2));
        ipc.sendData("team");
        ipc.sendRemoteData("team");

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
