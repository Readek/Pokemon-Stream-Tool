import { getLocalizedText } from "../../../Utils/Language.mjs";
import { current } from "../../Globals.mjs";
import { sendRemoteDataRaw } from "../../IPC.mjs";
import { displayNotif } from "../../Notifications.mjs";
import { pokemons } from "../../Team/TeamPokemons.mjs";
import { setEnemyTrainerName, trainerPokemons } from "../../VS Trainer/TrainerPokemons.mjs";
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
import { getEnemyTrainerName } from "./Memory Locations/Enemy Trainer Name.mjs";
import { setBadges } from "../../Player/Badges.mjs";
import { getRawBadges } from "./Memory Locations/Badges.mjs";

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

    // send state to remote GUIs
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
    if (await autoUpdateData(true)) { // if first update succeeds

        displayNotif(getLocalizedText("notifCitraOk"));

        // fire auto update as soon as each request is finished
        while (current.autoStatus) {

            // trigger the auto update code
            const autoUpdate = autoUpdateData();
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

        if (await autoUpdateData()) {
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
async function autoUpdateData(firstLoop) {

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

        if (battleType == "None") {

            for (let i = 0; i < 6; i++) {

                // reset some stuffs
                pokemons[i].setBoosts({
                    atk: 0, def: 0, spa: 0, spd: 0, spe: 0, acc: 0, eva: 0
                });
                pokemons[i].setInCombat(false);

                // clear enemy trainer states
                trainerPokemons[i].clear();

            }

            // clear trainer name
            setEnemyTrainerName({title: "", name: ""});

        }

        inCombat = battleType;
        setBattleState(battleType);
        resetActivePokemon();
        current.autoUpdated = true;

        // we force an await here because sometimes, when swapping from
        // memory locations, memory wont be fully filled up by the game yet
        if (battleType == "Trainer" || battleType == "Multi" || battleType == "Wild") {

            // delay being the time a wild pokemon takes to appear on screen :)
            // gen 7 has longer delay because we know battle state earlier there
            const delayTime = current.generation == 6 ? 2500 : 4500;
            await new Promise(resolve => setTimeout(resolve, delayTime));

        } else {
            
            // a tiny wait just in case
            await new Promise(resolve => setTimeout(resolve, 100));

            wildEncounter.setSpecies("None");
            updateWildEnc();

        }

        // get us the trainer's name, just once
        if (battleType == "Trainer") {
            setEnemyTrainerName(await getEnemyTrainerName());
        }

        // gym badges (no known data for gen7 yet)
        if (current.generation == 6) {                
            setBadges(await getRawBadges());
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
            if (hasChanged) rawPokesIndexed[i].changeHasChanged();
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

        // get a list of pokemon currently actively fighting
        const onFieldPokes = await getActivePokemon();

        // update player battle data
        let readCount = await updateBattlePokemon(battleType, hasChanged, onFieldPokes, 0, false);
        
        // gen 7 poke positions are fixed, while gen 6 are not
        // in gen 7, enemy slots start at slot 12
        readCount = current.generation == 7 ? 12 : readCount;

        // now same as above but for enemies
        if (battleType == "Trainer") {

            // update enemy battle data
            await updateBattlePokemon(battleType, hasChanged, onFieldPokes, readCount, true);

            // there could be some cases where inCombat regions cant be read
            // like multibattles or the final XY battle vs AZ
            if (!onFieldPokes) {

                let someCombat;

                // check for in combat state for each poke
                for (let i = 0; i < pokemons.length; i++) {
                    if (pokemons[i].getInCombat()) someCombat = true;
                }

                // if we couldnt find any inCombat pokes, just set the first one and carry on
                if (!someCombat) pokemons[0].setInCombat(true);

                // now same for enemies
                someCombat = false;
                for (let i = 0; i < trainerPokemons.length; i++) {
                    if (trainerPokemons[i].getInCombat()) someCombat = true;
                }
                if (!someCombat) trainerPokemons[0].setInCombat(true);

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

/**
 * Asks emu for battle data and updates ally or enemy pokemon
 * @param {"Wild"|"Trainer"|"Multi"|"None"} battleType - Region to read
 * @param {Boolean} hasChanged - To force updates
 * @param {{player:[], enemy:[]} | undefined} onFieldPokes - To set active status
 * @param {Number} pokeCount - Slot to read from
 * @param {Boolean} enemy - If this is an enemy pokemon
 * @returns {Number} How many pokes were properly read
 */
async function updateBattlePokemon(battleType, hasChanged, onFieldPokes, pokeCount, enemy) {

    // determine which class we're gonna use
    const rawPokes = !enemy ? rawBattlePokes : rawEnemyPokes;
    const pokes = !enemy ? pokemons : trainerPokemons;

    // ally pokemon have slots 0-5, enemies have slots 12-17
    const slotOffset = !enemy ? 0 : 12;

    let readCount = 0;

    for (let i = 0; i < pokes.length; i++) {

        // go read that pokemon
        await getPokeBattle(battleType, i + pokeCount, i, enemy);

        // to force update if needed
        if (hasChanged) rawPokes[i].changeHasChanged();

        // in gen6, battle memory will place enemy pokemons after the player's
        // if slot doesnt match party order, thats not a player poke
        if (rawPokes[i].slot() != i + slotOffset && rawPokes[i].valid) {
            break;
        }

        if (rawPokes[i].hasChanged() && rawPokes[i].valid) {

            // theres some data that we dont know where to get in battle
            // if the species doesnt match non battle data, clear this info
            if (!enemy && rawPokes[i].speciesName() != pokes[i].getSpecies()) {
                pokes[i].setNickName("");
                pokes[i].setShiny(false);
            }

            pokes[i].setSpecies(rawPokes[i].speciesName());
            pokes[i].setLvl(rawPokes[i].level());
            pokes[i].setGender(rawPokes[i].gender());
            pokes[i].setFormNumber(rawPokes[i].formIndex());

            if (!enemy) pokes[i].setExp(rawPokes[i].experience());
            pokes[i].setAbility(rawPokes[i].ability());
            pokes[i].setItem(rawPokes[i].item());
            pokes[i].setMoves(rawPokes[i].moves());
            pokes[i].setHpMax(rawPokes[i].maxHP());
            pokes[i].setHpCurrent(rawPokes[i].currentHP());
            pokes[i].setStats(rawPokes[i].stats());
            pokes[i].setBoosts(rawPokes[i].boosts());
            pokes[i].setTypes(rawPokes[i].types());

            pokes[i].setStatus(rawPokes[i].status());

        }

        readCount++;

    }

    // in case we didnt read all 6 pokemon, clear empty remaining slots
    if (readCount != 0) {
        for (let i = readCount; i < 6; i++) {
            pokes[i].clear();
        }
    }

    // match dex num with our pokes to know if a pokemon is in combat rn
    if (onFieldPokes) {

        // set everyone as not in combat
        for (let i = 0; i < pokes.length; i++) {
            pokes[i].setInCombat(false);
        }

        // for each in combat pokemon found
        const playerOrEnemy = !enemy ? "player" : "enemy";
        for (let i = 0; i < onFieldPokes[playerOrEnemy].length; i++) {

            // get an actual name
            const pokeName = current.numToPoke[onFieldPokes[playerOrEnemy][i]];

            // look for matches within the current team
            for (let i = 0; i < pokes.length; i++) {
                // also check if poke is already in combat, for dupes
                if (pokeName == pokes[i].getSpecies() && !pokes[i].getInCombat()) {
                    pokes[i].setInCombat(true);
                    break;
                }
            }

        }

        current.autoUpdated = true;

    }

    // so we know where to start reading enemies when reading them
    return readCount;

}
