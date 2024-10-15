import { generateLocJson } from "./Generate Loc Json.mjs";

// below you will find the way the Loc files were generated
// you can try and uncomment in order to generate new files
// leaving it here in case files get outdated

// this raw string is an example
// you will find a full list on bulbapedia (viewing source)
// https://bulbapedia.bulbagarden.net/wiki/List_of_moves_in_other_languages
const rawString = `
{{Langlist|move|1|Pound|はたく|Hataku|Écras'Face{{Ecras'Face (Generations I - IV)}}|Klaps{{Pfund (Generations I - VII)}}|Botta{{Libbra (Generations I - II)}}|Destructor|막치기|Makchigi|拍擊 / 拍击|Pāijī / Paakgīk|color=Normal}}
{{Langlist|move|2|Karate Chop|からてチョップ|Karate Choppu|Poing Karaté{{Poing-Karaté (Generations I - VII)}}|Karateschlag|Colpokarate|Golpe Kárate{{Golpe Karate (Generations I - V)}}|태권당수|Taegweon Dangsu|空手劈|Kōngshǒu Pī / Hūngsáu Pek|color=Fighting}}
{{Langlist|move|3|Double Slap|おうふくビンタ|Ōfuku Binta|Torgnoles|Duplexhieb|Doppiasberla|Doble Bofetón{{Doblebofetón (Generations I - V)}}|연속뺨치기|Yeonsok Ppyamchigi|連環巴掌 / 连环巴掌|Liánhuán Bāzhang / Lìhnwàahn Bājéung|color=Normal}}
{{Langlist|move|4|Comet Punch|れんぞくパンチ|Renzoku Panchi|Poing Comète|Kometenhieb|Cometapugno|Puño Cometa|연속펀치|Yeonsok Punch|連續拳 / 连续拳|Liánxù Quán / Lìhnjuhk Kyùhn|color=Normal}}
`

const rawLines = rawString.split(`\n`);
// "{{tt|*|" instances were manually changed to "{{"
// remaining "{{tt|" instances were manually removed
// TODO add regex for this... and TODO learn regex

generateLocJson(rawLines);