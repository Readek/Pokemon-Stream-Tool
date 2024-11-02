import { resetPokeLocTexts, setLanguage } from "../../../Resources/Scripts/Utils/Language.mjs";
import { initWebsocket } from "../../../Resources/Scripts/Utils/WebSocket.mjs";
import { current } from "./Scripts/Globals.mjs";
import { playerInfo } from "./Scripts/Player Info.mjs";
import { pokemons } from "./Scripts/Player Team/Pokemons.mjs";
import { battlePokemons } from "./Scripts/Trainer Battle/Battle Pokemons.mjs";
import { setTrainerName, showTrainerNameIntro } from "./Scripts/Trainer Battle/Trainer Name Intro.mjs";
import { wildPokemon } from "./Scripts/Wild Pokemon.mjs";

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
 * @param {Object} data 
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
            pokemons.update(data.playerPokemons, bTypeChanged);
        } else {
            battlePokemons.update(data.playerPokemons, true);
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

        wildPokemon.update(data)

    } else if (data.type == "Trainer") {

        setTrainerName(data.trainerName);
        battlePokemons.update(data.trainerPokemons);

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