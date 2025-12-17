import './GUI/Top Bar.mjs'; // so it loads the listeners
import { loadKeybinds } from './GUI/Keybinds.mjs';
import { inside, stPath } from './GUI/Globals.mjs';
import { pokemons } from './GUI/Team/TeamPokemons.mjs'
import { TeamPokemon } from './GUI/Team/TeamPokemon.mjs';
import { updateGUI } from './GUI/Remote Update.mjs';
import { getJson } from './GUI/File System.mjs';
import { updatePlayer } from './GUI/Player/Update Player.mjs';
import { updateTeam } from './GUI/Team/Update Team.mjs';
import { settings } from './GUI/Settings/Settings.mjs';
import { catches } from './GUI/Catches/Catches.mjs';
import { Catch } from './GUI/Catches/Catch.mjs';
import { updateCatches } from './GUI/Catches/Update Catches.mjs';
import { updateWildEnc } from './GUI/VS Wild/Update Wild.mjs';
import { trainerPokemons } from './GUI/VS Trainer/TrainerPokemons.mjs';
import { updateTrainer } from './GUI/VS Trainer/Update Trainer.mjs';
import { fetchSpritesheets } from './GUI/Asset Download.mjs';
import { checkDexExistance } from './GUI/Settings/App Settings/Update Dex.mjs';

// this is a weird way to have local file svg's that can be recolored by css
customElements.define("load-svg", class extends HTMLElement {
    async connectedCallback(
      shadowRoot = this.shadowRoot || this.attachShadow({mode:"open"})
    ) {
      shadowRoot.innerHTML = await (await fetch(this.getAttribute("src"))).text()
    }
});

// ask for the node path on startup
if (inside.electron) {const ipc = await import("./GUI/IPC.mjs"); ipc.getNodePath()}

init();
/** It all starts here */
async function init() {

    // first up, ready up the Pokedex libraries, everything depends on this
    if (inside.electron) await checkDexExistance();
    // import scripts globaly
    await import('./GUI/External Libraries/pkmn/dex.js');
    await import('./GUI/External Libraries/pkmn/data.js');
    await import('./GUI/External Libraries/pkmn/img.js');

    // if the user doesnt have spritesheet assets, remote download them
    if (inside.electron) await fetchSpritesheets();

    // initialize our pokemon class
    for (let i = 0; i < 6; i++) {
        pokemons.push(new TeamPokemon());
        trainerPokemons.push(new TeamPokemon(true));
    }

    // get those keybinds running
    loadKeybinds();

    // update the GUI on startup so we have something to send to browsers
    if (inside.electron) {

        // load previous gui state
        const storedData = await getJson(`${stPath.text}/GUI State`);

        if (storedData && storedData.settings) {
            await updateGUI(storedData.settings, true)
            updateGUI(storedData.catches, true);
            updateGUI(storedData.team, true);
            updateGUI(storedData.player, true);
        } else {
            // if we got no data to restore, set default values
            catches.push(new Catch());
            settings.genSelect.setGen(5); // best gen amarite
            settings.langSelect.setLang("EN");
        }

        // send initial data
        settings.update();
        updateCatches();
        updatePlayer();
        updateTeam();
        updateWildEnc();
        updateTrainer();

    } else { // remote GUIs will ask about the current main GUI state
        const remote = await import("./GUI/Remote Requests.mjs");
        remote.startWebsocket();
    }

}
