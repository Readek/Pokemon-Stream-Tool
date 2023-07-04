/**
 * Returns parsed json data from a local file
 * @param {String} jPath - Path to local file
 * @returns {Object?} - Parsed json object
*/
export async function getJson(jPath) {

    try {
        return await fetch(jPath + ".json", {cache: "no-store"}).json();
    } catch (e) {
        return null;
    }

}