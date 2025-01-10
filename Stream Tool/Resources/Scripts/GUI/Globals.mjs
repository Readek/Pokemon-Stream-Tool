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

/** Current values for stuff */
export const current = {
    lang : "", // most of these will change on startup
    generation : 0,
    game : "",
    version : "",
    focus : -1, // used for pokeFinder navigation
    autoStatus : false,
    autoUpdated : false
}
