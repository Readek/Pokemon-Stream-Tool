const dexGens = new pkmn.data.Generations(pkmn.dex.Dex);

export const dexData = {
    /** Holds entire Pokemon data, updated by gen select */
    pkmnSpecies : dexGens.get(5).species,
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
    dexData.pkmnSpecies = dexGens.get(gen).species;
    dexData.abilities = Object.fromEntries([...dexGens.get(gen).abilities].map(a => [a.num, a]));
    dexData.items = Object.fromEntries([...dexGens.get(gen).items].map(a => [a.num, a]));
    dexData.moves = Object.fromEntries([...dexGens.get(gen).moves].map(a => [a.num, a]));
}