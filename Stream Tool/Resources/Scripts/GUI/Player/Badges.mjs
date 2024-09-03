import { Badge } from "./Badge.mjs";

const badgesDiv = document.getElementById("badges");

let badges = {};

/**
 * Sets the state of badges given an object of arrays of states
 * @param {Object} states - Badge states
 */
export function setBadges(states) {
    
    for (const key in states) {

        for (let i = 0; i < states[key].length; i++) {
            badges[key][i].setValue(states[key][i]);
        }

    }

}

/**
 * Retuns arrays of truthies/falsies of badge states for each badge type
 * @returns {Object} Badge states
 */
export function getBadges() {

    const badgeState = {};

    for (const key in badges) {

        badgeState[key] = [];
        
        for (let i = 0; i < badges[key].length; i++) {
            badgeState[key].push(badges[key][i].getValue());
        }

    }    
    
    return badgeState;

}

/**
 * Updates badge assets
 * @param {Object} badgeData - How this game's badges should work
 */
export function changeBadges(badgeData) {

    badgesDiv.innerHTML = "";
    badges = {};
    
    if (badgeData) { // games that deviate from standard 8 gym badges

        for (const key in badgeData) {

            badges[key] = [];

            const wrap = createBadgeWrap();
            for (let i = 0; i < badgeData[key]; i++) {
                badges[key].push(new Badge(i+1, wrap, key));
            }

        }

        badgesDiv.classList.add("badgesColumns");

    } else {

        // we asume a standard 8 badges for every game without extra data
        badges = {gymBadges : []};

        const wrap1 = createBadgeWrap();
        for (let i = 0; i < 4; i++) {
            badges.gymBadges.push(new Badge(i+1, wrap1));
        }
        const wrap2 = createBadgeWrap();
        for (let i = 0; i < 4; i++) {
            badges.gymBadges.push(new Badge(i+5, wrap2));
        }

        badgesDiv.classList.remove("badgesColumns");

    }    

}

function createBadgeWrap() {
    const newEl = document.createElement("div");
    newEl.classList.add("badgesWrap");
    badgesDiv.appendChild(newEl);
    return newEl;
}