import { pokeFinder } from "./Finder/Pokemon Finder.mjs";
import { current } from "./Globals.mjs";

// this is what we will use to get a full dex if requested
// from: https://github.com/pkmn/ps/tree/main/data
const NATDEX_EXISTS = (d, g) => {
    if (!d.exists) return false;
    if (d.kind === 'Ability' && d.id === 'noability') return false;
    // TODO discover a filter to remove custom stuff without removin Leyends stuff
    //if ('isNonstandard' in d && d.isNonstandard && d.isNonstandard !== 'Past') return false;
    return true;
};

export const dexData = {
    /** Holds entire Pokemon data, updated by gen select */
    pkmnSpecies : {},
    /** Nums relative to current gen, filled on pokeFinder fill */
    numToPoke : {},
    /** Used for auto id matching, filled on gen update */
    abilities : {},
    /** Used for auto id matching, filled on gen update */
    items : {},
    /** Used for auto id matching, filled on gen update */
    moves : {}
}

/**
 * Updates all relevant Pokedex data
 * @param {Number} gen - Generation to change to
 */
export function updatePokedexData(gen) {

    const dexGens = new pkmn.data.Generations(pkmn.dex.Dex);

    if (!current.forceDex) {
        dexData.pkmnSpecies = dexGens.get(gen).species;
    } else {
        const fullGen = new pkmn.data.Generations(pkmn.dex.Dex, NATDEX_EXISTS);
        dexData.pkmnSpecies = fullGen.get(9).species; // 9 being latest gen
    }

    // these will be used for auto id matching
    dexData.abilities = Object.fromEntries([...dexGens.get(gen).abilities].map(a => [a.num, a]));
    dexData.items = Object.fromEntries([...dexGens.get(gen).items].map(a => [a.num, a]));
    dexData.moves = Object.fromEntries([...dexGens.get(gen).moves].map(a => [a.num, a]));

    pokeFinder.loadCharacters();

}