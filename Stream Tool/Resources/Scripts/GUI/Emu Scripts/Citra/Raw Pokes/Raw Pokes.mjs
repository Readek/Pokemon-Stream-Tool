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
]

/**
 * Reorders party to ingame order. 
 * Game's party memory rarely shuffles order, instead the game has an
 * external array to keep track of party order.
 * @param {Number[]} indexes - Actual party order
 * @returns {RawPokemonParty[]} Ordered party as seen in-game
 */
export function indexRawParty(indexes) {
    const rawPokesIndexed = [];
    for (let i = 0; i < rawPartyPokes.length; i++) {
        rawPokesIndexed.push(rawPartyPokes[indexes[i]]);
    }
    return rawPokesIndexed;
}