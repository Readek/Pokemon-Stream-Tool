import { Badge } from "./Badge.mjs";
/** @import { BadgeData } from "../../Utils/Type Definitions.mjs" */

const badgesDiv = document.getElementById("badges");

let badges = {};

/**
 * Sets the state of badges given an object of arrays of states
 * @param {BadgeData} states - Badge states
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
 * @returns {BadgeData} Badge states
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
 * @param {BadgeData} badgeData - How this game's badges should work
 */
export function changeBadges(badgeData, renderStyle) {

    badgesDiv.innerHTML = "";
    badges = {};
    
    if (badgeData) { // games that deviate from standard 8 gym badges

        for (const key in badgeData) {

            badges[key] = [];

            // separate in groups of 4 for SV's victory badges
            if (key == "Victory") {
                const wrap1 = createBadgeWrap();
                for (let i = 0; i < 4; i++) {
                    badges[key].push(new Badge(i+1, wrap1, key));
                }
                const wrap2 = createBadgeWrap();
                for (let i = 0; i < 4; i++) {
                    badges[key].push(new Badge(i+5, wrap2, key));
                }
            } else {
                const wrap = createBadgeWrap();
                for (let i = 0; i < badgeData[key]; i++) {
                    badges[key].push(new Badge(i+1, wrap, key));
                }
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

    // set pixelated scaling for pixel badges        
    badgesDiv.style.imageRendering = renderStyle ? "pixelated" : "auto";

}

function createBadgeWrap() {
    const newEl = document.createElement("div");
    newEl.classList.add("badgesWrap");
    badgesDiv.appendChild(newEl);
    return newEl;
}

/**
 * Updates badge images depending on game being played
 * @param {String} game - Sword, or Shield
 */
export function badgeSwordShieldUpdate(game) {
    for (const key in badges) {
        for (let i = 0; i < badges[key].length; i++) {
            badges[key][i].swordShieldUpdate(game);
        }
    }
}