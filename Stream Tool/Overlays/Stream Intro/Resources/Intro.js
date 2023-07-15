let webSocket;
let startup = true;

//animation stuff
const fadeInTime = 1; //(seconds)
const fadeOutTime = 1;
const revealTime = 10;
const displayTime = 7.5;
const countdownTime = 300;
let countdown;

const whoThatDiv = document.getElementById("whoThatDiv");
const whoThatProgressBar = document.getElementById("whoThatRevealProgress");
const whoThatPokeImg = document.getElementById("whoThatPokeImg");
const whoThatPokeNick = document.getElementById("pokeNick");
const whoThatPokeGender = document.getElementById("pokeGender");
const whoThatPokeSpecies = document.getElementById("pokeSpecies");
const countdownNumber = document.getElementById("countdownNumber");

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
    #nickname;
    #gender;
    #types = [];
    #img;
    #isNone;

    constructor() {

    }

    
    setSpecies(species) {
        this.#species = species;
    }
    getSpecies() {
        return this.#species;
    }

    setNickname(name) {
        this.#nickname = name;
    }
    getNickname() {
        return this.#nickname;
    }

    setGender(gender) {
        this.#gender = gender;
    }
    getGender() {
        return this.#gender;
    }

    setTypes(types) {
        this.#types = types;
    }
    getTypes() {
        return this.#types;
    }

    setImg(img) {
        this.#img = img;
    }
    getImg() {
        return this.#img;
    }

    setNone(value) {
        this.#isNone = value;
    }
    getNone() {
        return this.#isNone;
    }

}

const pokemons = [];

initPokemon();
function initPokemon() {
    for (let i = 0; i < 6; i++) {
        pokemons.push(new Pokemon())
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
                    pokemons[i].setImg(data.playerPokemons[i].img);
                    pokemons[i].setTypes(data.playerPokemons[i].types);
                    pokemons[i].setNone(false);
                } else {
                    pokemons[i].setNone(true);
                }
            }
    
            // set nickname
            if (data.playerPokemons[i].nickName != pokemons[i].getNickname()) {
                pokemons[i].setNickname(data.playerPokemons[i].nickName);
            }
    
            // set gender
            if (data.playerPokemons[i].gender != pokemons[i].getGender()) {
                pokemons[i].setGender(data.playerPokemons[i].gender);
            }
            
        }

    }

    if (startup) {
        
        whosThatPokemon();
        setInterval(() => {
            whosThatPokemon();
        }, (revealTime + displayTime + (fadeOutTime * 2))*1000);
        startup = false;

        startCountdown();

    }

}

function whosThatPokemon() {
    
    const chosenPoke = pokemons[genRnd(0, 5)];

    // image
    whoThatPokeImg.src = Object.values(chosenPoke.getImg())[genRnd(0, 3)];

    // nickname
    whoThatPokeNick.innerHTML = chosenPoke.getNickname();

    // gender
    if (chosenPoke.getGender() == "F") {
        whoThatPokeGender.innerHTML = "la"
    } else {
        whoThatPokeGender.innerHTML = "el"
    }

    // species
    whoThatPokeSpecies.innerHTML = chosenPoke.getSpecies();


    // on load
    fadeIn(whoThatPokeImg);
    whoThatProgressBar.style.animation = `barReveal ${revealTime}s linear both`;

    // after reveal time
    setTimeout(() => {

        whoThatPokeImg.style.filter = "brightness(1)";
        fadeIn(whoThatPokeNick.parentElement, fadeInTime * 1.5);
        // after initial fade in
        setTimeout(() => {
            whoThatPokeNick.parentElement.style.width = "300px";
        }, fadeInTime*1000);
        
        // after display time
        setTimeout(() => {
            fadeOut(whoThatPokeImg);
            fadeOut(whoThatPokeNick.parentElement);
            whoThatPokeImg.style.filter = "brightness(0)";
            whoThatProgressBar.style.animation = `barRevealnt ${fadeOutTime}s ease-out both`;
            // after final fadeout
            setTimeout(() => {
                whoThatPokeNick.parentElement.style.width = "0px";
            }, fadeOutTime*1000);

        }, displayTime * 1000);


    }, revealTime * 1000);

}


function startCountdown() {

    countdown = countdownTime;

    reduceCountdown();
    setInterval(() => {
        reduceCountdown();
    }, 1000);
    
}

function reduceCountdown() {

    if (countdown > 0) {
        
        let seconds = countdown % 60;
        const minutes = Math.floor(countdown / 60);

        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        
        countdownNumber.innerHTML = `en ${minutes}:${seconds}`;

        countdown -= 1;

    } else {
        
        countdownNumber.innerHTML = "pronto!";

    }

    

}


function fadeIn(itemID, delay = 0, dur = fadeInTime) {
	itemID.style.animation = `fadeIn ${dur}s ${delay}s both`;
}

//fade out
function fadeOut(itemID, dur = fadeOutTime) {
	itemID.style.animation = `fadeOut ${dur}s both`;
}


/**
 * Just a simple random function
 * @param {Number} min 
 * @param {Number} max 
 * @returns {Number}
 */
function genRnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}