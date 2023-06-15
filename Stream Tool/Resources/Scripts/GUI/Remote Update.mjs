import { displayNotif } from "./Notifications.mjs";
import { setBadges } from "./Player/Gym Badges.mjs";
import { playerStats } from "./Player/Stats.mjs";
import { pokemons } from "./Pokemon/Pokemons.mjs";

/**
 * Updates the entire GUI with values sent remotely
 * @param {Object} data GUI info
 */
export async function updateGUI(data) {

    // poketeam time
    for (let i = 0; i < pokemons.length; i++) {

        pokemons[i].setSpecies(data.playerPokemons[i].species);
        pokemons[i].setNickName(data.playerPokemons[i].nickName);

    };

    // player time
    setBadges(data.player.badges);
    playerStats.setCatches(data.player.catches);
    playerStats.setKills(data.player.kills);
    playerStats.setDeaths(data.player.deaths);

    // write it down
    displayNotif("GUI was remotely updated");
    
}