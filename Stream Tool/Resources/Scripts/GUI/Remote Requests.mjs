import { getLocalizedText } from "../Utils/Language.mjs";
import { enableCatchesUpdate } from "./Catches/Update Catches.mjs";
import { displayNotif } from "./Notifications.mjs";
import { enablePlayerUpdate } from "./Player/Update Player.mjs";
import { enableTeamUpdate } from "./Team/Update Team.mjs";
import { enableTrainerUpdate } from "./VS Trainer/Update Trainer.mjs";
import { updateGUI } from "./Remote Update.mjs";
import { enableWildUpdate } from "./VS Wild/Update Wild.mjs";

let webSocket;

export function startWebsocket() {

	// we need to connect to the websocket server
	webSocket = new WebSocket("ws://"+window.location.hostname+":1112?id=remoteGUI");
	webSocket.onopen = () => { // if it connects successfully
        
        // everything will update everytime we get data from the server (the GUI)
		webSocket.onmessage = function (event) {
			getData(JSON.parse(event.data));
		}

        // request current data to the GUI
        sendRemoteData({message: "RemoteRequestData"});

	}

	// if the connection closes
	webSocket.onclose = () => {errorWebsocket()};

}
function errorWebsocket() {

    // show error message
    displayNotif(getLocalizedText("notifConnLost"));
    // delete current websocket
    webSocket = null;
    // TODO add a way to reconnect

}

async function getData(data) {

    if (data) { // if this is a GUI update

        await updateGUI(data);
        if (data.type == "Catches") {
            enableCatchesUpdate();
        } else if (data.type == "Team") {
            enableTeamUpdate();
        } else if (data.type == "Player") {
            enablePlayerUpdate();
        } else if (data.type == "Wild Encounter") {
            enableWildUpdate();
        } else if (data.type == "Trainer") {
            enableTrainerUpdate();
        }

    }

}

export function sendRemoteData(data) {
    webSocket.send(JSON.stringify(data, null, 2));
}