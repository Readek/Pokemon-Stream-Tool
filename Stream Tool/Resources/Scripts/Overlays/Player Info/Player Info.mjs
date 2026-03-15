/** @import { PlayerData, BadgeData } from "../../Utils/Type Definitions.mjs" */
import "./Badge.mjs";

const badgeEl = document.getElementById("badges");
const badgeComp = {};

const catchesNum = document.getElementById("catchesNumber");
const deathsNum = document.getElementById("deathsNumber");

const statUpAnim = [
    {transform: "scale(1)", filter: "brightness(1)"},
    {transform: "scale(1.2)", filter: "brightness(1.3)", offset: 0.2},
    {transform: "scale(1)", filter: "brightness(1)"}
];
const statUpTime = {duration: 200, easing: "ease-out"}

class PlayerInfo {

    /**
     * Updates player's badges and stats
     * @param {PlayerData} data - Player data
     */
    update(data) {
        this.#updateStats(data.catches, data.deaths);
        this.#updateBadges(data.badges);
    }

    /** @param {BadgeData} badges - Player data */
    #updateBadges(badges) {

        // for every badge type (usually just 1, but some games have more)
        for (const key in badges) {

            // if this is the first time we see this badge type
            if (!badgeComp[key]) {

                // create category
                badgeComp[key] = [];

                // the place where we will place our badges
                const badgeTypeEl = badgeEl.getElementsByClassName(`b-${key}`)[0];

                // create as many badges as values we got sent for this type
                for (let i = 0; i < badges[key].length; i++) {
                    badgeComp[key].push(document.createElement("badge-overlay"));
                    badgeComp[key][i].setSrc(i, key);
                    badgeTypeEl.appendChild(badgeComp[key][i]);
                }

            }

            // update badge value
            for (let i = 0; i < badges[key].length; i++) {
                badgeComp[key][i].showHide(badges[key][i]);
            }

        }

    }

    /**
     * @param {Number} catches 
     * @param {Number} deaths
     */
    #updateStats(catches, deaths) {

        if (catches != catchesNum.textContent) {
            // update that number
            catchesNum.textContent = catches;
            // animate on stat update
            catchesNum.parentElement.animate(statUpAnim, statUpTime);
            // hide stats if at 0
            catchesNum.parentElement.style.display = catches ? "flex" : "none";
        } 
        if (deaths != deathsNum.textContent) {
            deathsNum.textContent = deaths;
            deathsNum.parentElement.animate(statUpAnim, statUpTime);
            deathsNum.parentElement.style.display = catches ? "flex" : "none";
        }

    }

}

/** Player badges and stats */
export const playerInfo = new PlayerInfo;