import { getLocalizedText } from "../../Utils/Language.mjs";
import { current } from "../Globals.mjs";
import { clearAllTrainerPokemon } from "../VS Trainer/TrainerPokemons.mjs";
/** @import { BattleType } from "../../Utils/Type Definitions.mjs" */

const bTypeButt = document.getElementById("bTypeButt");

let battleType = "None";

bTypeButt.addEventListener("click", toggleBattleState);

/** Moves on to the next battle state when manually clicking the button */
function toggleBattleState() {
    
    const state = getBattleState();

    if (state == "None") {
        setBattleState("Wild");
    } else if (state == "Wild") {
        setBattleState("Trainer");
    } else if (state == "Trainer") {
        setBattleState("Multi");
    } else {
        setBattleState("None");
    }

}

/**
 * Returns current team battle state
 * @returns {BattleType}
 */
export function getBattleState() {
    return battleType;
}

/**
 * Sets the current team battle state
 * @param {BattleType} value - Battle type to swap to
 */
export function setBattleState(value) {
    
    // skip if value is same as what we already got
    if (value == battleType) return;

    battleType = value;

    // change button text
    bTypeButt.innerHTML = getLocalizedText("bTypeButt" + value);
    bTypeButt.setAttribute("locText", "bTypeButt" + value);

    if (value != "Trainer") {
        clearAllTrainerPokemon();
    }

}

/** 
 * Shows or hides battle state button depending on generation
 * @param {Number} gen - Current Generation
 */
export function displayBattleStateButt(gen) {
    if (gen == 6 || gen == 7) {
        bTypeButt.style.display = "flex";
    } else {
        bTypeButt.style.display = "none";
    }
}