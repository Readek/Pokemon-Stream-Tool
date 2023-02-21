/** these are set when their respective views are visible */
export const inside = {
    settings : false,
    finder : false,
    electron : typeof process !== 'undefined' // if in executable or remote gui
};

/** Paths used for all of the Stream Tool */
const realPath = inside.electron ? __dirname : ""; // local file path if in executable
export const stPath = {
    poke: realPath + "/Assets/Pokemon",
    text : realPath + '/Texts',
};

/** Current values for stuff */
export const current = {
    focus : -1
}
