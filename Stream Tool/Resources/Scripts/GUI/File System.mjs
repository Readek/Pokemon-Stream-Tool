import { inside } from './Globals.mjs';

/**
 * Returns parsed json data from a local file
 * @param {String} jPath - Path to local file
 * @returns {Object?} Parsed json object
*/
export async function getJson(jPath) {

    if (inside.electron) {

        // the electron version
        const fs = require('fs');
        if (fs.existsSync(jPath + ".json")) {
            return JSON.parse(fs.readFileSync(jPath + ".json"));
        } else {
            return null;
        }

    } else {

        // the browser version
        try {
            return await (await fetch(jPath + ".json", {cache: "no-store"})).json();
        } catch (e) {
            return null;
        }

    }

}

/**
 * Checks if the requested file exists/can be accessed
 * @param {String} filePath - Path to the file
 * @returns True or False, pretty self explanatory if you ask me
 */
export async function fileExists(filePath) {

    if (inside.electron) {

        const fs = require('fs');
        return fs.existsSync(filePath);
        
    } else {

        return (await fetch(filePath, {method: "HEAD"})).ok;
    
    }

}

/**
 * Saves current settings with the provided values
 * @param {Object} data - Data to be saved
 */
export async function saveSettings(data) {

    if (inside.electron) {
        
        const ipc = await import("./IPC.mjs");
        ipc.refreshSettingsStore(data);

    } else {

        const remote = await import("./Remote Requests.mjs");
        data.message = "RemoteSaveJson";
        data.path = path;
        remote.sendRemoteData(data);

    }
    
}
