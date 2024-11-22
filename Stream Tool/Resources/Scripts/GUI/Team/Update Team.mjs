import { inside } from "../Globals.mjs";
import { displayLoadImgsMessage, hideLoadImgsMessage } from "../Loading Images Message.mjs";
import { getBattleState } from "./Battle State.mjs";
import { pokemons } from "./TeamPokemons.mjs";

const updateButt = document.getElementById("updateTeamButt");
const updateText = document.getElementById("updateTeamText");

updateButt.addEventListener("click", updateTeam);

let loading = false;

/** Generates an object with game data, then sends it */
export async function updateTeam() {

    // if for any reason we got here while waiting for a current update, do nothing
    if (loading) return;

     // if this is a remote browser, display some visual feedback
     if (!inside.electron) {
        changeUpdateText("SENDING DATA...");
        // disable updating until we get data back
        disableTeamUpdate();
    } else {
        // show some feedback if img loading takes too long
        displayLoadImgsMessage("team");
        loading = true;
    }

    // this is what's going to be sent to the browsers
    const dataJson = {
        id : "gameData",
        type : "Team",
        playerPokemons: [], // more lines will be added below,
        battleType: getBattleState()
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
            status : pokemons[i].getStatus(),
            types : pokemons[i].getTypes(),
            hpCurrent : pokemons[i].getHpCurrent(),
            hpMax : pokemons[i].getHpMax(),
            exp : pokemons[i].getExp(),
            ability : pokemons[i].getAbility(),
            item : pokemons[i].getItem(),
            itemCoords : pokemons[i].getItemCoords(),
            moves : pokemons[i].getMoves(),
            stats : pokemons[i].getStats(),
            boosts : pokemons[i].getBoosts(),
            inCombat : pokemons[i].getInCombat(),
            iconCoords : pokemons[i].getIconCoords()
        })

        // download images if needed and wait for them
        if (inside.electron) promises.push(await pokemons[i].getImgSrc())

    }

    // its time to send the data away
    if (inside.electron) {

        // once pokemon images are loaded, add them in
        const pokeImgs = await Promise.all(promises);
        for (let i = 0; i < pokemons.length; i++) {
            dataJson.playerPokemons[i].img = pokeImgs[i];
        }

        const ipc = await import("../IPC.mjs");
        ipc.updateStoredData("team", JSON.stringify(dataJson, null, 2));
        ipc.sendData("team");
        ipc.sendRemoteData("team");

        hideLoadImgsMessage("team");

    } else { // for remote GUIs

        const remote = await import("../Remote Requests.mjs");
        dataJson.id = "";
        dataJson.message = "RemoteUpdateGUI";
        remote.sendRemoteData(dataJson);

    }
    
    loading = false;

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
