import { resetPokeLocTexts, setLanguage } from "./Utils/Language.mjs";
import { initWebsocket } from "./Utils/WebSocket.mjs";
import { current } from "./Overlays/Globals.mjs";
import { playerInfo } from "./Overlays/Player Info.mjs";
import { pokemons } from "./Overlays/Player Team/Pokemons.mjs";
import { battlePokemons } from "./Overlays/Trainer Battle/Battle Pokemons.mjs";
import { setTrainerName, showTrainerNameIntro } from "./Overlays/Trainer Battle/Trainer Name Intro.mjs";
import { wildPokemon } from "./Overlays/Wild Pokemon.mjs";
/** @import { SentData } from "./Utils/Type Definitions.mjs" */

// this is a weird way to have file svg's that can be recolored by css
customElements.define("load-svg", class extends HTMLElement {
    async connectedCallback(
      shadowRoot = this.shadowRoot || this.attachShadow({mode:"open"})
    ) {
      shadowRoot.innerHTML = await (await fetch(this.getAttribute("src"))).text()
    }
});


// start the connection to the GUI so everything gets
// updated once the GUI sends back some data
initWebsocket("gameData", (data) => updateData(data));

let battleTypePrev;

/**
 * Updates overlay data with the provided object
 * @param {SentData} data 
 */
async function updateData(data) {

    if (data.type == "Team") {

        let bTypeChanged = false;
        const promises = [];

        // if battle type has changed
        if (battleTypePrev != data.battleType) {

            bTypeChanged = true;
            battleTypePrev = data.battleType;

            // hide current poke bar
            if (data.battleType != "Trainer") {
                promises.push(battlePokemons.hide());
            } else {
                promises.push(pokemons.hide());
            }

        }

        // update that data
        if (data.battleType != "Trainer") {
            pokemons.update(data.pokemons, bTypeChanged);
        } else {
            battlePokemons.update(data.pokemons, true);
        }

        // show that next poke bar
        if (bTypeChanged) {

            // wait for all promises so everything is properly loaded
            await Promise.all(promises);

            if (data.battleType != "Trainer") {
                pokemons.show();
            } else {
                await showTrainerNameIntro();
                battlePokemons.show();
            }

        }

    } else if (data.type == "Player") {

        playerInfo.update(data.player);

    } else if (data.type == "Wild Encounter") {

        wildPokemon.update(data.pokemons[0]);

    } else if (data.type == "Trainer") {

        setTrainerName(data.trainerName, data.pokemons[0].species);
        battlePokemons.update(data.pokemons);

    } else if (data.type == "Config") {

        if (current.lang != data.lang) {
            current.lang = data.lang;
            current.generation = data.gen;
            await setLanguage(data.lang, data.gen);
        } else if (current.generation != data.gen) {
            current.generation = data.gen;
            resetPokeLocTexts(data.gen);
        }

    }

}