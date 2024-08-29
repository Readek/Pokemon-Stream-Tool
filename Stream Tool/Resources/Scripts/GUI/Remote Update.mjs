import { getLocalizedText } from "../Utils/Language.mjs";
import { setAutoState } from "./Auto Update.mjs";
import { Catch } from "./Catches/Catch.mjs";
import { catches } from "./Catches/Catches.mjs";
import { current } from "./Globals.mjs";
import { displayNotif } from "./Notifications.mjs";
import { setBadges } from "./Player/Badges.mjs";
import { playerStats } from "./Player/Stats.mjs";
import { pokemons } from "./Team/TeamPokemons.mjs";
import { trainerPokemons } from "./VS Trainer/TrainerPokemons.mjs";
import { settings } from "./Settings/Settings.mjs";
import { wildEncounter } from "./VS Wild/Wild Pokemon.mjs";
import { setBattleState } from "./Team/Battle State.mjs";

/**
 * Updates the entire GUI with values sent remotely
 * @param {Object} data GUI info
 * @param {boolean} noNotif Disables update notification
 */
export async function updateGUI(data, noNotif) {

    if (data.type == "Settings") {

        if (current.lang != data.lang) {
            settings.langSelect.setLanguage(data.lang);
        }
        if (current.generation != data.gen) {
            settings.genSelect.setGen(data.gen);
        }
        if (current.game != data.game) {
            settings.gameSelect.setGame(data.game);
        }
        if (current.version != data.version) {
            settings.versionSelect.setVersion(data.version);
        }

    }

    if (data.type == "Catches") {

        const homeCatchesLength = catches.length;
        const incCatchesLength = data.catches.length;

        // add or remove catches if needed
        if (homeCatchesLength < incCatchesLength) {
            for (let i = 0; i < incCatchesLength - homeCatchesLength; i++) {
                // if theres no data on that slot, create a new catch
                catches.push(new Catch());
            }
        } else if (homeCatchesLength > incCatchesLength) {
            for (let i = homeCatchesLength-1; i > incCatchesLength-1; i--) {
                // remove slots that we wont need
                catches[i].delet();
            }
        }
        
        for (let i = 0; i < data.catches.length; i++) {

            catches[i].setSpecies(data.catches[i].internalSpecies);
            catches[i].setNickName(data.catches[i].nickName);
            if (catches[i].getForm() != data.catches[i].form) {
                catches[i].setForm(data.catches[i].form);
            }
            catches[i].setGender(data.catches[i].gender);
            catches[i].setShiny(data.catches[i].shiny);
            
        }

    }

    if (data.type == "Team") {

        // poketeam time
        for (let i = 0; i < data.playerPokemons.length; i++) {

            pokemons[i].setSpecies(data.playerPokemons[i].internalSpecies);
            pokemons[i].setNickName(data.playerPokemons[i].nickName);
            pokemons[i].setLvl(data.playerPokemons[i].lvl);
            if (pokemons[i].getForm() != data.playerPokemons[i].form) {
                pokemons[i].setForm(data.playerPokemons[i].form);
            }
            pokemons[i].setGender(data.playerPokemons[i].gender);
            pokemons[i].setShiny(data.playerPokemons[i].shiny);
            pokemons[i].setStatus(data.playerPokemons[i].status);
            pokemons[i].setHpCurrent(data.playerPokemons[i].hpCurrent);
            pokemons[i].setHpMax(data.playerPokemons[i].hpMax);
            pokemons[i].setExp(data.playerPokemons[i].exp);
            pokemons[i].setAbility(data.playerPokemons[i].ability);
            pokemons[i].setItem(data.playerPokemons[i].item);
            pokemons[i].setMoves(data.playerPokemons[i].moves);
            pokemons[i].setStats(data.playerPokemons[i].stats);
            pokemons[i].setBoosts(data.playerPokemons[i].boosts);
            pokemons[i].setInCombat(data.playerPokemons[i].inCombat);

        };

        setBattleState(data.battleType);

    }

    if (data.type == "Player") {

        // player time
        setBadges(data.player.badges);
        playerStats.setCatches(data.player.catches);
        playerStats.setDeaths(data.player.deaths);

    }

    if (data.type == "Wild Encounter") {

        if (data.pokemon) {
            wildEncounter.setSpecies(data.pokemon.species);
            wildEncounter.setForm(data.pokemon.form);
            wildEncounter.setGender(data.pokemon.gender),
            wildEncounter.setShiny(data.pokemon.shiny);
        } else {
            wildEncounter.setSpecies("None");
        }

    }

    if (data.type == "Trainer") {

        // enemy trainer
        for (let i = 0; i < data.trainerPokemons.length; i++) {

            trainerPokemons[i].setSpecies(data.trainerPokemons[i].internalSpecies);
            trainerPokemons[i].setNickName(data.trainerPokemons[i].nickName);
            trainerPokemons[i].setLvl(data.trainerPokemons[i].lvl);
            if (trainerPokemons[i].getForm() != data.trainerPokemons[i].form) {
                trainerPokemons[i].setForm(data.trainerPokemons[i].form);
            }
            trainerPokemons[i].setGender(data.trainerPokemons[i].gender);
            trainerPokemons[i].setShiny(data.trainerPokemons[i].shiny);
            trainerPokemons[i].setStatus(data.trainerPokemons[i].status);
            trainerPokemons[i].setHpCurrent(data.trainerPokemons[i].hpCurrent);
            trainerPokemons[i].setHpMax(data.trainerPokemons[i].hpMax);
            trainerPokemons[i].setAbility(data.trainerPokemons[i].ability);
            trainerPokemons[i].setItem(data.trainerPokemons[i].item);
            trainerPokemons[i].setMoves(data.trainerPokemons[i].moves);
            trainerPokemons[i].setStats(data.trainerPokemons[i].stats);
            trainerPokemons[i].setBoosts(data.trainerPokemons[i].boosts);
            trainerPokemons[i].setInCombat(data.trainerPokemons[i].inCombat);
            trainerPokemons[i].setReveals(data.trainerPokemons[i].reveals);

        };

    }

    if (data.type == "Auto") {
        setAutoState(data.value);
        displayNotif(getLocalizedText("notifRemoteAuto"));
    }

    // let us know
    if (!noNotif && !current.autoStatus) {
        displayNotif(getLocalizedText("notifRemoteUpdate"));
    }
    
}