import { getLocalizedText, setLanguage } from "../../../Resources/Scripts/Utils/Language.mjs";
import { initWebsocket } from "../../../Resources/Scripts/Utils/WebSocket.mjs";
import { current } from "./Scripts/Globals.mjs";
import { typeToColor } from "./Scripts/Type to Color.mjs";
import { wildPokemon } from "./Scripts/Wild Pokemon.mjs";

// this is a weird way to have file svg's that can be recolored by css
customElements.define("load-svg", class extends HTMLElement {
    async connectedCallback(
      shadowRoot = this.shadowRoot || this.attachShadow({mode:"open"})
    ) {
      shadowRoot.innerHTML = await (await fetch(this.getAttribute("src"))).text()
    }
});

class Pokemon {

    #species;
    #lvl;
    #nickname;
    #gender = "";
    #types = [];
    #status;
    #img;
    #side = "Front";
    shiny = false;

    constructor(el) {

        this.mainEl = el;

        this.speciesEl = el.getElementsByClassName(`pokeSpecies`)[0];
        this.lvlEl = el.getElementsByClassName(`pokeLvlNum`)[0];
        this.nickEl = el.getElementsByClassName(`pokeNick`)[0];
        this.gendEl = el.getElementsByClassName(`pokeGender`)[0];
        this.imgEl = el.getElementsByClassName(`pokeImg`)[0];
        
    }

    
    setSpecies(species) {
        this.#species = species;
        this.speciesEl.innerHTML = species;
    }
    getSpecies() {
        return this.#species;
    }

    setLvl(lvl) {
        this.#lvl = lvl;
        this.lvlEl.innerHTML = lvl;
    }
    getLvl() {
        return this.#lvl;
    }

    setNickname(name) {

        this.#nickname = name;
        this.nickEl.innerHTML = name;

        // hide or show sub text depending on if the poke has a nickname or not
        if (name && name != this.getSpecies()) {
            this.speciesEl.parentElement.style.display = "flex";
        } else {
            this.nickEl.innerHTML = this.getSpecies();
            this.speciesEl.parentElement.style.display = "none";
        }

    }
    getNickname() {
        return this.#nickname;
    }

    setGender(gender) {
        this.#gender = gender;
        this.gendEl.innerHTML = getLocalizedText("pokePronoun" + (gender || "Null"));
        this.gendEl.setAttribute("locText", "pokePronoun" + (gender || "Null"));
    }
    getGender() {
        return this.#gender;
    }

    setTypes(types) {
        this.#types = types;
        this.setBackgroundColor(types);
    }
    getTypes() {
        return this.#types;
    }

    setStatus(status) {
        this.#status = status;
        if (status == "Fai") {
            this.mainEl.classList.add("pokeDed");
        } else {
            this.mainEl.classList.remove("pokeDed");
        }
    }
    getStatus() {
        return this.#status;
    }

    setImg(img) {

        this.#img = img;
        this.imgEl.src = img["gen5" + this.#side];

        // We compensate to account for the cases where the gif center is skewed
        // towards a place where the Pokémon doesn't spend that much time;
        // e.g., Pokémon that jump (Rotom-Heat, Weavile) or extend their
        // body (Thundurus-Therian, Timburr).
        // The offsets are the difference between the actual center of the gif
        // and the mean of the bounding boxes of each gif frame, and are precalculated
        // using a Python script included in the assets repo.
        const offset = img["gen5" + this.#side + "Offs"];
        this.imgEl.style.transform = `scale(2) translate(${offset[0]}px, ${offset[1]}px)`;

    }
    getImgSrc() {
        return this.#img;
    }

    hidePoke() {
        this.mainEl.style.display = "none";
        this.setSpecies(null);
    }
    showPoke() {
        this.mainEl.style.display = "block";
    }

    /**
     * Changes the background color depending on the pokemons type
     * @param {Array} types - Names of types (Strings)
     */
    setBackgroundColor(types) {
        if (types.length == 2) {
            this.mainEl.style.background = `linear-gradient(to bottom,
                ${typeToColor(types[1])}35, ${typeToColor(types[0])}35)`;
        } else if (types.length == 1) {
            this.mainEl.style.background = `${typeToColor(types[0])}35`;
        }
    }

    /**
     * Compares current types with incoming
     * @param {Array} types - Names of types (Strings)
     * @returns {Boolean} - True if different
     */
    compareIncTypes(types) {
        if (types.length == this.#types.length) {
            for (let i = 0; i < types.length; i++) {
                if (types[i] != this.#types[i]) {
                    return true
                }
            }
            return;
        }
        return true;
    }

    /**
     * Turns the pokemon's sprite
     * @param {Boolean} side - True for "Back", false for "Front"
     */
    turnSprite(side) {
        this.#side = side ? "Back" : "Front";
        this.setImg(this.getImgSrc());

    }

}

const pokemons = [];

const playerInfoDiv = document.getElementById("playerInfo");
const badges = document.getElementsByClassName("badge");
const catchesNum = document.getElementById("catchesNumber");
const deathsNum = document.getElementById("deathsNumber");

const wildDiv = document.getElementById("wildEncounterDiv");

let inCombatPrev;

initPokemon();
function initPokemon() {
    for (const pokeDiv of document.getElementsByClassName("pokeDiv")) {
        pokemons.push(new Pokemon(pokeDiv))
    }
}


// start the connection to the GUI so everything gets
// updated once the GUI sends back some data
initWebsocket("gameData", (data) => updateData(data));


/**
 * Updates overlay data with a provided object
 * @param {Object} data 
 */
async function updateData(data) {

    if (data.type == "Team") {
        
        // pokemon team update
        for (let i = 0; i < data.playerPokemons.length; i++) {

            // set species
            if (data.playerPokemons[i].species != pokemons[i].getSpecies()) {
                if (data.playerPokemons[i].species) {
                    pokemons[i].setSpecies(data.playerPokemons[i].species);
                    pokemons[i].setImg(data.playerPokemons[i].img);
                    pokemons[i].showPoke();
                    pokemons[i].shiny = data.playerPokemons[i].shiny;
                } else {
                    pokemons[i].hidePoke();
                }
            } else if (pokemons[i].shiny != data.playerPokemons[i].shiny) {
                 // if shiny was toggled, just update the image
                pokemons[i].setImg(data.playerPokemons[i].img);
                pokemons[i].shiny = data.playerPokemons[i].shiny;
            }
    
            // set level
            if (data.playerPokemons[i].lvl != pokemons[i].getLvl()) {
                pokemons[i].setLvl(data.playerPokemons[i].lvl);
            }
    
            // set nickname
            if (data.playerPokemons[i].nickName != pokemons[i].getNickname()) {
                pokemons[i].setNickname(data.playerPokemons[i].nickName);
            }
    
            // set gender
            if (data.playerPokemons[i].gender != pokemons[i].getGender()) {
                pokemons[i].setGender(data.playerPokemons[i].gender);
            }

            // set background color
            if (pokemons[i].compareIncTypes(data.playerPokemons[i].types)) {
                pokemons[i].setTypes(data.playerPokemons[i].types);
            }
            
            // set status condition
            if (data.playerPokemons[i].status != pokemons[i].getStatus()) {
                pokemons[i].setStatus(data.playerPokemons[i].status);
            }
            
        }

    } else if (data.type == "Player") {

        // display those shiny gym badges
        for (let i = 0; i < data.player.badges.length; i++) {
            if (data.player.badges[i]) {
                badges[i].style.opacity = 1;
            } else {
                badges[i].style.opacity = 0;
            }
        }

        // get us those sweet stats
        catchesNum.innerText = data.player.catches;
        deathsNum.innerText = data.player.deaths;
        
    } else if (data.type == "Wild Encounter" && data.pokemon) {

        // wild pokemon image
        wildPokemon.setImg(data.pokemon.img);

        // set type info
        wildPokemon.setTypes(data.pokemon.type);

        // gender ratio
        wildPokemon.setGenderRatio(data.pokemon.ratioM, data.pokemon.ratioF);

        // abilities
        wildPokemon.setAbilities(data.pokemon.abilities);

        // stat meters
        wildPokemon.updateMeters(data.pokemon.stats);

        // check if the in combat state changed
        if (inCombatPrev != data.inCombat) {

            // show or hide info if the fight is happening or not
            if (data.inCombat) {
                playerInfoDiv.style.animation = "slideOut .5s both";
                setTimeout(() => {
                    wildDiv.style.animation = "slideIn .5s both";
                }, 250);
            } else {
                wildDiv.style.animation = "slideOut .5s both";
                setTimeout(() => {
                    playerInfoDiv.style.animation = "slideIn .5s both";
                }, 250);
            }
            
            // if in combat, turn everyone so they get to see this glorious fight
            for (let i = 0; i < pokemons.length; i++) {

                if (pokemons[i].getSpecies()) {
                    pokemons[i].turnSprite(data.inCombat);
                }
                
            }

        }

        inCombatPrev = data.inCombat;

    } else if (data.type == "Config") {

        if (current.lang != data.lang) {
            current.lang = data.lang;
            await setLanguage(data.lang);
        }

    }

}