import { generateLocJson } from "./Generate Loc Json.mjs";

// below you will find the way the Loc files were generated
// you can try and uncomment in order to generate new files
// leaving it here in case files get outdated

// this raw string is an example
// you will find a full list on bulbapedia (viewing source)
// https://bulbapedia.bulbagarden.net/wiki/List_of_Abilities_in_other_languages
const rawString = `
{{Langlist|ability|1|Stench|あくしゅう|Akushū|Puanteur|Duftnote|Tanfo|Hedor|악취|Akchwi|惡臭 / 恶臭|Èchòu / Okchau|color=poison}}
{{Langlist|ability|2|Drizzle|あめふらし|Amefurashi|Crachin|Niesel|Piovischio|Llovizna|잔비|Janbi|降雨|Jiàngyǔ / Gongyúh|color=water}}
{{Langlist|ability|3|Speed Boost|かそく|Kasoku|Turbo|Temposchub|Acceleratore|Impulso|가속|Gasok|加速|Jiāsù / Gāchūk|color=speed}}
{{Langlist|ability|4|Battle Armor|カブトアーマー|Kabuto Āmā|Armurbaston|Kampfpanzer|Lottascudo|Armadura Batalla{{Armad. Bat. (Generation III - V)}}|전투 무장|Jeontu Mujang|戰鬥盔甲 / 战斗盔甲|Zhàndòu Kuījiǎ / Jindau Kwāigaap|color=rock}}
`

const rawLines = rawString.split(`\n`);
// "{{tt|*|", "{{tt|--|" and "{{tt|76|" were manually changed to "{{" or removed
// TODO add regex for this... and TODO learn regex

generateLocJson(rawLines);