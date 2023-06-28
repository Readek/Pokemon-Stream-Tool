/** these are set when their respective views are visible */
export const inside = {
    settings : false,
    finder : false,
    electron : typeof process !== 'undefined' // if in executable or remote gui
};

/** Paths used for all of the Stream Tool */
const realPath = inside.electron ? __dirname : ""; // local file path if in executable
export const stPath = {
    poke: realPath + "/Assets/play.pokemonshowdown.com", //The "sprites" part will be completed by @pkmn/img. //You need to cd into the Assets folder and run `wget --mirror "https://play.pokemonshowdown.com/sprites/"`.

    assets: realPath + "/Assets",
    text : realPath + '/Texts',
};

/** Current values for stuff */
export const current = {
    focus : -1,
    generation : 5
}

export const nameReplacements = { //Some substitutions for presentation sake or translation.
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
