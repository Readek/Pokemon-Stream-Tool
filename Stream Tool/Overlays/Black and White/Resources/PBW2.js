import { typeToColor } from "./Scripts/Type to Color.mjs";

let webSocket;

// this is a weird way to have file svg's that can be recolored by css
customElements.define("load-svg", class extends HTMLElement {
    async connectedCallback(
      shadowRoot = this.shadowRoot || this.attachShadow({mode:"open"})
    ) {
      shadowRoot.innerHTML = await (await fetch(this.getAttribute("src"))).text()
    }
});

class Pokemon {

    constructor(el) {

        this.mainEl = el;

        this.speciesEl = el.getElementsByClassName(`pokeSpecies`)[0];
        this.lvlEl = el.getElementsByClassName(`pokeLvlNum`)[0];
        this.nickEl = el.getElementsByClassName(`pokeNick`)[0];
        this.gendEl = el.getElementsByClassName(`pokeGender`)[0];
        this.imgEl = el.getElementsByClassName(`pokeImg`)[0];
        
    }

    
    setSpecies(species) {
        this.speciesEl.innerHTML = species;
    }
    setLvl(lvl) {
        this.lvlEl.innerHTML = lvl
    }
    setNickname(name) {
        this.nickEl.innerHTML = name;
    }
    setGender(gender) {
        if (gender == "F") {
            this.gendEl.innerHTML = "la";
        } else {
            this.gendEl.innerHTML = "el";
        }
    }
    setImg(src) {
        this.imgEl.src = src;
    }

    hidePoke() {
        this.mainEl.style.display = "none";
    }
    showPoke() {
        this.mainEl.style.display = "block";
    }

    setBackgroundColor(types) {
        if (types.length == 2) {
            this.mainEl.style.background = `linear-gradient(to bottom,
                ${typeToColor(types[1])}35, ${typeToColor(types[0])}35)`;
        } else if (types.length == 1) {
            this.mainEl.style.background = `${typeToColor(types[0])}35`;
        }
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
            if (data.playerPokemons[i].species) {
                pokemons[i].setSpecies(data.playerPokemons[i].species);
                pokemons[i].showPoke();
            } else {
                pokemons[i].hidePoke();
            }
    
            // set level
            pokemons[i].setLvl(data.playerPokemons[i].lvl);
    
            // set nickname
            pokemons[i].setNickname(data.playerPokemons[i].nickName);
    
            // set gender
            pokemons[i].setGender(data.playerPokemons[i].gender);

            // set background color
            pokemons[i].setBackgroundColor(data.playerPokemons[i].types,
                data.playerPokemons[i].typeColors);
    
            // set image
            pokemons[i].setImg(data.playerPokemons[i].img);
            
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