const teamButton = document.getElementById("topBarTeam");
const playerButton = document.getElementById("topBarPlayer");
const settingsButton = document.getElementById("topBarSettings");

const teamDiv = document.getElementById("playerRegion");
const playerDiv = document.getElementById("playerInfoDiv");

teamButton.addEventListener("click", showTeamRegion);
playerButton.addEventListener("click", showPlayerRegion);

function showTeamRegion() {
    hideAll();
    teamDiv.style.display = "flex";
}

function showPlayerRegion() {
    hideAll();
    playerDiv.style.display = "flex";
}

function hideAll() {
    teamDiv.style.display = "none";
    playerDiv.style.display = "none";
}