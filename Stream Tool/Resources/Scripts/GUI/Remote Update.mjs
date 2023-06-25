import { displayNotif } from "./Notifications.mjs";
import { setBadges } from "./Player/Gym Badges.mjs";
import { playerStats } from "./Player/Stats.mjs";
import { pokemons } from "./Pokemon/Pokemons.mjs";

/**
 * Updates the entire GUI with values sent remotely
 * @param {Object} data GUI info
 * @param {boolean} noNotif Disables update notification
 */
export async function updateGUI(data, noNotif) {

    if (data.type == "Team") {

        // poketeam time
        for (let i = 0; i < pokemons.length; i++) {

            pokemons[i].setSpecies(data.playerPokemons[i].species);
            pokemons[i].setNickName(data.playerPokemons[i].nickName);
            pokemons[i].setLvl(data.playerPokemons[i].lvl)
            pokemons[i].setForm(data.playerPokemons[i].form);
            pokemons[i].setGender(data.playerPokemons[i].gender);

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