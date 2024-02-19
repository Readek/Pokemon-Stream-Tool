import { initWebsocket } from "../../../Resources/Scripts/Utils/WebSocket.mjs";
import { getJson } from "./Scripts/Get JSON.mjs";
import { typeToColor } from "./Scripts/Type to Color.mjs";
import { wildPokemon } from "./Scripts/Wild Pokemon.mjs";

// these are the sprite offsets so their positions are more centered
const offsets = await getJson("../../Resources/Assets/Pokemon/sprites/offsets.json") || {};

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
    #form;
    #lvl;
    #nickname;
    #gender;
    #types = [];
    #status;

    #hpCurrent;
    #hpMax;

    #img;
    #side = "Front";

    constructor(el) {

        this.mainEl = el;

        this.speciesEl = el.getElementsByClassName(`pokeSpecies`)[0];
        this.lvlEl = el.getElementsByClassName(`pokeLvlNum`)[0];
        this.nickEl = el.getElementsByClassName(`pokeNick`)[0];
        this.gendEl = el.getElementsByClassName(`pokeGender`)[0];

        this.hpBar = el.getElementsByClassName(`pokeHpBarCurrent`)[0];
        this.hpEl = el.getElementsByClassName(`pokeHpText`)[0];

        this.imgEl = el.getElementsByClassName(`pokeImg`)[0];
        
    }

    
    setSpecies(species) {
        this.#species = species;
        this.speciesEl.innerHTML = species;
    }
    getSpecies() {
        return this.#species;
    }

    setForm(form) {
        this.#form = form;
    }
    getForm() {
        return this.#form;
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
    }
    getNickname() {
        return this.#nickname;
    }

    setGender(gender) {
        this.#gender = gender;
        if (gender == "F") {
            this.gendEl.innerHTML = "la";
        } else {
            this.gendEl.innerHTML = "el";
        }
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

        if (status != "---") {
            this.mainEl.style.setProperty("--activeColor", "var(--"+status+")");
        }
        if (status == "Fai") {
            this.mainEl.classList.add("pokeDed");
        } else {
            this.mainEl.classList.remove("pokeDed");
        }

    }
    getStatus() {
        return this.#status;
    }

    getHpCurrent() {
        return this.#hpCurrent;
    }
    getHpMax() {
        return this.#hpMax;
    }
    /**
     * @param {Number} current 
     * @param {Numner} max 
     */
    setHp(current, max) {
        
        this.#hpCurrent = current;
        this.#hpMax = max;
        this.hpEl.innerHTML = current + "/" + max;

        // adjust the health bar
        const percent = current / max * 100 - 100;
        this.hpBar.style.transform = "translateX("+percent+"%)";

        // and just because its cool, recolor border if in danger
        if (current == max) {
            // this one is here for data sent with 0/0 HP
            this.mainEl.style.setProperty("--activeColor", "var(--healthy)");
        } else if (current <= max*.2) { // 20%
            this.mainEl.style.setProperty("--activeColor", "var(--danger)");
        } else if (current <= max/2) { // 50%
            this.mainEl.style.setProperty("--activeColor", "var(--warning)");
        } else {
            this.mainEl.style.setProperty("--activeColor", "var(--healthy)");
        }

    }

    setImg(img) {
        this.#img = img;
        this.imgEl.src = img["gen5" + this.#side];
        let filename = img["gen5" + this.#side].replace("\\", "/").replace(/.*sprites\//, ""); //"gen5ani/lugia.gif"
        let offset = offsets[filename] ?? [0, 0];
        this.imgEl.style.transform = `scale(2) translate(${offset[0]}px, ${offset[1]}px)`;
        //We compensate to account for the cases where the gif center is skewed towards a place where the Pokémon
        //doesn't spend that much time; e.g., Pokémon that jump (Rotom-Heat, Weavile) or extend their body (Thundurus-Therian, Timburr).
        //The offsets are the difference between the actual center of the gif and the mean of the bounding boxes of each gif frame, and are precalculated using a Python script included in the repo.
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
                ${typeToColor(types[1])}35, ${typeToColor(types[0])}75)`;
        } else if (types.length == 1) {
            this.mainEl.style.background = `${typeToColor(types[0])}75`;
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
            if (data.playerPokemons[i].species != pokemons[i].getSpecies() ||
                data.playerPokemons[i].form != pokemons[i].getForm()) {
                if (data.playerPokemons[i].species) {
                    pokemons[i].setSpecies(data.playerPokemons[i].species);
                    pokemons[i].setImg(data.playerPokemons[i].img);
                    pokemons[i].showPoke();
                    pokemons[i].setForm(data.playerPokemons[i].form);
                } else {
                    pokemons[i].hidePoke();
                }
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
            
            // set HP
            pokemons[i].setHp(data.playerPokemons[i].hpCurrent, data.playerPokemons[i].hpMax);

            // set status condition
            pokemons[i].setStatus(data.playerPokemons[i].status);
            
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
        
    } else if (data.type == "Wild Encounter") {

        // wild pokemon image
        if (data.pokemon) {
            wildPokemon.setImg(data.pokemon.img);
        }

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

    }

}