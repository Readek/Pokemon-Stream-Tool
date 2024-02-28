import { current } from "./Scripts/Globals.mjs";
import { genRnd } from "../../../Resources/Scripts/Utils/GenRnd.mjs";
import { initWebsocket } from "../../../Resources/Scripts/Utils/WebSocket.mjs";
import { getLocalizedText, setLanguage } from "../../../Resources/Scripts/Utils/Language.mjs";

let startup = true;

//animation stuff
const fadeInTime = 1; //(seconds)
const fadeOutTime = 1;
const revealTime = 10;
const displayTime = 7.5;
const countdownTime = 300;
let countdown;

const whoThatProgressBar = document.getElementById("whoThatRevealProgress");
const whoThatPokeImg = document.getElementById("whoThatPokeImg");
const whoThatPokeNick = document.getElementById("pokeNick");
const whoThatPokeGender = document.getElementById("pokeGender");
const whoThatPokeSpecies = document.getElementById("pokeSpecies");
const countdownText = document.getElementById("countdownText");

const noCatchesMessage = document.getElementById("noCatchesMessage");

class Catch {

    #species;
    #nickname;
    #gender;
    #img;
    #isNone;

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

const catches = [];


// start the connection to the GUI so everything gets
// updated once the GUI sends back some data
initWebsocket("gameData", (data) => updateData(data));

startCountdown();

/**
 * Updates overlay data with a provided object
 * @param {Object} data 
 */
async function updateData(data) {

    if (data.type == "Catches") {
        
        if (data.catches.length > 0) {

            // check if we got a different array
            if (catches.length != data.catches.length) {
                // resize it if so
                catches.length = data.catches.length;
            }

            // for every incoming catch
            for (let i = 0; i < data.catches.length; i++) {

                // if theres no data on that slot, create a new catch
                if (!catches[i]) {
                    catches[i] = new Catch();
                }

                // set species
                if (data.catches[i].species != catches[i].getSpecies()) {
                    if (data.catches[i].species) {
                        catches[i].setSpecies(data.catches[i].species);
                        catches[i].setImg(data.catches[i].img);
                        catches[i].setNone(false);
                    } else {
                        catches[i].setNone(true);
                    }
                }

                // set nickname
                if (data.catches[i].nickName != catches[i].getNickname()) {
                    catches[i].setNickname(data.catches[i].nickName);
                }

                // set gender
                if (data.catches[i].gender != catches[i].getGender()) {
                    catches[i].setGender(data.catches[i].gender);
                }
                
            }

            if (startup) {

                setTimeout(() => {
                    whosThatPokemon();
                    setInterval(() => {
                        whosThatPokemon();
                    }, (revealTime + displayTime + (fadeOutTime * 2))*1000);
                }, 50); // timeout here so lang has time to load
                
                startup = false;

            }

            noCatchesMessage.style.display = "none";

        } else {
            
            // if we got no data to work with, display a message
            noCatchesMessage.style.display = "block";

        }

    } else if (data.type == "Config") {

        if (current.lang != data.lang) {
            current.lang = data.lang;
            await setLanguage(data.lang, "overlay");
        }

    }

}

function whosThatPokemon() {
    
    const chosenPoke = catches[genRnd(0, catches.length-1)];

    // image
    whoThatPokeImg.src = Object.values(chosenPoke.getImg())[genRnd(0, 3)];

    // nickname
    whoThatPokeNick.innerHTML = chosenPoke.getNickname();

    // species
    whoThatPokeSpecies.innerHTML = chosenPoke.getSpecies();

    // gender
    if (chosenPoke.getGender() == "F") {
        whoThatPokeGender.innerHTML = getLocalizedText("pokePronounF");
    } else if (chosenPoke.getGender() == "M") {
        whoThatPokeGender.innerHTML = getLocalizedText("pokePronounM");
    } else {
        whoThatPokeGender.innerHTML = getLocalizedText("pokePronounNull");
    }

    // hide or show sub text depending on if the poke has a nickname or not
    if (chosenPoke.getNickname() && chosenPoke.getNickname() != chosenPoke.getSpecies()) {
        whoThatPokeSpecies.parentElement.style.display = "flex";
    } else {
        whoThatPokeNick.innerHTML = chosenPoke.getSpecies();
        whoThatPokeSpecies.parentElement.style.display = "none";
    }

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

    setTimeout(() => {
        reduceCountdown();
    }, 50); // so lang has time to load
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
        
        countdownText.innerHTML = getLocalizedText("cdTextProgress", [minutes, seconds]);

        countdown -= 1;

    } else {
        
        countdownText.innerHTML = getLocalizedText("cdTextFinished");

    }

}


function fadeIn(itemID, delay = 0, dur = fadeInTime) {
	itemID.style.animation = `fadeIn ${dur}s ${delay}s both`;
}
function fadeOut(itemID, dur = fadeOutTime) {
	itemID.style.animation = `fadeOut ${dur}s both`;
}
