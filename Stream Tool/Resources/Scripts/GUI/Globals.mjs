export const inside = {
    /** If in executable (true) or remote gui (false) */
    electron : typeof process !== 'undefined'
};

/** Local file path of executable or project */
const realPath = inside.electron ? __dirname : "";
/** Paths used for all of the Stream Tool */
export const stPath = {
    poke: realPath + "/Assets/Pokemon", // the "sprites" part will be completed by @pkmn/img
    assets: realPath + "/Assets",
    text : realPath + '/Texts',
};

/** Holds all relevant pokemon data of current generation */
export const dexGens = new pkmn.data.Generations(pkmn.dex.Dex);

/** Current values for stuff */
export const current = {
    lang : "", // most of these will change on startup
    generation : 0,
    game : "",
    version : "",
    pkmnSpecies : dexGens.get(5).species,
    focus : -1, // used for pokeFinder navigation
    numToPoke : {}, // filled on pokeFinder fill
    abilities : {}, // filled on gen update, used for auto id matching
    items : {}, // ^^
    moves : {}, // ^^
    autoStatus : false,
    autoUpdated : false
}
