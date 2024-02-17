import { current } from "../../Globals.mjs";
import { sendRemoteDataRaw } from "../../IPC.mjs";
import { displayNotif } from "../../Notifications.mjs";
import { pokemons } from "../../Pokemon/Pokemons.mjs";
import { updateTeam } from "../../Pokemon/Update Team.mjs";
import { getBattleAddress } from "./Battle Addresses.mjs";
import { readBattleType } from "./Read Battle Type.mjs";
import { readPartyIndexes } from "./Read Party Indexes.mjs";
import { readPokeBattleData } from "./Read Player Battle.mjs";
import { readPartyData } from "./Read Player Party.mjs";

const autoUpdateButt = document.getElementById("citraButt");
const updateButt = document.getElementById("updateTeamButt");

let readMemoryInterval;

/** Activates or deactivates Citra memory reading interval */
export function autoUpdateToggleCitra() {
    
    if (!current.autoStatus) { // if no auto update is running
        
        // update states
        current.autoStatus = true;
        autoUpdateButt.innerHTML = "🍊 AUTO ON";
        autoUpdateButt.classList.remove("citraButtOff");
        updateButt.disabled = true;

        // fire auto update every 1 second
        readMemoryInterval = setInterval(async () => {
            updatePlayerTeam();
        }, 1000);

    } else { // if theres a loop running, stop it
        
        clearInterval(readMemoryInterval);
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

}

async function updatePlayerTeam() {
    
    // get current party info
    const rawPokes = await readPartyData.getParty();

    // before continuing, we need to know if the connection to citra was successful
    if (!rawPokes) {
        
        // if it failed, deactivate auto update
        displayNotif("Couln't connect to Citra");
        autoUpdateToggleCitra();
        return;

    }

    // get current correct party order
    const indexes = await readPartyIndexes.getPartyIndexes();
    const rawPokesIndexed = [];

    // reorder pokemon party
    for (let i = 0; i < rawPokes.length; i++) {
        rawPokesIndexed.push(rawPokes[indexes[i]]);                    
    }

    // check if we are on a battle right now
    const battleType = await readBattleType.getBattleType(rawPokesIndexed[0].dexNum());

    // if we currently are in a battle
    if (battleType) {
        
        const addressToRead = getBattleAddress(battleType, current.game);
        const rawBattlePokes = await readPokeBattleData.getPokeBattle(addressToRead);

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

}
