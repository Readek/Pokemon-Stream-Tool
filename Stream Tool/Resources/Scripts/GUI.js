import './GUI/Top Bar.mjs'; // so it loads the listeners
import { loadKeybinds } from './GUI/Keybinds.mjs';
import { inside, stPath } from './GUI/Globals.mjs';
import { pokemons } from './GUI/Team/TeamPokemons.mjs'
import { TeamPokemon } from './GUI/Team/TeamPokemon.mjs';
import { updateGUI } from './GUI/Remote Update.mjs';
import { fileExists, getJson } from './GUI/File System.mjs';
import { updatePlayer } from './GUI/Player/Update Player.mjs';
import { updateTeam } from './GUI/Team/Update Team.mjs';
import { settings } from './GUI/Settings/Settings.mjs';
import { pokeFinder } from './GUI/Finder/Pokemon Finder.mjs';
import { catches } from './GUI/Catches/Catches.mjs';
import { Catch } from './GUI/Catches/Catch.mjs';
import { updateCatches } from './GUI/Catches/Update Catches.mjs';
import { updateWildEnc } from './GUI/VS Wild/Update Wild.mjs';
import { fetchFile } from './GUI/Fetch File.mjs';
import { trainerPokemons } from './GUI/VS Trainer/TrainerPokemons.mjs';
import { updateTrainer } from './GUI/VS Trainer/Update Trainer.mjs';


// this is a weird way to have local file svg's that can be recolored by css
customElements.define("load-svg", class extends HTMLElement {
    async connectedCallback(
      shadowRoot = this.shadowRoot || this.attachShadow({mode:"open"})
    ) {
      shadowRoot.innerHTML = await (await fetch(this.getAttribute("src"))).text()
    }
});


init();
/** It all starts here */
async function init() {

    if (inside.electron) { // remote GUIs will skip this

        // if the user doesnt have these assets, remote download them

        // icons spritesheet
        if (!await fileExists(stPath.assets + "/Pokemon/sprites/pokemonicons-sheet.png")) {
           await fetchFile(
            "https://gitlab.com/pokemon-stream-tool/pokemon-stream-tool-assets/-/raw/main/play.pokemonshowdown.com/sprites/pokemonicons-sheet.png",
            stPath.assets + "/Pokemon/sprites/pokemonicons-sheet.png"
           )
        }

        // items icons spritesheet
        if (!await fileExists(stPath.assets + "/Items/itemicons-sheet.png")) {
            await fetchFile(
             "https://gitlab.com/pokemon-stream-tool/pokemon-stream-tool-assets/-/raw/main/play.pokemonshowdown.com/sprites/itemicons-sheet.png",
             stPath.assets + "/Items/itemicons-sheet.png"
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

        if (storedData) {
            await updateGUI(storedData.settings, true)
            updateGUI(storedData.catches, true);
            updateGUI(storedData.team, true);
            updateGUI(storedData.player, true);
        } else {
            // if we got no data to restore, set default values
            catches.push(new Catch());
            settings.genSelect.setGen(5); // best gen amarite
            settings.langSelect.setLang("EN", 5);
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
