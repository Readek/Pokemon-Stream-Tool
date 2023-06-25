const teamButton = document.getElementById("topBarTeam");
const playerButton = document.getElementById("topBarPlayer");
const settingsButton = document.getElementById("topBarSettings");

const teamDiv = document.getElementById("teamRegion");
const playerDiv = document.getElementById("playerInfoRegion");
const settingsDiv = document.getElementById("settingsRegion");

teamButton.addEventListener("click", showTeamRegion);
playerButton.addEventListener("click", showPlayerRegion);
settingsButton.addEventListener("click", showSettingsRegion);

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
    teamDiv.style.display = "none";
    playerDiv.style.display = "none";
    settingsDiv.style.display = "none";

    teamButton.classList.remove("topBarSelected");
    playerButton.classList.remove("topBarSelected");
    settingsButton.classList.remove("topBarSelected");
}