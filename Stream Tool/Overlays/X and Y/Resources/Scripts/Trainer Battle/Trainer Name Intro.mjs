import { getLocalizedText } from "../../../../../Resources/Scripts/Utils/Language.mjs";

const trainerIntroDiv = document.getElementById("enemyNameIntroDiv");
const titleText = document.getElementById("enemyNameIntroTitle");
const nameText = document.getElementById("enemyNameIntroName");
const countText = document.getElementById("enemyNameIntroPokeCount");
/** @import { EnemyTrainerName } from "../../../../../Resources/Scripts/Utils/Type Definitions.mjs" */

let name = "";
let pokeCount = 0;

/**
 * Changes enemy trainer's name for the battle intro
 * @param {EnemyTrainerName} nameData 
 * @param {String} species
 */
export function setTrainerName(nameData, species) {

    if (nameData.name == name || nameData.name == species) return;

    // in gen7, battle overlay can activate for forced wild fights
    if (nameData.name.startsWith("\u0000")) {
        
        // in those cases, we will use first enemy poke as name
        nameData.name = species;
        nameData.title = getLocalizedText("pokeBattleIntroWild");

    }

    titleText.innerHTML = nameData.title;
    nameText.innerHTML = nameData.name;

    name = nameData.name;

}

/** 
 * Sets enemy trainer's intro pokemon count 
 * @param {Number} num - Number of enemy pokemon
 */
export function setTrainerPokeCount(num) {
    if (pokeCount == num) return;
    pokeCount = num;
    countText.innerHTML = num;
}

/** Display enemy trainer name intro, hides it when done */
export async function showTrainerNameIntro() {

    trainerIntroDiv.style.display = "flex";

    setTimeout(() => {
        trainerIntroDiv.style.display = "none";
    }, 4000);

    await new Promise(resolve => setTimeout(resolve, 3500));

    return;

}
