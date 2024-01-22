import { current, inside } from "../Globals.mjs";
import { getBattleAddress } from "../Emu Scripts/Citra/Battle Addresses.mjs";
import { pokemons } from "./Pokemons.mjs";

const updateButt = document.getElementById("updateTeamButt");
const updateText = document.getElementById("updateTeamText");
const autoUpdateButt = document.getElementById("citraButt");

let readMemoryInterval;
let autoUpdateBool;

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

    // add the teams's info
    for (let i = 0; i < pokemons.length; i++) {

        // add it to the main json
        dataJson.playerPokemons.push({
            internalSpecies : pokemons[i].getInternalSpecies(),
            species : pokemons[i].getSpecies(),
            nickName : pokemons[i].getNickName(),
            lvl : pokemons[i].getLvl(),
            form : pokemons[i].getForm(),
            gender : pokemons[i].getGender(),
            shiny : pokemons[i].getShiny(),
            hpCurrent : pokemons[i].getHpCurrent(),
            hpMax : pokemons[i].getHpMax(),
            status : pokemons[i].getStatus(),
            types : pokemons[i].getTypes(),
            img : pokemons[i].getImgSrc()
        })

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

// citra memory reading button
if (inside.electron) {

    const readpartydata = await import("../Emu Scripts/Citra/Read Player Party.mjs");
    const readPokeBattleData = await import("../Emu Scripts/Citra/Read Player Battle.mjs");
    const readPartyIndexes = await import("../Emu Scripts/Citra/Read Party Indexes.mjs");
    const readBattleType = await import("../Emu Scripts/Citra/Read Battle Type.mjs");

    autoUpdateButt.addEventListener("click", () => {

        if (!autoUpdateBool) { // if no auto update is running
            
            autoUpdateBool = true;
            autoUpdateButt.innerHTML = "🍊 AUTO ON";
            autoUpdateButt.classList.remove("citraButtOff");
            updateButt.disabled = true;

            readMemoryInterval = setInterval(async () => {

                // get current party info
                const rawPokes = await readpartydata.readPartyData.getParty();

                // get current correct party order
                const indexes = await readPartyIndexes.readPartyIndexes.getPartyIndexes();
                const rawPokesIndexed = [];

                // reorder pokemon party
                for (let i = 0; i < rawPokes.length; i++) {
                    rawPokesIndexed.push(rawPokes[indexes[i]]);                    
                }

                // check if we are on a battle right now
                const battleType = await readBattleType.readBattleType.
                    getBattleType(rawPokesIndexed[0].dexNum());

                // if we currently are in a battle
                if (battleType) {
                    
                    const addressToRead = getBattleAddress(battleType, current.game);
                    const rawBattlePokes = await readPokeBattleData.readPokeBattleData
                        .getPokeBattle(addressToRead);
            
                    for (let i = 0; i < pokemons.length; i++) {

                        // battle memory will use enemy pokemons after the player's pokes
                        // if our team data does not align with battle data, ignore it
                        if (rawPokesIndexed[i].dexNum() == rawBattlePokes[i].dexNum()) {
                            
                            if (rawBattlePokes[i].speciesName() != pokemons[i].getSpecies()) {
                                pokemons[i].setSpecies(rawBattlePokes[i].speciesName());
                            }
                            pokemons[i].setLvl(rawBattlePokes[i].level());
                            pokemons[i].setHpMax(rawBattlePokes[i].maxHP());
                            pokemons[i].setHpCurrent(rawBattlePokes[i].currentHP());
                            pokemons[i].setStatus(rawBattlePokes[i].status());
                            pokemons[i].setFormNumber(rawBattlePokes[i].formIndex());

                        }
            
                    }

                } else {
                    
                    // use party data
                    for (let i = 0; i < pokemons.length; i++) {
        
                        if (rawPokesIndexed[i].speciesName() != pokemons[i].getSpecies()) {
                            pokemons[i].setSpecies(rawPokesIndexed[i].speciesName());
                        }
                        pokemons[i].setNickName(rawPokesIndexed[i].nickname());
                        pokemons[i].setLvl(rawPokesIndexed[i].level());
                        pokemons[i].setGender(rawPokesIndexed[i].gender());
                        pokemons[i].setHpMax(rawPokesIndexed[i].maxHP());
                        pokemons[i].setHpCurrent(rawPokesIndexed[i].currentHP());
                        pokemons[i].setStatus(rawPokesIndexed[i].status());
                        pokemons[i].setFormNumber(rawPokesIndexed[i].formIndex());
                        
                    }

                }

                updateTeam();
    
            }, 1000);

        } else { // if theres a loop running, stop it
            
            clearInterval(readMemoryInterval);
            autoUpdateButt.innerHTML = "🍊 AUTO OFF";
            autoUpdateButt.classList.add("citraButtOff");
            autoUpdateBool = false;
            updateButt.disabled = false;

        }
        

    })

}