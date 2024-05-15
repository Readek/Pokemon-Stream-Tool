// so it loads the listeners
import './GUI/Top Bar.mjs';
import { restoreWindowDefaults } from './GUI/Settings/Window Settings/Restore Window Defaults.mjs';
import { loadKeybinds } from './GUI/Keybinds.mjs';
import { inside, stPath } from './GUI/Globals.mjs';
import { pokemons } from './GUI/Pokemon/TeamPokemons.mjs'
import { TeamPokemon } from './GUI/Pokemon/TeamPokemon.mjs';
import { updateGUI } from './GUI/Remote Update.mjs';
import { fileExists, getJson } from './GUI/File System.mjs';
import { updatePlayer } from './GUI/Player/Update Player.mjs';
import { updateTeam } from './GUI/Pokemon/Update Team.mjs';
import { settings } from './GUI/Settings/Settings.mjs';
import { pokeFinder } from './GUI/Finder/Pokemon Finder.mjs';
import { catches } from './GUI/Catches/Catches.mjs';
import { Catch } from './GUI/Catches/Catch.mjs';
import { updateCatches } from './GUI/Catches/Update Catches.mjs';
import { updateWildEnc } from './GUI/VS Wild/Update Wild.mjs';
import { fetchFile } from './GUI/Fetch File.mjs';
import { trainerPokemons } from './GUI/Pokemon/TrainerPokemons.mjs';
import { updateTrainer } from './GUI/Pokemon/Update Trainer.mjs';


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


    if (inside.electron) {

        // if the user doesnt have these assets, remote download them

        // icons spritesheet
        if (!await fileExists(stPath.assets + "/Pokemon/sprites/pokemonicons-sheet.png")) {
           await fetchFile(
            "https://gitlab.com/pokemon-stream-tool/pokemon-stream-tool-assets/-/raw/main/play.pokemonshowdown.com/sprites/pokemonicons-sheet.png",
            stPath.assets + "/Pokemon/sprites/pokemonicons-sheet.png"
           )
        }

        // offsets
        if (!await fileExists(stPath.assets + "/Pokemon/sprites/offsets.json")) {
            await fetchFile(
             "https://gitlab.com/pokemon-stream-tool/pokemon-stream-tool-assets/-/raw/main/offsets.json",
             stPath.assets + "/Pokemon/sprites/offsets.json"
            )
        }

    }
    
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

        // don't do this if we got no data to restore
        if (storedData) {
            updateGUI(storedData.settings, true)
            updateGUI(storedData.catches, true);
            updateGUI(storedData.team, true);
            updateGUI(storedData.player, true);
            updateGUI(storedData.trainer, true);
        } else {
            // set default values
            catches.push(new Catch());
            settings.langSelect.setLanguage("EN");
            settings.genSelect.setGen(5); // best gen amarite
            pokeFinder.loadCharacters();
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
