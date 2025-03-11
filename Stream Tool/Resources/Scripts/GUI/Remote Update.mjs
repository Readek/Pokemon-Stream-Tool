import { getLocalizedText } from "../Utils/Language.mjs";
import { setAutoState } from "./Auto Update.mjs";
import { Catch } from "./Catches/Catch.mjs";
import { catches } from "./Catches/Catches.mjs";
import { current, inside } from "./Globals.mjs";
import { displayNotif } from "./Notifications.mjs";
import { setBadges } from "./Player/Badges.mjs";
import { playerStats } from "./Player/Stats.mjs";
import { pokemons } from "./Team/TeamPokemons.mjs";
import { setEnemyTrainerName, trainerPokemons } from "./VS Trainer/TrainerPokemons.mjs";
import { settings } from "./Settings/Settings.mjs";
import { wildEncounter } from "./VS Wild/Wild Pokemon.mjs";
import { setBattleState } from "./Team/Battle State.mjs";
/** @import {SentData} from "../Utils/Type Definitions.mjs" */

/**
 * Updates the entire GUI with values sent remotely
 * @param {SentData} data GUI info
 * @param {boolean} noNotif Disables update notification
 */
export async function updateGUI(data, noNotif) {

    if (data.type == "Settings") {

        if (current.generation != data.gen) {
            settings.genSelect.setGen(data.gen);
        }
        if (current.lang != data.lang) {
            settings.langSelect.setLang(data.lang);
        }
        if (current.game != data.game) {
            settings.gameSelect.setGame(data.game);
        }
        if (current.version != data.version) {
            settings.versionSelect.setVersion(data.version);
        }
        if (current.forceDex != data.forceDex) {
            settings.forceDex.setForceDex(data.forceDex);
        }

        if (inside.electron) settings.update();

    }

    if (data.type == "Catches") {

        const homeCatchesLength = catches.length;
        const incCatchesLength = data.pokemons.length;

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

        for (let i = 0; data.pokemons && i < data.pokemons.length; i++) {

            catches[i].setSpecies(data.pokemons[i].internalSpecies);
            catches[i].setNickName(data.pokemons[i].nickName);
            catches[i].setForm(data.pokemons[i].form);
            catches[i].setGender(data.pokemons[i].gender);
            catches[i].setShiny(data.pokemons[i].shiny);

        }

    }

    if (data.type == "Team") {

        for (let i = 0; data.pokemons && i < data.pokemons.length; i++) {

            pokemons[i].setSpecies(data.pokemons[i].internalSpecies);
            pokemons[i].setNickName(data.pokemons[i].nickName);
            pokemons[i].setLvl(data.pokemons[i].lvl);
            pokemons[i].setForm(data.pokemons[i].form);
            pokemons[i].setGender(data.pokemons[i].gender);
            pokemons[i].setShiny(data.pokemons[i].shiny);
            pokemons[i].setStatus(data.pokemons[i].status);
            pokemons[i].setHpCurrent(data.pokemons[i].hpCurrent);
            pokemons[i].setHpMax(data.pokemons[i].hpMax);
            pokemons[i].setExp(data.pokemons[i].exp);
            pokemons[i].setAbility(data.pokemons[i].ability);
            pokemons[i].setItem(data.pokemons[i].item);
            pokemons[i].setMoves(data.pokemons[i].moves);
            pokemons[i].setStats(data.pokemons[i].stats);
            pokemons[i].setBoosts(data.pokemons[i].boosts);
            pokemons[i].setInCombat(data.pokemons[i].inCombat);

        };

        setBattleState(data.battleType);

    }

    if (data.type == "Player") {

        setBadges(data.player.badges);
        playerStats.setCatches(data.player.catches);
        playerStats.setDeaths(data.player.deaths);

    }

    if (data.type == "Wild Encounter") {

        if (data.pokemons) {
            for (let i = 0; i < data.pokemons.length; i++) {
                wildEncounter.setSpecies(data.pokemons[i].species);
                wildEncounter.setForm(data.pokemon[i].form);
                wildEncounter.setGender(data.pokemon[i].gender);
                wildEncounter.setShiny(data.pokemon[i].shiny);
            }
        } else {
            wildEncounter.setSpecies("None");
        }

    }

    if (data.type == "Trainer") {

        // enemy trainer
        for (let i = 0; i < data.pokemons.length; i++) {

            trainerPokemons[i].setSpecies(data.pokemons[i].internalSpecies);
            trainerPokemons[i].setNickName(data.pokemons[i].nickName);
            trainerPokemons[i].setLvl(data.pokemons[i].lvl);
            trainerPokemons[i].setForm(data.pokemons[i].form);
            trainerPokemons[i].setGender(data.pokemons[i].gender);
            trainerPokemons[i].setShiny(data.pokemons[i].shiny);
            trainerPokemons[i].setStatus(data.pokemons[i].status);
            trainerPokemons[i].setHpCurrent(data.pokemons[i].hpCurrent);
            trainerPokemons[i].setHpMax(data.pokemons[i].hpMax);
            trainerPokemons[i].setAbility(data.pokemons[i].ability);
            trainerPokemons[i].setItem(data.pokemons[i].item);
            trainerPokemons[i].setMoves(data.pokemons[i].moves);
            trainerPokemons[i].setStats(data.pokemons[i].stats);
            trainerPokemons[i].setBoosts(data.pokemons[i].boosts);
            trainerPokemons[i].setInCombat(data.pokemons[i].inCombat);
            trainerPokemons[i].setReveals(data.pokemons[i].reveals);

        };

        setEnemyTrainerName(data.trainerName);

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