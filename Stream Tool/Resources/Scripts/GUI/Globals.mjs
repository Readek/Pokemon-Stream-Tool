/** these are set when their respective views are visible */
export const inside = {
    settings : false,
    electron : typeof process !== 'undefined' // if in executable or remote gui
};

/** Paths used for all of the Stream Tool */
const realPath = inside.electron ? __dirname : ""; // local file path if in executable
export const stPath = {
    poke: realPath + "/Assets/Pokemon", //The "sprites" part will be completed by @pkmn/img.
    assets: realPath + "/Assets",
    text : realPath + '/Texts',
};

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

// some substitutions for presentation sake of translation
// TODO do this on lang scripts
export const nameReplacements = {
    "Nidoran-F": "Nidoran♀",
    "Nidoran-M": "Nidoran♂",
    "Type: Null": "Código Cero",
    "Great Tusk": "Colmilargo",
    "Scream Tail": "Colagrito",
    "Brute Bonnet": "Furioseta",
    "Flutter Mane": "Melenaleteo",
    "Slither Wing": "Reptalada",
    "Sandy Shocks": "Pelarena",
    "Iron Treads": "Ferrodada",
    "Iron Bundle": "Ferrosaco",
    "Iron Hands": "Ferropalmas",
    "Iron Jugulis": "Ferrocuello",
    "Iron Moth": "Ferropolilla",
    "Iron Thorns": "Ferropúas",
    "Roaring Moon": "Bramaluna",
    "Iron Valiant": "Ferropaladín",
    "Walking Wake": "Ondulagua",
    "Iron Leaves": "Ferroverdor",
}
