import { updateCatches } from './Catches/Update Catches.mjs';
import { saveSettings } from './File System.mjs';
import { updatePlayer } from './Player/Update Player.mjs';
import { updateTeam } from './Pokemon/Update Team.mjs';
import { updateGUI } from './Remote Update.mjs';
import { updateWildEnc } from './VS Wild/Update Wild.mjs';

const ipc = require('electron').ipcRenderer;


// ipc is the communication bridge between us and nodejs
// we can send signals to do node exclusive stuff,
// and recieve messages from it with data

// avoid calling this module outside Electron, or things will break


// we will store data to send to the browsers here
const data = {
    settings : {},
    catches : {},
    team : {},
    player : {},
    wild : {}
}
let catchesData, teamData, playerData, wildData;


// when a new browser connects
ipc.on('requestData', () => {

    // send the current (not updated) data
    sendData("settings");
    sendData("catches");
    sendData("team");
    sendData("player");
    sendData("wild");

})

/**
 * Sends current game data object to websocket clients
 * @param {String} type - Data type identifier
 */
export function sendData(type) {
    ipc.send('sendData', data[type]);
}

/**
 * Sends current game data to remote GUIs
 * @param {String} type - Data type identifier
 */
export function sendRemoteData(type) {
    ipc.send("sendData", JSON.stringify(remoteID(data[type]), null, 2));
}
export function sendRemoteCatchesData() {
    ipc.send("sendData", JSON.stringify(remoteID(catchesData), null, 2));
}
export function sendRemoteTeamData() {
    ipc.send("sendData", JSON.stringify(remoteID(teamData), null, 2));
}
export function sendRemotePlayerData() {
    ipc.send("sendData", JSON.stringify(remoteID(playerData), null, 2));
}
export function sendRemoteWildData() {
    ipc.send("sendData", JSON.stringify(remoteID(wildData), null, 2));
}

/**
 * Updates local stored data to be sent to clients
 * @param {String} type - Data type identifier
 * @param {Object} newData - New data to store
 */
export function updateStoredData(type, newData) {
    data[type] = newData;
}

/**
 * Changes the ID of an object so a Remote GUI can receive it
 * @param {Object} data - Data that will change its ID
 * @returns Data with changed ID
 */
function remoteID(data) {
    const newData = JSON.parse(data);
    newData.id = "remoteGUI";
    return newData;
}

/**
 * Sends the signal to Electron to keep the window
 * on top of others (or not) at all times
 * @param {Boolean} value - Verdadero o Falso
 */
export function alwaysOnTop(value) {
    ipc.send('alwaysOnTop', value);
}

/**
 * Sends the signal to Electron to unlock window resizing
 * @param {Boolean} value - Si o No
 */
export function resizable(value) {
    ipc.send('resizable', value);
}

/** Sends the signal to Electron to restore window dimensions */
export function defaultWindowDimensions() {
    ipc.send('defaultWindow');
}

/**
 * Sends the signal to Electron to store current settings data
 * @param {Object} data - Settings data
 */
export function refreshSettingsStore(data) {
    ipc.send('storeSettings', data)
}

// when we get data remotely, update GUI
ipc.on('remoteGuiData', async (event, data) => {

    const jsonData = JSON.parse(data);
    
    if (jsonData.message == "RemoteUpdateGUI") {

        // when we get data from remote GUIs
        await updateGUI(jsonData);
        
        if (jsonData.type == "Catches") {
            updateCatches();
        } else if (jsonData.type == "Team") {
            updateTeam();
        } else if (jsonData.type == "Player") {
            updatePlayer();
        } else if (jsonData.type == "Wild Encounter") {
            updateWildEnc();
        }

    } else if (jsonData.message == "RemoteRequestData") {

        // when remote GUIs request data
        sendRemoteData("settings");
        sendRemoteData("catches");
        sendRemoteData("team");
        sendRemoteData("player");
        sendRemoteData("wild");
        
    } else if (jsonData.message == "RemoteSaveJson") {

        // when remote GUIs request a file save
        const filePath = jsonData.path;
        delete jsonData.path;
        delete jsonData.message;

        // save locally
        saveSettings(filePath, jsonData);
        
    }

});