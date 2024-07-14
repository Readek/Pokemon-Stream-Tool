import { getLocalizedText } from "../../../Utils/Language.mjs";
import { current } from "../../Globals.mjs";
import { sendRemoteDataRaw } from "../../IPC.mjs";
import { displayNotif } from "../../Notifications.mjs";
import { pokemons } from "../../Team/TeamPokemons.mjs";
import { trainerPokemons } from "../../VS Trainer/TrainerPokemons.mjs";
import { updateTeam } from "../../Team/Update Team.mjs";
import { updateTrainer } from "../../VS Trainer/Update Trainer.mjs";
import { debugCitraMemory } from "./Debug Read.mjs";
import { indexRawParty, rawBattlePokes, rawEnemyPokes } from "./Raw Pokes/Raw Pokes.mjs";
import { getBattleType } from "./Read Battle Type.mjs";
import { getPartyIndexes } from "./Memory Locations/Party Indexes.mjs";
import { getPokeBattle } from "./Memory Locations/Battle Pokemon.mjs";
import { readPartyData } from "./Memory Locations/Party Pokemon.mjs";
import { getActivePokemon, resetActivePokemon } from "./Memory Locations/Active Pokemon.mjs";
import { setBattleState } from "../../Team/Battle State.mjs";
import { wildEncounter } from "../../VS Wild/Wild Pokemon.mjs";
import { updateWildEnc } from "../../VS Wild/Update Wild.mjs";

const autoUpdateButt = document.getElementById("citraButt");

let inCombat = false;

/** Activates or deactivates Citra memory reading interval */
export async function autoUpdateToggleCitra() {
    
    if (!current.autoStatus) { // if no auto update is running
        
        // update states
        current.autoStatus = true;
        autoUpdateButt.innerHTML = "🍊 AUTO ON";
        autoUpdateButt.classList.remove("citraButtOff");

    } else { // if theres a loop running, stop it
        
        autoUpdateButt.innerHTML = "🍊 AUTO OFF";
        autoUpdateButt.classList.add("citraButtOff");
        current.autoStatus = false;

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

    /* 
    // MEMORY DEBUG, uncomment to use
    await debugCitraMemory();
    return true;
    */

    // first of all, keep track of updates, unless on first loop after toggle
    if (firstLoop) {

        current.autoUpdated = true;
        
        // also reset inCombat state
        inCombat = false;

    } else {
        current.autoUpdated = false;
    }
    

    // check if we are on a battle right now
    const battleType = await getBattleType();

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

            if (battleType == "None") {

                // reset some stuffs
                pokemons[i].setBoosts({
                    atk: 0, def: 0, spa: 0, spd: 0, spe: 0, acc: 0, eva: 0
                });
                pokemons[i].setInCombat(false);

                // clear enemy trainer states
                trainerPokemons[i].clear();

            }

        }

        inCombat = battleType;
        setBattleState(battleType);
        resetActivePokemon();
        current.autoUpdated = true;

        // we force an await here because sometimes, when swapping from
        // memory locations, memory wont be fully filled up by the game yet
        if (battleType == "Trainer" || battleType == "Multi" || battleType == "Wild") {
            // 2500 being the time a wild pokemon takes to appear on screen :)
            await new Promise(resolve => setTimeout(resolve, 2500));
        } else {
            await new Promise(resolve => setTimeout(resolve, 100));
            wildEncounter.setSpecies("None");
            updateWildEnc();
        }

    }


    // check what type of memory we need to read from
    if (battleType == "None") { // out of combat

        // get current party info
        await readPartyData.getParty();

        // get current correct party order
        const rawPokesIndexed = indexRawParty(await getPartyIndexes());

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

    } else { // in combat

        let readCount = 0;

        for (let i = 0; i < pokemons.length; i++) {

            // go read that pokemon
            await getPokeBattle(battleType, i, i);

            // to force update if needed
            if (hasChanged) {rawBattlePokes[i].changeHasChanged()};

            // battle memory will place enemy pokemons after the player's
            // if slot doesnt match party order, thats not a player poke
            if (rawBattlePokes[i].slot() != i && rawBattlePokes[i].valid) {
                break;
            }

            if (rawBattlePokes[i].hasChanged() && rawBattlePokes[i].valid) {

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
                pokemons[i].setTypes(rawBattlePokes[i].types());

                pokemons[i].setStatus(rawBattlePokes[i].status());

            }

            readCount++;

        }

        // in case player party doesnt have 6 pokemon, clear empty remaining slots
        if (readCount != 0) {
            for (let i = readCount; i < 6; i++) {
                pokemons[i].clear();
            }
        }

        // get a list of pokemon currently actively fighting
        const onFieldPokes = await getActivePokemon();

        // match dex num with our pokes to know if a pokemon is in combat rn
        if (onFieldPokes) {
            
            // set everyone as not in combat
            for (let i = 0; i < pokemons.length; i++) {
                pokemons[i].setInCombat(false);
            }

            // for each in combat pokemon found
            for (let i = 0; i < onFieldPokes.player.length; i++) {

                // get an actual name
                const pokeName = current.numToPoke[onFieldPokes.player[i]];
    
                // look for matches within the current team
                for (let i = 0; i < pokemons.length; i++) {
                    if (pokeName == pokemons[i].getSpecies()) {
                        pokemons[i].setInCombat(true);
                    }
                }

            }

            current.autoUpdated = true;

        }

        // now for enemies
        if (battleType == "Trainer") {
            
            let enemyCount = 0;
            for (let i = 0; i < trainerPokemons.length; i++) {

                // go read that pokemon
                await getPokeBattle(battleType, i + readCount, i, true);

                // to force update if needed
                if (hasChanged) {rawEnemyPokes[i].changeHasChanged()};

                // battle memory will place enemy pokemons after the player's
                // enemy slots start at slot 12
                if (rawEnemyPokes[i].slot() != i + 12 && rawEnemyPokes[i].valid) {
                    break;
                }

                if (rawEnemyPokes[i].hasChanged() && rawEnemyPokes[i].valid) {

                    trainerPokemons[i].setSpecies(rawEnemyPokes[i].speciesName());
                    trainerPokemons[i].setLvl(rawEnemyPokes[i].level());
                    trainerPokemons[i].setGender(rawEnemyPokes[i].gender());
                    trainerPokemons[i].setFormNumber(rawEnemyPokes[i].formIndex());

                    trainerPokemons[i].setAbility(rawEnemyPokes[i].ability());
                    trainerPokemons[i].setItem(rawEnemyPokes[i].item());
                    trainerPokemons[i].setMoves(rawEnemyPokes[i].moves());
                    trainerPokemons[i].setHpMax(rawEnemyPokes[i].maxHP());
                    trainerPokemons[i].setHpCurrent(rawEnemyPokes[i].currentHP());
                    trainerPokemons[i].setStats(rawEnemyPokes[i].stats());
                    trainerPokemons[i].setBoosts(rawEnemyPokes[i].boosts());
                    trainerPokemons[i].setTypes(rawEnemyPokes[i].types());

                    trainerPokemons[i].setStatus(rawEnemyPokes[i].status());

                }

                enemyCount++;

            }

            // in case enemy party doesnt have 6 pokemon, clear empty remaining slots
            if (enemyCount != 0) {
                for (let i = enemyCount; i < 6; i++) {
                    trainerPokemons[i].clear();
                }
            }

            // match dex num with our pokes to know if a pokemon is in combat rn
            if (onFieldPokes) {

                // set everyone as not in combat
                for (let i = 0; i < trainerPokemons.length; i++) {
                    trainerPokemons[i].setInCombat(false);
                }

                // for each in combat pokemon found
                for (let i = 0; i < onFieldPokes.enemy.length; i++) {

                    // get an actual name
                    const pokeName = current.numToPoke[onFieldPokes.enemy[i]];
        
                    // look for matches within the current enemy team
                    for (let i = 0; i < trainerPokemons.length; i++) {
                        if (pokeName == trainerPokemons[i].getSpecies()) {
                            trainerPokemons[i].setInCombat(true);
                        }
                    }

                }
            }

            // if something was updated at all
            if (current.autoUpdated) {
                await updateTrainer();
            }

        }

        // we will only read first enemy pokemon of a wild battle
        if (battleType == "Wild") {

            // only read whenever inBattle pokes change
            if (onFieldPokes) {
                
                // go read that pokemon
                await getPokeBattle(battleType, readCount, 0, true);

                // to force update if needed
                if (hasChanged) {rawEnemyPokes[0].changeHasChanged()};

                if (rawEnemyPokes[0].hasChanged() && rawEnemyPokes[0].valid) {

                    wildEncounter.setSpecies(rawEnemyPokes[0].speciesName());
                    wildEncounter.setGender(rawEnemyPokes[0].gender());
                    wildEncounter.setFormNumber(rawEnemyPokes[0].formIndex());

                    await updateWildEnc();

                }

            }

        }

    }

    // if something was updated at all
    if (current.autoUpdated) {
        await updateTeam();
    }

    return true; // so we all know everything went alright

}
