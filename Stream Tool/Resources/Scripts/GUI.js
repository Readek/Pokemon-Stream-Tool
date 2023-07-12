import { loadKeybinds } from './GUI/Keybinds.mjs';
import { inside, stPath } from './GUI/Globals.mjs';
import { pokemons } from './GUI/Pokemon/Pokemons.mjs'
import { Pokemon } from './GUI/Pokemon/Pokemon.mjs';
import { updateGUI } from './GUI/Remote Update.mjs';
import { getJson } from './GUI/File System.mjs';
import { updatePlayer } from './GUI/Player/Update Player.mjs';
import { updateTeam } from './GUI/Pokemon/Update Team.mjs';
import { settings } from './GUI/Settings/Settings.mjs';
import { pokeFinder } from './GUI/Finder/Pokemon Finder.mjs';

// so it loads the listeners
import './GUI/Top Bar.mjs';
import { restoreWindowDefaults } from './GUI/Settings/Window Settings/Restore Window Defaults.mjs';


// this is a weird way to have file svg's that can be recolored by css
customElements.define("load-svg", class extends HTMLElement {
    async connectedCallback(
      shadowRoot = this.shadowRoot || this.attachShadow({mode:"open"})
    ) {
      shadowRoot.innerHTML = await (await fetch(this.getAttribute("src"))).text()
    }
});

// just in case we somehow go out of view
window.onscroll = () => { window.scroll(0, 0) };


init();
/** It all starts here */
async function init() {
    
    // initialize our pokemon class
    for (let i = 0; i < 6; i++) {
        pokemons.push(new Pokemon())
    }


    // get those keybinds running
    loadKeybinds();


    // update the GUI on startup so we have something to send to browsers
    if (inside.electron) {

        // load previous gui state
        let storedData = await getJson(`${stPath.text}/GUI State`);

        // don't do this if we got no data to restore
        if (storedData) {
            updateGUI(storedData.storedTeamData, true);
            updateGUI(storedData.storedPlayerData, true);
        } else {
            // set default values
            settings.gameSelect.setGen(5); // best gen amarite
            pokeFinder.loadCharacters();
        }

        // send initial data
        updatePlayer();
        updateTeam();

    } else { // remote GUIs will ask about the current main GUI state
        const remote = await import("./GUI/Remote Requests.mjs");
        remote.startWebsocket();
    }

}
