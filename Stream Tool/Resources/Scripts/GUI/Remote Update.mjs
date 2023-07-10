import { current } from "./Globals.mjs";
import { displayNotif } from "./Notifications.mjs";
import { setBadges } from "./Player/Gym Badges.mjs";
import { playerStats } from "./Player/Stats.mjs";
import { pokemons } from "./Pokemon/Pokemons.mjs";
import { settings } from "./Settings/Settings.mjs";

let firstTime = true;

/**
 * Updates the entire GUI with values sent remotely
 * @param {Object} data GUI info
 * @param {boolean} noNotif Disables update notification
 */
export async function updateGUI(data, noNotif) {

    if (data.type == "Team") {

        // this maybe should be somewhere else
        if (current.generation != data.generation || firstTime) {
            settings.gameSelect.setGen(data.generation);
            firstTime = false;
        }

        // poketeam time
        for (let i = 0; i < data.playerPokemons.length; i++) {

            if (pokemons[i].getSpecies() != data.playerPokemons[i].species) {
                pokemons[i].setSpecies(data.playerPokemons[i].species);
            }
            if (pokemons[i].getNickName() != data.playerPokemons[i].nickName) {
                pokemons[i].setNickName(data.playerPokemons[i].nickName);
            }
            if (pokemons[i].getLvl() != data.playerPokemons[i].lvl) {
                pokemons[i].setLvl(data.playerPokemons[i].lvl)
            }
            if (pokemons[i].getForm() != data.playerPokemons[i].form) {
                pokemons[i].setForm(data.playerPokemons[i].form);
            }
            if (pokemons[i].getGender() != data.playerPokemons[i].gender) {
                pokemons[i].setGender(data.playerPokemons[i].gender);
            }
            if (pokemons[i].getShiny() != data.playerPokemons[i].shiny) {
                pokemons[i].setShiny(data.playerPokemons[i].shiny);
            }

        };

    }
    if (data.type == "Player") {

        // player time
        setBadges(data.player.badges);
        playerStats.setCatches(data.player.catches);
        playerStats.setKills(data.player.kills);
        playerStats.setDeaths(data.player.deaths);

    }

    // let us know
    if (!noNotif) {
        displayNotif("GUI was remotely updated");
    }
    
}