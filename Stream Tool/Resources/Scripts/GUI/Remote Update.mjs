import { displayNotif } from "./Notifications.mjs";
import { pokemons } from "./Pokemon/Pokemons.mjs";

/**
 * Updates the entire GUI with values sent remotely
 * @param {Object} data GUI info
 */
export async function updateGUI(data) {

    // player time
    for (let i = 0; i < pokemons.length; i++) {

        pokemons[i].setSpecies(data.playerPokemons[i].species);
        pokemons[i].setNickName(data.playerPokemons[i].nickName);

    };

    // write it down
    displayNotif("GUI was remotely updated");
    
}