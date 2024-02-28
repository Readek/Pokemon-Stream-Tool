import { current, inside } from "../Globals.mjs";
import { SettingGameSelect } from "./General Settings/Game Select.mjs";
import { SettingGenSelect } from "./General Settings/Gen Select.mjs";
import { SettingLangSelect } from "./General Settings/Language Select.mjs";
import { SettingVersionSelect } from "./General Settings/Version Select.mjs";
import { SettingAlwaysOnTop } from "./Window Settings/Always on top.mjs";
import { SettingResizableWindow } from "./Window Settings/Resizable.mjs";
import { SettingWindowZoom } from "./Window Settings/Zoom.mjs";

class Settings {

    constructor() {

        this.langSelect = new SettingLangSelect();
        this.genSelect = new SettingGenSelect();
        this.gameSelect = new SettingGameSelect();
        this.versionSelect = new SettingVersionSelect();

        if (inside.electron) {
            this.alwaysOnTop = new SettingAlwaysOnTop();
            this.resizable = new SettingResizableWindow();
            this.windowZoom = new SettingWindowZoom();
        } else { // browser users dont need any of this
            document.getElementById("settingsElectron").style.display = "none";
        }

    }

    /** Generates an object with GUI data, then sends it */
    async update() {

        // this is what's going to be sent to the browsers
        const dataJson = {
            id : "guiData",
            type : "Settings",
            lang : current.lang,
            gen : current.generation,
            game : current.game,
            version : current.version
        };

        // its time to send the data away
        if (inside.electron) {

            const ipc = await import("../IPC.mjs");
            ipc.updateStoredData("settings", JSON.stringify(dataJson, null, 2));
            ipc.sendData("settings");
            ipc.sendRemoteData("settings");

            // additionally, send some settings data to overlays
            const configJson = {
                id : "gameData",
                type : "Config",
                lang : current.lang
            }
            ipc.updateStoredData("config", JSON.stringify(configJson, null, 2));
            ipc.sendData("config");

        } else { // for remote GUIs

            const remote = await import("../Remote Requests.mjs");
            dataJson.id = "";
            dataJson.message = "RemoteUpdateGUI";
            remote.sendRemoteData(dataJson);

        }

    }

}

export const settings = new Settings();
