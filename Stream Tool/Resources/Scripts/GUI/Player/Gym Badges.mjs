import { current, stPath } from "../Globals.mjs";

const badges = document.getElementsByClassName("gymBadgeButton");

for (let i = 0; i < badges.length; i++) {
    badges[i].addEventListener("click", toggleBadge);
}

function toggleBadge() {
    this.classList.toggle("badgeDisabled");
}

/**
 * Sets the state of badges given an array of states
 * @param {Array} states Badge states
 */
export function setBadges(states) {
    for (let i = 0; i < states.length; i++) {
        if (states[i]) {
            badges[i].classList.remove("badgeDisabled")
        } else {
            badges[i].classList.add("badgeDisabled")
        }
    }
}

/**
 * Retuns an array of truthies/falsies of badge states
 * @returns {Array} Badge states
 */
export function getBadges() {
    const badgeState = [];
    for (let i = 0; i < badges.length; i++) {
        let state = true;
        for (let j = 0; j < badges[i].classList.length; j++) {
            if (badges[i].classList[j] == "badgeDisabled") {
                state = false;
                break;
            }
        }
        badgeState.push(state);
    }
    return badgeState;
}

export function changeBadges(game) {
    
    for (let i = 0; i < badges.length; i++) {
        badges[i].firstElementChild.src = 
            `${stPath.assets}/Gym Badges/${current.generation}/${game}/${i+1}.png`;
    }

}