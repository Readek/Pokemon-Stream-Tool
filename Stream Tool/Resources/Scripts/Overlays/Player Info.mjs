/** @import { PlayerData } from "../Utils/Type Definitions.mjs" */

const badges = document.getElementsByClassName("badge");
const badgeEl = document.getElementById("badges");
const catchesNum = document.getElementById("catchesNumber");
const deathsNum = document.getElementById("deathsNumber");

class PlayerInfo {

    /**
     * Updates player's badges and stats
     * @param {PlayerData} data - Player data
     */
    update(data) {

        // display those shiny gym badges
        if (data.badges.gymBadges) {

            // this is the regular 8-badge mode
            for (let i = 0; i < data.badges.gymBadges.length; i++) {
                badges[i].style.opacity = data.badges.gymBadges[i] ? 1 : 0;
            }

        } else {

            // buuuut for games with diferent badge designs...
            for (const key in data.badges) { // for every badge type (kanto, melemele...)
                
                // search for those elements
                const badgeTypeEl = badgeEl.getElementsByClassName(`badge${key}`);
                
                // and show them up, or not
                for (let i = 0; i < data.badges[key].length; i++) {
                    badgeTypeEl[i].style.opacity = data.badges[key][i] ? 1 : 0;
                }

            }

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