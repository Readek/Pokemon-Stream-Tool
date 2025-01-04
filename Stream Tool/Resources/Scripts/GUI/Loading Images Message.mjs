import { getLocalizedPokeText, getLocalizedText } from "../Utils/Language.mjs";
import { current } from "./Globals.mjs";

const loadingMessageEl = document.getElementById("loadingImgsMessage");

const loadings = {}, timeouts = {};

/**
 * Displays a "Loading Sprites" text on screen
 * @param {String} id - Pokemon currently loading
 */
export function displayLoadImgsMessage(id) {

    loadings[id] = true;

    // get a localized poke name
    const name = getLocalizedPokeText(id, "Pokemon", current.generation);
    // and display it on the message
    loadingMessageEl.innerHTML = getLocalizedText("loadingImgsMessage", [name]);

    // wait a tick so we dont display the message if the function finishes fast enough
    timeouts[id] = setTimeout(() => {
        if (loadings[id]) {
            loadingMessageEl.style.display = "block";
        }
    }, 50);

}

/**
 * Hides the "Loading Sprites" message
 * @param {String} id - Pokemon currently loading
 */
export function hideLoadImgsMessage(id) {

    loadings[id] = false;

    loadingMessageEl.style.display = "none";
    
    clearTimeout(timeouts[id]);

}