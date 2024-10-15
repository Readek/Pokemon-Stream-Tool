import { stPath } from '../../../GUI/Globals.mjs';

/**
 * Generates a Json with localized info with given string
 * @param {String} rawLines 
 */
export function generateLocJson(rawLines) {
    
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

}
