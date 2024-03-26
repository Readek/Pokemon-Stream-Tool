const loadings = {};

const loadingMessageEl = document.getElementById("loadingImgsMessage");

/**
 * Displays a "Loading Sprites" text on screen
 * @param {String} id - Type of images loading
 */
export function displayLoadImgsMessage(id) {
    
    loadings[id] = true;

    // wait a tick so we dont display the message if the function finishes fast enough
    setTimeout(() => {
        if (loadings[id]) {
            loadingMessageEl.style.display = "block";
        }
    }, 50);
    
}

/**
 * Hides the "Loading Sprites" message, as long as no other id is still loading them
 * @param {String} id - Type of images loading
 */
export function hideLoadImgsMessage(id) {

    loadings[id] = false;
    
    // if another id is still loading, get us out
    for (const load in loadings) {
        if (loadings[load]) {
            return;
        }
    }

    loadingMessageEl.style.display = "none";
    
}