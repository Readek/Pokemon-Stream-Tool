const catchesButton = document.getElementById("topBarCatches");
const teamButton = document.getElementById("topBarTeam");
const playerButton = document.getElementById("topBarPlayer");
const settingsButton = document.getElementById("topBarSettings");

const catchesDiv = document.getElementById("catchesRegion");
const teamDiv = document.getElementById("teamRegion");
const playerDiv = document.getElementById("playerInfoRegion");
const settingsDiv = document.getElementById("settingsRegion");

const buttons = document.getElementsByClassName("topBarButton");
const regions = document.getElementsByClassName("region");

catchesButton.addEventListener("click", showCatchesRegion);
teamButton.addEventListener("click", showTeamRegion);
playerButton.addEventListener("click", showPlayerRegion);
settingsButton.addEventListener("click", showSettingsRegion);


function showCatchesRegion() {
    hideAll();
    catchesDiv.style.display = "flex";
    catchesButton.classList.add("topBarSelected");
}

function showTeamRegion() {
    hideAll();
    teamDiv.style.display = "flex";
    teamButton.classList.add("topBarSelected");
}

function showPlayerRegion() {
    hideAll();
    playerDiv.style.display = "flex";
    playerButton.classList.add("topBarSelected");
}

function showSettingsRegion() {
    hideAll();
    settingsDiv.style.display = "flex";
    settingsButton.classList.add("topBarSelected");
}

/** Hides all region divs and removes selected button style */
function hideAll() {

    for (let i = 0; i < regions.length; i++) {
        regions[i].style.display = "none";
        buttons[i].classList.remove("topBarSelected");        
    }

}