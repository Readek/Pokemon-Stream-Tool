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
    /** Where the Pokedex libraries are stored*/
    dexLibs: realPath + "/Scripts/GUI/External Libraries/pkmn/",
    /** This is the internal node path, can be used to find modules */ 
    node : "",
};

/** Current values for stuff */
export const current = {
    /** Current app language selected */
    lang : "",
    /** Current Pokemon generation we're using */
    generation : 0,
    /** Current Pokemon game */
    game : "",
    /** Version of current game */
    version : "",
    /** True if we want a Pokedex with all Pokemon in existance */
    forceDex : false,
    /** Used for pokeFinder navigation */
    focus : -1,
    /** If auto-update is currently enabled */
    autoStatus : false,
    /** If current auto loop has updated some value in its process */
    autoUpdated : false
}
