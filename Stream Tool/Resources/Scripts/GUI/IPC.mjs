import { saveSettings } from './File System.mjs';
import { updatePlayer } from './Player/Update Player.mjs';
import { updateTeam } from './Pokemon/Update Team.mjs';
import { updateGUI } from './Remote Update.mjs';

const ipc = require('electron').ipcRenderer;

// ipc is the communication bridge between us and nodejs
// we can send signals to do node exclusive stuff,
// and recieve messages from it with data

// node code is the only thing thats embbeded on the executable
// meaning that to see it or modify it, you will need to
// be able to build this project yourself... check the repo's wiki!


// we will store data to send to the browsers here
let teamData, playerData;


// when a new browser connects
ipc.on('requestData', () => {

    // send the current (not updated) data
    sendTeamData();
    sendPlayerData();

})

/** Sends current game data object to websocket clients */
export function sendTeamData() {
    ipc.send('sendData', teamData);
}
export function updateTeamData(data) {
    teamData = data;
}
/** Sends current game data to remote GUIs */
export function sendRemoteTeamData() {
    ipc.send("sendData", JSON.stringify(remoteID(teamData), null, 2));
}

/** Sends current game data object to websocket clients */
export function sendPlayerData() {
    ipc.send('sendData', playerData);
}
export function updatePlayerData(data) {
    playerData = data;
}
/** Sends current game data to remote GUIs */
export function sendRemotePlayerData() {
    ipc.send("sendData", JSON.stringify(remoteID(playerData), null, 2));
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
        if (jsonData.type == "Team") {
            updateTeam();
        } else if (jsonData.type == "Player") {
            updatePlayer();
        }

    } else if (jsonData.message == "RemoteRequestData") {

        // when remote GUIs request data
        sendRemoteTeamData();
        sendRemotePlayerData();
        
    } else if (jsonData.message == "RemoteSaveJson") {

        // when remote GUIs request a file save
        const filePath = jsonData.path;
        delete jsonData.path;
        delete jsonData.message;

        // save locally
        saveSettings(filePath, jsonData);
        
    }

});