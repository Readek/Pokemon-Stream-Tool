// sometimes i have too much time in my hands and only VSCode to spend it

/** 
 * @typedef { "Bug" | "Dark" | "Dragon" | "Electric" | "Fairy" | "Fighting" | "Fire" |
 *  "Flying" | "Ghost" | "Grass" | "Ground" | "Ice" | "Normal" | "Poison" |
 *  "Psychic" | "Rock" | "Steel" | "Water" | "None"
 * } PokeType
 */

/** @typedef {[{name: String, type: PokeType, pp: Number}]} Moves */

/**
 * @typedef {{left: Number, top: Number}} Coords
 * @typedef {{p1: Coords, p2: Coords}} IconCoords
 */

/**
 * @typedef {{num: Number, ev: Number, iv: Number}} StatKey
 * @typedef {{
 *  hp: StatKey, atk: StatKey, def: StatKey, spa: StatKey, spd: StatKey, spe: StatKey
 * }} Stats
 */

/**
 * @typedef {{
 *  atk: Number, def: Number, spa: Number, spd: Number, spe: Number, acc: Number, eva: Number
 * }} Boosts
 */

/** @typedef {"Wild"|"Trainer"|"Multi"|"None"} BattleType */

/** @typedef {"M" | "F" | null} PokeGender */

/**
 * @typedef {{
 *  gen5Front: String, gen5Back: String, aniFront: String, aniBack: String,
 *  gen5FrontOffs: [], gen5BackOffs: [], aniFrontOffs: [], aniBackOffs: []
 * }} PokeImgData
 */

/** @typedef {"Full" | "Ability" | "Item" | "Move" | "Stats"} Reveals */

/** @typedef {"EN" | "ES" | "FR" | "DE" | "ITA" | "JA"} LangCode */

/** @typedef {{title: String, name: String}} EnemyTrainerName */

/**
 * @typedef {{
 *  gymBadges?: Boolean[],
 *  Johto?: Boolean[], Kanto?: Boolean[],
 *  Akala?: Boolean[], Melemele?: Boolean[], Poni?: Boolean[], Ulaula?: Boolean[]
 *  Noble?: Boolean[],
 *  Victory?: Boolean[], Starfall?: Boolean[], Legends?: Boolean[]
 * }} BadgeData - Just "gymBadges" for most games
 */

/**
 * @typedef {{
 *  badges: BadgeData,
 *  catches: Number,
 *  deaths: Number
 * }} PlayerData
*/

/**
 * @typedef {{
*  0: String, 1?: String, H?: String
* }} Abilities
*/

/**
 * @typedef {{
 *  id: String,
 *  type: "Settings" | "Catches" | "Team" | "Player" | "Wild Encounter" | "Trainer" | "Auto"
 *  pokemons?: PokemonSentData[],
 *  battleType?: BattleType,
 *  lang?: LangCode,
 *  gen?: Number,
 *  game?: String,
 *  version?: String,
 *  forceDex?: Boolean,
 *  player?: PlayerData,
 *  trainerName?: EnemyTrainerName,
 * }} SentData
 */

/**
 * @typedef {{
 *  internalSpecies: String,
 *  species: String,
 *  nickName: String,
 *  lvl?: Number,
 *  form: String,
 *  gender: PokeGender,
 *  shiny: Boolean,
 *  types: PokeType[],
 *  img: PokeImgData
 *  status?: String,
 *  hpCurrent?: Number,
 *  hpMax?: Number,
 *  exp?: Number,
 *  ability?: String,
 *  item?: String,
 *  itemCoords?: Coords,
 *  moves?: Moves,
 *  stats?: Stats,
 *  boosts?: Boosts,
 *  inCombat?: Boolean,
 *  reveals?: Reveals[],
 *  ratioM?: Number,
 *  ratioF: Number,
 *  abilities: Abilities
 * }} PokemonSentData
 */