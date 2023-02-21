'use strict';

let webSocket;

class Pokemon {

    constructor(el) {

        this.mainEl = el;

        this.speciesEl = el.getElementsByClassName(`pokeSpecies`)[0];
        this.nickEl = el.getElementsByClassName(`pokeNick`)[0];
        this.gendEl = el.getElementsByClassName(`pokeGender`)[0];
        this.imgEl = el.getElementsByClassName(`pokeImg`)[0];
        
    }

    
    setSpecies(species) {
        this.speciesEl.innerHTML = species;
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

}

const pokemons = [];
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



async function updateData(data) {

    for (let i = 0; i < data.playerPokemons.length; i++) {

        // set species
        if (data.playerPokemons[i].species) {
            pokemons[i].setSpecies(data.playerPokemons[i].species);
            pokemons[i].showPoke();
        } else {
            pokemons[i].hidePoke();
        }

        // set nickname
        pokemons[i].setNickname(data.playerPokemons[i].nickName);

        // set gender
        pokemons[i].setGender(data.playerPokemons[i].gender);

        // set image
        pokemons[i].setImg(data.playerPokemons[i].img);
        
    }

}