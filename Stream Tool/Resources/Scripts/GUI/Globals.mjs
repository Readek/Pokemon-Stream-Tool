export const inside = {
    /** If in executable (true) or remote gui (false) */
    electron : typeof process !== 'undefined'
};

/** Local file path of executable or project */
const realPath = inside.electron ? __dirname : "";
/** Paths used for all of the Stream Tool */
export const stPath = {
    /** All images can be found here */
    assets: realPath + "/Assets",
    /** Where most configs are found */
    text : realPath + '/Texts',
    /** The "sprites" part will be completed by pkmn/img */
    poke: realPath + "/Assets/Pokemon",
    /** The actual resources folder */
    base: realPath,
    /** This is the internal node path, can be used to find modules */ 
    node : "",
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
