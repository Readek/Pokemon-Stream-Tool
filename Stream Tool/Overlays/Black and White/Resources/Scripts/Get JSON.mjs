/**
 * Returns parsed json data from a local file
 * @param {String} jPath - Path to local file
 * @returns {Object?} - Parsed json object
*/
export async function getJson(jPath) {

    try {
        return await fetch(jPath, {cache: "no-store"})
                    .then((response) => {
                        if(!response.ok) return null; //404 go here
                        return response.json();
                    })
    } catch (e) { //other errors go here
        return null;
    }

}