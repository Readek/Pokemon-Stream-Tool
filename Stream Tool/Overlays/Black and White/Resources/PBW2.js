import { getJson } from "./Scripts/Get JSON.mjs";
import { typeToColor } from "./Scripts/Type to Color.mjs";

let webSocket;

// these are the sprite offsets so their positions are more centered
const offsets = await getJson("../../Resources/Assets/play.pokemonshowdown.com/sprites/offsets.json") || {};

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
    #gender;
    #types = [];
    #imgSrc;

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

    setImg(src) {
        this.#imgSrc = src;
        this.imgEl.src = src;
        let filename = src.replace("\\", "/").replace(/.*sprites\//, ""); //"gen5ani/lugia.gif"
        let offset = offsets[filename] ?? [0, 0];
        this.imgEl.style.transform = `scale(2) translate(${offset[0]}px, ${offset[1]}px)`;
        //We compensate to account for the cases where the gif center is skewed towards a place where the Pokémon
        //doesn't spend that much time; e.g., Pokémon that jump (Rotom-Heat, Weavile) or extend their body (Thundurus-Therian, Timburr).
        //The offsets are the difference between the actual center of the gif and the mean of the bounding boxes of each gif frame, and are precalculated using a Python script included in the repo.
    }
    getImgSrc() {
        return this.#imgSrc;
    }

    hidePoke() {
        this.mainEl.style.display = "none";
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

}

const pokemons = [];
const badges = document.getElementsByClassName("badge");
const catchesNum = document.getElementById("catchesNumber");
const killsNum = document.getElementById("killsNumber");
const deathsNum = document.getElementById("deathsNumber");

initPokemon();
function initPokemon() {
    for (const pokeDiv of document.getElementsByClassName("pokeDiv")) {
        pokemons.push(new Pokemon(pokeDiv))
    }
}


// first we will start by connecting with the GUI with a websocket
startWebsocket();
function startWebsocket() {

	// change this to the IP of where the GUI is being used for remote control
	webSocket = new WebSocket("ws://localhost:8080?id=gameData");
	webSocket.onopen = () => { // if it connects successfully
		// everything will update everytime we get data from the server (the GUI)
		webSocket.onmessage = function (event) {
			updateData(JSON.parse(event.data));
		}
		// hide error message in case it was up
		document.getElementById('connErrorDiv').style.display = 'none';
	}

	// if the connection closes, wait for it to reopen
	webSocket.onclose = () => {errorWebsocket()}

}
function errorWebsocket() {

	// show error message
	document.getElementById('connErrorDiv').style.display = 'flex';
	// delete current webSocket
	webSocket = null;
	// we will attempt to reconect every 5 seconds
	setTimeout(() => {
		startWebsocket();
	}, 5000);

}


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
                    pokemons[i].showPoke();
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
    
            // set image
            if (data.playerPokemons[i].img != pokemons[i].getImgSrc()) {
                pokemons[i].setImg(data.playerPokemons[i].img);
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
        killsNum.innerText = data.player.kills;
        deathsNum.innerText = data.player.deaths;
        
    }

}