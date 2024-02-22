const badges = document.getElementsByClassName("badge");
const catchesNum = document.getElementById("catchesNumber");
const deathsNum = document.getElementById("deathsNumber");

class PlayerInfo {

    /**
     * Updates player's badges and stats
     * @param {Object} data - Player data
     */
    update(data) {

        // display those shiny gym badges
        for (let i = 0; i < data.badges.length; i++) {
            if (data.badges[i]) {
                badges[i].style.opacity = 1;
            } else {
                badges[i].style.opacity = 0;
            }
        }

        // get us those sweet stats
        catchesNum.innerText = data.catches;
        deathsNum.innerText = data.deaths;

    }

}

/** Player badges and stats */
export const playerInfo = new PlayerInfo;