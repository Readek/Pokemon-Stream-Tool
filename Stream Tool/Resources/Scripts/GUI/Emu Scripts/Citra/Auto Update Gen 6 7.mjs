import { getLocalizedText } from "../../../Utils/Language.mjs";
import { current } from "../../Globals.mjs";
import { sendRemoteDataRaw } from "../../IPC.mjs";
import { displayNotif } from "../../Notifications.mjs";
import { pokemons } from "../../Pokemon/TeamPokemons.mjs";
import { updateTeam } from "../../Pokemon/Update Team.mjs";
import { debugCitraMemory } from "./Debug Read.mjs";
import { indexRawParty, rawBattlePokes, rawPartyPokes } from "./Raw Pokes/Raw Pokes.mjs";
import { readBattleType } from "./Read Battle Type.mjs";
import { readPartyIndexes } from "./Read Party Indexes.mjs";
import { readPokeBattleData } from "./Read Player Battle.mjs";
import { readPartyData } from "./Read Player Party.mjs";

const autoUpdateButt = document.getElementById("citraButt");
const updateButt = document.getElementById("updateTeamButt");

let inCombat = false;

/** Activates or deactivates Citra memory reading interval */
export async function autoUpdateToggleCitra() {
    
    if (!current.autoStatus) { // if no auto update is running
        
        // update states
        current.autoStatus = true;
        autoUpdateButt.innerHTML = "🍊 AUTO ON";
        autoUpdateButt.classList.remove("citraButtOff");
        updateButt.disabled = true;

    } else { // if theres a loop running, stop it
        
        autoUpdateButt.innerHTML = "🍊 AUTO OFF";
        autoUpdateButt.classList.add("citraButtOff");
        current.autoStatus = false;
        updateButt.disabled = false;

    }

    // send state to remote GUIS
    sendRemoteDataRaw(JSON.stringify({
        message: "RemoteUpdateGUI",
        type: "Auto",
        value: current.autoStatus
    }, null, 2));

    if (current.autoStatus) {

        autoUpdateLoop();
       
    }

}

async function autoUpdateLoop() {

    let itBroke;

    // check if we can stablish a connection to citra
    if (await updatePlayerTeam()) { // if first update succeeds

        displayNotif(getLocalizedText("notifCitraOk"));

        // fire auto update as soon as each request is finished
        while (current.autoStatus) {

            // trigger the auto update code
            const autoUpdate = updatePlayerTeam();
            // but set a max time so we dont request it more than every game frame
            const timeLimit = new Promise((resolve) => {
                let timeo = setTimeout(() => {
                    resolve();
                    clearTimeout(timeo);
                }, 1000/30, null); // assuming 30 fps
            });

            // when both update and time limit finish
            await Promise.all([autoUpdate, timeLimit]);

            // if update failed at any point, get us out of here
            if (!autoUpdate) {
                itBroke = true;
                break;
            }

        }

    } else {
        itBroke = true;
    }

    // if connection with the emu failed
    if (itBroke && current.autoStatus) {

        displayNotif(getLocalizedText("notifCitraRipLoop"));
        // wait a bit just in case
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (await updatePlayerTeam()) {
            // if reconnecting goes alright, re-enable auto loop
            autoUpdateLoop();
        } else {
            // if citra is ded, toggle auto update off
            displayNotif(getLocalizedText("notifCitraRip"));
            current.autoStatus = true;
            autoUpdateToggleCitra();
        }

    }

}

async function updatePlayerTeam() {

    try { // the amount of possible errors Citra can give are a bit too much

        /* 
        // MEMORY DEBUG, uncomment to use
        await debugCitraMemory();
        return true;
         */

        // first of all, keep track of updates
        current.autoUpdated = false;

        // get current party info
        const rawPokes = await readPartyData.getParty();

        // before continuing, we need to know if the connection to citra was successful
        if (!rawPokes) {

            // if it failed, just return false
            return;

        }

        // get current correct party order
        const rawPokesIndexed = indexRawParty(await readPartyIndexes.getPartyIndexes());

        // check if we are on a battle right now
        const battleType = await readBattleType.getBattleType(rawPokesIndexed[0].dexNum());

        // clear changed states if going in or out of combat
        if (inCombat != battleType) {
            for (let i = 0; i < 6; i++) {
                rawPartyPokes[i].changeHasChanged();
                rawBattlePokes[i].changeHasChanged();
                if (!battleType) { // reset boost texts
                    pokemons[i].setBoosts({
                        atk: 0, def: 0, spa: 0, spd: 0, spe: 0, acc: 0, eva: 0
                    })
                }
            }
            inCombat = battleType;
            current.autoUpdated = true;
        }

        // if we currently are in a battle
        if (battleType) {

            const battlePokes = await readPokeBattleData.getPokeBattle(battleType);

            for (let i = 0; i < pokemons.length; i++) {

                if (battlePokes && rawBattlePokes[i].hasChanged() && rawBattlePokes[i].valid) {

                    // battle memory will use enemy pokemons after the player's pokes
                    // if our team data does not align with battle data, ignore it
                    if (rawPokesIndexed[i].dexNum() == rawBattlePokes[i].dexNum()) {

                        if (rawBattlePokes[i].speciesName() != pokemons[i].getSpecies()) {
                            pokemons[i].setSpecies(rawBattlePokes[i].speciesName());
                        }
                        pokemons[i].setLvl(rawBattlePokes[i].level());
                        pokemons[i].setGender(rawBattlePokes[i].gender());
                        pokemons[i].setStatus(rawBattlePokes[i].status());
                        pokemons[i].setFormNumber(rawBattlePokes[i].formIndex());

                        pokemons[i].setExp(rawBattlePokes[i].experience());
                        pokemons[i].setAbility(rawBattlePokes[i].ability());
                        pokemons[i].setItem(rawBattlePokes[i].item());
                        pokemons[i].setMoves(rawBattlePokes[i].moves());
                        pokemons[i].setHpMax(rawBattlePokes[i].maxHP());
                        pokemons[i].setHpCurrent(rawBattlePokes[i].currentHP());
                        pokemons[i].setStats(rawBattlePokes[i].stats());
                        pokemons[i].setBoosts(rawBattlePokes[i].boosts());

                    }

                }

            }

        } else {
            
            // use party data
            for (let i = 0; i < pokemons.length; i++) {

                if (rawPokesIndexed[i].hasChanged() && rawPokesIndexed[i].valid) {

                    if (rawPokesIndexed[i].speciesName() != pokemons[i].getSpecies()) {
                        pokemons[i].setSpecies(rawPokesIndexed[i].speciesName());
                    }
                    pokemons[i].setNickName(rawPokesIndexed[i].nickname());
                    pokemons[i].setLvl(rawPokesIndexed[i].level());
                    pokemons[i].setGender(rawPokesIndexed[i].gender());
                    pokemons[i].setStatus(rawPokesIndexed[i].status());
                    pokemons[i].setFormNumber(rawPokesIndexed[i].formIndex());

                    pokemons[i].setExp(rawPokesIndexed[i].experience());
                    pokemons[i].setAbility(rawPokesIndexed[i].ability());
                    pokemons[i].setItem(rawPokesIndexed[i].item());
                    pokemons[i].setMoves(rawPokesIndexed[i].moves());
                    pokemons[i].setHpMax(rawPokesIndexed[i].maxHP());
                    pokemons[i].setHpCurrent(rawPokesIndexed[i].currentHP());
                    pokemons[i].setStats(rawPokesIndexed[i].stats());
                    
                }           
                
            }

        }

        // if something was updated at all
        if (current.autoUpdated) {
            await updateTeam();
        }

        return true; // so we all know everything went alright
        
    } catch (e) {
        console.log(e);
        return;
    }

}
