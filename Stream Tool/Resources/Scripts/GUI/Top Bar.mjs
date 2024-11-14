const buttons = {
    catches: document.getElementById("topBarCatches"),
    team: document.getElementById("topBarTeam"),
    player: document.getElementById("topBarPlayer"),
    wild: document.getElementById("topBarVsWild"),
    trainer: document.getElementById("topBarVsTrainer"),
    settings: document.getElementById("topBarSettings")
}
const regions = {
    catches: document.getElementById("catchesRegion"),
    team: document.getElementById("teamRegion"),
    player: document.getElementById("playerInfoRegion"),
    wild: document.getElementById("vsWildRegion"),
    trainer: document.getElementById("vsTrainerRegion"),
    settings: document.getElementById("settingsRegion")
}

for (const key in buttons) {
    buttons[key].addEventListener("click", () => {showRegion(key)});
}

/**
 * Displays the requested region and styles selected button
 * @param {String} key - Name of region
 */
function showRegion(key) {
    hideAll();
    regions[key].style.display = "flex";
    buttons[key].classList.add("topBarSelected");
}

/** Hides all region divs and removes selected button style */
function hideAll() {

    for (const key in regions) {
        regions[key].style.display = "none";
    }
    for (const key in buttons) {
        buttons[key].classList.remove("topBarSelected");
    }

}