import { current } from "../../../Globals.mjs";
import { RawPokemonBattle } from "./Raw Pokemon Battle.mjs";
import { RawPokemonParty } from "./Raw Pokemon Party.mjs";

export const rawPartyPokes = [
    new RawPokemonParty,
    new RawPokemonParty,
    new RawPokemonParty,
    new RawPokemonParty,
    new RawPokemonParty,
    new RawPokemonParty
];

export const rawBattlePokes = [
    new RawPokemonBattle,
    new RawPokemonBattle,
    new RawPokemonBattle,
    new RawPokemonBattle,
    new RawPokemonBattle,
    new RawPokemonBattle
];

export const rawEnemyPokes = [
    new RawPokemonBattle,
    new RawPokemonBattle,
    new RawPokemonBattle,
    new RawPokemonBattle,
    new RawPokemonBattle,
    new RawPokemonBattle
];

// to check if order changed
let prevIndexes = [0, 0, 0, 0, 0, 0]

/**
 * Reorders party to ingame order. 
 * Game's party memory rarely shuffles order, instead the game has an
 * external array to keep track of party order.
 * @param {Number[]} indexes - Actual party order
 * @returns {RawPokemonParty[]} Ordered party as seen in-game
 */
export function indexRawParty(indexes) {

    // check if order changed
    for (let i = 0; i < indexes.length; i++) {
        if (indexes[i] != prevIndexes[i]) {
            current.autoUpdated = true;
            prevIndexes = indexes;
            break;
        }
    }

    // reorder that party
    const rawPokesIndexed = [];
    for (let i = 0; i < rawPartyPokes.length; i++) {

        rawPokesIndexed.push(rawPartyPokes[indexes[i]]);
        if (current.autoUpdated) {
            rawPokesIndexed[i].changeHasChanged();
        }

    }

    return rawPokesIndexed;
}