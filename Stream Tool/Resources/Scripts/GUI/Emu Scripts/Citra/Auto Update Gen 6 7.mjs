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
    if (await updatePlayerTeam(true)) { // if first update succeeds

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

/**
 * Asks Citra for memory data and translates it to local pokemon classes
 * @param {Boolean} firstLoop If this is first loop after auto toggle
 * @returns {Boolean} False if something went wrong
 */
async function updatePlayerTeam(firstLoop) {

    try { // the amount of possible errors Citra can give are a bit too much

        /* 
        // MEMORY DEBUG, uncomment to use
        await debugCitraMemory();
        return true;
         */

        // first of all, keep track of updates, unless on first loop after toggle
        current.autoUpdated = firstLoop ? true : false;

        // check if we are on a battle right now
        const battleType = await readBattleType.getBattleType();

        // before continuing, we need to know if the connection to citra was successful
        if (!battleType) {

            // if it failed, just return false
            return;

        }

        // clear changed states if going in or out of combat
        let hasChanged = false;
        if (inCombat != battleType) {

            hasChanged = true;

            for (let i = 0; i < 6; i++) {

                // reset boost texts
                if (battleType == "None") {
                    pokemons[i].setBoosts({
                        atk: 0, def: 0, spa: 0, spd: 0, spe: 0, acc: 0, eva: 0
                    })
                }

            }

            inCombat = battleType;
            current.autoUpdated = true;

        }


        // check what type of memory we need to read from
        if (battleType == "None") {

            // get current party info
            await readPartyData.getParty();

            // get current correct party order
            const rawPokesIndexed = indexRawParty(await readPartyIndexes.getPartyIndexes());

            // to force update
            for (let i = 0; i < rawPokesIndexed.length; i++) {
                if (hasChanged) {
                    rawPokesIndexed[i].changeHasChanged();
                };
            }

            // use party data
            for (let i = 0; i < pokemons.length; i++) {

                if (rawPokesIndexed[i].hasChanged() && rawPokesIndexed[i].valid) {

                    pokemons[i].setSpecies(rawPokesIndexed[i].speciesName());

                    // if there's no pokemon, just clear all data and move on
                    if (!pokemons[i].getSpecies()) {
                        pokemons[i].clear();
                        continue;
                    }

                    pokemons[i].setNickName(rawPokesIndexed[i].nickname());
                    pokemons[i].setLvl(rawPokesIndexed[i].level());
                    pokemons[i].setGender(rawPokesIndexed[i].gender());
                    pokemons[i].setShiny(rawPokesIndexed[i].shiny());
                    pokemons[i].setFormNumber(rawPokesIndexed[i].formIndex());

                    pokemons[i].setExp(rawPokesIndexed[i].experience());
                    pokemons[i].setAbility(rawPokesIndexed[i].ability());
                    pokemons[i].setItem(rawPokesIndexed[i].item());
                    pokemons[i].setMoves(rawPokesIndexed[i].moves());
                    pokemons[i].setHpMax(rawPokesIndexed[i].maxHP());
                    pokemons[i].setHpCurrent(rawPokesIndexed[i].currentHP());
                    pokemons[i].setStats(rawPokesIndexed[i].stats());

                    pokemons[i].setStatus(rawPokesIndexed[i].status());
                    
                }           
                
            }

        } else {

            await readPokeBattleData.getPokeBattle(battleType);

            // to force update
            for (let i = 0; i < readPokeBattleData.length; i++) {
                if (hasChanged) {
                    readPokeBattleData[i].changeHasChanged();
                };
            }

            let readCount = 0;

            for (let i = 0; i < pokemons.length; i++) {

                if (rawBattlePokes[i].hasChanged() && rawBattlePokes[i].valid) {

                    // battle memory will place enemy pokemons after the player's
                    // if slot doesnt match party order, thats not a player poke
                    if (rawBattlePokes[i].slot() != i) {
                        break;
                    }

                    // we cant check for a nickname in battle, so if the species
                    // doesnt match, we better just leave the nickname empty
                    if (rawBattlePokes[i].speciesName() != pokemons[i].getSpecies()) {
                        pokemons[i].setNickName("");
                    }

                    pokemons[i].setSpecies(rawBattlePokes[i].speciesName());
                    pokemons[i].setLvl(rawBattlePokes[i].level());
                    pokemons[i].setGender(rawBattlePokes[i].gender());
                    pokemons[i].setFormNumber(rawBattlePokes[i].formIndex());

                    pokemons[i].setExp(rawBattlePokes[i].experience());
                    pokemons[i].setAbility(rawBattlePokes[i].ability());
                    pokemons[i].setItem(rawBattlePokes[i].item());
                    pokemons[i].setMoves(rawBattlePokes[i].moves());
                    pokemons[i].setHpMax(rawBattlePokes[i].maxHP());
                    pokemons[i].setHpCurrent(rawBattlePokes[i].currentHP());
                    pokemons[i].setStats(rawBattlePokes[i].stats());
                    pokemons[i].setBoosts(rawBattlePokes[i].boosts());

                    pokemons[i].setStatus(rawBattlePokes[i].status());

                }

                readCount++;

            }

            // in case player party doesnt have 6 pokemon, clear empty slots
            if (readCount != 0) {
                for (let i = readCount; i < 6; i++) {
                    pokemons[i].clear();
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
