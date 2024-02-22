import { initWebsocket } from "../../../Resources/Scripts/Utils/WebSocket.mjs";
import { playerInfo } from "./Scripts/Player Info.mjs";
import { pokemons } from "./Scripts/Player Team/Pokemons.mjs";
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


/**
 * Updates overlay data with the provided object
 * @param {Object} data 
 */
async function updateData(data) {

    if (data.type == "Team") {
        
        pokemons.update(data.playerPokemons);

    } else if (data.type == "Player") {

        playerInfo.update(data.player);
        
    } else if (data.type == "Wild Encounter" && data.pokemon) {

        wildPokemon.update(data)

    }

}