import { inside } from "../Globals.mjs";
import { displayLoadImgsMessage, hideLoadImgsMessage } from "../Loading Images Message.mjs";
import { getEnemyTrainerName, trainerPokemons } from "./TrainerPokemons.mjs";

const updateButt = document.getElementById("updateTrainerButt");
const updateText = document.getElementById("updateTrainerText");

updateButt.addEventListener("click", updateTrainer);

let loading = false;

/** Generates an object with game data, then sends it */
export async function updateTrainer() {

    // if for any reason we got here while waiting for a current update, do nothing
    if (loading) return;

     // if this is a remote browser, display some visual feedback
     if (!inside.electron) {
        changeUpdateText("SENDING DATA...");
        // disable updating until we get data back
        disableTrainerUpdate();
    } else {
        // show some feedback if img loading takes too long
        displayLoadImgsMessage("trainer");
        loading = true;
    }

    // this is what's going to be sent to the browsers
    const dataJson = {
        id : "gameData",
        type : "Trainer",
        pokemons: [], // more lines will be added below
        trainerName : getEnemyTrainerName()
    };

    const promises = [];

    // add the teams's info
    for (let i = 0; i < trainerPokemons.length; i++) {

        // add it to the main json
        dataJson.pokemons.push({
            internalSpecies : trainerPokemons[i].getInternalSpecies(),
            species : trainerPokemons[i].getSpecies(),
            nickName : trainerPokemons[i].getNickName() || trainerPokemons[i].getSpecies(),
            lvl : trainerPokemons[i].getLvl(),
            form : trainerPokemons[i].getForm(),
            gender : trainerPokemons[i].getGender(),
            shiny : trainerPokemons[i].getShiny(),
            status : trainerPokemons[i].getStatus(),
            types : trainerPokemons[i].getTypes(),
            hpCurrent : trainerPokemons[i].getHpCurrent(),
            hpMax : trainerPokemons[i].getHpMax(),
            ability : trainerPokemons[i].getAbility(),
            item : trainerPokemons[i].getItem(),
            itemCoords : trainerPokemons[i].getItemCoords(),
            moves : trainerPokemons[i].getMoves(),
            stats : trainerPokemons[i].getStats(),
            boosts : trainerPokemons[i].getBoosts(),
            inCombat : trainerPokemons[i].getInCombat(),
            iconCoords : trainerPokemons[i].getIconCoords(),
            reveals : trainerPokemons[i].getReveals()
        })

        // download images if needed and wait for them
        if (inside.electron) promises.push(await trainerPokemons[i].getImgSrc())

    }

    // its time to send the data away
    if (inside.electron) {

        // once pokemon images are loaded, add them in
        const pokeImgs = await Promise.all(promises);
        for (let i = 0; i < trainerPokemons.length; i++) {
            dataJson.pokemons[i].img = pokeImgs[i];
        }

        const ipc = await import("../IPC.mjs");
        ipc.updateStoredData("trainer", JSON.stringify(dataJson, null, 2));
        ipc.sendData("trainer");
        ipc.sendRemoteData("trainer");

        hideLoadImgsMessage("trainer");

    } else { // for remote GUIs

        const remote = await import("../Remote Requests.mjs");
        dataJson.id = "";
        dataJson.message = "RemoteUpdateGUI";
        remote.sendRemoteData(dataJson);

    }
    
    loading = false;

}

/** removes click event listener from update button */
export function disableTrainerUpdate() {
    updateButt.removeEventListener("click", updateTrainer);
}
/** enables click event listener to update button */
export function enableTrainerUpdate() {
    updateButt.addEventListener("click", updateTrainer);
    changeUpdateText("UPDATE TRAINER");
}

/**
 * Changes the text displayed on the update button
 * @param {String} text - New button text
 */
function changeUpdateText(text) {
    updateText.innerHTML = text;
}
