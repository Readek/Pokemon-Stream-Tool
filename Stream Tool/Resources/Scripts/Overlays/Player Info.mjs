/** @import { PlayerData } from "../Utils/Type Definitions.mjs" */

const badges = document.getElementsByClassName("badge");
const catchesNum = document.getElementById("catchesNumber");
const deathsNum = document.getElementById("deathsNumber");

class PlayerInfo {

    /**
     * Updates player's badges and stats
     * @param {PlayerData} data - Player data
     */
    update(data) {

        // display those shiny gym badges
        for (let i = 0; i < data.badges.gymBadges.length; i++) {
            badges[i].style.opacity = data.badges.gymBadges[i] ? 1 : 0;
        }

        // get us those sweet stats
        catchesNum.innerText = data.catches;
        deathsNum.innerText = data.deaths;

        // hide stats if at 0
        data.catches 
            ? catchesNum.parentElement.style.display = "flex" 
            : catchesNum.parentElement.style.display = "none";
        data.deaths
            ? deathsNum.parentElement.style.display = "flex" 
            : deathsNum.parentElement.style.display = "none";

    }

}

/** Player badges and stats */
export const playerInfo = new PlayerInfo;