/** @import { PokeType } from "../Utils/Type Definitions.mjs" */

const colors = {
    "Bug": "#91c12c",
    "Dark": "#5a5467",
    "Dragon": "#0c6cc4",
    "Electric": "#f4d43b",
    "Fairy": "#ed91e3",
    "Fighting": "#ce4267",
    "Fire": "#ff9d54",
    "Flying": "#90a9dc",
    "Ghost": "#526aad",
    "Grass": "#63bc5a",
    "Ground": "#d97846",
    "Ice": "#73d0bd",
    "Normal": "#909ca2",
    "Poison": "#a96ac9",
    "Psychic": "#fb717b",
    "Rock": "#c6b88a",
    "Steel": "#5a8fa3",
    "Water": "#4e92d2",
}

/**
 * Returns a hex color code for a given type
 * @param {PokeType} type
 * @returns {String} 
 */
export function typeToColor(type) {
    return colors[type] || colors["Normal"];
}