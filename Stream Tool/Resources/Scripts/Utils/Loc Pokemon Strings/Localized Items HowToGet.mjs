import { stPath } from "../../GUI/Globals.mjs";


// below you will find the way the Loc files were generated
// you can try and uncomment in order to generate new files
// leaving it here in case files get outdated

// this raw string is an example
// you will find a full list on bulbapedia (viewing source)
// https://bulbapedia.bulbagarden.net/wiki/List_of_items_in_other_languages
const rawString = `
{{langlist|item||Berry|きのみ|Kino Mi|Baie|Beere|Bacca|Baya|나무열매|Namu Yeolmae|bagsprite=None|link=Berry (item)}}
{{langlist|item||Gold Berry|おうごんのみ|Ōgon no Mi|Baie Doree|Goldbeere|Bacca Oro|Baya Dorada|황금 열매|Hwanggeum Yeolmae|bagsprite=None}}
{{langlist|item||PSNCureBerry|どくけしのみ|Dokukeshi no Mi|Baie Antidot|Ggngiftbeere|Baccantivel.|Bayantídoto|해독열매|Haedok Yeolmae|bagsprite=None}}
{{langlist|item||PRZCureBerry|まひなおしのみ|Mahinaoshi no Mi|Baie AntiPAR|AntiPARBeere|Baccantipar.|Antiparabaya|마비치료열매|Mabi Chiryo Yeolmae|bagsprite=None}}
`

const rawLines = rawString.split(`\n`);
// Only berries and held items were considered
// Gen II Berry comments were manually removed
// "{{tt|*|" instances were manually changed to "{{"
// "{{tt|" instances were manually removed
// TODO add regex for this... and TODO learn regex

const langOrder = ["EN", "JA", null, "FR", "DE", "ITA", "ES"];
const finalObject = [];

rawLines.forEach(line => {

    const lineSplits = line.split(`|`);
    const lineObject = {};

    // for each language split (no lang keys before 3)
    for (let i = 0; i < langOrder.length; i++) {

        // [2] has "Rōmaji" lang which we dont need
        if (!langOrder[i]) continue;

        const fullName = lineSplits[i+3];

        // just in case
        if (!fullName) break;

        lineObject[langOrder[i]] = {};

        // if it had another name in a previous gen, [1] will have that info
        const nameWithSplit = fullName.split("{{");

        // localized name
        lineObject[langOrder[i]].name = nameWithSplit[0];
        // old data, only if its there
        if (nameWithSplit[1]) lineObject[langOrder[i]].old = nameWithSplit[1].replace("}}", "");

    }

    finalObject.push(lineObject);

});

const fs = require('fs')
fs.writeFileSync(`${stPath.text}/test.json`, JSON.stringify(finalObject, null, 2));
