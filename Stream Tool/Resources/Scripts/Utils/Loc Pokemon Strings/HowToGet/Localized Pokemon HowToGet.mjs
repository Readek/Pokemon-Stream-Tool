import { stPath } from "../../../GUI/Globals.mjs";
import { generateLocJson } from "./Generate Loc Json.mjs";

// below you will find the way this Loc file was generated
// leaving it here in case files get outdated

const finalObject = [];

// these raw strings are just an example
// you will find a full list on bulbapedia (viewing source)
// https://bulbapedia.bulbagarden.net/wiki/List_of_Japanese_Pok%C3%A9mon_names (and the other langs)
const jpString = `
{{Lop/foreign|0001|Bulbasaur|ja|フシギダネ|Fushigidane|Fushigidane}}
{{Lop/foreign|0002|Ivysaur|ja|フシギソウ|Fushigisō|Fushigisou}}
{{Lop/foreign|0003|Venusaur|ja|フシギバナ|Fushigibana|Fushigibana}}
{{Lop/foreign|0004|Charmander|ja|ヒトカゲ|Hitokage|Hitokage}}
`

const jaLines = jpString.split(`\n`);

jaLines.forEach(line => {
    
    const lineSplits = line.split(`|`);

    finalObject.push({
        "EN": lineSplits[2], "JA": lineSplits[4]
    })

});

const frString = `
{{Lop/foreign|0001|Bulbasaur|fr|Bulbizarre}}
{{Lop/foreign|0002|Ivysaur|fr|Herbizarre}}
{{Lop/foreign|0003|Venusaur|fr|Florizarre}}
{{Lop/foreign|0004|Charmander|fr|Salamèche}}
`

const deString = `
{{Lop/foreign|0001|Bulbasaur|de|Bisasam}}
{{Lop/foreign|0002|Ivysaur|de|Bisaknosp}}
{{Lop/foreign|0003|Venusaur|de|Bisaflor}}
{{Lop/foreign|0004|Charmander|de|Glumanda}}
`
const itaString = `
{{Lop/foreign|0772|Type: Null|it|Tipo Zero}}
{{Lop/foreign|0984|Great Tusk|it|Grandizanne}}
{{Lop/foreign|0985|Scream Tail|it|Codaurlante}}
{{Lop/foreign|0986|Brute Bonnet|it|Fungofurioso}}
`

const esString = `
{{Lop/foreign|0772|Type: Null|es|Código Cero}}
{{Lop/foreign|0984|Great Tusk|es|Colmilargo}}
{{Lop/foreign|0985|Scream Tail|es|Colagrito}}
{{Lop/foreign|0986|Brute Bonnet|es|Furioseta}}
`

addToFinalObject(frString, "FR");
addToFinalObject(deString, "DE");
addToFinalObject(itaString, "ITA");
addToFinalObject(esString, "ES");

/**
 * @param {String} rawString 
 * @param {String} key 
 */
function addToFinalObject(rawString, key) {

    rawString.replaceAll("}}", "").split(`\n`).forEach(line => {
    
        const lineSplits = line.split(`|`);

        for (let i = 0; i < finalObject.length; i++) {
            if (finalObject[i].EN == lineSplits[2]) {
                finalObject[i][key] = lineSplits[4]
            }
        }
    
    });

}

const fs = require('fs')
fs.writeFileSync(`${stPath.text}/test.json`, JSON.stringify(finalObject, null, 2));
